#!/usr/bin/env tsx
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'fs'

/**
 * Generic A11y Debug Script
 *
 * Usage:
 *   npx tsx scripts/debug-a11y.ts /auth/login
 *   npx tsx scripts/debug-a11y.ts /dashboard --authenticated
 *   npx tsx scripts/debug-a11y.ts /auth/login --click "button:has-text('Log in')"
 *   npx tsx scripts/debug-a11y.ts /dashboard/profile --rule color-contrast
 *
 * Options:
 *   --authenticated      Use authenticated session (loads user.json)
 *   --admin             Use admin session (loads admin.json)
 *   --click "selector"   Click element before scanning
 *   --type "selector" "text"   Type into element before scanning
 *   --rule "rule-id"    Only show specific rule violations (e.g., color-contrast)
 *   --impact level      Only show violations of specific impact (critical|serious|moderate|minor)
 *   --headless          Run in headless mode (default: visible)
 */

interface Options {
	url: string
	authenticated?: boolean
	admin?: boolean
	click?: string
	type?: { selector: string; text: string }
	rule?: string
	impact?: string
	headless?: boolean
}

function parseArgs(): Options {
	const args = process.argv.slice(2)

	if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
		console.log(`
🔍 Generic A11y Debug Script

Usage:
  npx tsx scripts/debug-a11y.ts <path> [options]

Examples:
  npx tsx scripts/debug-a11y.ts /auth/login
  npx tsx scripts/debug-a11y.ts /dashboard --authenticated
  npx tsx scripts/debug-a11y.ts /auth/login --click "button:has-text('Log in')"
  npx tsx scripts/debug-a11y.ts /dashboard/profile --rule color-contrast
  npx tsx scripts/debug-a11y.ts /dashboard --impact serious

Options:
  --authenticated      Use authenticated session (loads user.json)
  --admin             Use admin session (loads admin.json)
  --click "selector"   Click element before scanning
  --type "sel" "text"  Type into element before scanning
  --rule "rule-id"     Only show specific rule violations
  --impact "level"     Filter by impact (critical|serious|moderate|minor)
  --headless          Run in headless mode (default: visible)
  -h, --help          Show this help

Common Rule IDs:
  - color-contrast
  - document-title
  - html-has-lang
  - button-name
  - image-alt
  - label
  - link-name
		`)
		process.exit(0)
	}

	const options: Options = {
		url: args[0],
		headless: false
	}

	for (let i = 1; i < args.length; i++) {
		const arg = args[i]

		if (arg === '--authenticated') {
			options.authenticated = true
		} else if (arg === '--admin') {
			options.admin = true
		} else if (arg === '--headless') {
			options.headless = true
		} else if (arg === '--click') {
			options.click = args[++i]
		} else if (arg === '--type') {
			options.type = {
				selector: args[++i],
				text: args[++i]
			}
		} else if (arg === '--rule') {
			options.rule = args[++i]
		} else if (arg === '--impact') {
			options.impact = args[++i]
		}
	}

	return options
}

async function debugAccessibility(options: Options) {
	const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
	const fullUrl = `${baseUrl}${options.url}`

	console.log(`\n🔍 Testing: ${fullUrl}`)
	if (options.authenticated) console.log('🔐 Using authenticated session')
	if (options.admin) console.log('👑 Using admin session')
	if (options.click) console.log(`🖱️  Will click: ${options.click}`)
	if (options.type) console.log(`⌨️  Will type into: ${options.type.selector}`)
	console.log()

	const browser = await chromium.launch({ headless: options.headless })

	let storageState = undefined
	if (options.authenticated) {
		try {
			storageState = JSON.parse(readFileSync('tests/.auth/user.json', 'utf-8'))
		} catch (e) {
			console.warn('⚠️  Could not load user.json, proceeding without auth')
		}
	} else if (options.admin) {
		try {
			storageState = JSON.parse(readFileSync('tests/.auth/admin.json', 'utf-8'))
		} catch (e) {
			console.warn('⚠️  Could not load admin.json, proceeding without auth')
		}
	}

	const context = await browser.newContext(storageState ? { storageState } : {})
	const page = await context.newPage()

	try {
		await page.goto(fullUrl)
		await page.waitForLoadState('networkidle')

		// Perform interactions if specified
		if (options.click) {
			console.log(`Clicking: ${options.click}`)
			await page.locator(options.click).click()
			await page.waitForTimeout(500)
		}

		if (options.type) {
			console.log(`Typing into: ${options.type.selector}`)
			await page.locator(options.type.selector).fill(options.type.text)
			await page.waitForTimeout(500)
		}

		// Run accessibility scan
		const results = await new AxeBuilder({ page })
			.options({ resultTypes: ['violations'] })
			.analyze()

		let violations = results.violations

		// Filter by rule if specified
		if (options.rule) {
			violations = violations.filter((v) => v.id === options.rule)
		}

		// Filter by impact if specified
		if (options.impact) {
			violations = violations.filter((v) => v.impact === options.impact)
		}

		if (violations.length === 0) {
			console.log('✅ No accessibility violations found!')
			if (options.rule) console.log(`   (filtered by rule: ${options.rule})`)
			if (options.impact) console.log(`   (filtered by impact: ${options.impact})`)
			await browser.close()
			return
		}

		console.log(`❌ Found ${violations.length} violation(s)`)
		if (options.rule) console.log(`   (filtered by rule: ${options.rule})`)
		if (options.impact) console.log(`   (filtered by impact: ${options.impact})`)
		console.log()

		// Group by impact level
		const byImpact = violations.reduce((acc, v) => {
			const impact = v.impact || 'unknown'
			if (!acc[impact]) acc[impact] = []
			acc[impact].push(v)
			return acc
		}, {} as Record<string, typeof violations>)

		// Show violations grouped by severity
		const impactOrder = ['critical', 'serious', 'moderate', 'minor', 'unknown']
		const impactEmoji = {
			critical: '🔴',
			serious: '🟠',
			moderate: '🟡',
			minor: '🟢',
			unknown: '⚪'
		}

		for (const impact of impactOrder) {
			if (!byImpact[impact]) continue

			const emoji = impactEmoji[impact as keyof typeof impactEmoji] || '⚪'
			console.log(`\n${'='.repeat(70)}`)
			console.log(`${emoji}  ${impact.toUpperCase()} - ${byImpact[impact].length} violation(s)`)
			console.log('='.repeat(70))

			for (const violation of byImpact[impact]) {
				console.log(`\n📋 Rule: ${violation.id}`)
				console.log(`   Impact: ${violation.impact}`)
				console.log(`   Description: ${violation.description}`)
				console.log(`   Help: ${violation.help}`)
				console.log(`   📖 Learn more: ${violation.helpUrl}`)
				console.log(`\n   🎯 Affected elements: ${violation.nodes.length}`)

				for (let i = 0; i < violation.nodes.length; i++) {
					const node = violation.nodes[i]
					console.log(`\n   ${'-'.repeat(66)}`)
					console.log(`   Element #${i + 1}:`)
					console.log(`   ${'-'.repeat(66)}`)

					// Show HTML (truncated if too long)
					const html = node.html.length > 200
						? node.html.substring(0, 200) + '...'
						: node.html
					console.log(`   HTML: ${html}`)

					// Show selector
					console.log(`   Selector: ${JSON.stringify(node.target)}`)

					// Show failure summary
					if (node.failureSummary) {
						console.log(`\n   ❌ Failure:`)
						const failureLines = node.failureSummary.split('\n')
						failureLines.forEach(line => console.log(`      ${line}`))
					}

					// Show detailed check results
					if (node.any.length > 0) {
						console.log(`\n   💡 Fix suggestions:`)
						node.any.forEach((check) => {
							console.log(`      • ${check.message}`)
							if (check.data) {
								// Pretty print data
								const dataStr = JSON.stringify(check.data, null, 2)
								const dataLines = dataStr.split('\n')
								dataLines.forEach(line => console.log(`        ${line}`))
							}
						})
					}

					// Show related nodes if any
					if (node.all.length > 0) {
						console.log(`\n   ℹ️  Additional info:`)
						node.all.forEach((check) => {
							console.log(`      • ${check.message}`)
						})
					}
				}
			}
		}

		console.log(`\n${'='.repeat(70)}`)
		console.log(`\n📊 Summary: ${violations.length} total violation(s) found`)
		console.log(`   Impact breakdown:`)
		Object.entries(byImpact).forEach(([impact, viols]) => {
			const emoji = impactEmoji[impact as keyof typeof impactEmoji] || '⚪'
			console.log(`   ${emoji} ${impact}: ${viols.length}`)
		})
		console.log()

		if (!options.headless) {
			console.log('🔍 Browser kept open for manual inspection.')
			console.log('   Use browser DevTools (F12) to inspect elements.')
			console.log('   Press Ctrl+C when done.\n')
			await new Promise(() => {}) // Keep alive
		} else {
			await browser.close()
		}

	} catch (error) {
		console.error('Error during accessibility scan:', error)
		await browser.close()
		process.exit(1)
	}
}

// Run the script
const options = parseArgs()
debugAccessibility(options).catch(console.error)

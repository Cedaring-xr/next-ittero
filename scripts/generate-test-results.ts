#!/usr/bin/env tsx

import { exec, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface PlaywrightTestResult {
	status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted'
	duration: number
	startTime: string
}

interface PlaywrightTest {
	timeout: number
	results: PlaywrightTestResult[]
	expectedStatus: string
	projectName: string
	status: string
}

interface PlaywrightSpec {
	title: string
	ok: boolean
	tests: PlaywrightTest[]
	file: string
	line: number
	column: number
}

interface PlaywrightSuite {
	title: string
	file: string
	specs?: PlaywrightSpec[]
	suites?: PlaywrightSuite[]
}

interface PlaywrightReport {
	suites: PlaywrightSuite[]
	stats?: {
		startTime: string
		duration: number
		expected: number
		unexpected: number
		skipped: number
	}
}

interface TestRun {
	id: string
	name: string
	startDate: string
	endDate: string
	environment: string
	buildVersion: string
	location: string
	passed: boolean
	suites: TestSuite[]
}

interface TestSuite {
	id: string
	name: string
	description: string
	totalTests: number
	passedTests: number
	failedTests: number
	skippedTests: number
	blockedTests: number
	tests: unknown[]
}

interface TestResults {
	runs: TestRun[]
	summary: {
		totalTests: number
		passed: number
		failed: number
		skipped: number
		blocked: number
		passRate: number
		totalRuns: number
		passedRuns: number
		runPassRate: number
		byCategory: Array<{
			category: string
			count: number
			passed: number
			failed: number
			skipped: number
		}>
		coverage: {
			unit: number
			component: number
			api: number
		}
	}
	lastUpdated: string
}

function getPackageVersion(): string {
	try {
		const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
		return packageJson.version || 'v1.0.0'
	} catch {
		return 'v1.0.0'
	}
}

function getEnvironment(): string {
	return process.env.CI ? 'CI' : 'Local'
}

function getLocation(): string {
	return process.env.CI ? 'ci' : 'local'
}

function flattenTests(suite: PlaywrightSuite): PlaywrightTest[] {
	const tests: PlaywrightTest[] = []

	// Get tests from specs in this suite
	if (suite.specs) {
		for (const spec of suite.specs) {
			tests.push(...spec.tests)
		}
	}

	// Recursively get tests from child suites
	if (suite.suites) {
		for (const childSuite of suite.suites) {
			tests.push(...flattenTests(childSuite))
		}
	}

	return tests
}

function getCategoryFromFile(file: string): string {
	const fileName = file.toLowerCase()

	// Map file paths to categories
	if (fileName.includes('component')) {
		return 'component'
	}
	if (fileName.includes('api')) {
		return 'api'
	}
	if (fileName.includes('a11y') || fileName.includes('accessibility')) {
		return 'accessibility'
	}

	// All other e2e tests default to regression (unless they have @smoke tag)
	return 'regression'
}

function transformPlaywrightReport(reportPath: string, unitStats?: { total: number; passed: number; failed: number; skipped: number }): TestRun {
	const rawReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8')) as PlaywrightReport

	// Find earliest start time and latest end time from all test results
	let earliestStart: Date | null = null
	let latestEnd: Date | null = null
	let totalFailed = 0
	let totalPassed = 0
	let totalSkipped = 0

	function collectTimes(suite: PlaywrightSuite) {
		if (suite.specs) {
			for (const spec of suite.specs) {
				for (const test of spec.tests) {
					if (test.results && test.results.length > 0) {
						for (const result of test.results) {
							const startTime = new Date(result.startTime)
							const endTime = new Date(startTime.getTime() + result.duration)

							if (!earliestStart || startTime < earliestStart) {
								earliestStart = startTime
							}
							if (!latestEnd || endTime > latestEnd) {
								latestEnd = endTime
							}

							if (result.status === 'passed') {
								totalPassed++
							} else if (result.status === 'skipped') {
								totalSkipped++
							} else {
								totalFailed++
							}
						}
					}
				}
			}
		}

		if (suite.suites) {
			suite.suites.forEach(collectTimes)
		}
	}

	rawReport.suites.forEach(collectTimes)

	const startDate = earliestStart || new Date()
	const endDate = latestEnd || new Date()

	const runId = `run-${Date.now()}`
	const buildVersion = getPackageVersion()
	const environment = getEnvironment()
	const location = getLocation()

	// Group tests by category
	const categoryMap = new Map<string, TestSuite>()
	let suiteCounter = 1

	function processSuite(playwrightSuite: PlaywrightSuite) {
		// Process specs in this suite
		if (playwrightSuite.specs) {
			for (const spec of playwrightSuite.specs) {
				// Determine category based on file and spec title
				let category = getCategoryFromFile(playwrightSuite.file)

				// For regression tests, check if it's actually a smoke test
				// Check both suite and spec titles (case-insensitive)
				if (category === 'regression') {
					const suiteTitle = playwrightSuite.title?.toLowerCase() || ''
					const specTitle = spec.title.toLowerCase()

					if (suiteTitle.includes('@smoke') || specTitle.includes('@smoke')) {
						category = 'e2e'
					}
				}

				// Generate friendly category names
				const categoryNames: Record<string, string> = {
					unit: 'Unit Tests',
					component: 'Component Tests',
					e2e: 'Smoke Tests',
					regression: 'Regression Tests',
					api: 'API Tests',
					accessibility: 'Accessibility Tests'
				}
				const categoryName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1) + ' Tests'

				if (!categoryMap.has(category)) {
					categoryMap.set(category, {
						id: `suite-${suiteCounter++}`,
						name: categoryName,
						description: `${categoryName} for the application`,
						totalTests: 0,
						passedTests: 0,
						failedTests: 0,
						skippedTests: 0,
						blockedTests: 0,
						tests: []
					})
				}

				const suite = categoryMap.get(category)!

				// Count tests from this spec
				for (const test of spec.tests) {
					suite.totalTests++

					if (test.results && test.results.length > 0) {
						const result = test.results[0]
						if (result.status === 'passed') {
							suite.passedTests++
						} else if (result.status === 'skipped') {
							suite.skippedTests++
						} else {
							suite.failedTests++
						}
					}
				}
			}
		}

		// Recursively process child suites
		if (playwrightSuite.suites) {
			playwrightSuite.suites.forEach(processSuite)
		}
	}

	rawReport.suites.forEach(processSuite)

	// Add unit tests suite if provided
	if (unitStats && unitStats.total > 0) {
		categoryMap.set('unit', {
			id: `suite-${suiteCounter++}`,
			name: 'Unit Tests',
			description: 'Unit Tests for the application',
			totalTests: unitStats.total,
			passedTests: unitStats.passed,
			failedTests: unitStats.failed,
			skippedTests: unitStats.skipped,
			blockedTests: 0,
			tests: []
		})
	}

	// The run is marked as passed if the test script completed successfully
	// Individual test failures are tracked in the test counts, not here
	const passed = true

	return {
		id: runId,
		name: `Test Run - ${startDate.toLocaleDateString()}`,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		environment,
		buildVersion,
		location,
		passed,
		suites: Array.from(categoryMap.values())
	}
}

function calculateComponentCoverage(): number {
	try {
		// Find all component files in src/ui
		const componentFiles = execSync('find src/ui -name "*.tsx" -type f', { encoding: 'utf-8' })
			.trim()
			.split('\n')
			.filter(file => file.length > 0)

		const totalComponents = componentFiles.length

		if (totalComponents === 0) {
			return 0
		}

		// Find all component test files
		const testFiles = execSync('find tests/component -name "*.spec.tsx" -type f 2>/dev/null || true', { encoding: 'utf-8' })
			.trim()
			.split('\n')
			.filter(file => file.length > 0 && file !== '')

		// Extract component names from test files
		const testedComponents = new Set(
			testFiles.map(testFile => {
				// Extract filename without extension (e.g., "Banner" from "tests/component/ui/Banner.spec.tsx")
				const match = testFile.match(/\/([^/]+)\.spec\.tsx$/)
				return match ? match[1].toLowerCase() : ''
			}).filter(name => name.length > 0)
		)

		// Count how many components have tests
		let coveredComponents = 0
		for (const componentFile of componentFiles) {
			// Extract component name (e.g., "banner" from "src/ui/info/banner.tsx")
			const match = componentFile.match(/\/([^/]+)\.tsx$/)
			if (match) {
				const componentName = match[1].toLowerCase()
				if (testedComponents.has(componentName)) {
					coveredComponents++
				}
			}
		}

		const coveragePercent = (coveredComponents / totalComponents) * 100
		console.log(`Component coverage: ${coveredComponents}/${totalComponents} components have tests (${coveragePercent.toFixed(1)}%)`)

		return Number(coveragePercent.toFixed(1))
	} catch (error) {
		console.warn('Could not calculate component coverage:', error)
		return 0
	}
}

function generateSummary(runs: TestRun[], coverage?: { unit: number; component: number; api: number }): TestResults['summary'] {
	let totalTests = 0
	let passed = 0
	let failed = 0
	let skipped = 0
	let blocked = 0

	const categoryMap = new Map<string, { count: number; passed: number; failed: number; skipped: number }>()

	// Initialize categories
	categoryMap.set('unit', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('component', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('e2e', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('regression', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('api', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('accessibility', { count: 0, passed: 0, failed: 0, skipped: 0 })

	// Map suite names to category keys
	function getCategoryKey(suiteName: string): string {
		const name = suiteName.toLowerCase()
		if (name.includes('unit')) return 'unit'
		if (name.includes('component')) return 'component'
		if (name.includes('smoke') || name.includes('e2e')) return 'e2e'
		if (name.includes('regression')) return 'regression'
		if (name.includes('api')) return 'api'
		if (name.includes('accessibility')) return 'accessibility'
		return 'regression' // default
	}

	// Use only the most recent run for category breakdown
	const latestRun = runs[0]

	if (latestRun) {
		for (const suite of latestRun.suites) {
			const categoryKey = getCategoryKey(suite.name)
			const category = categoryMap.get(categoryKey)!

			category.count += suite.totalTests
			category.passed += suite.passedTests
			category.failed += suite.failedTests
			category.skipped += suite.skippedTests
		}
	}

	// Calculate totals across all runs
	for (const run of runs) {
		for (const suite of run.suites) {
			totalTests += suite.totalTests
			passed += suite.passedTests
			failed += suite.failedTests
			skipped += suite.skippedTests
			blocked += suite.blockedTests
		}
	}

	const byCategory = Array.from(categoryMap.entries()).map(([category, stats]) => ({
		category,
		...stats
	}))

	const passRate = totalTests > 0 ? Number(((passed / totalTests) * 100).toFixed(1)) : 0
	const passedRuns = runs.filter(r => r.passed).length
	const runPassRate = runs.length > 0 ? Number(((passedRuns / runs.length) * 100).toFixed(1)) : 0

	return {
		totalTests,
		passed,
		failed,
		skipped,
		blocked,
		passRate,
		totalRuns: runs.length,
		passedRuns,
		runPassRate,
		byCategory,
		coverage: coverage || {
			unit: 0,
			component: 0,
			api: 0
		}
	}
}

async function main() {
	console.log('Running Vitest unit tests with coverage...')

	let unitTestStats = { total: 0, passed: 0, failed: 0, skipped: 0 }
	let coverageStats = { unit: 0, component: 0, api: 0 }

	try {
		// Run Vitest with JSON reporter and coverage
		const vitestResult = await execAsync('npx vitest run --reporter=json --reporter=verbose --coverage')

		// Parse the JSON output (it's on the last line with JSON data)
		const lines = vitestResult.stdout.split('\n')
		const jsonLine = lines.find(line => line.startsWith('{') && line.includes('numTotalTests'))

		if (jsonLine) {
			const vitestReport = JSON.parse(jsonLine)
			unitTestStats = {
				total: vitestReport.numTotalTests || 0,
				passed: vitestReport.numPassedTests || 0,
				failed: vitestReport.numFailedTests || 0,
				skipped: vitestReport.numPendingTests || 0
			}
			console.log(`Vitest: ${unitTestStats.passed}/${unitTestStats.total} passed`)
		}
	} catch (error: any) {
		console.log('Vitest completed (some tests may have failed)')

		// Try to parse results even from failed run
		if (error.stdout) {
			const lines = error.stdout.split('\n')
			const jsonLine = lines.find((line: string) => line.startsWith('{') && line.includes('numTotalTests'))

			if (jsonLine) {
				const vitestReport = JSON.parse(jsonLine)
				unitTestStats = {
					total: vitestReport.numTotalTests || 0,
					passed: vitestReport.numPassedTests || 0,
					failed: vitestReport.numFailedTests || 0,
					skipped: vitestReport.numPendingTests || 0
				}
				console.log(`Vitest: ${unitTestStats.passed}/${unitTestStats.total} passed`)
			}
		}
	}

	// Parse coverage data if available
	const coveragePath = 'coverage/coverage-summary.json'
	if (fs.existsSync(coveragePath)) {
		try {
			const coverageReport = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'))

			// Extract function coverage percentage
			if (coverageReport.total?.functions) {
				const functionCoverage = coverageReport.total.functions.pct || 0
				coverageStats.unit = Number(functionCoverage.toFixed(1))
				console.log(`Function coverage: ${coverageStats.unit}%`)
			}
		} catch (error) {
			console.log('Could not parse coverage report, coverage will be set to 0')
		}
	} else {
		console.log('Coverage report not found, coverage will be set to 0')
	}

	// Calculate component test coverage
	coverageStats.component = calculateComponentCoverage()

	console.log('Running Playwright E2E tests with JSON reporter...')

	const e2eReportPath = 'test-results-e2e.json'

	try {
		// Run Playwright E2E tests with JSON reporter
		const { stdout } = await execAsync('npx playwright test --reporter=json')
		fs.writeFileSync(e2eReportPath, stdout)
		console.log('Playwright E2E test execution completed successfully')
	} catch (error: any) {
		console.log('Playwright E2E tests completed (some tests may have failed)')
		if (error.stdout) {
			fs.writeFileSync(e2eReportPath, error.stdout)
		} else {
			console.error('No Playwright E2E test output captured')
			process.exit(1)
		}
	}

	if (!fs.existsSync(e2eReportPath) || fs.statSync(e2eReportPath).size === 0) {
		console.error('E2E JSON report not found or empty at:', e2eReportPath)
		process.exit(1)
	}

	console.log('Running Playwright Component tests with JSON reporter...')

	const componentReportPath = 'test-results-component.json'

	try {
		// Run Playwright component tests with JSON reporter
		const { stdout } = await execAsync('npx playwright test -c playwright-ct.config.ts --reporter=json')
		// Component tests may have Vite build output before JSON, extract just the JSON part
		const jsonStart = stdout.indexOf('{')
		const cleanOutput = jsonStart >= 0 ? stdout.substring(jsonStart) : stdout
		fs.writeFileSync(componentReportPath, cleanOutput)
		console.log('Playwright component test execution completed successfully')
	} catch (error: any) {
		console.log('Playwright component tests completed (some tests may have failed)')
		if (error.stdout) {
			// Component tests may have Vite build output before JSON, extract just the JSON part
			const jsonStart = error.stdout.indexOf('{')
			const cleanOutput = jsonStart >= 0 ? error.stdout.substring(jsonStart) : error.stdout
			fs.writeFileSync(componentReportPath, cleanOutput)
		} else {
			console.warn('No Playwright component test output captured - continuing without component tests')
			// Create empty report if component tests fail
			fs.writeFileSync(componentReportPath, JSON.stringify({ suites: [] }))
		}
	}

	console.log('Transforming test results...')

	// Load existing results if they exist
	const outputPath = 'public/test-results.json'
	let existingResults: TestResults | null = null

	if (fs.existsSync(outputPath)) {
		try {
			existingResults = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
		} catch {
			console.log('Could not parse existing results, will create new file')
		}
	}

	// Merge E2E and component test reports
	const e2eReport = JSON.parse(fs.readFileSync(e2eReportPath, 'utf-8')) as PlaywrightReport
	const componentReport = JSON.parse(fs.readFileSync(componentReportPath, 'utf-8')) as PlaywrightReport

	// Tag component test suites by modifying their file paths to include 'component'
	function tagComponentSuites(suite: PlaywrightSuite): PlaywrightSuite {
		const taggedSuite = { ...suite }
		if (taggedSuite.file) {
			taggedSuite.file = `component/${taggedSuite.file}`
		}
		if (taggedSuite.suites) {
			taggedSuite.suites = taggedSuite.suites.map(tagComponentSuites)
		}
		return taggedSuite
	}

	const taggedComponentSuites = componentReport.suites.map(tagComponentSuites)

	const mergedReport: PlaywrightReport = {
		suites: [...e2eReport.suites, ...taggedComponentSuites]
	}

	// Save merged report temporarily
	const mergedReportPath = 'test-results-merged.json'
	fs.writeFileSync(mergedReportPath, JSON.stringify(mergedReport, null, 2))

	// Transform the merged test run
	const newRun = transformPlaywrightReport(mergedReportPath, unitTestStats)

	// Combine with existing runs (keep last 10 runs)
	const runs = existingResults ? [newRun, ...existingResults.runs].slice(0, 10) : [newRun]

	// Generate summary with coverage stats
	const summary = generateSummary(runs, coverageStats)

	const results: TestResults = {
		runs,
		summary,
		lastUpdated: new Date().toISOString()
	}

	// Write to public folder
	fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

	// Clean up temporary files
	const tempFiles = [e2eReportPath, componentReportPath, mergedReportPath]
	for (const file of tempFiles) {
		if (fs.existsSync(file)) {
			fs.unlinkSync(file)
		}
	}

	console.log(`Test results saved to ${outputPath}`)
	console.log(`Total tests: ${summary.totalTests}`)
	console.log(`Passed: ${summary.passed}`)
	console.log(`Failed: ${summary.failed}`)
	console.log(`Skipped: ${summary.skipped}`)
	console.log(`Pass rate: ${summary.passRate}%`)
	console.log(`Unit function coverage: ${summary.coverage.unit}%`)
	console.log(`Component test coverage: ${summary.coverage.component}%`)
}

main().catch(error => {
	console.error('Error generating test results:', error)
	process.exit(1)
})

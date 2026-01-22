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
	if (fileName.includes('api')) {
		return 'api'
	}
	if (fileName.includes('a11y') || fileName.includes('accessibility')) {
		return 'accessibility'
	}
	if (fileName.includes('auth') || fileName.includes('sign')) {
		return 'e2e'
	}
	if (fileName.includes('admin')) {
		return 'e2e'
	}
	if (fileName.includes('profile')) {
		return 'integration'
	}
	if (fileName.includes('navigation')) {
		return 'integration'
	}
	if (fileName.includes('list')) {
		return 'integration'
	}
	if (fileName.includes('journal')) {
		return 'integration'
	}
	if (fileName.includes('stats')) {
		return 'integration'
	}

	return 'integration'
}

function transformPlaywrightReport(reportPath: string): TestRun {
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
		const category = getCategoryFromFile(playwrightSuite.file)
		const categoryName = category.charAt(0).toUpperCase() + category.slice(1) + ' Tests'

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
		const tests = flattenTests(playwrightSuite)

		for (const test of tests) {
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

		if (playwrightSuite.suites) {
			playwrightSuite.suites.forEach(processSuite)
		}
	}

	rawReport.suites.forEach(processSuite)

	const passed = totalFailed === 0

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

function generateSummary(runs: TestRun[]): TestResults['summary'] {
	let totalTests = 0
	let passed = 0
	let failed = 0
	let skipped = 0
	let blocked = 0

	const categoryMap = new Map<string, { count: number; passed: number; failed: number; skipped: number }>()

	// Initialize categories
	categoryMap.set('e2e', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('api', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('integration', { count: 0, passed: 0, failed: 0, skipped: 0 })
	categoryMap.set('accessibility', { count: 0, passed: 0, failed: 0, skipped: 0 })

	// Map suite names to category keys
	function getCategoryKey(suiteName: string): string {
		const name = suiteName.toLowerCase()
		if (name.includes('e2e')) return 'e2e'
		if (name.includes('api')) return 'api'
		if (name.includes('integration')) return 'integration'
		if (name.includes('accessibility')) return 'accessibility'
		return 'integration' // default
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
		coverage: {
			unit: 0,
			component: 0,
			api: 0
		}
	}
}

async function main() {
	console.log('Running Playwright tests with JSON reporter...')

	const jsonReportPath = 'test-results.json'

	try {
		// Run Playwright tests with JSON reporter and capture output
		const { stdout, stderr } = await execAsync('npx playwright test --reporter=json')

		// Save the JSON output to a file
		fs.writeFileSync(jsonReportPath, stdout)
		console.log('Test execution completed successfully')
	} catch (error: any) {
		// Tests may fail but we still want to process results
		console.log('Tests completed (some tests may have failed)')

		// Even if tests fail, Playwright should output JSON to stdout
		if (error.stdout) {
			fs.writeFileSync(jsonReportPath, error.stdout)
		} else {
			console.error('No test output captured')
			process.exit(1)
		}
	}

	// Check if the JSON report was generated
	if (!fs.existsSync(jsonReportPath) || fs.statSync(jsonReportPath).size === 0) {
		console.error('JSON report not found or empty at:', jsonReportPath)
		process.exit(1)
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

	// Transform the new test run
	const newRun = transformPlaywrightReport(jsonReportPath)

	// Combine with existing runs (keep last 10 runs)
	const runs = existingResults ? [newRun, ...existingResults.runs].slice(0, 10) : [newRun]

	// Generate summary
	const summary = generateSummary(runs)

	const results: TestResults = {
		runs,
		summary,
		lastUpdated: new Date().toISOString()
	}

	// Write to public folder
	fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

	console.log(`Test results saved to ${outputPath}`)
	console.log(`Total tests: ${summary.totalTests}`)
	console.log(`Passed: ${summary.passed}`)
	console.log(`Failed: ${summary.failed}`)
	console.log(`Skipped: ${summary.skipped}`)
	console.log(`Pass rate: ${summary.passRate}%`)
}

main().catch(error => {
	console.error('Error generating test results:', error)
	process.exit(1)
})

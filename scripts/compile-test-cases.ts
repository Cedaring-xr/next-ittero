#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'

interface TestCase {
	id: string
	title: string
	status: string
	priority: string
	testSuite?: string
	description: string
	preconditions: string[]
	testSteps: string[]
	expectedResult: string
	playwrightFile: string
	category: string
	filePath: string
}

interface CompiledTestCases {
	generatedAt: string
	totalTestCases: number
	categories: {
		[key: string]: {
			count: number
			testCases: TestCase[]
		}
	}
	statusSummary: {
		[key: string]: number
	}
	prioritySummary: {
		[key: string]: number
	}
}

/**
 * Parse a markdown test case file and extract test cases
 */
function parseTestCaseFile(filePath: string, category: string): TestCase[] {
	const content = fs.readFileSync(filePath, 'utf-8')
	const testCases: TestCase[] = []

	// Split by test case headers (### TEST-ID: Title)
	const testCasePattern = /^### ([A-Z]+-\d+): (.+)$/gm
	const matches = [...content.matchAll(testCasePattern)]

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i]
		const id = match[1]
		const title = match[2]
		const startIndex = match.index!
		const endIndex = i < matches.length - 1 ? matches[i + 1].index! : content.length

		const testCaseContent = content.substring(startIndex, endIndex)

		// Parse test case fields
		const status = extractField(testCaseContent, 'Status')
		const priority = extractField(testCaseContent, 'Priority')
		const testSuite = extractField(testCaseContent, 'Test Suite')
		const description = extractField(testCaseContent, 'Description')
		const preconditions = extractListItems(testCaseContent, 'Preconditions')
		const testSteps = extractListItems(testCaseContent, 'Test Steps')
		const expectedResult = extractField(testCaseContent, 'Expected Result')
		const playwrightFile = extractField(testCaseContent, 'Playwright File')

		testCases.push({
			id,
			title,
			status: cleanStatus(status),
			priority: priority.toLowerCase(),
			...(testSuite && { testSuite }),
			description,
			preconditions,
			testSteps,
			expectedResult,
			playwrightFile: playwrightFile === '-' ? '' : playwrightFile,
			category,
			filePath: path.relative(process.cwd(), filePath)
		})
	}

	return testCases
}

/**
 * Extract a field value from markdown content
 */
function extractField(content: string, fieldName: string): string {
	const pattern = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+?)(?=\\n\\*\\*|\\n---|$)`, 's')
	const match = content.match(pattern)
	if (!match) return ''

	return match[1]
		.trim()
		.replace(/`\[(.*?)\]`/g, '$1') // Remove status brackets like `[Completed]`
		.replace(/\n/g, ' ')
		.trim()
}

/**
 * Extract list items from markdown content
 */
function extractListItems(content: string, fieldName: string): string[] {
	const pattern = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n---|$)`, 's')
	const match = content.match(pattern)
	if (!match) return []

	const listContent = match[1]
	const items: string[] = []

	// Match both numbered (1. 2. 3.) and bulleted (- *) lists
	const itemPattern = /^[\s]*(?:\d+\.|-)\s*(.+)$/gm
	const itemMatches = [...listContent.matchAll(itemPattern)]

	for (const itemMatch of itemMatches) {
		items.push(itemMatch[1].trim())
	}

	return items
}

/**
 * Clean status field (remove brackets and backticks)
 */
function cleanStatus(status: string): string {
	return status
		.replace(/`/g, '')
		.replace(/\[/g, '')
		.replace(/\]/g, '')
		.trim()
}

/**
 * Get category name from file path
 */
function getCategoryFromPath(filePath: string): string {
	const parts = filePath.split(path.sep)
	const testCasesIndex = parts.indexOf('test-cases')

	if (testCasesIndex >= 0 && testCasesIndex < parts.length - 1) {
		return parts[testCasesIndex + 1]
	}

	return 'unknown'
}

/**
 * Find all markdown files in test-cases directory
 */
function findTestCaseFiles(dir: string): string[] {
	const files: string[] = []

	function traverse(currentDir: string) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name)

			if (entry.isDirectory()) {
				traverse(fullPath)
			} else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
				files.push(fullPath)
			}
		}
	}

	traverse(dir)
	return files
}

/**
 * Compile all test cases into a single JSON structure
 */
function compileTestCases(testCasesDir: string): CompiledTestCases {
	const testCaseFiles = findTestCaseFiles(testCasesDir)
	const allTestCases: TestCase[] = []
	const categories: { [key: string]: { count: number; testCases: TestCase[] } } = {}
	const statusSummary: { [key: string]: number } = {}
	const prioritySummary: { [key: string]: number } = {}

	for (const filePath of testCaseFiles) {
		const category = getCategoryFromPath(filePath)
		const testCases = parseTestCaseFile(filePath, category)

		allTestCases.push(...testCases)

		if (!categories[category]) {
			categories[category] = { count: 0, testCases: [] }
		}

		categories[category].testCases.push(...testCases)
		categories[category].count = categories[category].testCases.length
	}

	// Calculate summaries
	for (const testCase of allTestCases) {
		// Status summary
		statusSummary[testCase.status] = (statusSummary[testCase.status] || 0) + 1

		// Priority summary
		prioritySummary[testCase.priority] = (prioritySummary[testCase.priority] || 0) + 1
	}

	return {
		generatedAt: new Date().toISOString(),
		totalTestCases: allTestCases.length,
		categories,
		statusSummary,
		prioritySummary
	}
}

/**
 * Main execution
 */
function main() {
	const testCasesDir = path.join(__dirname, '../tests/test-cases')
	const outputFile = path.join(__dirname, '../tests/compiled-test-cases.json')

	console.log('📚 Compiling test case documentation...')
	console.log(`📂 Source directory: ${testCasesDir}`)

	if (!fs.existsSync(testCasesDir)) {
		console.error(`❌ Test cases directory not found: ${testCasesDir}`)
		process.exit(1)
	}

	const compiled = compileTestCases(testCasesDir)

	// Write to JSON file
	fs.writeFileSync(outputFile, JSON.stringify(compiled, null, 2))

	console.log(`✅ Compiled ${compiled.totalTestCases} test cases`)
	console.log(`📊 Categories: ${Object.keys(compiled.categories).join(', ')}`)
	console.log(`📄 Output file: ${outputFile}`)
	console.log('\nStatus Summary:')
	Object.entries(compiled.statusSummary).forEach(([status, count]) => {
		console.log(`  ${status}: ${count}`)
	})
	console.log('\nPriority Summary:')
	Object.entries(compiled.prioritySummary).forEach(([priority, count]) => {
		console.log(`  ${priority}: ${count}`)
	})
}

if (require.main === module) {
	main()
}

export { compileTestCases, parseTestCaseFile, type TestCase, type CompiledTestCases }

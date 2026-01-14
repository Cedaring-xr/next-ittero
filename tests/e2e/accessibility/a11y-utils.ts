import { Page, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

export interface A11yViolation {
	id: string
	impact: string
	description: string
	nodes: number
}

/**
 * Run an axe-core accessibility scan on the full page
 * @param page - Playwright page object
 * @param options - Optional configuration for the scan
 * @returns Array of violations found
 */
export async function scanPage(
	page: Page,
	options?: {
		disableRules?: string[]
		includedImpacts?: ('critical' | 'serious' | 'moderate' | 'minor')[]
	}
): Promise<A11yViolation[]> {
	let builder = new AxeBuilder({ page })

	if (options?.disableRules) {
		builder = builder.disableRules(options.disableRules)
	}

	if (options?.includedImpacts) {
		builder = builder.options({ resultTypes: ['violations'] })
	}

	const results = await builder.analyze()

	// Filter by impact if specified
	let violations = results.violations
	if (options?.includedImpacts) {
		violations = violations.filter((v) => options.includedImpacts!.includes(v.impact as any))
	}

	return violations.map((v) => ({
		id: v.id,
		impact: v.impact || 'unknown',
		description: v.description,
		nodes: v.nodes.length
	}))
}

/**
 * Run an axe-core accessibility scan on a specific element (e.g., modal)
 * @param page - Playwright page object
 * @param selector - CSS selector for the element to scan
 * @returns Array of violations found
 */
export async function scanElement(page: Page, selector: string): Promise<A11yViolation[]> {
	const results = await new AxeBuilder({ page }).include(selector).analyze()

	return results.violations.map((v) => ({
		id: v.id,
		impact: v.impact || 'unknown',
		description: v.description,
		nodes: v.nodes.length
	}))
}

/**
 * Assert no accessibility violations exist
 * @param violations - Array of violations from a scan
 * @param context - Description of what was scanned (for error messages)
 */
export function assertNoViolations(violations: A11yViolation[], context: string): void {
	if (violations.length > 0) {
		const violationSummary = violations
			.map((v) => `  - [${v.impact}] ${v.id}: ${v.description} (${v.nodes} element(s))`)
			.join('\n')

		expect(violations, `Accessibility violations found in ${context}:\n${violationSummary}`).toHaveLength(0)
	}
}

/**
 * Run a scan and assert no critical/serious violations
 * Useful for catching the most impactful issues while allowing minor ones
 */
export async function assertNoCriticalViolations(page: Page, context: string): Promise<void> {
	const violations = await scanPage(page, {
		includedImpacts: ['critical', 'serious']
	})
	assertNoViolations(violations, context)
}

/**
 * Generate a detailed report of violations for debugging
 */
export function generateViolationReport(violations: A11yViolation[]): string {
	if (violations.length === 0) {
		return 'No accessibility violations found.'
	}

	const grouped = violations.reduce(
		(acc, v) => {
			if (!acc[v.impact]) acc[v.impact] = []
			acc[v.impact].push(v)
			return acc
		},
		{} as Record<string, A11yViolation[]>
	)

	let report = `Found ${violations.length} accessibility violation(s):\n\n`

	const impactOrder = ['critical', 'serious', 'moderate', 'minor']
	for (const impact of impactOrder) {
		if (grouped[impact]) {
			report += `## ${impact.toUpperCase()} (${grouped[impact].length})\n`
			for (const v of grouped[impact]) {
				report += `  - ${v.id}: ${v.description}\n`
				report += `    Affects ${v.nodes} element(s)\n`
			}
			report += '\n'
		}
	}

	return report
}

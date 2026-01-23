import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/ui/loading-spinner'

describe('LoadingSpinner', () => {
	it('should render with default props', () => {
		const { container } = render(<LoadingSpinner />)

		// Should render the spinner container
		expect(container.querySelector('.relative')).toBeInTheDocument()

		// Should have medium size by default (w-12 h-12)
		expect(container.querySelector('.w-12.h-12')).toBeInTheDocument()
	})

	it('should render with custom text', () => {
		render(<LoadingSpinner text="Loading data..." />)

		expect(screen.getByText('Loading data...')).toBeInTheDocument()
	})

	it('should apply small size class', () => {
		const { container } = render(<LoadingSpinner size="sm" />)

		expect(container.querySelector('.w-8.h-8')).toBeInTheDocument()
	})

	it('should apply large size class', () => {
		const { container } = render(<LoadingSpinner size="lg" />)

		expect(container.querySelector('.w-16.h-16')).toBeInTheDocument()
	})

	it('should apply extra large size class', () => {
		const { container } = render(<LoadingSpinner size="xl" />)

		expect(container.querySelector('.w-24.h-24')).toBeInTheDocument()
	})

	it('should render fullScreen overlay when fullScreen prop is true', () => {
		const { container } = render(<LoadingSpinner fullScreen />)

		// Should have fixed positioning and backdrop
		const overlay = container.querySelector('.fixed.inset-0')
		expect(overlay).toBeInTheDocument()
		expect(overlay).toHaveClass('bg-white/80', 'backdrop-blur-sm')
	})

	it('should not render fullScreen overlay when fullScreen prop is false', () => {
		const { container } = render(<LoadingSpinner fullScreen={false} />)

		expect(container.querySelector('.fixed.inset-0')).not.toBeInTheDocument()
	})

	it('should apply primary color by default', () => {
		const { container } = render(<LoadingSpinner />)

		// Primary color uses bg-indigo-600
		expect(container.querySelector('.bg-indigo-600')).toBeInTheDocument()
	})

	it('should apply secondary color when specified', () => {
		const { container } = render(<LoadingSpinner color="secondary" />)

		// Secondary color uses bg-purple-600
		expect(container.querySelector('.bg-purple-600')).toBeInTheDocument()
	})

	it('should apply white color when specified', () => {
		const { container } = render(<LoadingSpinner color="white" />)

		// White color uses bg-white
		expect(container.querySelector('.bg-white')).toBeInTheDocument()
	})

	it('should render animation styles', () => {
		const { container } = render(<LoadingSpinner />)

		// Check for orbit animation classes
		expect(container.querySelector('.orbit-1')).toBeInTheDocument()
		expect(container.querySelector('.orbit-2')).toBeInTheDocument()
		expect(container.querySelector('.orbit-3')).toBeInTheDocument()
	})

	it('should apply correct text size based on spinner size', () => {
		const { container: smallContainer } = render(<LoadingSpinner size="sm" text="Small" />)
		expect(smallContainer.querySelector('.text-sm')).toBeInTheDocument()

		const { container: medContainer } = render(<LoadingSpinner size="md" text="Medium" />)
		expect(medContainer.querySelector('.text-base')).toBeInTheDocument()

		const { container: lgContainer } = render(<LoadingSpinner size="lg" text="Large" />)
		expect(lgContainer.querySelector('.text-lg')).toBeInTheDocument()

		const { container: xlContainer } = render(<LoadingSpinner size="xl" text="Extra Large" />)
		expect(xlContainer.querySelector('.text-xl')).toBeInTheDocument()
	})
})

import React from 'react'
import clsx from 'clsx'

interface ElegantButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
	size?: 'sm' | 'md' | 'lg'
	isLoading?: boolean
	icon?: React.ReactNode
	iconPosition?: 'left' | 'right'
	fullWidth?: boolean
	children: React.ReactNode
}

export default function ElegantButton({
	variant = 'primary',
	size = 'md',
	isLoading = false,
	icon,
	iconPosition = 'left',
	fullWidth = false,
	className,
	disabled,
	children,
	...props
}: ElegantButtonProps) {
	const baseStyles =
		'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

	const variantStyles = {
		primary:
			'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500 shadow-sm hover:shadow-md',
		secondary:
			'bg-slate-600 text-white hover:bg-slate-700 active:bg-slate-800 focus:ring-slate-500 shadow-sm hover:shadow-md',
		outline:
			'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500',
		ghost: 'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm hover:shadow-md'
	}

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-sm gap-1.5',
		md: 'px-4 py-2 text-base gap-2',
		lg: 'px-6 py-3 text-lg gap-2.5'
	}

	const widthStyle = fullWidth ? 'w-full' : ''

	return (
		<button
			className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], widthStyle, className)}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading && (
				<svg
					className="animate-spin -ml-1 h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			)}
			{!isLoading && icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
			<span>{children}</span>
			{!isLoading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
		</button>
	)
}

import React from 'react'

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg' | 'xl'
	text?: string
	fullScreen?: boolean
	color?: 'primary' | 'secondary' | 'white'
}

export default function LoadingSpinner({
	size = 'md',
	text,
	fullScreen = false,
	color = 'primary'
}: LoadingSpinnerProps) {
	// Size mappings
	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16',
		xl: 'w-24 h-24'
	}

	const dotSizeClasses = {
		sm: 'w-2 h-2',
		md: 'w-3 h-3',
		lg: 'w-4 h-4',
		xl: 'w-6 h-6'
	}

	const textSizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl'
	}

	// Color mappings
	const colorClasses = {
		primary: 'bg-indigo-600',
		secondary: 'bg-purple-600',
		white: 'bg-white'
	}

	const textColorClasses = {
		primary: 'text-gray-700',
		secondary: 'text-gray-700',
		white: 'text-white'
	}

	const spinner = (
		<>
			<style dangerouslySetInnerHTML={{
				__html: `
					@keyframes spinner-orbit {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
					.orbit-1 { animation: spinner-orbit 1s linear infinite; }
					.orbit-2 { animation: spinner-orbit 1s linear infinite; animation-delay: 0.15s; }
					.orbit-3 { animation: spinner-orbit 1s linear infinite; animation-delay: 0.3s; }
				`
			}} />
			<div className="flex flex-col items-center justify-center gap-4">
				{/* Unique orbiting dots spinner */}
				<div className={`relative ${sizeClasses[size]}`}>
					{/* Center dot */}
					<div
						className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${dotSizeClasses[size]} ${colorClasses[color]} rounded-full opacity-50`}
					></div>

					{/* Orbiting dots with custom animations */}
					<div className="absolute inset-0 orbit-1">
						<div
							className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} ${colorClasses[color]} rounded-full`}
						></div>
					</div>
					<div className="absolute inset-0 orbit-2">
						<div
							className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} ${colorClasses[color]} rounded-full opacity-75`}
						></div>
					</div>
					<div className="absolute inset-0 orbit-3">
						<div
							className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} ${colorClasses[color]} rounded-full opacity-50`}
						></div>
					</div>
				</div>

				{/* Optional loading text */}
				{text && <p className={`${textSizeClasses[size]} ${textColorClasses[color]} font-medium`}>{text}</p>}
			</div>
		</>
	)

	if (fullScreen) {
		return (
			<div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
				{spinner}
			</div>
		)
	}

	return spinner
}

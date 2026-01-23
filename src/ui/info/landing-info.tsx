import React from 'react'
import {
	BookOpenIcon,
	ListBulletIcon,
	ArchiveBoxIcon,
	ChartBarIcon,
	ShieldCheckIcon
} from '@heroicons/react/24/outline'

function LandingInfo() {
	const features = [
		{
			icon: BookOpenIcon,
			title: 'Quick Journal',
			description:
				'A personal daily quick journal designed to be fast, easy, and low-pressure. Quick journal focusses on short notes, key thoughts, and highlights of a day.'
		},
		{
			icon: ListBulletIcon,
			title: 'Categorized To-Do Lists',
			description:
				'A to-do list broken out into categories. Create categories based on importance or time sensitivity. Work, home, family, immediate, or long-term items, the options are up to you.'
		},
		{
			icon: ArchiveBoxIcon,
			title: 'Item Tracking',
			description:
				'When items are completed they are not deleted forever. They get archived for later reference if needed. Completed items should be celebrated not forgotten and unaccessable.'
		},
		{
			icon: ChartBarIcon,
			title: 'Monthly Reports',
			description:
				'Detailed feedback on how to improve. A monthly report is given on how many and what type of items have been acomplished. Suggestions are given on how to write better tasks.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Secure & Private',
			description:
				'Fully encrypted user data ensure that what you write remains personal to you. We will never monitize or sell your data.'
		}
	]

	return (
		<div className="font-lusitana py-16 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
						Simple but Powerful Productivity Tracking
					</h2>
					<p className="text-xl text-gray-700 max-w-3xl mx-auto">
						Everything you need to stay organized and accomplish your goals
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="p-8"
							style={{
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(71, 85, 105, 0.2)'
							}}
						>
							<div
								className="w-16 h-16 mb-6 flex items-center justify-center"
								style={{ backgroundColor: '#39CCCC' }}
							>
								<feature.icon className="w-8 h-8" style={{ color: '#001F3F' }} />
							</div>
							<h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3a5f' }}>
								{feature.title}
							</h3>
							<p className="text-gray-700 leading-relaxed">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default LandingInfo

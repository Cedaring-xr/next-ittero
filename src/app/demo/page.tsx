'use client'
import Link from 'next/link'
import { ArrowLeftIcon, ListBulletIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { lusitana } from '@/ui/fonts'
import ElegantButton from '@/ui/elegant-button'

export default function DemoPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
			{/* Header */}
			<div className="bg-gradient-to-r from-[#1e3a5f] to-slate-900 border-b-2 border-slate-600 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div>
						<h1 className={`${lusitana.className} text-2xl md:text-3xl text-white font-bold`}>
							Ittero Demo
						</h1>
						<p className="text-gray-300 text-sm mt-1">Explore features without signing up</p>
					</div>
					<Link href="/">
						<ElegantButton variant="secondary" size="md" icon={<ArrowLeftIcon className="w-5 h-5" />}>
							Back to Home
						</ElegantButton>
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
				{/* Introduction */}
				<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8 mb-8 text-center">
					<h2 className="text-xl md:text-2xl font-bold text-white mb-3">
						Welcome to the Ittero Interactive Demo
					</h2>
					<p className="text-gray-300 text-lg">
						Explore the core features below. Sign up to unlock full functionality and save your data!
					</p>
				</div>

				{/* Feature Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{/* Lists Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition-all">
						<div className="flex items-center gap-3 mb-4">
							<ListBulletIcon className="w-8 h-8 text-indigo-400" />
							<h3 className="text-xl font-semibold text-white">Lists</h3>
						</div>
						<p className="text-gray-300 mb-4">
							Create and manage organized lists for tasks, projects, and goals.
						</p>
						<div className="bg-slate-900 border border-slate-600 rounded p-4 mb-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300">Sample Task 1</span>
							</div>
							<div className="flex items-center gap-2 mb-2">
								<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300">Sample Task 2</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-indigo-500 border-2 border-indigo-500 rounded flex items-center justify-center">
									<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<span className="text-gray-400 line-through">Completed Task</span>
							</div>
						</div>
						<ElegantButton variant="outline" size="sm" fullWidth disabled>
							Try Lists (Demo)
						</ElegantButton>
					</div>

					{/* Journal Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition-all">
						<div className="flex items-center gap-3 mb-4">
							<BookOpenIcon className="w-8 h-8 text-purple-400" />
							<h3 className="text-xl font-semibold text-white">Journal</h3>
						</div>
						<p className="text-gray-300 mb-4">Document your thoughts, ideas, and daily reflections.</p>
						<div className="bg-slate-900 border border-slate-600 rounded p-4 mb-4">
							<div className="mb-3">
								<p className="text-sm text-gray-400 mb-1">Today, 2:30 PM</p>
								<p className="text-gray-300 italic">
									&quot;This is a sample journal entry. Write about your day, track your progress, and
									reflect on your journey...&quot;
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-400 mb-1">Yesterday, 8:15 AM</p>
								<p className="text-gray-300 italic">
									&quot;Another sample entry showing how your thoughts are organized
									chronologically...&quot;
								</p>
							</div>
						</div>
						<ElegantButton variant="outline" size="sm" fullWidth disabled>
							Try Journal (Demo)
						</ElegantButton>
					</div>

					{/* Stats Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition-all">
						<div className="flex items-center gap-3 mb-4">
							<ChartBarIcon className="w-8 h-8 text-green-400" />
							<h3 className="text-xl font-semibold text-white">Stats</h3>
						</div>
						<p className="text-gray-300 mb-4">
							Track your productivity and view insights about your activity.
						</p>
						<div className="bg-slate-900 border border-slate-600 rounded p-4 mb-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center">
									<p className="text-3xl font-bold text-indigo-400">24</p>
									<p className="text-sm text-gray-400">Tasks Completed</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold text-purple-400">8</p>
									<p className="text-sm text-gray-400">Journal Entries</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold text-green-400">12</p>
									<p className="text-sm text-gray-400">Active Lists</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold text-yellow-400">89%</p>
									<p className="text-sm text-gray-400">Completion Rate</p>
								</div>
							</div>
						</div>
						<ElegantButton variant="outline" size="sm" fullWidth disabled>
							Try Stats (Demo)
						</ElegantButton>
					</div>
				</div>

				{/* Call to Action */}
				<div className="bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-indigo-500 rounded-lg p-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
					<p className="text-gray-100 text-lg mb-6">
						Sign up now to create your account and start organizing your life with Ittero!
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/auth/signup">
							<ElegantButton variant="primary" size="lg">
								Create Free Account
							</ElegantButton>
						</Link>
						<Link href="/auth/login">
							<ElegantButton variant="secondary" size="lg">
								Log In
							</ElegantButton>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

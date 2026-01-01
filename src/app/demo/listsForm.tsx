import React from 'react'

function ListsForm() {
	return (
		<>
			<p className="text-gray-300 mb-6 text-lg">
				Create and manage organized lists for tasks, projects, and goals. Lists are organized in categories and
				also tags. Completed items are archived for later reference if needed. All tasks can have a priority
				option for low, medium, high, and urgent. Tasks that are time sensetive are labeled and can have
				notifications set as reminders.
			</p>

			{/* Template Lists - 3 Horizontal Sections */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				{/* Daily To-Do Template */}
				<div className="bg-slate-900 border-2 border-slate-500 rounded-lg p-6">
					<div className="flex justify-between">
						<h4 className="text-lg font-semibold text-white mb-4">To-Do</h4>
						<span className="border-2 text-white border-indigo-400 rounded-md px-2 py-[1px] h-8">
							Monthly
						</span>
					</div>
					<div className="space-y-2 mb-4">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">check mail</span>
						</div>
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300 text-sm">pay rent</span>
							</div>
							<span className="text-xs text-rose-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-600">
								due in: 48 hrs
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">return package</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Clean out garage</span>
						</div>
					</div>
					{/* Completed Tasks */}
					<div className="mt-4 pt-4 border-t border-slate-700">
						<p className="text-xs text-gray-500 mb-2 font-semibold">COMPLETED</p>
						<div className="space-y-2">
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
								<span className="text-gray-500 text-sm line-through">get car washed</span>
							</div>
						</div>
					</div>
				</div>

				{/* Shopping List Template */}
				<div className="bg-slate-900 border-2 border-slate-500 rounded-lg p-6">
					<div className="flex justify-between">
						<h4 className="text-lg font-semibold text-white mb-4">Groceries</h4>
						<span className="border-2 text-white border-purple-400 rounded-md px-2 py-[1px] h-8">
							Shopping List
						</span>
					</div>
					<div className="space-y-2 mb-1">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Bread</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Eggs</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Pizza</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Dog food</span>
						</div>
					</div>
					{/* Completed Tasks */}
					<div className="mt-4 pt-4 border-t border-slate-700">
						<p className="text-xs text-gray-500 mb-2 font-semibold">COMPLETED</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-purple-500 border-2 border-purple-500 rounded flex items-center justify-center">
									<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<span className="text-gray-500 text-sm line-through">ice cream</span>
							</div>
						</div>
					</div>
				</div>

				{/* Project Tasks Template */}
				<div className="bg-slate-900 border-2 border-slate-500 rounded-lg p-6">
					<div className="flex justify-between">
						<h4 className="text-lg font-semibold text-white mb-4">Coding Project</h4>
						<span className="border-2 text-white border-green-400 rounded-md px-2 py-[1px] h-8">Work</span>
					</div>
					<div className="space-y-2 mb-4">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Update Jira tickets</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Code reviews</span>
						</div>
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300 text-sm">Write new tests</span>
							</div>
							<span className="text-xs text-emerald-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-600">
								due in: 4 days
							</span>
						</div>
					</div>
					{/* Completed Tasks */}
					<div className="mt-4 pt-4 border-t border-slate-700">
						<p className="text-xs text-gray-500 mb-2 font-semibold">COMPLETED</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 border-2 border-green-500 rounded flex items-center justify-center">
									<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<span className="text-gray-500 text-sm line-through">Manager meeting</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 border-2 border-green-500 rounded flex items-center justify-center">
									<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<span className="text-gray-500 text-sm line-through">Write documentation</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Priorities Section - Full Width */}
			<div className="bg-slate-900 border-2 border-slate-500 rounded-lg p-6">
				<div className="flex justify-between mb-4">
					<h4 className="text-lg font-semibold text-white">Priorities</h4>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 mr-36">
					<div className="space-y-2">
						<p className="text-sm font-semibold text-red-400 mb-2">Urgent</p>
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300 text-sm">pay rent</span>
							</div>
							<span className="text-xs text-rose-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-600">
								due in: 48 hrs
							</span>
						</div>
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300 text-sm">Write new tests</span>
							</div>
							<span className="text-xs text-emerald-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-600">
								due in: 4 days
							</span>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="space-y-2">
						<p className="text-sm font-semibold text-yellow-400 mb-2">High Priority</p>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">return package</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Code reviews</span>
						</div>
					</div>
					<div className="space-y-2">
						<p className="text-sm font-semibold text-lime-400 mb-2">Medium Priority</p>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Dog food</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Update Jira tickets</span>
						</div>
					</div>
					<div className="space-y-2">
						<p className="text-sm font-semibold text-cyan-400 mb-2">Low Priority</p>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">check mail</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Clean out garage</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ListsForm

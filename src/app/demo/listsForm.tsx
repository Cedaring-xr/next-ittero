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
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">pay rent</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">return package</span>
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
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Write new tests</span>
						</div>
					</div>
				</div>
			</div>

			{/* Priorities Section - Full Width */}
			<div className="bg-slate-900 border-2 border-slate-500 rounded-lg p-6">
				<div className="flex justify-between mb-4">
					<h4 className="text-lg font-semibold text-white">Priorities</h4>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
					<div className="space-y-2">
						<p className="text-sm font-semibold text-red-400 mb-2">Urgent</p>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Complete project proposal</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Client meeting prep</span>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="space-y-2">
						<p className="text-sm font-semibold text-yellow-400 mb-2">High Priority</p>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Complete project proposal</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Client meeting prep</span>
						</div>
					</div>
					<div className="space-y-2">
						<p className="text-sm font-semibold text-orange-400 mb-2">Medium Priority</p>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Update documentation</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Review team feedback</span>
						</div>
					</div>
					<div className="space-y-2">
						<p className="text-sm font-semibold text-green-400 mb-2">Low Priority</p>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Organize workspace</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-gray-300 text-sm">Read industry articles</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ListsForm

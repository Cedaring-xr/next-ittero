import React from 'react'

function Stats() {
	return (
		<>
			<p className="text-gray-300 mb-6 text-lg">
				Track your productivity and view insights about your activity.
			</p>
			<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="text-center">
						<p className="text-4xl font-bold text-indigo-400">24</p>
						<p className="text-sm text-gray-400 mt-1">Tasks Completed</p>
					</div>
					<div className="text-center">
						<p className="text-4xl font-bold text-purple-400">8</p>
						<p className="text-sm text-gray-400 mt-1">Journal Entries</p>
					</div>
					<div className="text-center">
						<p className="text-4xl font-bold text-green-400">12</p>
						<p className="text-sm text-gray-400 mt-1">Active Lists</p>
					</div>
					<div className="text-center">
						<p className="text-4xl font-bold text-yellow-400">89%</p>
						<p className="text-sm text-gray-400 mt-1">Completion Rate</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default Stats

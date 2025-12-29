'use client'
import React from 'react'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface TaskFormFieldsProps {
	newItemText: string
	setNewItemText: (value: string) => void
	newItemDueDate: string
	setNewItemDueDate: (value: string) => void
	newItemDueTime: string
	setNewItemDueTime: (value: string) => void
	newItemPriority: Priority
	setNewItemPriority: (value: Priority) => void
}

const getPriorityColor = (priority: Priority): string => {
	switch (priority) {
		case 'urgent':
			return 'bg-red-600 text-white'
		case 'high':
			return 'bg-orange-600 text-white'
		case 'medium':
			return 'bg-yellow-600 text-white'
		case 'low':
			return 'bg-blue-600 text-white'
		case 'none':
			return 'bg-gray-600 text-white'
	}
}

export default function TaskFormFields({
	newItemText,
	setNewItemText,
	newItemDueDate,
	setNewItemDueDate,
	newItemDueTime,
	setNewItemDueTime,
	newItemPriority,
	setNewItemPriority
}: TaskFormFieldsProps): JSX.Element {
	return (
		<>
			{/* Task Input */}
			<div>
				<label htmlFor="taskText" className="block text-sm font-medium text-gray-200 mb-2">
					Task <span className="text-red-400">*</span>
				</label>
				<input
					type="text"
					id="taskText"
					value={newItemText}
					onChange={(e) => setNewItemText(e.target.value)}
					placeholder="What needs to be done?"
					className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					required
				/>
			</div>

			{/* Due Date */}
			<div>
				<label htmlFor="dueDate" className="block text-sm font-medium text-gray-200 mb-2">
					Due Date (Optional)
				</label>
				<input
					type="date"
					id="dueDate"
					value={newItemDueDate}
					onChange={(e) => setNewItemDueDate(e.target.value)}
					className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>

			{/* Due Time */}
			<div>
				<label htmlFor="dueTime" className="block text-sm font-medium text-gray-200 mb-2">
					Due Time (Optional)
				</label>
				<input
					type="time"
					id="dueTime"
					value={newItemDueTime}
					onChange={(e) => setNewItemDueTime(e.target.value)}
					disabled={!newItemDueDate}
					className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
				/>
				{!newItemDueDate && (
					<p className="text-xs text-gray-400 mt-1">Select a due date first</p>
				)}
			</div>

			{/* Priority */}
			<div>
				<label className="block text-sm font-medium text-gray-200 mb-3">Priority</label>
				<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
					{(['urgent', 'high', 'medium', 'low', 'none'] as Priority[]).map((p) => (
						<label
							key={p}
							className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
								newItemPriority === p
									? 'border-indigo-500 bg-indigo-600/20'
									: 'border-slate-600 bg-slate-700 hover:border-slate-500'
							}`}
						>
							<input
								type="radio"
								name="priority"
								value={p}
								checked={newItemPriority === p}
								onChange={(e) => setNewItemPriority(e.target.value as Priority)}
								className="sr-only"
							/>
							<span className="text-white capitalize font-medium">{p}</span>
						</label>
					))}
				</div>
			</div>
		</>
	)
}

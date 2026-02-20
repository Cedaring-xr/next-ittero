import { useState } from 'react'
import TaskFormFields from '../../../src/ui/task-form-fields'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

export function TaskFormWrapper() {
	const [text, setText] = useState('')
	const [dueDate, setDueDate] = useState('')
	const [dueTime, setDueTime] = useState('')
	const [priority, setPriority] = useState<Priority>('none')

	return (
		<TaskFormFields
			newItemText={text}
			setNewItemText={setText}
			newItemDueDate={dueDate}
			setNewItemDueDate={setDueDate}
			newItemDueTime={dueTime}
			setNewItemDueTime={setDueTime}
			newItemPriority={priority}
			setNewItemPriority={setPriority}
		/>
	)
}

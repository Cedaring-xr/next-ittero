

// Format timestamp to MM-DD-YYYY
export const formatDate = (timestamp: string) => {
	const date = new Date(timestamp)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()
	return `${month}-${day}-${year}`
}

export const formatDateFromStr = (dateStr: string) => {
	const [year, month, day] = dateStr.split('-')
	return `${month}-${day}-${year}`
}

// Get today's date in YYYY-MM-DD format using local timezone
export const getTodayDate = () => {
	const today = new Date()
	const year = today.getFullYear()
	const month = String(today.getMonth() + 1).padStart(2, '0')
	const day = String(today.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

// Get date N days ago in YYYY-MM-DD format using local timezone
export const getDateDaysAgo = (days: number) => {
	const date = new Date()
	date.setDate(date.getDate() - days)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

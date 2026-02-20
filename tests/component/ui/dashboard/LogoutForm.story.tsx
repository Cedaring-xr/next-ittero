import { PowerIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

// Mock version of LogoutForm that doesn't use server actions
export function LogoutFormWrapper({ isCollapsed }: { isCollapsed: boolean }) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Mock submit - do nothing in tests
	}

	return (
		<form onSubmit={handleSubmit}>
			<button
				type="submit"
				className={clsx(
					'flex h-[48px] w-full grow items-center justify-center gap-2 bg-slate-800 border-t-2 border-slate-600 p-3 text-sm text-gray-100 font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg',
					isCollapsed ? 'md:justify-center' : ''
				)}
			>
				<PowerIcon className="w-6" />
				{!isCollapsed && <div className="hidden md:block">Sign Out</div>}
			</button>
		</form>
	)
}

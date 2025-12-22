'use client'

import { PowerIcon } from '@heroicons/react/24/outline'
import { useFormState } from 'react-dom'
import { handleSignOut } from '@/lib/cognitoActions'

export default function LogoutForm() {
	const [, dispatch] = useFormState(handleSignOut, undefined)
	return (
		<form action={dispatch}>
			<button className="flex h-[48px] w-full grow items-center justify-center gap-2 bg-slate-800 border-t-2 border-slate-600 p-3 text-sm text-gray-100 font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg">
				<PowerIcon className="w-6" />
				<div className="hidden md:block">Sign Out</div>
			</button>
		</form>
	)
}

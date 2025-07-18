'use client'

import { lusitana } from '@/ui/fonts'
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/ui/button'
import { useFormState, useFormStatus } from 'react-dom'
import { handleSignIn } from '@/lib/cognitoActions'
import Link from 'next/link'

export default function LoginForm() {
	const [errorMessage, dispatch] = useFormState(handleSignIn, undefined)
	return (
		<form action={dispatch} className="space-y-3">
			<div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
				<h1 className={`${lusitana.className} mb-3 text-2xl text-gray-900`}>Please sign in to continue.</h1>
				<div className="w-full">
					<div>
						<label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
							Email
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm text-gray-900 outline-2 placeholder:text-gray-700"
								id="email"
								type="email"
								name="email"
								placeholder="Enter your email address"
								required
							/>
							<AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div className="mt-4">
						<label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
							Password
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm text-gray-900 outline-2 placeholder:text-gray-500"
								id="password"
								type="password"
								name="password"
								placeholder="Enter password"
								required
								minLength={6}
							/>
							<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
				</div>
				<LoginButton />
				<div className="flex justify-center">
          			<Link
            			href="/auth/reset-password/submit"
            			className="mt-2 cursor-pointer text-blue-500"
          			>
            			Forgot password? Click here.
          			</Link>
        		</div>
				<div className="flex justify-center">
					<Link href="/auth/signup" className="mt-2 cursor-pointer text-blue-500">
						{"Don't have an account? "} Sign up.
					</Link>
				</div>
				<div className="flex h-8 items-end space-x-1">
					<div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
						{errorMessage && (
							<>
								<ExclamationCircleIcon className="h-5 w-5 text-red-500" />
								<p className="text-sm text-red-500">{errorMessage}</p>
							</>
						)}
					</div>
				</div>
			</div>
		</form>
	)
}

function LoginButton() {
	const { pending } = useFormStatus()

	return (
		<Button className="mt-4 w-full" aria-disabled={pending}>
			Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
		</Button>
	)
}

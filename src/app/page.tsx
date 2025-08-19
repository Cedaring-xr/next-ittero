import AcmeLogo from '@/ui/acme-logo'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { lusitana } from '@/ui/fonts'
import Image from 'next/image'
import LandingInfo from '@/ui/info/landing-info'
import Footer from '@/ui/info/footer'

export default function Page() {
	return (
		<>
			<main className="flex min-h-screen flex-col p-2">
				<div className="flex h-24 shrink-0 items-end rounded-lg bg-indigo-700 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
					<AcmeLogo />
				</div>
				<div className="mt-4 flex grow flex-col gap-4 md:flex-row max-w-[1300px] mx-auto">
					<div className="flex flex-col justify-center items-center gap-6 rounded-lg bg-gray-200 py-10 md:w-3/5 md:px-20 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
						<p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
							<strong>Welcome to Ittero App.</strong>
						</p>
						<Link
							href="/auth/login"
							className="flex gap-5 self-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 md:text-base"
						>
							<span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
						<Link
							href="/auth/signup"
							className="flex items-center gap-5 self-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 md:text-base"
						>
							<span>Sign Up</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
					</div>
					<div className="flex items-center justify-center md:w-2/5">
						<Image
							src="/journal.png"
							width={1000}
							height={760}
							className="hidden md:block rounded-lg"
							alt="Screenshots of the dashboard project showing desktop version"
						/>
						<Image
							src="/journal.png"
							width={560}
							height={620}
							className="block md:hidden rounded-lg"
							alt="Screenshots of the dashboard project showing mobile version"
						/>
					</div>
				</div>

				<div className="sm:justify-center p-6">
					<LandingInfo />
				</div>
			</main>
		</>
	)
}

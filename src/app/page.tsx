'use client'
import AcmeLogo from '@/ui/acme-logo'
import { ArrowRightIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { lusitana } from '@/ui/fonts'
import Image from 'next/image'
import LandingInfo from '@/ui/info/landing-info'
import Footer from '@/ui/info/footer'

export default function Page() {
	return (
		<>
			<main
				className="flex min-h-screen flex-col"
				style={{
					background: 'radial-gradient(ellipse at center, #e2e8f0 0%, #e2e8f0 45%, #9ca3af 75%, #6b7280 100%)'
				}}
			>
				<div
					className="flex h-24 shrink-0 items-end shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
					style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }}
				>
					<AcmeLogo />
				</div>
				<div className="mt-4 flex grow relative max-w-[1100px] mx-auto w-full items-center justify-center min-h-[500px] md:min-h-[600px]">
					{/* Background Image */}
					<div className="absolute inset-0">
						<Image
							src="/journal.png"
							fill
							className="object-cover"
							alt="Ittero dashboard background"
							priority
						/>
					</div>

					{/* Glassmorphism Box */}
					<div
						className="relative z-10 flex flex-col justify-center items-center gap-6 py-8 px-8 md:px-20 max-w-2xl mx-auto rounded-3xl shadow-2xl"
						style={{
							backgroundColor: 'rgba(71, 85, 105, 0.85)',
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)',
							border: '1px solid rgba(241, 245, 249, 0.18)'
						}}
					>
						<p
							className={`${lusitana.className} text-2xl md:text-4xl md:leading-normal text-center text-[#f1f5f9]`}
						>
							<strong>Welcome to Ittero App</strong>
						</p>
						<Link
							href="/auth/login"
							className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 hover:shadow-xl active:bg-indigo-800 active:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
						<Link
							href="/auth/signup"
							className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 hover:shadow-xl active:bg-indigo-800 active:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<span>Sign Up</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
					</div>
				</div>

				{/* Demo Button Section */}
				<div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 py-12 px-4 border-y-2 border-slate-700">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
							Experience Ittero Before You Sign Up
						</h2>
						<p className="text-gray-300 mb-8 text-lg">
							Explore our features with a live demo - no account required
						</p>
						<Link
							href="/demo"
							className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xl font-semibold rounded-lg transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl active:scale-100 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
						>
							<PlayCircleIcon className="w-7 h-7" />
							<span>Demo Available Features</span>
						</Link>
					</div>
				</div>

				<LandingInfo />
			</main>
		</>
	)
}

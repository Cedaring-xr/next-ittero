'use client'
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
			<main
				className="flex min-h-screen flex-col p-2"
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
						className="relative z-10 flex flex-col justify-center items-center gap-4 py-8 px-8 md:px-20 max-w-2xl mx-auto rounded-3xl shadow-2xl"
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
							className="flex gap-5 self-center px-8 py-4 text-sm font-medium transition-colors md:text-base hover:bg-[#01ff70] bg-[#39cccc] border-[2px] border-black"
						>
							<span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
						<Link
							href="/auth/signup"
							className="flex items-center gap-5 self-center px-8 py-4 text-sm font-medium transition-colors md:text-base hover:bg-[#01ff70] bg-[#39cccc] border-[2px] border-black"
						>
							<span>Sign Up</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
					</div>
				</div>

				<LandingInfo />
			</main>
		</>
	)
}

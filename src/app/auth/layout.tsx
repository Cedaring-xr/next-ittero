// import Logo from '@/ui/some-logo'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex items-center justify-center md:h-screen">
			<div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5">
				<div>
					<div>logo</div>
				</div>
				{children}
			</div>
		</main>
	)
}

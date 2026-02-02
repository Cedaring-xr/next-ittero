import SideNav from '@/ui/dashboard/sidenav'
import Providers from '@/app/providers'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<div
				className="flex min-h-screen flex-col md:flex-row"
				style={{
					background: 'radial-gradient(ellipse at center, #ffffff 0%, #f8fafc 45%, #f1f5f9 75%, #e2e8f0 100%)'
				}}
			>
				<div className="flex-none">
					<SideNav />
				</div>
				<main className="flex-grow p-6 md:p-6">{children}</main>
			</div>
		</Providers>
	)
}

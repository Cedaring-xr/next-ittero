import SideNav from '@/ui/dashboard/sidenav'
import Providers from '@/app/providers'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<div
				className="flex min-h-screen flex-col md:flex-row"
				style={{
					background: 'radial-gradient(ellipse at center, #e2e8f0 0%, #e2e8f0 45%, #9ca3af 75%, #6b7280 100%)'
				}}
			>
				<div className="flex-none">
					<SideNav />
				</div>
				<div className="flex-grow p-6 md:p-6">{children}</div>
			</div>
		</Providers>
	)
}

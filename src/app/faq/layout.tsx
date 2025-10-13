import SideNav from '@/ui/dashboard/sidenav'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col md:flex-row bg-stone-700">
			<div className="w-full flex-none md:w-64"></div>
			<div className="flex-grow p-6 md:overflow-y-auto md:p-6">{children}</div>
		</div>
	)
}

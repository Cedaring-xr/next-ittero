export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden bg-stone-200">
			<div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
		</div>
	)
}

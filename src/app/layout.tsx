import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/ui/info/footer'
import ConfigureAmplifyClientSide from './amplify-cognito-config'
import Providers from './providers'

export const metadata: Metadata = {
	title: 'List, Itterate, Improve',
	description: 'AWS services Next.js app.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lusitana:wght@400;700&family=Corinthia:wght@400;700&display=swap" rel="stylesheet" />
			</head>
			<body className="font-inter antialiased bg-slate-700">
				<>
					<ConfigureAmplifyClientSide />
					<Providers>
						{children}
					</Providers>
				</>
				<Footer />
			</body>
		</html>
	)
}

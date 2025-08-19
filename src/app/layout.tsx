import type { Metadata } from 'next'
import './globals.css'
import { inter } from '@/ui/fonts'
import Footer from '@/ui/info/footer'
import ConfigureAmplifyClientSide from './amplify-cognito-config'

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
			<body className={`${inter.className} antialiased bg-slate-700`}>
				<>
					<ConfigureAmplifyClientSide />
					{children}
				</>
				<Footer />
			</body>
		</html>
	)
}

import type { Metadata } from 'next'
import './globals.css'
import { inter } from '@/ui/fonts'
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
			<body className={`${inter.className} antialiased`}>
				<>
					<ConfigureAmplifyClientSide />
					{children}
				</>
			</body>
		</html>
	)
}

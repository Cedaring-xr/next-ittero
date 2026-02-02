import Link from 'next/link'
import Image from 'next/image'

interface DashboardCardProps {
	href: string
	imageSrc: string
	title: React.ReactNode
	icon: React.ReactNode
	iconColor: string
	glowColor: string
}

export default function DashboardCard({
	href,
	imageSrc,
	title,
	icon,
	iconColor,
	glowColor
}: DashboardCardProps) {
	return (
		<Link href={href}>
			<div
				className={`relative rounded-lg overflow-hidden transition-all duration-300 md:hover:scale-105 md:hover:shadow-2xl active:scale-105 active:shadow-2xl max-w-[400px] ${glowColor}`}
			>
				<Image
					src={imageSrc}
					width={800}
					height={533}
					className="w-full h-auto transition-transform duration-300"
					alt={title}
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 md:hover:opacity-100 active:opacity-100 transition-opacity duration-300"></div>
				<div className="absolute inset-0 -top-10 flex items-center pl-4">
					<div className={`h-[35px] w-[35px] drop-shadow-lg transition-transform duration-300 md:hover:scale-110 md:hover:rotate-12 active:scale-110 active:rotate-12 animate-pulse ${iconColor}`}>
						{icon}
					</div>
					<h3 className="text-lg sm:text-3xl md:text-xl lg:text-3xl ml-3 text-white font-bold drop-shadow-lg">
						{title}
					</h3>
				</div>
			</div>
		</Link>
	)
}

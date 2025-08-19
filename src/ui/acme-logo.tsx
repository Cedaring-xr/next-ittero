import { GiNotebook } from 'react-icons/gi'
import { corinthia } from '@/ui/fonts'
import { lusitana } from '@/ui/fonts'

export default function AcmeLogo() {
	return (
		<div className={`${corinthia.className} flex flex-row items-center leading-none text-white ml-6 w-full`}>
			<GiNotebook className="h-14 w-14 mb-4" />
			<p className="text-[90px] ml-6">Ittero</p>
			<p className={`${lusitana.className} text-2xl hidden md:flex ml-48 lg:ml-[400px]`}>
				List - Iterate - Improve
			</p>
		</div>
	)
}

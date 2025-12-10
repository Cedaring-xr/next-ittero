import { GiNotebook } from 'react-icons/gi'
import { corinthia } from '@/ui/fonts'
import { lusitana } from '@/ui/fonts'

export default function AcmeLogo() {
	return (
		<div className={`${corinthia.className} flex flex-row items-center justify-between leading-none text-white ml-6 mr-6 w-full`}>
			<div className="flex flex-row items-center">
				<GiNotebook className="h-14 w-14 mb-4" />
				<p className="text-[90px] ml-6">Ittero</p>
			</div>
			<p className={`${lusitana.className} text-2xl italic font-light hidden md:flex text-gray-300 absolute left-1/2 transform -translate-x-1/2`}>
				List - Iterate - Improve
			</p>
		</div>
	)
}

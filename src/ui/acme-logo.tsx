import { GiNotebook } from 'react-icons/gi'
import { corinthia } from '@/ui/fonts'
import { lusitana } from '@/ui/fonts'

export default function AcmeLogo() {
	return (
		<div
			className={`${corinthia.className} flex flex-row items-center justify-between leading-none text-white ml-6 mr-6 w-full`}
		>
			<div className="flex flex-row items-center">
				<GiNotebook className="h-12 w-12 mb-4" />
				<p className="text-[76px] ml-4">Ittero</p>
			</div>
		</div>
	)
}

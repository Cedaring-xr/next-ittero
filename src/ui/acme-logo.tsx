import { GiNotebook } from "react-icons/gi";
import { corinthia } from '@/ui/fonts'

export default function AcmeLogo() {
	return (
		<div className={`${corinthia.className} flex flex-row items-center leading-none text-white`}>
			<GiNotebook className="h-12 w-12" />
			<p className="text-[90px] ml-6">Ittero</p>
		</div>
	)
}

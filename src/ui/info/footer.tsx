import React from 'react'
import Link from 'next/link'

function Footer() {
	return (
		<div className="mt-4 pt-2 pb-2 bg-slate-900 text-white">
			<div className="flex justify-between max-w-[1500px] mx-auto">
				<div className="ml-2 flex flex-col">
					<span>version 1.02.1</span>
				</div>
				<div className="flex flex-col">
					<span>&#169; Ittero 2025</span>
				</div>
				<div className="mr-2 flex flex-col">
					<Link href="/faq">
						<span>FAQ</span>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Footer

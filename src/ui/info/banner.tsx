import React, { useState, useEffect } from 'react'
import { HiOutlineBackspace } from 'react-icons/hi'
import { lusitana } from '../fonts'

type Props = {
	message: string
	title: string
	color: string
}

export default function Banner({ message, title, color }: Props) {
	const [bannerVisible, setBannerVisible] = useState(true)

	useEffect(() => {
		setBannerVisible(true)
	}, [])

	return (
		<>
			{bannerVisible && (
				<div className={`banner ${color}`}>
					<div className="flex justify-between">
						<h4 className={`${lusitana.className} justify-start text-xl font-bold`}>{title}</h4>
						<div className="flex">
							<div className="close flex cursor-pointer" onClick={() => setBannerVisible(false)}>
								<HiOutlineBackspace className="text-3xl mt-1 mr-1" />
								{/* <span className="mt-[5px]">Close</span> */}
							</div>
						</div>
					</div>
					<p className="mt-4">{message}</p>
				</div>
			)}
		</>
	)
}

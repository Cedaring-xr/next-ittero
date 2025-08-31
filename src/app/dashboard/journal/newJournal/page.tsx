'use client'
import dynamic from 'next/dynamic'
import { lusitana } from '@/ui/fonts'
import React from 'react'
// import Banner from '@/ui/info/banner'

const Banner = dynamic(() => import('@/ui/info/banner'), { ssr: false })

function page() {
	return (
		<>
			<div id="journal container">
				<h2 className={`${lusitana.className} text-[24px] md:text-[42px] text-center font-bold`}>
					Quick Journal Entry
				</h2>
				<div id="QJ-intro">
					<Banner
						message="A quick journal is a simplified style of journaling that is meant to be fast, easy, and
                                 low-pressure. Instead of writing long, detailed entries, a quick journal focuses on jotting down
                                 short notes, key thoughts, or highlights from your day."
						title="How Quick Journal Works"
						color="green-banner"
					/>
				</div>
				<Banner message="test" title="test" color="green-banner" />
				<div className="banner-2">
					<h5>Tips:</h5>
					<ul className="list-disc">
						<li>Spend less than 2 minutes writing</li>
						<li>Note how the day felt overall</li>
						<li>Note anything suprising or new that you learned</li>
						<li>Note one successful thing that was acomplised</li>
						<li>Note any challenges or road-blocks</li>
					</ul>
				</div>

				<div id="entry-form-container">
					<form action="submit">
						<p>toggle for free form or template</p>
						<select name="date" id="date">
							date dropdown
						</select>
					</form>
				</div>
				<div>
					<button>View past entries</button>
					<button>Setup notifications</button>
				</div>
			</div>
		</>
	)
}

export default page

'use client'
import dynamic from 'next/dynamic'
import { lusitana } from '@/ui/fonts'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdArrowRightAlt } from 'react-icons/md'
import { MdNotificationsActive } from 'react-icons/md'
import Link from 'next/link'

const Banner = dynamic(() => import('@/ui/info/banner'), { ssr: false })

export type FormData = {
	name: string
	email: string
	message: string
}

export default function NewJournal() {
	const [sendForm, setSendForm] = useState(false)
	const { register, handleSubmit } = useForm<FormData>()

	function onSubmit(data: FormData) {}

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
						color="teal-banner"
					/>
				</div>
				<div className="banner-2">
					<h5>Tips:</h5>
					<ul className="list-disc">
						<li>Spend less than 2 minutes writing</li>
						<li>Note how the day felt overall</li>
						<li>Note anything suprising or new that you learned</li>
						<li>Note one successful thing that was acomplised</li>
						<li>Note any challenges or road-blocks</li>
					</ul>
					<div className="invisible">
						<p>toggle for free form or template</p>

						<select name="date" id="date">
							date dropdown
						</select>
					</div>
				</div>
				<div id="entry-form-container">
					<form onSubmit={handleSubmit(onSubmit)}>
						{sendForm ? (
							<div className="h-[350px] mt-24">
								<h3 className="mx-4 serif-font text-xl">
									<span className="font-bold">Thank you for your interest! </span>
									<br />
									Your message has been recieved and I will respond by email as soon as I am able.
								</h3>
							</div>
						) : (
							<div className="border-[1px] border-black p-4 m-4">
								<div className="my-2">
									<label htmlFor="name" className="mb-2 block text-base font-medium">
										Title
									</label>
									<input
										type="text"
										placeholder="Entry title"
										className="w-full rounded-md border border-gray-300 bg-[#f7f4fb] pt-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
										{...register('name', { required: true })}
									/>
								</div>
								<div className="mb-5">
									<label htmlFor="message" className="mb-2 block text-base font-medium text-black">
										Message
									</label>
									<textarea
										rows={4}
										placeholder="Type your message"
										className="w-full resize-none rounded-md border border-gray-300 bg-white pt-2 px-6 text-base font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
										{...register('message', { required: true })}
									></textarea>
								</div>
								<div>
									<button
										className="hover:shadow-form text-xl  headline-font text-black border-[1px] border-black"
										type="submit"
									>
										<div id="button-wrapper" className="button-wrap-shadow">
											<div className="button-gradient button-clip button-shadow">
												<div className="button-clip bg-[#f7f4fb] px-4 py-0 items-center flex hover:bg-[#121313] hover:text-[#89f7fe]">
													Submit
													<MdArrowRightAlt className="text-4xl ml-2"> </MdArrowRightAlt>
												</div>
											</div>
										</div>
									</button>
								</div>
							</div>
						)}
					</form>
				</div>
				<div className="flex gap-6 m-8 mt-20">
					<button className="hover:shadow-form text-xl  headline-font text-black border-[1px] border-black">
						<Link href="/dashboard/jounal">
							<div id="button-wrapper" className="button-wrap-shadow">
								<div className="button-gradient button-clip button-shadow">
									<div className="button-clip bg-[#f7f4fb] px-4 py-0 items-center flex hover:bg-[#121313] hover:text-[#89f7fe] font-bold">
										View Past Entries
										<MdArrowRightAlt className="text-4xl ml-2"> </MdArrowRightAlt>
									</div>
								</div>
							</div>
						</Link>
					</button>
					<button className="hover:shadow-form text-xl  headline-font text-black border-[1px] border-black">
						<div id="button-wrapper" className="button-wrap-shadow">
							<div className="button-gradient button-clip button-shadow">
								<div className="button-clip bg-[#f7f4fb] px-4 py-0 items-center flex hover:bg-[#121313] hover:text-[#89f7fe] font-bold">
									Set Up Notifications
									<MdNotificationsActive className="text-4xl ml-2"></MdNotificationsActive>
								</div>
							</div>
						</div>
					</button>
				</div>
			</div>
		</>
	)
}

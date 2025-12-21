'use client'
import useAuthUser from '@/app/hooks/user-auth-user'
import ElegantButton from '@/ui/elegant-button'
import { PlusIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useState } from 'react'
import { lusitana } from '@/ui/fonts'
import { HiOutlinePresentationChartBar, HiOutlineBookOpen, HiOutlineClipboardList } from 'react-icons/hi'

function Stats() {
	const [notificationCount, setNotificationCount] = useState(0)

	const user = useAuthUser()

	const handleCalculateJournalStats = () => {
		// fetch resources needed to calculate stats
		// run calculation functions
		// push results to state variables
	}

	const handleShowOldJournalStats = () => {}

	const handleShowOldListStats = () => {}

	const handleShowJournalNotifications = () => {}

	const handleShowListNotifications = () => {}

	const handleNotificationsClick = () => {
		// TODO: Open notifications panel/modal
		console.log('Notifications clicked')
	}

	return (
		<>
			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-2 py-4 w-full mb-6">
				<div className="flex ml-4">
					<HiOutlinePresentationChartBar className="h-[30px] w-[30px]" />
					<h2 className="md:text-xl ml-2">{user?.name ? `${user?.name}'s Usage Statistics` : ''}</h2>
				</div>
				<div className="flex items-center mr-4">
					<button
						onClick={handleNotificationsClick}
						className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors flex"
						aria-label="Notifications"
					>
						<BellIcon className="w-6 h-6" />
						{/* Optional: Add notification badge */}

						{notificationCount > 0 ? (
							<div>
								<span className="absolute top-1 right-8 w-2 h-2 bg-red-500 rounded-full"></span>
								<span>{`(${notificationCount})`}</span>
							</div>
						) : (
							''
						)}
					</button>
				</div>
			</div>
			<div id="overview-container" className="p-6 max-w-6xl mx-auto">
				{/* Journal Stats Section */}
				<div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
					<div className="flex items-center gap-3 mb-6">
						<HiOutlineBookOpen className="h-8 w-8 text-indigo-400" />
						<h3 className={`${lusitana.className} text-2xl font-bold text-white`}>
							Journal Entry Statistics
						</h3>
					</div>
					<p className="text-gray-100 text-sm mb-6">
						View and analyze your journal writing patterns and insights.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<ElegantButton
							variant="primary"
							size="lg"
							icon={<ChartBarIcon className="h-5 w-5" />}
							onClick={handleCalculateJournalStats}
						>
							Run Journal Stats
						</ElegantButton>
						<ElegantButton
							variant="secondary"
							size="lg"
							icon={<PlusIcon className="h-5 w-5" />}
							onClick={handleShowOldJournalStats}
						>
							View Previous Timeframes
						</ElegantButton>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 my-4">
						<ElegantButton variant="secondary" size="lg" onClick={handleShowJournalNotifications}>
							View Notifications
						</ElegantButton>
					</div>
				</div>

				{/* Lists and Tasks Stats Section */}
				<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
					<div className="flex items-center gap-3 mb-6">
						<HiOutlineClipboardList className="h-8 w-8 text-emerald-400" />
						<h3 className={`${lusitana.className} text-2xl font-bold text-white`}>
							Lists & Tasks Statistics
						</h3>
					</div>
					<p className="text-gray-400 text-sm mb-4">Track your productivity and task completion metrics.</p>
					<div className="flex flex-col sm:flex-row gap-4 my-4">
						<ElegantButton variant="primary" size="lg" icon={<ChartBarIcon className="h-5 w-5" />}>
							Run List Stats
						</ElegantButton>
						<ElegantButton
							variant="secondary"
							size="lg"
							icon={<PlusIcon className="h-5 w-5" />}
							onClick={handleShowOldListStats}
						>
							View Previous Timeframes
						</ElegantButton>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 my-4">
						<ElegantButton variant="secondary" size="lg" onClick={handleShowListNotifications}>
							View Notifications
						</ElegantButton>
					</div>
					<ElegantButton onClick={() => setNotificationCount(notificationCount + 1)}>
						Add notifications
					</ElegantButton>
					<ElegantButton onClick={() => setNotificationCount(Math.max(0, notificationCount - 1))}>
						Remove notifications
					</ElegantButton>
				</div>
			</div>
		</>
	)
}

export default Stats

'use client'
import { lusitana } from '@/ui/fonts'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiOutlineClipboardList } from 'react-icons/hi'
import { FolderPlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { useRouter } from 'next/navigation'

interface ListEntry {
	id: string
	title: string
	description: string
	category: string
	tags: string[]
	archived: boolean
	createdAt: string
	updatedAt: string
}

export default function Lists() {
	const [userLists, setUserLists] = useState<ListEntry[]>([])
	const [error, setError] = useState<string | null>()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	// used for sending api calls via api/routes
	const router = useRouter()

	// Format timestamp to DD-MM-YYYY
	const formatDate = (timestamp: string) => {
		const date = new Date(timestamp)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${day}-${month}-${year}`
	}

	const handleCategoryCreate = () => {
		// open modal for creating a category
		// todo: create modal component
	}

	const handleCategoryModify = () => {}

	const handleCreateNewList = () => {
		// copy code from create page or create a re-usable component
		router.push('/dashboard/lists/newList')
	}

	const handleItemCreate = () => {
		router.push('/dashboard/lists/items')
	}

	const handleFetchLists = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/lists', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()
			setUserLists(data.lists || [])

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch lists')
			}

			console.log('Lists fetched successfully')
		} catch (err) {
			console.error('Error fetching lists:', err)
			setError(err instanceof Error ? err.message : 'Failed to fetch user lists')
			setIsLoading(false)
		}
	}

	useEffect(() => {
		handleFetchLists()
	}, [])

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4">
				<ElegantButton
					variant="primary"
					size="lg"
					icon={<HiOutlineClipboardList className="h-6 w-6" />}
					onClick={handleCreateNewList}
					className="h-20"
				>
					Create New List
				</ElegantButton>

				<ElegantButton
					variant="secondary"
					size="lg"
					icon={<FolderPlusIcon className="h-6 w-6" />}
					onClick={handleCategoryCreate}
					className="h-20"
				>
					Create New Category
				</ElegantButton>

				<ElegantButton
					variant="outline"
					size="lg"
					icon={<ArrowsUpDownIcon className="h-6 w-6" />}
					onClick={handleCategoryModify}
					className="h-20"
				>
					Re-arrange Categories
				</ElegantButton>
				<ElegantButton
					variant="outline"
					size="lg"
					icon={<ArrowsUpDownIcon className="h-6 w-6" />}
					onClick={handleItemCreate}
					className="h-20"
				>
					Create to-do items
				</ElegantButton>
			</div>
			<h3 className="text-black text-3xl">Current Lists</h3>
			<div className={`${lusitana.className} font-bold p-6`}>
				<div>
					{!userLists.length ? (
						<div>
							<p>There are currently no categories listed</p>
							<button className="button" onClick={handleCategoryCreate}>
								Create new Category
							</button>
							<button>
								<Link href="/dashboard/lists/newList">Create New List</Link>
							</button>
						</div>
					) : (
						<div id="list-container">
							{userLists.length > 0
								? userLists.map((list) => (
										<Link
											key={list.id}
											href={`/dashboard/lists/${list.id}`}
											className="block mt-6 mb-2 p-4 bg-slate-800 hover:border-2 hover:border-violet-400 cursor-pointer transition-all"
										>
											<div className="flex justify-between">
												<h3 className="text-white font-bold text-xl md:text-2xl underline">
													{list.title}
												</h3>
												<div className="border-emerald-500 border-[2px] p-1 rounded-md text-white">
													{list.category}
												</div>
											</div>
											<div className="flex justify-between mt-1">
												<p className="text-white mb-4 italic">{list.description}</p>
												<p className="text-white text-sm">{formatDate(list.updatedAt)}</p>
											</div>
											<div>
												<div id="list-container">
													<ul>
														<li className="text-white ml-4 list-disc">
															preview of list items
														</li>
													</ul>
												</div>
											</div>
										</Link>
								  ))
								: 'put error message here'}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

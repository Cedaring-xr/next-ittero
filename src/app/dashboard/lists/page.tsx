'use client'
import { lusitana } from '@/ui/fonts'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiOutlineClipboardList, HiClipboardList } from 'react-icons/hi'
import { FolderPlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { useRouter } from 'next/navigation'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface TodoItem {
	id: string
	text: string
	listId: string
	priority: Priority
	dueDate: string
	completed: boolean
	createdAt: string
	updatedAt: string
}

interface ListEntry {
	id: string
	title: string
	description: string
	category: string
	tags: string[]
	archived: boolean
	createdAt: string
	updatedAt: string
	items?: TodoItem[]
}

export default function Lists() {
	const [userLists, setUserLists] = useState<ListEntry[]>([])
	const [error, setError] = useState<string | null>()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	// used for sending api calls via api/routes
	const router = useRouter()

	// Format timestamp to MM-DD-YYYY
	const formatDate = (timestamp: string) => {
		const date = new Date(timestamp)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${month}-${day}-${year}`
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
			// Fetch all lists
			const response = await fetch('/api/lists', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch lists')
			}

			const lists = data.lists || []

			// Fetch items for each list
			const listsWithItems = await Promise.all(
				lists.map(async (list: ListEntry) => {
					try {
						const itemsResponse = await fetch(`/api/lists/items?listId=${list.id}`, {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json'
							}
						})

						const itemsData = await itemsResponse.json()

						if (itemsResponse.ok) {
							return { ...list, items: itemsData.items || [] }
						} else {
							return { ...list, items: [] }
						}
					} catch (err) {
						console.error(`Error fetching items for list ${list.id}:`, err)
						return { ...list, items: [] }
					}
				})
			)

			setUserLists(listsWithItems)
			console.log('Lists and items fetched successfully')
		} catch (err) {
			console.error('Error fetching lists:', err)
			setError(err instanceof Error ? err.message : 'Failed to fetch user lists')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		handleFetchLists()
	}, [])

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4">
				<ElegantButton
					variant="secondary"
					size="lg"
					icon={<HiOutlineClipboardList className="h-6 w-6" />}
					onClick={handleCreateNewList}
					className="h-12"
				>
					Create New List
				</ElegantButton>

				<ElegantButton
					variant="secondary"
					size="lg"
					icon={<FolderPlusIcon className="h-6 w-6" />}
					onClick={handleCategoryCreate}
					className="h-12"
				>
					Create New Category
				</ElegantButton>

				<ElegantButton
					variant="secondary"
					size="lg"
					icon={<ArrowsUpDownIcon className="h-6 w-6" />}
					onClick={handleCategoryModify}
					className="h-12"
				>
					Re-arrange Categories
				</ElegantButton>
				<ElegantButton
					variant="secondary"
					size="lg"
					icon={<HiClipboardList className="h-6 w-6" />}
					onClick={handleItemCreate}
					className="h-12"
				>
					Create tasks
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
											className="block mt-6 mb-2 p-4 bg-slate-800 border-4 border-slate-700 hover:border-indigo-500 hover:shadow-lg cursor-pointer transition-all"
										>
											<div className="flex justify-between">
												<h3 className="text-white font-bold text-xl md:text-2xl underline">
													{list.title}
												</h3>
												<p className="text-white text-sm">{formatDate(list.updatedAt)}</p>
											</div>
											<div className="flex justify-between mt-1">
												<p className="text-white mb-4 italic">{list.description}</p>
												{!list.category ? (
													''
												) : (
													<div className="border-emerald-500 border-[2px] p-1 rounded-md text-white">
														{list.category}
													</div>
												)}
											</div>

											{/* Item counts */}
											<div className="flex gap-4 text-sm">
												<span className="text-gray-300">
													Total: <span className="font-semibold text-white">{list.items?.length || 0}</span>
												</span>
												<span className="text-gray-300">
													Completed:{' '}
													<span className="font-semibold text-green-400">
														{list.items?.filter((item) => item.completed).length || 0}
													</span>
												</span>
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

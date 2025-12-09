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
	user: string
	title: string
	description: string
}

export default function Lists() {
	const [userLists, setUserLists] = useState<ListEntry[]>([])
	const [error, setError] = useState<string | null>()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	// used for sending api calls via api/routes
	const router = useRouter()

	const handleCategoryCreate = () => {
		// open modal for creating a category
		// todo: create modal component
	}

	const handleCategoryModify = () => {}

	const handleCreateNewList = () => {
		// copy code from create page or create a re-usable component
		router.push('/dashboard/lists/newList')
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
			</div>
			<h3 className="text-white text-3xl">Current List Categories</h3>
			<div className={`${lusitana.className} font-bold grid grid-cols-1 md:grid-cols-2 gap-4 p-6`}>
				<div className="bg-gray-50 text-gray-900 rounded-lg  hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex flex-col hover:text-indigo-700">
					<p>auto fetch list categories from api</p>
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
						<div>
							{userLists.length > 0
								? userLists.map((list) => (
										<div key={list.id}>
											<h3>{list.title}</h3>
											<div id="list-container">
												<p>{list.description}</p>
											</div>
										</div>
								  ))
								: 'put error message here'}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

'use client'
import { lusitana } from '@/ui/fonts'
import { DivideIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiOutlineClipboardList } from 'react-icons/hi'
import { FolderPlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { useRouter } from 'next/navigation'

export default function Lists() {
	const [userLists, setUserLists] = useState<string[]>([])
	const router = useRouter()

	const handleCategoryCreate = () => {
		// open modal for creating a category
	}

	const handleCategoryModify = () => {}

	const handleCreateNewList = () => {
		// copy code from create page or create a re-usable component
		router.push('/dashboard/lists/newList')
	}

	useEffect(() => {
		// fetch call for lists
	}, [userLists])

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
					{!categories.length ? (
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
						<div>show if there are categories found</div>
					)}
				</div>
			</div>
		</>
	)
}

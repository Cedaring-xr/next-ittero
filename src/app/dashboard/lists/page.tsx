'use client'
import { lusitana } from '@/ui/fonts'
import { DivideIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiOutlineClipboardList } from 'react-icons/hi'

export default function Lists() {
	const [categories, setCategories] = useState<string[]>([])

	const handleCategoryCreate = () => {
		// open modal for creating a category
	}

	const handleCategoryModify = () => {}

	useEffect(() => {
		// fetch call for categories here
	}, [categories])

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-gray-50 text-gray-900 hover:border-2 hover:border-indigo-700 p-4 flex flex-col hover:text-indigo-700 rounded-lg cursor-pointer transition-all">
					<Link href="/dashboard/lists/newList" className="flex">
						<HiOutlineClipboardList className="h-[30px] w-[40px] mb-2" />
						<h3 className="text-lg md:text-xl font-semibold">Create New List</h3>
					</Link>
				</div>
				<div
					className="bg-gray-50 text-gray-900 hover:border-2 hover:border-indigo-700 p-4 flex flex-col hover:text-indigo-700 rounded-lg cursor-pointer transition-all"
					onClick={handleCategoryCreate}
				>
					<h3 className="text-lg md:text-xl font-semibold">Create New Category</h3>
				</div>
				<div
					className="bg-gray-50 text-gray-900 hover:border-2 hover:border-indigo-700 p-4 flex flex-col hover:text-indigo-700 rounded-lg cursor-pointer transition-all"
					onClick={handleCategoryModify}
				>
					<h3 className="text-lg md:text-xl font-semibold">Re-arrange Categories</h3>
				</div>
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

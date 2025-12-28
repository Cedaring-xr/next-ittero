'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { PinnedListsProvider } from '@/contexts/PinnedListsContext'

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // Data considered fresh for 1 minute
						refetchOnWindowFocus: true, // Refetch when window regains focus
						retry: 1 // Retry failed requests once
					},
					mutations: {
						retry: 1
					}
				}
			})
	)

	return (
		<QueryClientProvider client={queryClient}>
			<PinnedListsProvider>{children}</PinnedListsProvider>
		</QueryClientProvider>
	)
}

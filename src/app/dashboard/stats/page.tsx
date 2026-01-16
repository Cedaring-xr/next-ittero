import { getAuthenticatedUser } from '@/utils/amplify-server-utils'
import StatsClient from '@/ui/stats/stats-client'

export default async function StatsPage() {
	const user = await getAuthenticatedUser()

	return <StatsClient username={user?.username} />
}

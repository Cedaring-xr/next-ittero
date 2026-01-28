import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from './utils/amplify-server-utils'

export async function middleware(request: NextRequest) {
	const response = NextResponse.next()
	const user = await authenticatedUser({ request, response })

	const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard')
	const isOnAdminArea = request.nextUrl.pathname.startsWith('/dashboard/admins')

	if (isOnDashboard) {
		if (!user) {
			const redirect = NextResponse.redirect(new URL('/auth/login', request.nextUrl))
			redirect.headers.set('Cache-Control', 'no-store')
			return redirect
		}
		if (isOnAdminArea && !user.isAdmin) {
			const redirect = NextResponse.redirect(new URL('/dashboard', request.nextUrl))
			redirect.headers.set('Cache-Control', 'no-store')
			return redirect
		}
		response.headers.set('Cache-Control', 'no-store')
		return response
	} else if (user) {
		const redirect = NextResponse.redirect(new URL('/dashboard', request.nextUrl))
		redirect.headers.set('Cache-Control', 'no-store')
		return redirect
	}
}

export const config = {
	/*
      Match all request paths except for the ones starting with
   */
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}

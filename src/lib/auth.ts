import { redirect, type LoaderFunctionArgs } from 'react-router-dom'
import { whoAmI } from '@/lib/api'

function isExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export async function checkAuthLoader({ request }: LoaderFunctionArgs) {
  try {
    const response = await whoAmI()
    if (!response.ok) {
      const currentUrl = new URL(request.url)
      let redirectUrl: string
      if (isExternalUrl(currentUrl.href)) {
        redirectUrl = currentUrl.href
      } else {
        redirectUrl = currentUrl.pathname + currentUrl.search
      }
      const encodedRedirect = encodeURIComponent(redirectUrl)
      return redirect(`/login?redirect_url=${encodedRedirect}`)
    }
    return null
  } catch {
    return redirect('/login')
  }
}

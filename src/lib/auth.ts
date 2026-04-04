import { redirect } from 'react-router-dom'
import { whoAmI } from '@/lib/api'

export async function checkAuthLoader() {
  try {
    const response = await whoAmI()
    if (!response.ok) {
      return redirect('/login')
    }
    return null
  } catch {
    return redirect('/login')
  }
}

const API_BASE = '/api'

async function fetchApi(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return response
}

export async function login(name: string, secret: string) {
  return fetchApi('/v1/login', {
    method: 'POST',
    body: JSON.stringify({ name, secret }),
  })
}

export async function register(name: string, secret: string) {
  return fetchApi('/v1/register', {
    method: 'POST',
    body: JSON.stringify({ name, secret }),
  })
}

export async function logout() {
  return fetchApi('/v1/logout', {
    method: 'POST',
  })
}

export async function whoAmI() {
  return fetchApi('/v1/whoami', {
    method: 'GET',
  })
}

export interface WhoAmIResponse {
  id: string
  name: string
}

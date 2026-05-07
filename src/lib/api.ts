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

export interface JWK {
  kty: string
  kid: string
  use: string
  alg: string
  n: string
  e: string
}

export interface JwksResponse {
  keys: JWK[]
}

export interface Client {
  id: string
  name: string
  domain: string
  redirectURI: string
  type: 'confidential' | 'public'
  createdAt: number
  updatedAt: number
}

export interface RegisterClientResponse {
  clientId: string
  clientSecret: string
}

export async function listClients() {
  return fetchApi('/v1/oauth2/clients', {
    method: 'GET',
  })
}

export async function registerClient(
  name: string,
  domain: string,
  redirectURI: string,
  type: 'confidential' | 'public'
) {
  return fetchApi('/v1/oauth2/clients', {
    method: 'POST',
    body: JSON.stringify({ name, domain, redirectURI, type }),
  })
}

export async function getJwks() {
  const response = await fetch('/.well-known/jwks.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}

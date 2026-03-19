export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type ApiRequestOptions = RequestInit & {
  json?: unknown
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {})
  let body = options.body

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json")
    body = JSON.stringify(options.json)
  }

  const res = await fetch(path, {
    ...options,
    headers,
    body,
    credentials: "include",
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const text = await res.text()
      if (text) {
        message = text
      }
    } catch {
      // ignore
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) {
    return null as T
  }

  const contentType = res.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    return await res.json()
  }

  return (await res.text()) as T
}

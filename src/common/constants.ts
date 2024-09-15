export const GLOB = {
  PORT: process.env.BIND_PORT || process.env.PORT || 8080,
  CONTEXT_NAME: process.env.CONTEXT_NAME,
  VERSION: process.env.VERSION,
  TZ: process.env.TIZ || 'America/Costa_Rica',
  BIND: process.env.BIND
}

export const SERVICE_DOMAINS = {
  POKEAPI_URL: process.env.POKEAPI_URL
}

export const MONGO = {
  URI: process.env.MONGOURI,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
}

export const HTTP_REQUEST_TIMEOUT = Number.parseInt(
  process.env.HTTP_REQUEST_TIMEOUT,
  10
)

export const HTTP_REQUEST_REJECT_UNAUTHORIZED =
  process.env.HTTP_REQUEST_REJECT_UNAUTHORIZED === 'true'

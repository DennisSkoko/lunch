module NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'production'|undefined
    readonly NTFY_URL: string|undefined
    readonly NTFY_TOKEN: string|undefined
    readonly LUNCH_STORAGE_FILE: string
  }
}

type CourseDiet = 'all' | 'veg'

interface Course {
  diet: CourseDiet
  desc: string
}

interface ScrapeResult {
  name: string
  url: string
  courses: Course[]
}

interface ScrapeResultError {
  name: string
  url: string
  error: string
}

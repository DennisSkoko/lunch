module NodeJS {
  interface ProcessEnv {
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

module NodeJS {
  interface ProcessEnv {
    readonly LUNCH_STORAGE_FILE: string
    readonly LUNCH_EMAIL_FROM_EMAIL: string
    readonly LUNCH_EMAIL_FROM_NAME: string
    readonly LUNCH_EMAIL_API_KEY: string
    readonly LUNCH_EMAIL_SEND_TO: string
  }
}

interface Course {
  diet: 'all' | 'veg'
  desc: string
}

interface Restaurant {
  name: string
  url: string
  emoji?: string
  error?: string
  courses: Course[]
}

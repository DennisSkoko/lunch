module NodeJS {
  interface ProcessEnv {
    readonly LUNCH_STORAGE_FILE: string
    readonly LUNCH_SLACK_TOKEN: string
    readonly LUNCH_SLACK_CHANNEL: string
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

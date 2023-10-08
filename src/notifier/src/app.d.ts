module NodeJS {
  interface ProcessEnv {
    readonly LUNCH_STORAGE_FILE: string
    readonly LUNCH_SLACK_TOKEN: string
    readonly LUNCH_SLACK_CHANNEL: string
  }
}

interface Restaurant {
  name: string
  url: string
  courses: string[]
}

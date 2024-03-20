export interface CronCollection {
  cron: string
  tasks: string[]
}

export interface ServerTaskInfo {
  name: string
  handler: string
  description: string
  type: 'collection' | 'task'
  tasks?: ServerTaskInfo[]
}

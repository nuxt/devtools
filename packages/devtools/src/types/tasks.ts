export interface ScannedNitroTasks {
  tasks: {
    [name: string]: {
      description: string
    }
  }
  scheduledTasks: false | {
    cron: string
    tasks: string[]
  }[]
}

export interface ServerTaskInfo {
  name: string
  description: string
  type: 'collection' | 'task'
  tasks?: ServerTaskInfo[]
}

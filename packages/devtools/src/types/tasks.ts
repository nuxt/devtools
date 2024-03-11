export interface NitroTask {
  name: string
  description: string
}

export interface ScannedNitroTasks {
  tasks: {
    [name: string]: {
      description: string
    }
  }
  scheduledTasks: false | {
    [cronPeriod: string]: string[]
  }
}

export interface ServerTaskInfo {
  name: string
  description: string
  type: 'collection' | 'task'
  tasks?: ServerTaskInfo[]
}

export interface NitroTask {
  key: string
  description: string
}

export interface ScannedNitroTasks {
  tasks: {
    [key: string]: {
      description: string
    }
  }
  scheduledTasks: false | {
    [cronPeriod: string]: string[]
  }
}

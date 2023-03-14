export interface WizardFunctions {
  enablePages: (nuxt: any, pages: string[]) => Promise<void>
}

export type WizardActions = keyof WizardFunctions

export type GetWizardArgs<T extends WizardActions> = WizardFunctions[T] extends (nuxt: any, ...args: infer A) => any ? A : never

import { enablePages } from './enable-pages'

export const wizard = {
  enablePages,
}

export type Wizard = typeof wizard
export type WizardActions = keyof Wizard

export type WizardArgs<T extends WizardActions> = Wizard[T] extends (nuxt: any, ...args: infer A) => any ? A : never

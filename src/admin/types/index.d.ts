import type { ResourceOptions, FeatureType } from 'adminjs'

export interface CreateResourceResult<T> {
  resource: T
  options: ResourceOptions
  features?: FeatureType[]
}

export type ResourceFunction<T = unknown> = () => CreateResourceResult<T>

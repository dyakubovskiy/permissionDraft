export interface Subject<Role extends string> {
  id: string
  role: Role
  [key: string]: unknown
}

export interface Resource {
  id: string
  [key: string]: unknown
}

export type SimpleCheck = () => boolean
export type ResourceCheck<R extends Resource> = (resource: R) => boolean
export type ComplexCheck<R extends Resource, S extends Subject<Role>, Role extends string> = (
  resource: R,
  subject: S,
) => boolean

export type PermissionCheck<R extends Resource, S extends Subject<Role>, Role extends string> =
  | SimpleCheck
  | ResourceCheck<R>
  | ComplexCheck<R, S, Role>

export type PermissionConfig<
  Action extends string,
  Role extends string,
  R extends Resource,
  S extends Subject<Role>,
> = {
  [K in Role]: {
    [A in Action]: PermissionCheck<R, S, Role>
  }
}

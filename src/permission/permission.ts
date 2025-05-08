import type {
  Resource,
  Subject,
  PermissionConfig,
  PermissionCheck,
  SimpleCheck,
  ResourceCheck,
  ComplexCheck
} from './types'
import type { User, Role } from '../user'

export type BasePermissionConfig<Action extends string, R extends Resource> = PermissionConfig<
  Action,
  Role,
  R,
  User
>

interface UsePermission<
  Action extends string,
  Role extends string,
  R extends Resource,
  S extends Subject<Role>
> {
  checkByAction: (action: Action) => boolean
  checkByResource: (action: Action, resource: R) => boolean
  complexCheck: (action: Action, resource: R, subject: S) => boolean
}

const usePermission = <
  Action extends string,
  Role extends string,
  R extends Resource,
  S extends Subject<Role>
>(
  role: Role,
  config: PermissionConfig<Action, Role, R, S>
): UsePermission<Action, Role, R, S> => {
  const complexCheck = (action: Action, resource: R, subject: S): boolean => {
    const check = config[role][action]

    if (isSimpleCheck(check)) return check()

    if (isResourceCheck(check)) return check(resource)

    if (isComplexCheck(check)) return check(resource, subject)

    throw new Error(`Invalid check type for action ${action}`)
  }

  const checkByResource = (action: Action, resource: R): boolean => {
    const check = config[role][action]

    if (isSimpleCheck(check)) return check()

    if (isResourceCheck(check)) return check(resource)

    throw new Error(`Check for action ${action} requires a user`)
  }

  const checkByAction = (action: Action): boolean => {
    const check = config[role][action]

    if (isSimpleCheck(check)) return check()

    throw new Error(`Check for action ${action} requires a resource`)
  }

  const isSimpleCheck = (check: PermissionCheck<R, S, Role>): check is SimpleCheck =>
    check.length === 0

  const isResourceCheck = (check: PermissionCheck<R, S, Role>): check is ResourceCheck<R> =>
    check.length === 1

  const isComplexCheck = (check: PermissionCheck<R, S, Role>): check is ComplexCheck<R, S, Role> =>
    check.length === 2

  return { checkByAction, checkByResource, complexCheck }
}

export const useBasePermission = <Action extends string, R extends Resource>(
  role: Role,
  config: BasePermissionConfig<Action, R>
) => usePermission<Action, Role, R, User>(role, config)

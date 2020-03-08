export const DEBUG = (
  typeof process === 'object' &&
  typeof process.env === 'object' &&
  process.env.NODE_ENV !== 'production'
)

export const error = (message, vm) => {
  console.error(
    `[VueRouteProps warn]: `,
    message,
    vm,
  )
}

export const toString = (value) => {
  return {}.toString.call(value)
}

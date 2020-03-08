import {
  DEBUG,
  error,
  toString,
} from './utils.ts'

const createMixin = () => {
  return {
    data () {
      return generateData({
        routeProps: this.$options.routeProps,
        route: this.$route,
        context: this,
      })
    },
    watch: {
      '$route' () {
        const newData = generateData({
          routeProps: this.$options.routeProps,
          route: this.$route,
          context: this,
        })

        for (const routeProp in this.$options.routeProps) {
          this[routeProp] = newData[routeProp]
        }
      },
    },
  }
}

export const generateData = ({
  routeProps,
  route,
  context,
}) => {
  const data = {}

  for (const key in routeProps) {
    const normalizedProp = normalize({
      routeProps,
      key,
    })

    const value = route.query.hasOwnProperty(key)
      ? JSON.parse(route.query[key])
      : undefined

    if (DEBUG) {
      validate({
        routeProps,
        key,
        value,
        context
      })
    }

    data[key] = value

    if (value === undefined) {
      data[key] = normalizedProp.default()
    }
  }

  return data
}

export const normalize = ({
  routeProps,
  key,
}) => {
  const normalizedProp = {
    default: () => void 0,
    required: false,
    type: [],
    validator: () => true,
  }

  const prop = routeProps[key]

  if (toString(prop) === '[object Array]') {
    normalizedProp.type = prop
  }

  else if (toString(prop) === '[object String]') {
    normalizedProp.type = [prop]
  }

  else if (toString(prop) === '[object Object]') {
    if (toString(prop.type) === '[object Array]') {
      normalizedProp.type = prop.type
    } else if (prop.type !== void 0) {
      normalizedProp.type = [prop.type]
    }

    if (toString(prop.required) === '[object Boolean]') {
      normalizedProp.required = prop.required
    }

    if (toString(prop.validator) === '[object Function]') {
      normalizedProp.validator = prop.validator
    }

    if (toString(prop.default) === '[object Function]') {
      normalizedProp.default = prop.default
    } else if (toString(prop.default) !== void 0) {
      normalizedProp.default = () => prop.default
    }
  }

  return normalizedProp
}

export const validate = ({
  routeProps,
  key,
  value,
  context,
}) => {
  validateDefault({
    routeProps,
    key,
    context,
  })

  const normalizedProp = normalize({
    routeProps,
    key,
  })

  validateRequired({
    normalizedProp,
    key,
    value,
    context,
  })

  validateType({
    normalizedProp,
    key,
    value,
    context,
  })

  validateCustom({
    normalizedProp,
    key,
    value,
    context,
  })
}

export const validateDefault = ({
  routeProps,
  key,
  context,
}) => {
  const prop = routeProps[key]
  if (toString(prop) === '[object Object]' && typeof routeProps[key].default === 'object' && routeProps[key].default !== null) {
    error(
      `Invalid default value for routeProp "${key}": routeProps with type Object/Array must use a factory function to return the default value.`,
      context,
    )
  }
}

export const validateRequired = ({
  normalizedProp,
  key,
  value,
  context,
}) => {
  if (normalizedProp.required && value === void 0) {
    error(
      `Missing required routeProp: "${key}"`,
      context,
    )
  }
}

export const validateType = ({
  normalizedProp,
  key,
  value,
  context,
}) => {
  value = value !== void 0 ? value : normalizedProp.default()

  let result = false

  if (value === void 0 && normalizedProp.required === false) {
    result = true
  }

  else if (value === null && normalizedProp.type.includes(null) === true) {
    result = true
  }

  else if (value !== void 0 && value !== null) {
    for (const constructor of normalizedProp.type.filter(type => type !== null)) {
      result = result || Object.getPrototypeOf(value).constructor === constructor
    }
  }

  if (result === false) {
    const type = []
    for (const constructor of normalizedProp.type) {
      if (constructor === null) {
        type.push('null')
      } else {
        type.push(/function ([^(]+)/.exec(constructor.toString())[1])
      }
    }
    const valueType = toString(value).slice(8, -1)
    value = value === undefined ? 'undefined' : JSON.stringify(value)

    error(
      `Invalid routeProp: type check failed for routeProp "${key}". Expected ${type.join(', ')}, got ${valueType} with value ${value}.`,
      context,
    )
  }
}

export const validateCustom = ({
  normalizedProp,
  key,
  value,
  context,
}) => {
  value = value !== void 0 ? value : normalizedProp.default()
  if (
    normalizedProp.validator(value, key) === false
  ) {
    error(
      `Invalid routeProp: custom validator check failed for routeProp "${key}".`,
      context,
    )
  }
}

export default createMixin

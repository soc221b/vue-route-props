import 'vue';

const DEBUG = (
  typeof process === 'object' &&
  typeof process.env === 'object' &&
  process.env.NODE_ENV !== 'production'
);

const error = (message, vm) => {
  console.error(
    `[VueRouteProps warn]: `,
    message,
    vm,
  );
};

const log = (message, vm) => {
  console.log(
    `[VueRouteProps log]: `,
    message,
    vm,
  );
};

const toString = (value) => {
  return {}.toString.call(value)
};

const has = (object, key) => {
  return object.hasOwnProperty(key)
};

const stringifyableTypes = [null, Boolean, String, Number, Array, Object];

function returnUndefined () {
  return void 0
}

function returnTrue () {
  return true
}

function createMixin(Vue, options = {}) {
  return {
    beforeCreate () {
      if (this.$options.routeProps === void 0) return

      /* istanbul ignore next */
      if (DEBUG) {
        validateDependency({
          context: this,
        });
        validateRoutePropsOption({
          routeProps: this.$options.routeProps,
          context: this,
        });
      }

      this._routeProps = {
        normalized: normalize({
          routeProps: this.$options.routeProps,
        }),
        computed: {},
      };

      for (const routeProp in this._routeProps.normalized) {
        this._routeProps.computed[routeProp] = void 0;

        Vue.util.defineReactive(this._routeProps.computed, routeProp);

        proxy({
          vm: this,
          routeProp
        });
      }
    },

    watch: {
      '$route': {
        immediate: true,
        handler () {
          if (this.$options.routeProps === void 0) return

          /* istanbul ignore next */
          if (DEBUG) {
            validateRoutePropsValue({
              normalizedRouteProps: this._routeProps.normalized,
              context: this,
            });
          }

          const newData = generateData({
            normalizedRouteProps: this._routeProps.normalized,
            route: this.$route,
            context: this,
          });
          for (const routeProp in newData) {
            this._routeProps.computed[routeProp] = newData[routeProp];
          }

          if (options.inspect) {
            log(
              JSON.stringify(this._routeProps.computed, null, 2),
              this,
            );
          }
        }
      },
    },
  }
}

function validateDependency ({
  context,
}) {
  if (context.$router === void 0) {
    error(
      `Missing vue-router`,
      context,
    );
  }
}

function validateRoutePropsOption ({
  routeProps,
  context,
}) {
  let isValid = true;

  if (toString(routeProps) === '[object Object]') {
    for (const prop in routeProps) {
      if (toString(routeProps[prop]) === '[object Object]') {
        isValid = (
          isValid
          && validateRoutePropsDefaultOption({
            routeProps,
            prop,
            context,
          })
          && validateRoutePropsValidatorOption({
            routeProps,
            prop,
            context,
          })
        );
      }
    }
  }

  return isValid
}

function validateRoutePropsDefaultOption ({
  routeProps,
  prop,
  context,
}) {
  if (toString(routeProps[prop].default) === '[object Object]' || toString(routeProps[prop].default) === '[object Array]') {
    error(
      `Invalid default value for routeProp "${prop}": routeProps with type Object/Array must use a factory function to return the default value.`,
      context,
    );
    return false
  }
  return true
}

function validateRoutePropsValidatorOption ({
  routeProps,
  prop,
  context,
}) {
  let isValid = true;

  if (toString(routeProps[prop].validator) === '[object Function]') {
    if (has(routeProps[prop], 'default')) {
      if (toString(routeProps[prop].default) === '[object Function]') {
        isValid = routeProps[prop].validator(routeProps[prop].default());
      } else {
        isValid = routeProps[prop].validator(routeProps[prop].default);
      }
    }
  }

  if (isValid === false) {
    error(
      `Invalid routeProp: custom validator check failed for routeProp "${prop}".`,
      context,
    );
  }

  return isValid
}

function normalize ({
  routeProps,
}) {
  if (toString(routeProps) === '[object Array]') {
    /*
    convert routeProps: ['prop1', 'prop2']
    to      routeProps: {
              prop1: {},
              prop2: {},
            }
    }
    */
    const newRouteProps = {};
    for (const prop of routeProps) {
      newRouteProps[prop] = {};
    }
    routeProps = newRouteProps;
  }

  for (const prop in routeProps) {
    if (toString(routeProps[prop]) === '[object Array]') {
      /*
      convert routeProps: {
                prop1: [String, Number],
              }
      to      routeProps: {
                prop1: {
                  type: [String, Number],
                }
              }
      */
      routeProps[prop] = {
        type: routeProps[prop]
      };
    }
    else if (toString(routeProps[prop]) !== '[object Object]') {
      /*
      convert routeProps: {
                prop1: String,
              }
      to      routeProps: {
                prop1: {
                  type: [String],
                }
              }
      */
      routeProps[prop] = {
        type: [routeProps[prop]]
      };
    }
  }

  for (const prop in routeProps) {
    if (has(routeProps[prop], 'required') === false) {
      routeProps[prop].required = false;
    }

    if (has(routeProps[prop], 'type') === false) {
      routeProps[prop].type = stringifyableTypes;
    }
    else if (toString(routeProps[prop].type) !== '[object Array]') {
      routeProps[prop].type = [routeProps[prop].type];
    }
    else if (routeProps[prop].type.length === 0) {
      routeProps[prop].type = stringifyableTypes;
    }

    if (has(routeProps[prop], 'default') === false) {
      routeProps[prop].default = returnUndefined;
    }
    else if (toString(routeProps[prop].default) !== '[object Function]') {
      const defaultValue = routeProps[prop].default;
      routeProps[prop].default = function () {
        return defaultValue
      };
    }

    if (has(routeProps[prop], 'validator') === false) {
      routeProps[prop].validator = returnTrue;
    }
  }

  return routeProps
}

function generateData ({
  normalizedRouteProps,
  route,
  context,
}) {
  const data = {};

  for (const prop in normalizedRouteProps) {
    data[prop] = has(route.query, prop)
      ? JSON.parse(route.query[prop])
      : normalizedRouteProps[prop].default();
  }

  return data
}

function validateRoutePropsValue ({
  normalizedRouteProps,
  context,
}) {
  let isValid = true;

  for (const prop in normalizedRouteProps) {
    isValid = (
      isValid
      && validateRequired({
        normalizedRouteProps,
        prop,
        context,
      })
      && validateType({
        normalizedRouteProps,
        prop,
        context,
      })
      && validateCustom({
        normalizedRouteProps,
        prop,
        context,
      })
    );
  }

  return isValid
}

function validateRequired ({
  normalizedRouteProps,
  prop,
  context,
}) {
  const value = has(context.$route.query, prop)
    ? JSON.parse(context.$route.query[prop])
    : void 0;

  if (normalizedRouteProps[prop].required && value === void 0) {
    error(
      `Missing required routeProp: "${prop}"`,
      context,
    );
    return false
  }
  return true
}

function validateType ({
  normalizedRouteProps,
  prop,
  context,
}) {
  const value = has(context.$route.query, prop)
    ? JSON.parse(context.$route.query[prop])
    : normalizedRouteProps[prop].default();

  let isValid = true;

  if (value === void 0) {
    if (normalizedRouteProps[prop].required === true) {
      isValid = false;
    }
  }
  else if (value === null) {
    if (normalizedRouteProps[prop].type.includes(null) === false) {
      isValid = false;
    }
  }
  else if (normalizedRouteProps[prop].type.includes(Object.getPrototypeOf(value).constructor) === false){
    isValid = false;
  }

  if (isValid === false) {
    const type = [];
    for (const constructor of normalizedRouteProps[prop].type) {
      if (constructor === null) {
        type.push('null');
      }
      else {
        type.push(/function ([^(]+)/.exec(constructor.toString())[1]);
      }
    }
    const valueType = toString(value).slice(8, -1);

    error(
      `Invalid routeProp: type check failed for routeProp "${prop}". Expected ${type.join(', ')}, got ${valueType} with value ${JSON.stringify(value)}.`,
      context,
    );
  }

  return isValid
}

function validateCustom ({
  normalizedRouteProps,
  prop,
  context,
}) {
  const value = has(context.$route.query, prop)
    ? JSON.parse(context.$route.query[prop])
    : normalizedRouteProps[prop].default();

  if (
    (
      normalizedRouteProps[prop].required
      || has(context.$route.query, prop)
    )
    && !normalizedRouteProps[prop].validator(value, prop)
  ) {
    error(
      `Invalid routeProp: custom validator check failed for routeProp "${prop}".`,
      context,
    );
    return false
  }

  return true
}

function proxy ({
  vm,
  routeProp,
}) {
  Object.defineProperty(vm, routeProp, {
    configurable: true,
    enumerable: true,
    set () {
      error(
        `Avoid mutating a routeProp directly since the value will be ` +
        `overwritten whenever the route changes. ` +
        `Instead, use a data or computed property based on the routeProp's ` +
        `value. Prop being mutated: "${routeProp}"`,
        vm,
      );
    },
    get () {
      return vm._routeProps.computed[routeProp]
    },
  });
}

const install = function (Vue, options) {
  Vue.mixin(createMixin(Vue, options));
};

var index = { install };

export default index;

# vue-route-props

Automatically bind vue-router query to vm, APIs are mostly same as the Vue props.

[![npm version](https://img.shields.io/npm/v/vue-route-props)](https://www.npmjs.com/package/vue-route-props)
[![CI](https://github.com/iendeavor/vue-route-props/workflows/CI/badge.svg?branch=develop)](https://github.com/iendeavor/vue-route-props/actions?query=branch%3Adevelop)
[![codecov](https://codecov.io/gh/iendeavor/vue-route-props/branch/develop/graph/badge.svg)](https://codecov.io/gh/iendeavor/vue-route-props)

## Install

```bash
npm install vue-route-props
yarn add vue-route-props
```

## Usage

[![Edit vue-route-props](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-route-props-vbuj1?fontsize=14&hidenavigation=1&theme=dark)

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouteProps from 'vue-route-props'

Vue.use(VueRouter)
Vue.use(VueRouteProps)

new Vue({
  routeProps: {
    optional: {
      type: String,
      default: "an optional routeProp with default value"
    },
    required: {
      required: true,
      type: String
    },
    multiple: {
      type: [String, Array, Object]
    },
    validator: {
      validator(value) {
        return value === "with custom validator";
      }
    }
  }
})
```

## API

### vm

#### Prop Types

In order to keep values' type, you need to **ALWAYS** use `JSON.stringify` to insert query:

```javascript
this.$router.push({
  query: {
    willBeString: 0, // wrong, there will be an error occurs
    willBeNumber: JSON.stringify(0), // expected, the willBeNumber is bind with 0 now
  }
})
```

### Options

#### Inspect mode

Since we bind routeProps to vm's root instead of data/computed, and so on, You cannot use the vue-dev-tools to inspect what value it is.

In order to inspect routeProps, you can enable inspect mode. we will log all routeProps when it is updated.

```javascript
Vue.use(VueRouteProps, {
  inspect: true
})
```

```javascript
new Vue({
  routeProps: {
    prop: {
      type: String,
      default: "a default value"
    },
  }
})

/*
console:

[VueRouteProps info]: {
  prop: "a default value"
}
*/
```

# vue-route-props

Automatically bind vue-router query, Same as the props API in Vue.

> Only stringifiable types are supported.

[![npm version](https://img.shields.io/npm/v/vue-route-props)](https://www.npmjs.com/package/vue-route-props)
[![CI](https://github.com/iendeavor/vue-route-props/workflows/CI/badge.svg?branch=develop)](https://github.com/iendeavor/vue-route-props/actions?query=branch%3Adevelop)
[![codecov](https://codecov.io/gh/iendeavor/vue-route-props/branch/develop/graph/badge.svg)](https://codecov.io/gh/iendeavor/vue-route-props)

## Install

```bash
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

### Prop Types

Same as https://vuejs.org/v2/api/#props.

But the `type` option can ONLY be the following constructors: `String`, `Number`, `Boolean`, `Array`, `Object`, and the `null`.

In order to keep values' type, you need to use `JSON.stringify` to add query at all times:

```javascript
this.$router.push({
  query: {
    willBeString: 0, // wrong
    willBeNumber: JSON.stringify(0), // expected
  }
})
```

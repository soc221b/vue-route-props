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

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouteProps from 'vue-route-props'

Vue.use(VueRouter)
Vue.use(VueRouteProps)

new Vue({
  routeProps: {
    title: String,
  },

  created () {
    console.log(this.title)
  },
})
```

## API

### Prop Types

```javascript
new Vue({
  routeProps: {
    title: {
      required: true,
      type: String,
    },
    likes: Number,
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishAt: {
      type: [Number, null],
      validator (value) {
        return value === null || value >= Date.now()
      },
    }
  }
})
```

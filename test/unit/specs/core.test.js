import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouteProps from '../../../src/index'

Vue.use(VueRouter)
Vue.use(VueRouteProps)

describe('core', () => {
  it('should not inject any computed props', () => {
    let vm

    vm = new Vue({
      computed: {},
    })
    expect(Object.keys(vm.$options.computed).length).toBe(0)

    vm = new Vue({
      computed: {},
      routeProps: {},
    })
    expect(Object.keys(vm.$options.computed).length).toBe(0)

    vm = new Vue({
      computed: {},
      routeProps: [],
    })
    expect(Object.keys(vm.$options.computed).length).toBe(0)
  })
})

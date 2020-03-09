import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouteProps from '../../../src/index'

Vue.use(VueRouter)
Vue.use(VueRouteProps)

let vm
let router
let spy

describe('install', () => {
  beforeEach(() => {
    router = new VueRouter({
      routes: [{
        path: '/'
      }],
    })
    spy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    if (vm.$router) {
      vm.$router.replace({
        query: {}
      })
        .catch(error => {
          // ignore navigation to same route
        })
    }
    vm.$destroy()
    spy.mockClear()
  })

  it('should not inject any prop', () => {
    vm = new Vue({})
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(vm.$options.computed).toBe(undefined)

    vm = new Vue({
      routeProps: {}
    })
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(vm.$options.computed).toBe(undefined)

    vm = new Vue({
      router,
    })
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(vm.$options.computed).toBe(undefined)

    vm = new Vue({
      data () {
        return {}
      },
      computed: {},
      routeProps: {},
    })
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(Object.keys(vm.$options.computed).length).toBe(0)

    vm = new Vue({
      data () {
        return {}
      },
      computed: {},
      routeProps: [],
    })
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(Object.keys(vm.$options.computed).length).toBe(0)

    vm = new Vue({
      data () {
        return {}
      },
      computed: {},
      routeProps: ['noQueryProvided'],
    })
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(Object.keys(vm.$options.computed).length).toBe(0)

    vm = new Vue({
      data () {
        return {}
      },
      computed: {},
      routeProps: {
        noQueryProvided: String,
      },
    })
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(Object.keys(vm.$options.computed).length).toBe(0)

    vm = new Vue({
      router,
      data () {
        return {}
      },
      computed: {},
      routeProps: {},
    })
    expect(Object.keys(vm.$data).length).toBe(0)
    expect(Object.keys(vm.$options.computed).length).toBe(0)
  })
})

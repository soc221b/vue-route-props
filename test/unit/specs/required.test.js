import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouteProps from '../../../src/index'

Vue.use(VueRouter)
Vue.use(VueRouteProps)

let vm
let router
let spy

describe('required', () => {
  beforeEach(() => {
    router = new VueRouter({
      routes: [{
        path: '/'
      }],
    })
    router.replace({
      query: {}
    })
      .catch(error => {
        // ignore navigation to same route
      })
    spy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    vm.$destroy()
    spy.mockClear()
  })

  it(`should log error when requiredProp's required option is true but no corresponding query is not given.`, () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          required: true
        }
      }
    })

    expect(vm.$route.query).toEqual({})
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([`[VueRouteProps warn]: `, `Missing required routeProp: "prop"`])
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it(`should not log error when requiredProp's required option is true and a corresponding query is given.`, () => {
    router.replace({
      query: {
        prop: JSON.stringify(1)
      }
    })
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          required: true
        }
      }
    })

    expect(vm.$route.query).toEqual({ prop: JSON.stringify(1) })
    expect(vm.prop).toEqual(1)
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it(`routeProp's required should be false as a default.`, () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {}
      }
    })

    expect(vm.$route.query).toEqual({})
    expect(console.error).toHaveBeenCalledTimes(0)

    vm = new Vue({
      router,
      routeProps: {
        prop: null
      }
    })

    expect(vm.$route.query).toEqual({})
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it(`should not log when a routeProp's required option is false.`, () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          required: false
        }
      }
    })

    expect(vm.$route.query).toEqual({})
    expect(console.error).toHaveBeenCalledTimes(0)
  })
})

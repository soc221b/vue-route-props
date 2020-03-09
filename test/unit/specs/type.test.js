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
        name: '/',
        path: '/'
      }],
    })
    spy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    vm.$router.replace({
      query: {}
    })
      .catch(error => {
        // ignore navigation to same route
      })
    vm.$destroy()
    spy.mockClear()
  })

  it(`should not log error when requiredProp's required option is true and a corresponding query is given.`, () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          required: true
        }
      }
    })
    spy.mockClear()
    vm.$router.replace({
      query: {
        prop: 1
      }
    })

    expect(vm.$route.query).toEqual({ prop: 1 })
    expect(console.error).toHaveBeenCalledTimes(0)
  })
})

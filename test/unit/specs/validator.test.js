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
    spy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    vm.$destroy()
    spy.mockClear()
  })

  it(`should log error when custom validator return falsy values.`, () => {
    // https://developer.mozilla.org/en-US/docs/Glossary/Falsy
    const falsyValues = [null, undefined, 0, '', false, NaN, 0n]

    for (const value of falsyValues) {
      vm = new Vue({
        router,
        routeProps: {
          prop: {
            validator () {
              return value
            }
          }
        }
      })

      expect(console.error).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0].slice(0, 2)).toEqual([`[VueRouteProps warn]: `, `Invalid routeProp: custom validator check failed for routeProp "prop".`])

      spy.mockClear()
    }
  })

  it(`should not log error when custom validator return true.`, () => {
    // https://developer.mozilla.org/en-US/docs/Glossary/Truthy
    const truthyValues = [true, {}, [], 42, "0", "false", new Date(), -42, 12n, 3.14, -3.14, Infinity, -Infinity]

    for (const value of truthyValues) {
      vm = new Vue({
        router,
        routeProps: {
          prop: {
            validator () {
              return value
            }
          }
        }
      })

      expect(console.error).toHaveBeenCalledTimes(0)

      spy.mockClear()
    }
  })
})

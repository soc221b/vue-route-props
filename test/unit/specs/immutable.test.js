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
    vm.$router.replace({
      query: {}
    })
      .catch(error => {
        // ignore navigation to same route
      })
    vm.$destroy()
    spy.mockClear()
  })

  it(`should be immutable.`, async () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          default: 'default'
        }
      }
    })
    expect(console.error).toHaveBeenCalledTimes(0)
    expect(vm.prop).toEqual('default')

    vm.prop = 'changed'
    expect(console.error).toHaveBeenCalledTimes(1)
    expect(vm.prop).toEqual('default')
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Avoid mutating a routeProp directly since the value will be overwritten whenever the route changes. Instead, use a data or computed property based on the routeProp's value. Prop being mutated: \"prop\"`,
    ])
  })
})

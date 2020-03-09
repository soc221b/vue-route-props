import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouteProps from '../../../src/index'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueRouteProps)

let vm
let router
let spy

const stringifiableTypes = [null, Boolean, String, Number, Array, Object]
const validValueMapping = new Map([
  [null, null],
  [Boolean, false],
  [String, ''],
  [Number, 0],
  [Array, []],
  [Object, {}]
])

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

  test.each(stringifiableTypes)(`should allow user to specify type as prop value.`, async (type) => {
    const value = validValueMapping.get(type)
    vm = new Vue({
      router,
      routeProps: {
        prop: type,
      }
    })
    spy.mockClear()
    vm.$router.replace({
      query: {
        prop: JSON.stringify(value)
      }
    })
    await Promise.resolve()

    expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) })
    expect(vm.prop).toEqual(value)
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  test.each(stringifiableTypes)(`should allow user to specify type as type option.`, async (type) => {
    const value = validValueMapping.get(type)
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          type: type,
        }
      }
    })
    spy.mockClear()
    vm.$router.replace({
      query: {
        prop: JSON.stringify(value)
      }
    })
    await Promise.resolve()

    expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) })
    expect(vm.prop).toEqual(value)
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  test.each([...validValueMapping.values(), null])(`should allow user to specify multitple types as type option.`, async (value) => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          type: stringifiableTypes,
        }
      }
    })
    spy.mockClear()
    vm.$router.replace({
      query: {
        prop: JSON.stringify(value)
      }
    })
    await Promise.resolve()

    expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) })
    expect(vm.prop).toEqual(value)
    expect(console.error).toHaveBeenCalledTimes(0)
  })
})

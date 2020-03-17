import Vue from 'vue'
import { mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import VueRouteProps from '../../../src/index'

Vue.use(VueRouter)
Vue.use(VueRouteProps)

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
    spy.mockClear()
  })

  it(`should works when change route dynamically (1).`, async () => {
    const Component = {
      template: '<div>{{prop}}</div>'
    }
    const template = mount(Component, {
      router,
      routeProps: {
        prop: {
          type: String,
        }
      },
    })
    expect(template.html()).toBe('<div></div>')
    expect(console.error).toHaveBeenCalledTimes(0)

    router.replace({
      query: {
        prop: JSON.stringify("routeProps is changed")
      }
    })
    await Promise.resolve()
    expect(template.html()).toBe('<div>routeProps is changed</div>')
    expect(console.error).toHaveBeenCalledTimes(0)

    router.replace({
      query: {
        prop: JSON.stringify("routeProps is changed again")
      }
    })
    await Promise.resolve()
    expect(template.html()).toBe('<div>routeProps is changed again</div>')
    expect(console.error).toHaveBeenCalledTimes(0)

    router.replace({
      query: {}
    })
    await Promise.resolve()
    expect(template.html()).toBe('<div></div>')
    expect(console.error).toHaveBeenCalledTimes(0)
  })
})

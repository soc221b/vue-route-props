import createMixin from './core'

const install = function (Vue, options) {
  Vue.mixin(createMixin(Vue, options))
}

export default { install }

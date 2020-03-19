import createMixin from './core.ts'

const install = function (Vue, options) {
  Vue.mixin(createMixin(Vue, options))
}

export default { install }

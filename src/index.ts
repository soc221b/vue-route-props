import createMixin from './core.ts'

const install = function (Vue) {
  Vue.mixin(createMixin())
}

export default { install }

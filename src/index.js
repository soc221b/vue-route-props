import createMixin from "./core";

/**
 * @param {any} Vue
 * @param {object} options
 * @param {boolean} options.debug
 * @param {boolean} options.inspect
 * @returns {void}
 */
const install = function (
  Vue,
  options = {
    debug:
      process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test",
    inspect: false,
  }
) {
  Vue.mixin(createMixin(Vue, options));
};

export { install };

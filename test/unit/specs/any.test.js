import Vue from "vue";
import VueRouter from "vue-router";
import * as VueRouteProps from "../../../src/index";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueRouteProps);

let vm;
let router;
let spy;

const validValueMapping = new Map([
  [null, null],
  [Boolean, false],
  [String, ""],
  [Number, 0],
  [Array, []],
  [Object, {}],
]);

describe("required", () => {
  beforeEach(() => {
    router = new VueRouter({
      routes: [
        {
          path: "/",
        },
      ],
    });
    router
      .replace({
        query: {},
      })
      .catch((error) => {
        // ignore navigation to same route
      });
    spy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    vm.$destroy();
    spy.mockClear();
  });

  test.each([...validValueMapping.values()])(
    `should allow any stringifiable value.`,
    (value) => {
      router.replace({
        query: {
          prop: JSON.stringify(value),
        },
      });
      vm = new Vue({
        router,
        routeProps: ["prop"],
      });
      expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) });
      expect(vm.prop).toEqual(value);
      expect(console.error).toHaveBeenCalledTimes(0);
    }
  );
});

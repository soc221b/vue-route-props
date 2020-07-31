import Vue from "vue";
import VueRouter from "vue-router";
import VueRouteProps from "../../../src/index";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueRouteProps);

let vm;
let router;
let spy;

const stringifiableTypes = [null, Boolean, String, Number, Array, Object];
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

  test.each(stringifiableTypes)(
    `should allow user to specify type as prop value.`,
    (type) => {
      const value = validValueMapping.get(type);
      router.replace({
        query: {
          prop: JSON.stringify(value),
        },
      });
      vm = new Vue({
        router,
        routeProps: {
          prop: type,
        },
      });

      expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) });
      expect(vm.prop).toEqual(value);
      expect(console.error).toHaveBeenCalledTimes(0);
    }
  );

  test.each(stringifiableTypes)(
    `should allow user to specify type as type option.`,
    (type) => {
      const value = validValueMapping.get(type);
      router.replace({
        query: {
          prop: JSON.stringify(value),
        },
      });
      vm = new Vue({
        router,
        routeProps: {
          prop: {
            type: type,
          },
        },
      });

      expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) });
      expect(vm.prop).toEqual(value);
      expect(console.error).toHaveBeenCalledTimes(0);
    }
  );

  test.each([...validValueMapping.values()])(
    `should not do type validation.`,
    (value) => {
      router.replace({
        query: {
          prop: JSON.stringify(value),
        },
      });
      vm = new Vue({
        router,
        routeProps: {
          prop: {},
        },
      });

      expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) });
      expect(vm.prop).toEqual(value);
      expect(console.error).toHaveBeenCalledTimes(0);
    }
  );

  test.each([...validValueMapping.values()])(
    `should allow user to specify multitple types as type option.`,
    (value) => {
      router.replace({
        query: {
          prop: JSON.stringify(value),
        },
      });
      vm = new Vue({
        router,
        routeProps: {
          prop: {
            type: stringifiableTypes,
          },
        },
      });

      expect(vm.$route.query).toEqual({ prop: JSON.stringify(value) });
      expect(vm.prop).toEqual(value);
      expect(console.error).toHaveBeenCalledTimes(0);
    }
  );

  it(`should log error when given value is not expected type (specify type as prop value).`, () => {
    router.replace({
      query: {
        prop: JSON.stringify(1),
      },
    });
    vm = new Vue({
      router,
      routeProps: {
        prop: Boolean,
      },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid routeProp: type check failed for routeProp "prop". Expected Boolean, got Number with value 1.`,
    ]);
  });

  it(`should log error when given value is not expected type (null).`, () => {
    router.replace({
      query: {
        prop: JSON.stringify(1),
      },
    });
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          type: null,
        },
      },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid routeProp: type check failed for routeProp "prop". Expected null, got Number with value 1.`,
    ]);
  });
});

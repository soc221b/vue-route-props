import Vue from "vue";
import VueRouter from "vue-router";
import VueRouteProps from "../../../src/index";

Vue.use(VueRouter);
Vue.use(VueRouteProps);

let vm;
let router;
let spy;

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

  it(`should works when change route dynamically (1).`, async () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          required: true,
          type: Array,
          validator(value) {
            return (
              value.length === 2 &&
              value.includes("route") &&
              value.includes("changed")
            );
          },
        },
      },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Missing required routeProp: "prop"`,
    ]);

    router.replace({
      query: {
        prop: JSON.stringify(1),
      },
    });
    await Promise.resolve();
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid routeProp: type check failed for routeProp "prop". Expected Array, got Number with value 1.`,
    ]);

    router.replace({
      query: {
        prop: JSON.stringify([]),
      },
    });
    await Promise.resolve();
    expect(console.error).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls[2].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid routeProp: custom validator check failed for routeProp "prop".`,
    ]);

    router.replace({
      query: {
        prop: JSON.stringify(["route", "changed"]),
      },
    });
    await Promise.resolve();
    expect(console.error).toHaveBeenCalledTimes(3);

    router.replace({
      query: {},
    });
    await Promise.resolve();
    expect(console.error).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[3].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Missing required routeProp: "prop"`,
    ]);
  });

  it(`should works when change route dynamically (2).`, async () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          default: () => [],
          type: Array,
          validator(value) {
            return (
              value.length === 2 &&
              value.includes("route") &&
              value.includes("changed")
            );
          },
        },
      },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid routeProp: custom validator check failed for routeProp "prop".`,
    ]);

    router.replace({
      query: {
        prop: JSON.stringify([]),
      },
    });
    await Promise.resolve();
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid routeProp: custom validator check failed for routeProp "prop".`,
    ]);

    router.replace({
      query: {
        prop: JSON.stringify(["route", "changed"]),
      },
    });
    await Promise.resolve();
    expect(console.error).toHaveBeenCalledTimes(2);

    router.replace({
      query: {},
    });
    await Promise.resolve();
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

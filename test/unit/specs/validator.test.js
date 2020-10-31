import Vue from "vue";
import VueRouter from "vue-router";
import * as VueRouteProps from "../../../src/index";

Vue.use(VueRouter);
Vue.use(VueRouteProps);

let vm;
let router;
let spy;

// https://developer.mozilla.org/en-US/docs/Glossary/Falsy
const falsyValues = [null, void 0, 0, "", false, NaN, 0n];
// https://developer.mozilla.org/en-US/docs/Glossary/Truthy
const truthyValues = [
  true,
  {},
  [],
  42,
  "0",
  "false",
  new Date(),
  -42,
  12n,
  3.14,
  -3.14,
  Infinity,
  -Infinity,
];

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

  test.each(falsyValues)(
    `should log error when custom validator return falsy values.`,
    (value) => {
      router.replace({
        query: {
          prop: JSON.stringify("no matter"),
        },
      });
      vm = new Vue({
        router,
        routeProps: {
          prop: {
            required: true,
            validator() {
              return value;
            },
          },
        },
      });

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0].slice(0, 2)).toEqual([
        `[VueRouteProps warn]: `,
        `Invalid routeProp: custom validator check failed for routeProp "prop".`,
      ]);
    }
  );

  test.each(truthyValues)(
    `should not log error when custom validator return true.`,
    (value) => {
      router.replace({
        query: {
          prop: JSON.stringify("no matter"),
        },
      });
      vm = new Vue({
        router,
        routeProps: {
          prop: {
            required: true,
            validator() {
              return value;
            },
          },
        },
      });

      expect(console.error).toHaveBeenCalledTimes(0);
    }
  );

  test.each(falsyValues)(
    `should not validate when routeProp is not required.`,
    (value) => {
      vm = new Vue({
        router,
        routeProps: {
          prop: {
            required: false,
            validator() {
              return value;
            },
          },
        },
      });

      expect(console.error).toHaveBeenCalledTimes(0);
    }
  );
});

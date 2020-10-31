import Vue from "vue";
import VueRouter from "vue-router";
import * as VueRouteProps from "../../../dist/vue-route-props.esm.js";

Vue.use(VueRouter);
Vue.use(VueRouteProps);

let vm;
let router;
let spy;

describe("install", () => {
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

  it("should not inject any prop", async () => {
    router.replace({
      query: {
        prop: JSON.stringify("simple test"),
      },
    });
    vm = new Vue({
      router,
      routeProps: {
        prop: String,
      },
    });
    expect(vm.prop).toBe("simple test");
  });
});

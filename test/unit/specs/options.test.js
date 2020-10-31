import Vue from "vue";
import VueRouter from "vue-router";
import * as VueRouteProps from "../../../src/index";

Vue.use(VueRouter);
Vue.use(VueRouteProps, {
  inspect: true,
});

let vm;
let router;
let spyLog;

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
    spyLog = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    vm.$destroy();
    spyLog.mockClear();
  });

  it("works with inspect mode", async () => {
    vm = new Vue({
      router,
      routeProps: ["prop"],
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(spyLog.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps log]: `,
      `{}`,
    ]);

    router.replace({
      query: {
        prop: JSON.stringify("changed"),
      },
    });
    await Promise.resolve();
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(spyLog.mock.calls[1].slice(0, 2)).toEqual([
      `[VueRouteProps log]: `,
      JSON.stringify({ prop: "changed" }, null, 2),
    ]);
  });
});

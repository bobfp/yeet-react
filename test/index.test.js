import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useGetter, YeetContext } from "../src/index.js";
import { createStore } from "@bobfp/yeet-state";
import { cleanup } from "@testing-library/react";

describe("userGetter", () => {
  let store;
  beforeEach(() => {
    store = createStore({ counter: 0 });
  });
  afterEach(() => cleanup());
  test("gets state", () => {
    const wrapper = ({ children }) => (
      <YeetContext.Provider value={store}>{children}</YeetContext.Provider>
    );
    const { result } = renderHook(() => useGetter("counter", state => state), {
      wrapper
    });
    expect(result.current).toBe(0);
  });
  test("subscribes to state changes", () => {
    const wrapper = ({ children }) => (
      <YeetContext.Provider value={store}>{children}</YeetContext.Provider>
    );
    const { result } = renderHook(() => useGetter("counter", state => state), {
      wrapper
    });
    expect(result.current).toBe(0);

    act(() => {
      store.publish("counter")(state => 1);
    });
    expect(result.current).toBe(1);
  });
});

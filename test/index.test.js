import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useGetter, YeetContext, useSetter, useYeet } from "../src/index.js";
import { createStore } from "@bobfp/yeet-state";
import { cleanup } from "@testing-library/react";
import * as Y from "../../yeet-lens";

describe("hooks", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = createStore({ counter: 0 });
    wrapper = ({ children }) => (
      <YeetContext.Provider value={store}>{children}</YeetContext.Provider>
    );
  });

  afterEach(() => cleanup());

  describe("useGetter", () => {
    test("gets state", () => {
      const { result } = renderHook(
        () => useGetter("counter", state => state),
        {
          wrapper
        }
      );
      expect(result.current).toBe(0);
    });
    test("subscribes to state changes", () => {
      const { result } = renderHook(
        () => useGetter("counter", state => state),
        {
          wrapper
        }
      );
      expect(result.current).toBe(0);

      act(() => {
        store.publish("counter")(state => 1);
      });
      expect(result.current).toBe(1);
    });
  });

  describe("useSetter", () => {
    test("sets state with function", () => {
      const { result } = renderHook(
        () => useSetter("counter", (newState, state) => newState),
        { wrapper }
      );
      result.current(1);
      expect(store.getAtom("counter")).toBe(1);
    });
    test("sets state with value", () => {
      const { result } = renderHook(() => useSetter("counter"), { wrapper });
      result.current(1);
      expect(store.getAtom("counter")).toBe(1);
    });
  });

  describe("useYeet", () => {
    test("reads and writes to state", () => {
      const { result } = renderHook(() => useYeet("counter"), {
        wrapper
      });
      const [counter, setCounter] = result.current;
      expect(counter).toBe(0);

      act(() => {
        setCounter(1);
      });

      const [newCounter, _] = result.current;
      expect(newCounter).toBe(1);
    });
  });
});

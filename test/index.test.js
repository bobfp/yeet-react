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

describe("lens integration", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = createStore({
      counter: 0,
      testObject: { a: "cat" },
      list: [1, 2, 3],
      complex: {
        user: {
          name: "bob",
          connections: [
            { name: "steave", friend: false },
            { name: "carlos", friend: true }
          ]
        }
      }
    });
    wrapper = ({ children }) => (
      <YeetContext.Provider value={store}>{children}</YeetContext.Provider>
    );
  });

  afterEach(() => cleanup());

  test("prop", () => {
    const { result } = renderHook(
      () => useYeet("testObject", Y.propLens("a")),
      {
        wrapper
      }
    );
    expect(result.current[0]).toBe("cat");

    act(() => {
      result.current[1]("dog");
    });
    expect(result.current[0]).toBe("dog");

    act(() => {
      result.current[1](state => state + "s");
    });
    expect(result.current[0]).toBe("dogs");
  });
  test("list root getter, list item setter", () => {
    const { result } = renderHook(() => useYeet("list"), {
      wrapper
    });

    let [list, setList] = result.current;
    expect(list).toEqual([1, 2, 3]);

    const setWithIndex = setter => index => newItem =>
      setter(oldList =>
        oldList.map((item, i) => {
          if (i === index) {
            return typeof newItem === "function" ? newItem(item) : newItem;
          }
          return item;
        })
      );

    const setItem = setWithIndex(setList);
    act(() => {
      setItem(0)(1);
    });
    expect(result.current[0][0]).toBe(1);

    act(() => {
      setItem(1)(item => item + 2);
    });
    expect(result.current[0][1]).toBe(4);
  });
  test("complex", () => {
    const { result } = renderHook(
      () => useYeet("testObject", Y.propLens("a")),
      {
        wrapper
      }
    );
    expect(result.current[0]).toBe("cat");

    act(() => {
      result.current[1]("dog");
    });
    expect(result.current[0]).toBe("dog");

    act(() => {
      result.current[1](state => state + "s");
    });
    expect(result.current[0]).toBe("dogs");
  });
});

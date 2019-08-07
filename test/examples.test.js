import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useGetter, YeetContext, useSetter, useYeet } from "../src/index.js";
import { createStore } from "@bobfp/yeet-state";
import { cleanup } from "@testing-library/react";
import * as Y from "../../yeet-lens";

describe("examples", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = createStore({
      counter: 0,
      obj: { a: "cat", b: "zebra" },
      complex: {
        obj: { list: [1, 2, 3] }
      }
    });
    wrapper = ({ children }) => (
      <YeetContext.Provider value={store}>{children}</YeetContext.Provider>
    );
  });

  afterEach(() => cleanup());

  describe("useYeet", () => {
    test("basic", () => {
      const { result } = renderHook(() => useYeet("obj", Y.propLens("a")), {
        wrapper
      });
      expect(result.current[0]).toBe("cat");
    });
    test("itemSetter", () => {
      const { result } = renderHook(
        () =>
          useYeet(
            "complex",
            Y.composeLens(Y.propLens("obj"), Y.propLens("list"))
          ),
        {
          wrapper
        }
      );
      const [list, setList] = result.current;
      const setItem = Y.itemSetter(setList);
      expect(list).toEqual([1, 2, 3]);

      act(() => {
        setItem(0)(item => item + 1);
      });
      const [newList, _] = result.current;
      expect(newList).toEqual([2, 2, 3]);
    });
    test("keySetter", () => {
      const { result } = renderHook(() => useYeet("obj"), {
        wrapper
      });
      const [obj, setObj] = result.current;
      const setKey = Y.keySetter(setObj);
      expect(obj).toEqual({ a: "cat", b: "zebra" });

      act(() => {
        setKey("a")(item => item + "s");
      });
      const [newObj, _] = result.current;
      expect(newObj).toEqual({ a: "cats", b: "zebra" });
    });
  });
});

import React, { useContext, useEffect, useState } from "react";

export const YeetContext = React.createContext(null);

export const useGetter = (atom, getter) => {
  const store = useContext(YeetContext);
  const initialState = getter(store.getAtom(atom));
  const [state, setState] = useState(initialState);
  useEffect(() => {
    store.subscribe(atom)(state => setState(getter(state)));
  }, []);
  return state;
};

export const useSetter = (atom, setter = null) => {
  const store = useContext(YeetContext);
  if (setter) {
    return (...args) => {
      store.publish(atom)(state => setter(...args, state));
    };
  }
  return newState => store.publish(atom)(() => newState);
};

export const useYeet = (atom, lens = [state => state, null]) => {
  const [getter, setter] = lens;
  const state = useGetter(atom, getter);
  const setState = useSetter(atom, setter);
  return [state, setState];
};

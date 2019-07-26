# Yeet-React

Official React Hooks for [Yeet-State](https://github.com/bobfp/yeet-state)

Fast and simple.

## Installation

`yarn add @bobfp/yeet-react`

Yeet-React requires **React 16.8.6 or later.**

## Examples

### Basic

```js
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "@bobfp/yeet-state";
import {
  YeetContext,
  useLens
} from "@bobfp/yeet-react";

const counter = {value: 0};
const valueGetter = counter => counter.value
const valueSetter = (value, counter) => ({...counter, value})

const Counter = () => {
  const [value, yeetValue] = useLens("counter", [valueGetter, valueSetter]);
  
  return (
    <div>
      <button onClick={yeetValue(value + 1)}>+</button>
      <button onClick={yeetValue(value - 1)}>-</button>
      <span>{value}</span>
    </div>
  );
};

const App = () => {
  const initValue = { counter };
  const store = createStore(initValue);
  return (
    <YeetContext.Provider value={store}>
      <Counter />
    </YeetContext.Provider>
  );
};
```



## API

**useGetter(atomName, getter)**

A getter is any function that takes an atoms state and returns some value from it.

useGetter is a react hook that takes a getter function, and applies it to an atoms state. The useGetter hook will also subscribe the component to any changes in the atoms state, which would result in a re-render.

```js
const store = createStore({
  user: {name: 'bob', age: 32},
  counter: {value: 0}
});

// In a Component...
const name = useGetter('user', user => user.name)
```



**useSetter(atomName, setter)**

A setter is any function that takes any number of parameters followed by the atoms state and returns a new state

useSetter is a react hook that takes a setter function, and returns a function, that when called, updates the atoms state.

```js
const store = createStore({
  user: {name: 'bob', age: 32},
  counter: {value: 0}
});

// In a component...
const yeetAge = useSetter('user', (newAge, user) => ({...user, age: newAge}))
yeetAge(33)
// {user: name: 'bob', age: 33}


// The setter function can take any number of arguments, as long as the last argument 
// represents the atoms state. 

const yeetAge = useSetter('user', (newAge, newName, user) => ({
  ...user, 
  age: newAge, 
  name: newName
}))
yeetAge(34, 'bill')
// {user: name: 'bill', age: 34}
```



**useLens(atomName, [getter, setter])**

useLens is a convenience hook, which combines the effects of useGetter and useSetter



```js
const store = createStore({
  user: {name: 'bob', age: 32},
  counter: {value: 0}
});

// In a component...
const [age, yeetAge] = useLens('user', [
  user => user.age,
  (age, user) => ({...user, age})
])
```



**YeetContext**

A simple React Context that passes the store down to children.

```js
const App = () => {
  const initValue = { counter };
  const store = createStore(initValue);
  return (
    <YeetContext.Provider value={store}>
      <Counter />
    </YeetContext.Provider>
  );
};
```


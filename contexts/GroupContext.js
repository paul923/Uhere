import * as React from 'react';

const initialState = {
  groupData: {
    value: "test"
  },
}
const store = React.createContext(initialState);

const { Provider } = store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = React.useReducer((state, action) => {
    switch(action.type) {
      case 'change group data':
        const newState = {
          groupData: {
            value: action.newValue
          }
        }
        return newState;
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};


export { store, StateProvider }

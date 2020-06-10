import * as React from 'react';

const initialState = {
  groupData: {
    value: "test"
  },
}
export const GroupContext = React.createContext();

const reducer = (state, action) => {
  switch(action.type) {
    case 'change group data':
      const newState = {
        groupData: action.dataObject
      }
      return newState;
    default:
      return state;
  };
}

export const GroupProvider = ( { children } ) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <GroupContext.Provider value={[state, dispatch]}>
      {children}
    </GroupContext.Provider>
  )
}

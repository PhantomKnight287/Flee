import React, { createContext, FC, PropsWithChildren, useReducer } from "react";

interface User {
  username: string;
  id: string;
}
type Context = {
  user: User;
  setUser: (payload: {
    type: keyof typeof Events;
    payload: Partial<User> | null;
  }) => void;
};

export const UserContext = createContext<Context | null>(null);

enum Events {
  SetUser = "SET_USER",
  Logout = "LOGOUT",
}

const reducer = (
  state: Partial<User>,
  action: {
    type: keyof typeof Events;
    payload: Partial<User> | null;
  }
): Partial<User> => {
  switch (action.type) {
    case "Logout": {
      return {};
    }
    case "SetUser": {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
};

export const UserProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});
  return (
    <>
      <UserContext.Provider
        value={{
          user: state as unknown as User,
          setUser: dispatch,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

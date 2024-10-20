export const intialState = {
  loggedIn: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGOUT":
      return {
        ...state,
        loggedIn: false,
      };
    case "LOGIN":
      return {
        ...state,
        loggedIn: true,
      };
    default:
     return state
  }
};

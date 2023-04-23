export const authReducer = (state, action) => {
  const {
    type,
    payload: { isAuthenticated, username, isAdmin },
  } = action;

  switch (type) {
    case "LOGIN_USER":
      return {
        ...state,
        isAuthenticated,
        username,
        isAdmin,
      };
    default:
      return state;
  }
};

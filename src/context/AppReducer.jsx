export const appReducer = (state, action) => {
  switch (action.type) {

    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        selectedChat: null
      };

    case "LOGOUT":
      return {
        user: {
          uid: "",
          name: "",
          email: "",
          photo: ""
        },
        chats: [],
        selectedChat: null
      };

    case "SET_CHATS":
      return {
        ...state,
        chats: action.payload
      };

    case "SELECT_CHAT":
      return {
        ...state,
        selectedChat: action.payload
      };

    default:
      return state;
  }
};
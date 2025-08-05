// handleCasdoorReducer.ts
import { ActionUserReducerType } from "../types";

interface UserState {
  key: string | null;
  error: string | null;
}

const initialState: UserState = {
  key: null,
  error: null,
};

export const userReducer = (
  state: UserState = initialState,
  action: any,
): UserState => {
  switch (action.type) {
    // state for store key-authentication
    case ActionUserReducerType.SET_KEY:
      return {
        ...state,
        key: action.payload,
        error: null,
      };

    // state for store user information

    default:
      return state;
  }
};

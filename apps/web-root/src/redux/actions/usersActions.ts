import { ActionUserReducerType } from "../types";

export const setKey = (key: string) => {
  return {
    type: ActionUserReducerType.SET_KEY,
    payload: key,
  };
};

export const clearKey = () => {
  return {
    type: ActionUserReducerType.CLEAR_KEY,
  };
};

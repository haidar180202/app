import { combineReducers } from "redux";
import { handleManagementUi } from "./handleManagementUiReducer";
import { userReducer } from "./handleCasdoorReducer";

export const rootReducers = combineReducers({
  handleManagementUi,
  userReducer,
});

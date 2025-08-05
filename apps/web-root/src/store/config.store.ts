import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@store/slice/auth.slice";

export default configureStore({
  reducer: {
    config: authReducer,
  },
});

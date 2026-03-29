import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import contentReducer from "./contentSlice"
import rightsReducer from "./rightsSlice"
import reportsReducer from "./reportsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    rights: rightsReducer,
    reports: reportsReducer
  }
})

export default store
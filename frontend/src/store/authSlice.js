import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/api/axios"

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", credentials)
      const token = response.data.access_token
      localStorage.setItem("token", token)
      return token
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Login failed")
    }
  }
)

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/register", userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Registration failed")
    }
  }
)

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/auth/me")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("token")
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
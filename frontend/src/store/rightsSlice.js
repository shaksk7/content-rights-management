import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/api/axios"

export const fetchRights = createAsyncThunk(
  "rights/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/rights?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

export const createRights = createAsyncThunk(
  "rights/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/rights", data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

export const checkAvailability = createAsyncThunk(
  "rights/checkAvailability",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/rights/check-availability", data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

const rightsSlice = createSlice({
  name: "rights",
  initialState: {
    items: [],
    availability: null,
    loading: false,
    error: null
  },
  reducers: {
    clearAvailability: (state) => {
      state.availability = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRights.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRights.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchRights.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createRights.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items]
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = action.payload
      })
  }
})

export const { clearAvailability, clearError } = rightsSlice.actions
export default rightsSlice.reducer
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/api/axios"

export const fetchExpiring = createAsyncThunk(
  "reports/fetchExpiring",
  async (days = 30, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reports/expiring?days=${days}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

export const fetchByTerritory = createAsyncThunk(
  "reports/fetchByTerritory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/reports/by-territory")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    expiring: null,
    byTerritory: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpiring.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchExpiring.fulfilled, (state, action) => {
        state.loading = false
        state.expiring = action.payload
      })
      .addCase(fetchExpiring.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchByTerritory.fulfilled, (state, action) => {
        state.byTerritory = action.payload
      })
  }
})

export default reportsSlice.reducer
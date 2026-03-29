import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/api/axios"

export const fetchContent = createAsyncThunk(
  "content/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/content?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

export const createContent = createAsyncThunk(
  "content/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/content", data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

export const deleteContent = createAsyncThunk(
  "content/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/content/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail)
    }
  }
)

const contentSlice = createSlice({
  name: "content",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items]
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  }
})

export const { clearError } = contentSlice.actions
export default contentSlice.reducer
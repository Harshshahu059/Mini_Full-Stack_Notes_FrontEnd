import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axiosInstance'

// Async Thunks
export const register = createAsyncThunk('auth/register', async (payload,thunkAPI) => {
 try {
   const res = await API.post('/auth/register', payload);
   return res.data;
 }  catch (error) {
     console.log(error)
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Register user failed'
      );
  }
})

export const login = createAsyncThunk('auth/login', async (payload,thunkAPI) => {
  try {
    const res = await API.post('/auth/login', payload);
    console.log(res)
    return res.data.data;
  } catch (error) {
     console.log(error)
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
  }
})

// Safe initial state
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.warn('Failed to parse user from localStorage', err);
    return null;
  }
}

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error:null
}

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.error=null
      })
      .addCase(register.rejected, (state, action) => {
        console.log(action.payload)
        state.error=action.payload
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error=null
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action.payload)
        state.error=action.payload
      })
  }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import notesReducer, { noteAddedRealtime, noteUpdatedRealtime, noteDeletedRealtime } from '../features/notes/notesSlice'
import { io } from 'socket.io-client'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  }
})

// Setup Socket.IO after store is created
const socket = io(import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000')

socket.on('noteAdded', (note) => store.dispatch(noteAddedRealtime(note)));
socket.on('noteUpdated', (note) => store.dispatch(noteUpdatedRealtime(note)));
socket.on('noteDeleted', (payload) => store.dispatch(noteDeletedRealtime(payload)));

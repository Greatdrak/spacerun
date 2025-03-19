import { createSlice } from '@reduxjs/toolkit';

const creditsSlice = createSlice({
  name: 'credits',
  initialState: 0,
  reducers: {
    addCredits: (state, action) => state + action.payload,
    setCredits: (state, action) => action.payload
  }
});

export const { addCredits, setCredits } = creditsSlice.actions;
export default creditsSlice.reducer; 
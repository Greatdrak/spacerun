import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEngaged: false
};

const shieldsSlice = createSlice({
  name: 'shields',
  initialState,
  reducers: {
    toggleShields: (state) => {
      state.isEngaged = !state.isEngaged;
    }
  }
});

export const { toggleShields } = shieldsSlice.actions;
export default shieldsSlice.reducer; 
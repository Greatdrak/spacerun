import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEngaged: false
};

const hyperdriveSlice = createSlice({
  name: 'hyperdrive',
  initialState,
  reducers: {
    toggleHyperdrive: (state) => {
      state.isEngaged = !state.isEngaged;
    },
    setHyperdrive: (state, action) => {
      state.isEngaged = action.payload;
    }
  }
});

export const { toggleHyperdrive, setHyperdrive } = hyperdriveSlice.actions;
export default hyperdriveSlice.reducer; 
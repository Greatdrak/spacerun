import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeMission: null,
  completedMissions: []
};

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setActiveMission: (state, action) => {
      state.activeMission = action.payload;
    },
    completeMission: (state, action) => {
      state.completedMissions.push(state.activeMission);
      state.activeMission = null;
    }
  }
});

export const { setActiveMission, completeMission } = missionsSlice.actions;
export default missionsSlice.reducer; 
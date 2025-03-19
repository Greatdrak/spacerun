// Action Types
export const TOGGLE_HYPERDRIVE = 'TOGGLE_HYPERDRIVE';
export const TOGGLE_SHIELDS = 'TOGGLE_SHIELDS';
export const ADD_CREDITS = 'ADD_CREDITS';
export const SET_CREDITS = 'SET_CREDITS';

// Action Creators
export const toggleHyperdrive = () => ({
  type: TOGGLE_HYPERDRIVE
});

export const toggleShields = () => ({
  type: TOGGLE_SHIELDS
});

export const addCredits = (amount) => ({
  type: ADD_CREDITS,
  payload: amount
});

export const setCredits = (amount) => ({
  type: SET_CREDITS,
  payload: amount
}); 
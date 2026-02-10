import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,    // Will hold { uid, name, email, role, etc. }
  loading: true, // Used to track the initial Firebase auth check
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called when user logs in or auth state is detected
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
    },
    // Called during logout
    clearUser(state) {
      state.user = null;
      state.loading = false;
    },
    // Useful for manual loading triggers (e.g., during profile updates)
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
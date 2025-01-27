import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  compliance: {},
};

const poiSlice = createSlice({
  name: 'poi',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(backendService.getCompliance.fulfilled, (state, action) => {
      state.compliance = action.payload;
    });
  },
});

export default poiSlice.reducer;

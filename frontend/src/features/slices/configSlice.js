import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  maptoken: '',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(backendService.getMapToken.fulfilled, (state, action) => {
      state.maptoken = action.payload?.value;
    });
  },
});

export default configSlice.reducer;

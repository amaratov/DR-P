import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';
import { isEmpty } from '../../utils/utils';

const initialState = {
  connections: [],
  editExistingConnect: {},
  total: 0,
};

const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setEditExistingConnect: (state, action) => {
      state.editExistingConnect = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getProjectConnections.fulfilled, (state, action) => {
        state.connections = action.payload?.connections;
      })
      .addCase(backendService.newProjectConnections.fulfilled, (state, action) => {
        if (action?.payload?.connection) state.connections.push(action?.payload?.connection);
      })
      .addCase(backendService.updateProjectConnections.fulfilled, (state, action) => {
        const needToUpdateExist = !isEmpty(state.editExistingConnect) && state.editExistingConnect?.id === action.payload?.id;
        if (needToUpdateExist) state.editExistingConnect = { ...action.payload.connection };
      });
  },
});

export const { setEditExistingConnect } = connectionSlice.actions;
export default connectionSlice.reducer;

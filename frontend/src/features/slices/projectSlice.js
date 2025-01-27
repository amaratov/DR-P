import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  allProjects: [],
  myProjects: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setAllProjects: (state, action) => {
      state.allProjects = action.payload;
    },
    setMyProjects: (state, action) => {
      state.myProjects = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getProjects.fulfilled, (state, action) => {
        state.allProjects = action.payload?.projects;
      })
      .addCase(backendService.getProjectsByParams.fulfilled, (state, action) => {
        state.allProjects = action.payload?.projects;
      })
      .addCase(backendService.getMyProjects.fulfilled, (state, action) => {
        state.myProjects = action.payload?.projects;
      });
  },
});

export const { setAllProjects, setMyProjects } = projectSlice.actions;

export default projectSlice.reducer;

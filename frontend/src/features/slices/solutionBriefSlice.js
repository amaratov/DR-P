import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  allSolutionBriefs: [],
  currentSolutionBriefs: [],
  createdSolutionBrief: {},
  triggerDownload: false,
};

const solutionBriefSlice = createSlice({
  name: 'solutionBrief',
  initialState,
  reducers: {
    setAllSolutionBriefs: (state, action) => {
      // TODO fix this when API is working
      state.allSolutionBriefs = [
        {
          docName: 'solutions_brief_111222_jesh.pdf',
          notes: 'Published new changes to the model and added more marketing materials as requested by Irina',
          createdBy: 'Steve Broderick',
          version: 'A.005',
          key: '1',
          id: '12345-123435-123423',
          published: true,
        },
        {
          docName: 'solutions_brief_111222_jesh.pdf',
          notes: 'Published new changes to the model and added more marketing materials as requested by Irina',
          createdBy: 'Steve Broderick',
          version: 'A.005',
          key: '2',
          id: '12345-123435-123423',
          published: false,
        },
      ];
    },
    removeSolutionBrief: (state, action) => {
      // TODO remove this function when API is working. Currently used for delete-testing purposes
      state.allSolutionBriefs = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getSolutionBriefcaseByProjectId.fulfilled, (state, action) => {
        state.currentSolutionBriefs = action.payload?.solutionBriefcases;
      })
      .addCase(backendService.createSolutionBriefcase.fulfilled, (state, action) => {
        state.createdSolutionBrief = action?.payload?.solutionBriefcase || {};
        state.currentSolutionBriefs.push(action?.payload?.solutionBriefcase);
      })
      .addCase(backendService.generateSolutionBriefcase.fulfilled, (state, action) => {
        state.triggerDownload = true;
      })
      .addCase(backendService.downloadSolutionBriefcase.pending, state => {
        state.triggerDownload = false;
      })
      .addCase(backendService.downloadSolutionBriefcase.rejected, state => {
        state.triggerDownload = false;
      })
      .addCase(backendService.downloadSolutionBriefcase.fulfilled, state => {
        state.triggerDownload = false;
      })
      .addCase(backendService.publishSolutionBriefcase.fulfilled, (state, action) => {
        const index = state.currentSolutionBriefs?.findIndex(brief => brief.id === action?.payload?.solutionBriefcase?.id);
        state.currentSolutionBriefs[index] = action?.payload?.solutionBriefcase;
      })
      .addCase(backendService.updateSolutionBriefcase.fulfilled, (state, action) => {
        const index = state.currentSolutionBriefs?.findIndex(brief => brief.id === action?.payload?.solutionBriefcase?.id);
        state.currentSolutionBriefs[index] = action?.payload?.solutionBriefcase;
      });
  },
});

export const { setAllSolutionBriefs, removeSolutionBrief } = solutionBriefSlice.actions;

export default solutionBriefSlice.reducer;

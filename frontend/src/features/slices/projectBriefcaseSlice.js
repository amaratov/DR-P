import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  allProjectBriefcase: [],
  currentProjectBriefcase: {},
  associatedMarketingDetail: [],
  associatedCustomerDocsDetail: [],
  total: 0,
  page: 0,
  numPages: 0,
  isLoadingAssociatedMarketing: false,
  isLoadingAssociatedCustomerDocs: false,
  hasLoadedAssociatedMarketing: false,
  hasLoadedAssociatedCustomerDocs: false,
};

const projectBriefCaseSlice = createSlice({
  name: 'projectBriefcase',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(backendService.getAllProjectBriefcase.fulfilled, (state, action) => {
        state.allProjectBriefcase = action?.payload?.briefcases || {};
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
      })
      .addCase(backendService.getProjectBriefcaseByParams.fulfilled, (state, action) => {
        state.allProjectBriefcase = action?.payload?.briefcases || {};
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
      })
      .addCase(backendService.createProjectBriefcase.fulfilled, (state, action) => {
        state.currentProjectBriefcase = action?.payload?.briefcase || {};
      })
      .addCase(backendService.getProjectBriefcaseByProjectId.fulfilled, (state, action) => {
        state.currentProjectBriefcase = action?.payload?.briefcases?.[0] || {};
      })
      .addCase(backendService.findMarketingsByIds.pending, state => {
        state.isLoadingAssociatedMarketing = true;
      })
      .addCase(backendService.findMarketingsByIds.fulfilled, (state, action) => {
        state.associatedMarketingDetail = action.payload.documents || [];
        state.isLoadingAssociatedMarketing = false;
        state.hasLoadedAssociatedMarketing = true;
      })
      .addCase(backendService.findMarketingsByIdsAndParams.pending, state => {
        state.isLoadingAssociatedMarketing = true;
      })
      .addCase(backendService.findMarketingsByIdsAndParams.fulfilled, (state, action) => {
        state.associatedMarketingDetail = action.payload.documents || [];
        state.isLoadingAssociatedMarketing = false;
        state.hasLoadedAssociatedMarketing = true;
      })
      .addCase(backendService.updateProjectBriefcase.fulfilled, (state, action) => {
        state.currentProjectBriefcase = action?.payload?.briefcase || {};
      });
  },
});

export default projectBriefCaseSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  industryVerticals: [],
  companies: [],
  projects: [],
  documents: [],
  roles: [],
  otherTages: [],
  hasIndustryVerticalLoaded: false,
  hasCompanyLoaded: false,
  hasProjectLoaded: false,
  hasDocumentLoaded: false,
  hasRoleLoaded: false,
  hasOtherTagsLoaded: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(backendService.getAllIndustryVertical.fulfilled, (state, action) => {
        state.industryVerticals = action.payload?.industryverticals;
        state.hasIndustryVerticalLoaded = true;
      })
      .addCase(backendService.getAllCompanies.fulfilled, (state, action) => {
        state.companies = action.payload?.companies;
        state.hasCompanyLoaded = true;
      })
      .addCase(backendService.getProjects.fulfilled, (state, action) => {
        state.projects = action.payload?.projects;
        state.hasProjectLoaded = true;
      })
      .addCase(backendService.getDocuments.fulfilled, (state, action) => {
        state.documents = action.payload?.documents;
        state.hasDocumentLoaded = true;
      })
      .addCase(backendService.getRoles.fulfilled, (state, action) => {
        state.roles = action.payload?.roles;
        state.hasRoleLoaded = true;
      })
      .addCase(backendService.getOtherTags.fulfilled, (state, action) => {
        state.otherTags = action.payload?.tags;
        state.hasOtherTagsLoaded = true;
      });
  },
});

export default commonSlice.reducer;

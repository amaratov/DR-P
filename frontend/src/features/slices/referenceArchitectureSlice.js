import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  activeReferenceDocs: null,
  archivedReferenceDocs: null,
  searchedReferenceDocs: null,
  total: 0,
  page: 0,
  numPages: 0,
  isLoadingReferenceDoc: false,
};

const ReferenceArchitectureSlice = createSlice({
  name: 'referenceArchitecture',
  initialState,
  reducers: {
    resetReferenceDocSearch: state => {
      state.searchedReferenceDocs = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getAllActiveReferenceArchitecture.fulfilled, (state, action) => {
        state.activeReferenceDocs = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingReferenceDoc = false;
      })
      .addCase(backendService.getAllArchivedReferenceArchitecture.fulfilled, (state, action) => {
        state.archivedReferenceDocs = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingReferenceDoc = false;
      })
      .addCase(backendService.getReferenceArchitectureByParams.fulfilled, (state, action) => {
        state.activeReferenceDocs = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingUseCases = false;
        if (!state.hasLoadedUseCases) state.hasLoadedUseCases = true;
      })
      .addCase(backendService.getReferenceArchitectureByParams.pending, state => {
        state.isLoadingUseCases = true;
      })
      .addCase(backendService.getUseCasesByParams.pending, state => {
        state.isLoadingUseCases = true;
      })
      .addCase(backendService.getAllActiveReferenceArchitecture.pending, state => {
        state.isLoadingReferenceDoc = true;
      })
      .addCase(backendService.getAllArchivedReferenceArchitecture.pending, state => {
        state.isLoadingReferenceDoc = true;
      })
      .addCase(backendService.searchReferenceArchitecture.pending, state => {
        state.isLoadingReferenceDoc = true;
      })
      .addCase(backendService.searchReferenceArchitecture.fulfilled, (state, action) => {
        state.searchedReferenceDocs = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingReferenceDoc = false;
      })
      .addCase(backendService.createReferenceArchitecture.fulfilled, (state, action) => {
        state.activeReferenceDocs.push(action.payload?.document);
      })
      .addCase(backendService.updateReferenceArchitecture.fulfilled, (state, action) => {
        const index = state.activeReferenceDocs.findIndex(referDoc => referDoc.id === action.payload?.document?.id);
        state.activeReferenceDocs[index] = action.payload?.document;
      })
      .addCase(backendService.deleteReferenceArchitecture.fulfilled, (state, action) => {
        const id = action.payload?.document?.id;
        state.activeReferenceDocs = state.activeReferenceDocs?.filter(referDoc => referDoc.id !== id);
      })
      .addCase(backendService.activateReferenceArchitecture.fulfilled, (state, action) => {
        const id = action.payload?.document?.id;
        state.archivedReferenceDocs = state.archivedReferenceDocs?.filter(referDoc => referDoc.id !== id);
      });
  },
});

export const { resetReferenceDocSearch } = ReferenceArchitectureSlice.actions;

export default ReferenceArchitectureSlice.reducer;

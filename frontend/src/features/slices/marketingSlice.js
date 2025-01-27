import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  allMarketings: null,
  allActiveMarketings: null,
  archivedMarketings: null,
  searchedMarketings: null,
  total: 0,
  page: 0,
  numPages: 0,
  isLoadingMarketingDoc: false,
};

const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {
    setAllMarketings: (state, action) => {
      state.allMarketings = action.payload;
    },
    setArchivedMarketings: (state, action) => {
      state.archivedMarketings = action.payload;
    },
    resetMarketingSearch: state => {
      state.searchedMarketings = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getAllMarketing.fulfilled, (state, action) => {
        state.allMarketings = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingMarketingDoc = false;
      })
      .addCase(backendService.getAllActiveMarketings.fulfilled, (state, action) => {
        state.allActiveMarketings = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingMarketingDoc = false;
      })
      .addCase(backendService.getAllArchivedMarketings.fulfilled, (state, action) => {
        state.archivedMarketings = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingMarketingDoc = false;
      })
      .addCase(backendService.createMarketing.fulfilled, (state, action) => {
        state.allMarketings.push(action.payload?.document);
      })
      .addCase(backendService.updateMarketing.fulfilled, (state, action) => {
        const index = state?.allMarketings?.findIndex(marketing => marketing?.id === action.payload?.document?.id);
        try {
          state.allMarketings[index] = action.payload?.document;
        } catch (e) {
          console.error(e);
        }
      })
      .addCase(backendService.deleteMarketing.fulfilled, (state, action) => {
        const id = action.payload?.document?.id;
        state.allMarketings = state.allMarketings?.filter(marketing => marketing.id !== id);
      })
      .addCase(backendService.activateMarketing.fulfilled, (state, action) => {
        const id = action.payload?.document?.id;
        state.archivedMarketings = state.archivedMarketings?.filter(marketing => marketing.id !== id);
      })
      .addCase(backendService.getAllMarketing.pending, state => {
        state.isLoadingMarketingDoc = true;
      })
      .addCase(backendService.getAllActiveMarketings.pending, state => {
        state.isLoadingMarketingDoc = true;
      })
      .addCase(backendService.getAllArchivedMarketings.pending, state => {
        state.isLoadingMarketingDoc = true;
      })
      .addCase(backendService.searchMarketings.pending, state => {
        state.isLoadingMarketingDoc = true;
      })
      .addCase(backendService.searchMarketings.fulfilled, (state, action) => {
        state.searchedMarketings = action.payload?.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingMarketingDoc = false;
      });
  },
});

export const { setAllMarketings, setArchivedMarketings, resetMarketingSearch } = marketingSlice.actions;

export default marketingSlice.reducer;

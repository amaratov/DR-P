import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  allIndustryVerticals: null,
  archivedIndustryVerticals: null,
  hasLoadedIndustryVertical: false,
  total: 0,
  page: 0,
  numPages: 0,
  isLoadingIndustryVertical: false,
};

const industryVerticalSlice = createSlice({
  name: 'industryVertical',
  initialState,
  reducers: {
    setAllIndustryVerticals: (state, action) => {
      state.allIndustryVerticals = action.payload;
      if (!state.hasLoadedIndustryVertical) state.hasLoadedIndustryVertical = true;
    },
    setArchivedIndustryVerticals: (state, action) => {
      state.archivedIndustryVerticals = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getAllIndustryVertical.fulfilled, (state, action) => {
        state.allIndustryVerticals = action.payload?.industryverticals;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page || 0;
        state.isLoadingIndustryVertical = false;
        if (!state.hasLoadedIndustryVertical) state.hasLoadedIndustryVertical = true;
      })
      .addCase(backendService.getIndustryVerticalByParams.fulfilled, (state, action) => {
        state.allIndustryVerticals = action.payload?.industryverticals;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page || 0;
        state.isLoadingIndustryVertical = false;
        if (!state.hasLoadedIndustryVertical) state.hasLoadedIndustryVertical = true;
      })
      .addCase(backendService.getAllIndustryVertical.pending, (state, action) => {
        state.isLoadingIndustryVertical = true;
      })
      .addCase(backendService.getIndustryVerticalByParams.pending, (state, action) => {
        state.isLoadingIndustryVertical = true;
      })
      .addCase(backendService.createIndustryVertical.fulfilled, (state, action) => {
        state.allIndustryVerticals.push(action.payload?.industryvertical);
      })
      .addCase(backendService.updateIndustryVertical.fulfilled, (state, action) => {
        const index = state.allIndustryVerticals.findIndex(industryvertical => industryvertical.id === action.payload?.industryvertical?.id);
        state.allIndustryVerticals[index] = action.payload?.industryvertical;
      })
      .addCase(backendService.deleteIndustryVertical.fulfilled, (state, action) => {
        const index = state.allIndustryVerticals.findIndex(industryvertical => industryvertical.id === action.payload?.industryvertical?.id);
        state.allIndustryVerticals[index] = action.payload?.industryvertical;
      })
      .addCase(backendService.activateIndustryVertical.fulfilled, (state, action) => {
        const index = state.allIndustryVerticals.findIndex(industryvertical => industryvertical.id === action.payload?.industryvertical?.id);
        state.allIndustryVerticals[index] = action.payload?.industryvertical;
      });
  },
});

export const { setAllIndustryVerticals, setArchivedIndustryVerticals } = industryVerticalSlice.actions;

export default industryVerticalSlice.reducer;

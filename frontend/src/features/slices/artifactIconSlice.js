import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  createdIcon: {},
  allIcons: [],
  activeIcons: [],
  archivedIcons: [],
  searchedIcons: [],
  defaultIcons: [],
  updateIconData: '',
  total: 0,
  page: 0,
  numPages: 0,
  isLoadingIcons: false,
  allActiveIcons: [],
};

const artifactIconSlice = createSlice({
  name: 'artifactIcon',
  initialState,
  reducers: {
    resetIconSearch: state => {
      state.searchedIcons = [];
    },
    resetUpdateIconData: state => {
      state.updateIconData = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.createIcon.fulfilled, (state, action) => {
        state.activeIcons.push(action.payload?.icon);
      })
      .addCase(backendService.getAllActiveIcon.fulfilled, (state, action) => {
        state.activeIcons = action.payload?.icons;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingIcons = false;
      })
      .addCase(backendService.getTrueAllActiveIcon.fulfilled, (state, action) => {
        state.allActiveIcons = action.payload?.icons;
      })
      .addCase(backendService.getAllIcon.fulfilled, (state, action) => {
        state.allIcons = action.payload?.icons;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingIcons = false;
      })
      .addCase(backendService.getAllArchivedIcon.fulfilled, (state, action) => {
        state.archivedIcons = action.payload?.icons;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingIcons = false;
      })
      .addCase(backendService.searchPreviewIcons.fulfilled, (state, action) => {
        state.activeIcons = action.payload?.icons;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingIcons = false;
      })
      .addCase(backendService.searchIcons.fulfilled, (state, action) => {
        state.searchedIcons = action.payload?.icons;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingIcons = false;
      })
      .addCase(backendService.getAllActiveIcon.pending, state => {
        state.isLoadingIcons = true;
      })
      .addCase(backendService.getAllIcon.pending, state => {
        state.isLoadingIcons = true;
      })
      .addCase(backendService.getAllArchivedIcon.pending, state => {
        state.isLoadingIcons = true;
      })
      .addCase(backendService.searchIcons.pending, state => {
        state.isLoadingIcons = true;
      })
      .addCase(backendService.searchPreviewIcons.pending, state => {
        state.isLoadingIcons = true;
      })
      .addCase(backendService.updateIcon.fulfilled, (state, action) => {
        state.updateIconData = action.payload?.icon?.id;
      })
      .addCase(backendService.deleteIcon.fulfilled, (state, action) => {
        const id = action.payload?.icon?.id;
        state.activeIcons = state.activeIcons?.filter(icon => icon.id !== id);
      })
      .addCase(backendService.activateIcon.fulfilled, (state, action) => {
        const id = action.payload?.icon?.id;
        state.archivedIcons = state.archivedIcons?.filter(icon => icon.id !== id);
      })
      .addCase(backendService.detachIcon.fulfilled, (state, action) => {
        state.updateIconData = action.payload?.icon?.id;
      })
      .addCase(backendService.getIconById.fulfilled, (state, action) => {
        const index = state.activeIcons?.findIndex(icon => icon.id === action.payload?.icon?.id);
        state.activeIcons[index] = action.payload?.icon;
        state.updateIconData = '';
      })
      .addCase(backendService.searchDefaultIcons.fulfilled, (state, action) => {
        state.defaultIcons = action.payload?.icons;
      });
  },
});

export const { resetIconSearch, resetUpdateIconData } = artifactIconSlice.actions;

export default artifactIconSlice.reducer;

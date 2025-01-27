import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_VIEW_STATE } from '../../utils/constants/constants';

const initialState = {
  viewState: DEFAULT_VIEW_STATE,
  recentlyDeactivated: null,
  hoveredConnectionId: null,
  highlightConnectionInfo: {},
};

const mapSlice = createSlice({
  name: 'mapState',
  initialState,
  reducers: {
    setViewState: (state, action) => {
      state.viewState = action.payload;
    },
    resetViewState: state => {
      state.viewState = DEFAULT_VIEW_STATE;
    },
    setRecentlyDeactivated: (state, action) => {
      state.recentlyDeactivated = action.payload;
    },
    setHoveredConnectionId: (state, action) => {
      state.hoveredConnectionId = action.payload;
    },
    setHighlightConnectionInfo: (state, action) => {
      state.highlightConnectionInfo = action.payload;
    },
  },
});

export const { setViewState, resetViewState, setRecentlyDeactivated, setHoveredConnectionId, setHighlightConnectionInfo } = mapSlice.actions;

export default mapSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  regions: {},
  compliances: [],
  applications: [],
  clouds: [],
  partnerships: {
    nsp: [],
    var: [],
    sw: [],
    migration: [],
    hw: [],
  },
};

const mvtSlice = createSlice({
  name: 'mvt',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(backendService.getRegions.fulfilled, (state, action) => {
        state.regions = action.payload;
      })
      .addCase(backendService.getActiveCompliance.fulfilled, (state, action) => {
        state.compliances = action.payload?.icons;
      })
      .addCase(backendService.getActiveApplication.fulfilled, (state, action) => {
        state.applications = action.payload?.icons;
      })
      .addCase(backendService.getActiveCloud.fulfilled, (state, action) => {
        state.clouds = action.payload?.icons;
      })
      .addCase(backendService.getActivePartnernsp.fulfilled, (state, action) => {
        state.partnerships.nsp = action.payload?.icons;
      })
      .addCase(backendService.getActivePartnervar.fulfilled, (state, action) => {
        state.partnerships.var = action.payload?.icons;
      })
      .addCase(backendService.getActivePartnersw.fulfilled, (state, action) => {
        state.partnerships.sw = action.payload?.icons;
      })
      .addCase(backendService.getActivePartnermig.fulfilled, (state, action) => {
        state.partnerships.migration = action.payload?.icons;
      })
      .addCase(backendService.getActivePartnerhw.fulfilled, (state, action) => {
        state.partnerships.hw = action.payload?.icons;
      });
  },
});

export default mvtSlice.reducer;

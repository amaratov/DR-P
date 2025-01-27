import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  allUseCases: null,
  archivedUseCases: null,
  hasLoadedUseCases: false,
  total: '',
  page: '',
  numPages: '',
  isLoadingUseCases: false,
};

const useCaseSlice = createSlice({
  name: 'useCase',
  initialState,
  reducers: {
    setAllUseCases: (state, action) => {
      state.allUseCases = action.payload;
      if (!state.hasLoadedUseCases) state.hasLoadedUseCases = true;
    },
    setArchivedUseCases: (state, action) => {
      state.archivedUseCases = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getAllUseCases.fulfilled, (state, action) => {
        state.allUseCases = action.payload?.usecases;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingUseCases = false;
        if (!state.hasLoadedUseCases) state.hasLoadedUseCases = true;
      })
      .addCase(backendService.getUseCasesByParams.fulfilled, (state, action) => {
        state.allUseCases = action.payload?.usecases;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingUseCases = false;
        if (!state.hasLoadedUseCases) state.hasLoadedUseCases = true;
      })
      .addCase(backendService.getAllUseCases.pending, state => {
        state.isLoadingUseCases = true;
      })
      .addCase(backendService.getUseCasesByParams.pending, state => {
        state.isLoadingUseCases = true;
      })
      .addCase(backendService.createUseCase.fulfilled, (state, action) => {
        state.allUseCases.push(action.payload?.usecase);
      })
      .addCase(backendService.updateUseCase.fulfilled, (state, action) => {
        const index = state.allUseCases.findIndex(usecase => usecase.id === action.payload?.usecase?.id);
        state.allUseCases[index] = action.payload?.usecase;
      })
      .addCase(backendService.deleteUseCase.fulfilled, (state, action) => {
        const index = state.allUseCases.findIndex(usecase => usecase.id === action.payload?.usecase?.id);
        state.allUseCases[index] = action.payload?.usecase;
      })
      .addCase(backendService.activateUseCase.fulfilled, (state, action) => {
        const index = state.allUseCases.findIndex(usecase => usecase.id === action.payload?.usecase?.id);
        state.allUseCases[index] = action.payload?.usecase;
      });
  },
});

export const { setAllUseCases, setArchivedUseCases } = useCaseSlice.actions;

export default useCaseSlice.reducer;

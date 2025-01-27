import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  allCustomerDocuments: [],
  archivedCustomerDocuments: [],
  searchedCustomerDocuments: [],
  projectAssociatedCustomerDocuments: [],
  total: 0,
  page: 0,
  numPages: 0,
  isLoadingCustomerDoc: false,
};

const customerDocumentSlice = createSlice({
  name: 'customerDocument',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(backendService.getCustomerDocumentByProjectId.fulfilled, (state, action) => {
        state.projectAssociatedCustomerDocuments = action.payload.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
      })
      .addCase(backendService.getCustomerDocumentByProjectIdAndParams.fulfilled, (state, action) => {
        state.projectAssociatedCustomerDocuments = action.payload.documents;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
      })
      .addCase(backendService.createCustomerDocument.fulfilled, (state, action) => {
        state.projectAssociatedCustomerDocuments.push(action.payload?.document);
      })
      .addCase(backendService.deleteCustomerDocument.fulfilled, (state, action) => {
        const id = action.payload?.document?.id;
        state.projectAssociatedCustomerDocuments = state.projectAssociatedCustomerDocuments?.filter(customerDoc => customerDoc.id !== id);
      });
  },
});

export default customerDocumentSlice.reducer;

export const getProjectAssociatedDocuments = state => state?.customerDocument?.projectAssociatedCustomerDocuments || [];
export const getNumPagesForCustomerDocuments = state => state?.customerDocument?.numPages;
export const getCurrentPageForCustomerDocuments = state => state?.customerDocument?.page;

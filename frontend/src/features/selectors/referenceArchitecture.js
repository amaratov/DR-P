import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllActiveReferenceDoc = state => state?.referenceArchitecture?.activeReferenceDocs || [];
export const getAllArchivedReferenceDoc = state => state?.referenceArchitecture?.archivedReferenceDocs || [];
export const getReferenceDocSearchResults = state => state?.referenceArchitecture?.searchedReferenceDocs || [];
export const getIsLoadingReferenceDoc = state => state?.referenceArchitecture?.isLoadingReferenceDoc;
export const getNumPagesForReferenceDoc = state => state?.referenceArchitecture?.numPages;
export const getCurrentPageForReferenceDoc = state => state?.referenceArchitecture?.page;

export const getAllActiveReferenceDocFullInfo = createDraftSafeSelector(getAllActiveReferenceDoc, allRefs => {
  return allRefs?.reduce((acc, refdocs) => {
    acc.push({
      id: refdocs?.id,
      name: refdocs?.docName,
      type: refdocs?.docType,
      types: refdocs?.types,
      createdAt: refdocs?.createdAt,
      updatedAt: refdocs?.updatedAt,
      modifiedBy: `${refdocs?.fullCreatedBy?.firstName || ''} ${refdocs?.fullCreatedBy?.lastName || ''}`,
      createdBy: refdocs?.createdBy,
      originalFilename: refdocs?.originalFilename,
      archived: refdocs?.archived,
      industryVertical: refdocs?.industryVertical,
      useCase: refdocs?.useCase,
      notes: refdocs?.notes,
      partners: refdocs?.partners,
      technologies: refdocs?.technologies,
      hub: refdocs?.hub,
    });
    return acc;
  }, []);
});

export const getReferenceDocSearchResultsFullInfo = createDraftSafeSelector(getReferenceDocSearchResults, searchedRefs => {
  return searchedRefs
    ?.filter(rf => !rf?.archived)
    ?.reduce((acc, refdocs) => {
      acc.push({
        id: refdocs?.id,
        name: refdocs?.docName,
        type: refdocs?.docType,
        types: refdocs?.types,
        createdAt: refdocs?.createdAt,
        updatedAt: refdocs?.updatedAt,
        modifiedBy: `${refdocs?.fullCreatedBy?.firstName || ''} ${refdocs?.fullCreatedBy?.lastName || ''}`,
        createdBy: refdocs?.createdBy,
        originalFilename: refdocs?.originalFilename,
        archived: refdocs?.archived,
        industryVertical: refdocs?.industryVertical,
        useCase: refdocs?.useCase,
        notes: refdocs?.notes,
        partners: refdocs?.partners,
        technologies: refdocs?.technologies,
        hub: refdocs?.hub,
      });
      return acc;
    }, []);
});

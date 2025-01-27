import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllMarketings = state => state?.marketing?.allMarketings || [];
export const getAllActiveMarketingRaw = state => state?.marketing?.allActiveMarketings || [];
export const getAllArchivedMarketingsRaw = state => state?.marketing?.archivedMarketings || [];
export const getMarketingSearchResults = state => state?.marketing?.searchedMarketings || [];
export const getIsLoadingMarketingDocs = state => state?.marketing?.isLoadingMarketingDoc;
export const getNumPagesForMarketing = state => state?.marketing?.numPages;
export const getCurrentPageForMarketing = state => state?.marketing?.page;

export const getAllActiveMarketing = createDraftSafeSelector(getAllActiveMarketingRaw, allMarketings => {
  return allMarketings?.reduce((acc, marketings) => {
    acc.push({
      id: marketings?.id,
      name: marketings?.docName,
      type: marketings?.docType,
      types: marketings?.types,
      createdAt: marketings?.createdAt,
      updatedAt: marketings?.updatedAt,
      modifiedBy: `${marketings?.fullCreatedBy?.firstName || ''} ${marketings?.fullCreatedBy?.lastName || ''}`,
      createdBy: marketings?.createdBy,
      originalFilename: marketings?.originalFilename,
      archived: marketings?.archived,
      industryVertical: marketings?.industryVertical,
      useCase: marketings?.useCase,
      notes: marketings?.notes,
      partners: marketings?.partners,
      technologies: marketings?.technologies,
      hub: marketings?.hub,
      otherTags: marketings?.otherTags,
    });
    return acc;
  }, []);
});

export const getAllArchivedMarketings = createDraftSafeSelector(getAllArchivedMarketingsRaw, allMarketings => {
  return allMarketings
    ?.filter(mk => mk?.archived)
    ?.reduce((acc, marketings) => {
      acc.push({
        id: marketings?.id,
        name: marketings?.docName,
        type: marketings?.docType,
        types: marketings?.types,
        createdAt: marketings?.createdAt,
        updatedAt: marketings?.updatedAt,
        modifiedBy: `${marketings?.fullCreatedBy?.firstName || ''} ${marketings?.fullCreatedBy?.lastName || ''}`,
        createdBy: marketings?.createdBy,
        originalFilename: marketings?.originalFilename,
        archived: marketings?.archived,
        industryVertical: marketings?.industryVertical,
        useCase: marketings?.useCase,
        notes: marketings?.notes,
        partners: marketings?.partners,
        technologies: marketings?.technologies,
        hub: marketings?.hub,
        otherTags: marketings?.otherTags,
      });
      return acc;
    }, []);
});

export const getMarketingSearchResultsFullInfo = createDraftSafeSelector(getMarketingSearchResults, searchedMarketings => {
  return searchedMarketings
    ?.filter(com => !com?.archived)
    ?.reduce((acc, marketings) => {
      acc.push({
        id: marketings?.id,
        name: marketings?.docName,
        type: marketings?.docType,
        types: marketings?.types,
        createdAt: marketings?.createdAt,
        updatedAt: marketings?.updatedAt,
        modifiedBy: `${marketings?.fullCreatedBy?.firstName || ''} ${marketings?.fullCreatedBy?.lastName || ''}`,
        createdBy: marketings?.createdBy,
        originalFilename: marketings?.originalFilename,
        archived: marketings?.archived,
        industryVertical: marketings?.industryVertical,
        useCase: marketings?.useCase,
        notes: marketings?.notes,
        partners: marketings?.partners,
        technologies: marketings?.technologies,
        hub: marketings?.hub,
        otherTags: marketings?.otherTags,
      });
      return acc;
    }, []);
});

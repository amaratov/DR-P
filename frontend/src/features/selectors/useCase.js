import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllUseCases = state => state?.useCase?.allUseCases;
export const getHasLoadedUseCases = state => state?.useCase?.hasLoadedUseCases;
export const getNumPagesForUseCases = state => state?.useCase?.numPages;
export const getCurrentPageForUseCases = state => state?.useCase?.page;
export const getIsLoadingUseCases = state => state?.useCase?.isLoadingUseCases;
export const getTotalUseCases = state => state?.useCase?.total;

export const getAllActiveUseCases = createDraftSafeSelector(getAllUseCases, allUseCases => {
  return allUseCases
    ?.filter(com => !com?.archived)
    ?.reduce((acc, useCases) => {
      acc.push({
        id: useCases?.id,
        name: useCases?.name,
        projectCount: useCases?.projectCount || 0,
        documentCount: useCases?.documentCount || 0,
        createdAt: useCases?.createdAt,
        updatedAt: useCases?.updatedAt,
        createdBy: useCases?.createdBy,
        archived: useCases?.archived,
      });
      return acc;
    }, []);
});

export const getAllArchivedUseCases = createDraftSafeSelector(getAllUseCases, allUseCases => {
  return allUseCases
    ?.filter(com => com?.archived)
    ?.reduce((acc, useCases) => {
      acc.push({
        id: useCases?.id,
        name: useCases?.name,
        projectCount: useCases?.projectCount || 0,
        documentCount: useCases?.documentCount || 0,
        createdAt: useCases?.createdAt,
        updatedAt: useCases?.updatedAt,
        createdBy: useCases?.createdBy,
        archived: useCases?.archived,
      });
      return acc;
    }, []);
});

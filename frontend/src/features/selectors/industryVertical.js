import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllIndustryVerticals = state => state?.industryVertical?.allIndustryVerticals;
export const getHasLoadedIndustryVerticals = state => state?.industryVertical?.hasLoadedIndustryVertical;
export const getNumPagesForIndustryVertical = state => state?.industryVertical?.numPages;
export const getCurrentPageForIndustryVertical = state => state?.industryVertical?.page;
export const getIsLoadingIndustryVertical = state => state?.industryVertical?.isLoadingIndustryVertical;

export const getAllActiveIndustryVerticals = createDraftSafeSelector(getAllIndustryVerticals, allIndustryVerticals => {
  return allIndustryVerticals
    ?.filter(com => !com?.archived)
    ?.reduce((acc, industryVerticals) => {
      acc.push({
        id: industryVerticals?.id,
        name: industryVerticals?.name,
        createdAt: industryVerticals?.createdAt,
        updatedAt: industryVerticals?.updatedAt,
        createdBy: industryVerticals?.createdBy,
        archived: industryVerticals?.archived,
        companyCount: industryVerticals?.companyCount || 0,
        documentCount: industryVerticals?.documentCount || 0,
      });
      return acc;
    }, []);
});

export const getAllArchivedIndustryVerticals = createDraftSafeSelector(getAllIndustryVerticals, allIndustryVerticals => {
  return allIndustryVerticals
    ?.filter(com => com?.archived)
    ?.reduce((acc, industryVerticals) => {
      acc.push({
        id: industryVerticals?.id,
        name: industryVerticals?.name,
        createdAt: industryVerticals?.createdAt,
        updatedAt: industryVerticals?.updatedAt,
        createdBy: industryVerticals?.createdBy,
        archived: industryVerticals?.archived,
        companyCount: industryVerticals?.companyCount || 0,
        documentCount: industryVerticals?.documentCount || 0,
      });
      return acc;
    }, []);
});

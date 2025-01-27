import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllCompanies = state => state?.company?.allCompanies?.companies;
export const getAllMyCompaniesRaw = state => state?.company?.myCompanies?.companies;
export const getCompanies = state => state?.company?.companies;
export const getSearchedCompanies = state => state?.company?.searchedCompanies;
export const getIsLoadingCompanies = state => state?.company?.isLoadingCompanies;
export const getNumPagesForCompany = state => state?.company?.numPages;
export const getCurrentPageForCompany = state => state?.company?.page;

export const getCompaniesWithCreatorFullName = createDraftSafeSelector(getCompanies, companies => {
  return companies?.reduce((acc, company) => {
    const userFullName = `${company?.fullCreatedBy?.firstName || ''} ${company?.fullCreatedBy?.lastName || ''}`;
    acc.push({
      id: company?.id,
      name: company?.name,
      projects: company?.projects || [],
      createdAt: company?.createdAt,
      updatedAt: company?.updatedAt,
      creator: userFullName,
      industryVertical: company?.industryVertical || [],
      salesforceId: company?.salesforceId || [],
      associatedUsers: company?.associatedUsers || [],
      archived: company?.archived,
    });
    return acc;
  }, []);
});

export const getSearchedCompaniesWithCreatorFullName = createDraftSafeSelector(getSearchedCompanies, companies => {
  return companies?.reduce((acc, company) => {
    const userFullName = `${company?.fullCreatedBy?.firstName || ''} ${company?.fullCreatedBy?.lastName || ''}`;
    acc.push({
      id: company?.id,
      name: company?.name,
      projects: company?.projects || [],
      createdAt: company?.createdAt,
      updatedAt: company?.updatedAt,
      creator: userFullName,
      industryVertical: company?.industryVertical || [],
      salesforceId: company?.salesforceId || [],
      associatedUsers: company?.associatedUsers || [],
      archived: company?.archived,
    });
    return acc;
  }, []);
});

export const getAllActiveCompanies = createDraftSafeSelector(getAllCompanies, allCompanies => {
  return allCompanies
    ?.filter(com => !com.archived)
    ?.reduce((acc, company) => {
      const userFullName = `${company?.fullCreatedBy?.firstName || ''} ${company?.fullCreatedBy?.lastName || ''}`;
      acc.push({
        id: company?.id,
        name: company?.name,
        projects: company?.projects || [],
        createdAt: company?.createdAt,
        updatedAt: company?.updatedAt,
        creator: userFullName,
        industryVertical: company?.industryVertical || [],
        salesforceId: company?.salesforceId || [],
        associatedUsers: company?.associatedUsers || [],
        archived: company?.archived,
      });
      return acc;
    }, []);
});

export const getAllArchivedCompanies = createDraftSafeSelector(getAllCompanies, allCompanies => {
  return allCompanies
    ?.filter(com => com.archived)
    ?.reduce((acc, company) => {
      const userFullName = `${company?.fullCreatedBy?.firstName || ''} ${company?.fullCreatedBy?.lastName || ''}`;
      acc.push({
        id: company?.id,
        name: company?.name,
        projects: company?.projects || [],
        createdAt: company?.createdAt,
        updatedAt: company?.updatedAt,
        creator: userFullName,
        industryVertical: company?.industryVertical || [],
        salesforceId: company?.salesforceId || [],
        associatedUsers: company?.associatedUsers || [],
        archived: company?.archived,
      });
      return acc;
    }, []);
});

export const getAllMyCompanies = createDraftSafeSelector(getAllMyCompaniesRaw, allMyCompanies => {
  return allMyCompanies?.reduce((acc, company) => {
    const userFullName = `${company?.fullCreatedBy?.firstName || ''} ${company?.fullCreatedBy?.lastName || ''}`;
    acc.push({
      id: company?.id,
      name: company?.name,
      projects: company?.projects || [],
      createdAt: company?.createdAt,
      updatedAt: company?.updatedAt,
      creator: userFullName,
      industryVertical: company?.industryVertical || [],
      salesforceId: company?.salesforceId || [],
      associatedUsers: company?.associatedUsers || [],
      archived: company?.archived,
    });
    return acc;
  }, []);
});

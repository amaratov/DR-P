import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllProjectBriefcases = state => state?.projectBriefcase?.allProjectBriefcase;
export const getCurrentProjectBriefcase = state => state?.projectBriefcase?.currentProjectBriefcase;
export const getAssociatedMarketingDetail = state => state?.projectBriefcase?.associatedMarketingDetail;
export const getAssociatedCustomerDocDetail = state => state?.projectBriefcase?.associatedCustomerDocsDetail;
export const getNumPagesForProjectBriefcase = state => state?.projectBriefcase?.numPages;
export const getCurrentPageForProjectBriefcase = state => state?.projectBriefcase?.page;

export const getAllPublishedMarketing = createDraftSafeSelector(getAllProjectBriefcases, allProjectBriefcase => {
  return allProjectBriefcase
    .map((projectBriefcase, i) => {
      if (projectBriefcase?.publishedMarketing?.length > 0) {
        return projectBriefcase?.publishedMarketing.map((publishedMarketing, j) => {
          return {
            ...publishedMarketing,
            projectId: projectBriefcase?.projectId,
            key: `${i}${j}`,
          };
        });
      }
      return [...projectBriefcase.publishedMarketing];
    })
    .flat();
});

export const getAllAssociatedMarketing = createDraftSafeSelector(getAllProjectBriefcases, allProjectBriefcase => {
  return allProjectBriefcase
    .map(projectBriefcase => {
      if (projectBriefcase?.associatedMarketing?.length > 0) {
        return projectBriefcase?.associatedMarketing.map(associatedMarketing => {
          return {
            ...associatedMarketing,
            projectId: projectBriefcase?.projectId,
          };
        });
      }
      return [...projectBriefcase.associatedMarketing];
    })
    .flat();
});

export const getAllPublishedCustomerDocumentation = createDraftSafeSelector(getAllProjectBriefcases, allProjectBriefcase => {
  return allProjectBriefcase
    .map((projectBriefcase, i) => {
      if (projectBriefcase?.publishedDocument?.length > 0) {
        return projectBriefcase?.publishedDocument.map((publishedDocument, j) => {
          return {
            ...publishedDocument,
            projectId: projectBriefcase?.projectId,
            key: `${i}${j}`,
          };
        });
      }
      return [...projectBriefcase.publishedDocument];
    })
    .flat();
});

export const getAllAssociatedCustomerDocumentation = createDraftSafeSelector(getAllProjectBriefcases, allProjectBriefcase => {
  return allProjectBriefcase
    .map(projectBriefcase => {
      if (projectBriefcase?.associatedDocument?.length > 0) {
        return projectBriefcase?.associatedDocument.map(associatedDocument => {
          return {
            ...associatedDocument,
            projectId: projectBriefcase?.projectId,
          };
        });
      }
      return [...projectBriefcase.associatedDocument];
    })
    .flat();
});

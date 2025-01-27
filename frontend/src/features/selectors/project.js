import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllProjects = state => state?.project?.allProjects;
export const getAllMyProjects = state => state?.project?.myProjects;

export const getProjects = createDraftSafeSelector(getAllProjects, allProjects => {
  return allProjects
    ?.filter(com => !com?.archived)
    ?.reduce((acc, projects) => {
      acc.push({
        id: projects?.id,
        title: projects?.title,
        associatedUsers: projects?.associatedUsers || [],
        useCases: projects?.useCases || [],
        createdAt: projects?.createdAt,
        updatedAt: projects?.updatedAt,
        createdBy: projects?.createdBy,
        archived: projects?.archived,
        companyId: projects?.companyId,
        fullCreatedBy: projects?.fullCreatedBy || {},
      });
      return acc;
    }, []);
});

export const getMyProjects = createDraftSafeSelector(getAllMyProjects, myProjects => {
  return myProjects
    ?.filter(com => !com?.archived)
    ?.reduce((acc, projects) => {
      acc.push({
        id: projects?.id,
        title: projects?.title,
        associatedUsers: projects?.associatedUsers || [],
        useCases: projects?.useCases || [],
        createdAt: projects?.createdAt,
        updatedAt: projects?.updatedAt,
        createdBy: projects?.createdBy,
        archived: projects?.archived,
        companyId: projects?.companyId,
        fullCreatedBy: projects?.fullCreatedBy || {},
      });
      return acc;
    }, []);
});

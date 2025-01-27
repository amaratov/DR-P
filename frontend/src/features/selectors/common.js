export const getIndustryVerticals = state => state?.common?.industryVerticals || [];
export const getCompanies = state => state?.common?.companies || [];
export const getProjects = state => state?.common?.projects || [];
export const getDocuments = state => state?.common?.documents || [];
export const getRoles = state => state?.common?.roles || [];
export const getOtherTags = state => state?.common?.otherTags || [];
export const getHasOtherTagsLoaded = state => state?.comon?.hasOtherTagsLoaded;
export const getHasProjectsLoaded = state => state?.common?.hasProjectLoaded;
export const getHasDocumentsLoaded = state => state?.common?.hasDocumentLoaded;

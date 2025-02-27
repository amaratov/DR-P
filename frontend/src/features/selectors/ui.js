export const getSelectedUserDetails = state => state?.ui?.selectedUserDetails;
export const getSelectedUseCaseDetails = state => state?.ui?.selectedUseCaseDetails;
export const getSelectedIndustryVerticalDetails = state => state?.ui?.selectedIndustryVerticalDetails;
export const getSelectedMarketingDetails = state => state?.ui?.selectedMarketingDetails;
export const getSelectedReferenceDocDetails = state => state?.ui?.selectedReferenceDocDetails;
export const getSelectedIconDetails = state => state?.ui?.selectedIconDetails;
export const getSelectedSolutionBriefDetails = state => state?.ui?.selectedSolutionBrief;
export const getSelectedDataCentreDetails = state => state?.ui?.selectedDataCentreDetails;
export const getSelectedRegionCloudDetails = state => state?.ui?.selectedRegionCloudDetails;
export const getSelectedRegionCustomerLocationDetails = state => state?.ui?.selectedRegionCustomerLocationDetails;
export const getSelectedRegionApplicationDetails = state => state?.ui?.selectedRegionApplicationDetails;
export const getSelectedDiscoverRegionAddComplianceValues = state => state?.ui?.selectedDiscoverRegionAddComplianceValues;
export const getSelectedDiscoverRegionAddApplicationValues = state => state?.ui?.selectedDiscoverRegionAddApplicationValues;
export const getEditMode = state => state?.ui?.editMode;
export const getDetailsMode = state => state?.ui?.detailsMode;
export const getFilterMode = state => state?.ui?.filterMode;
export const getUploadMode = state => state?.ui?.uploadMode;
export const getPublishMode = state => state?.ui?.publishMode;
export const getDownloadMode = state => state?.ui?.downloadMode;
export const getRecentlyAdded = state => state?.ui?.recentlyAdded;
export const getRecentlyEdited = state => state?.ui?.recentlyEdited;
export const getRecentlyArchived = state => state?.ui?.recentlyArchived;
export const getArchiveMode = state => state?.ui?.archiveMode;
export const getActiveMode = state => state?.ui?.activateMode;
export const getForceTableRefresh = state => state?.ui?.forceTableRefresh;
export const getAddUserMode = state => state?.ui?.addUserMode;
export const getAddUseCaseMode = state => state?.ui?.addUseCaseMode;
export const getAddIndustryVerticalMode = state => state?.ui?.addIndustryVertical;
export const getAddCompanyMode = state => state?.ui?.addCompanyMode;
export const getAddProjectMode = state => state?.ui?.addProjectMode;
export const getAddMarketingMode = state => state?.ui?.addMarketingMode;
export const getAddIconMode = state => state?.ui?.addIconMode;
export const getProjectDetailsMode = state => state?.ui?.projectDetailsMode;
export const getAddComplianceMode = state => state?.ui?.addComplianceMode;
export const getAddDataCenterMode = state => state?.ui?.addDataCenterMode;
export const getAddRegionCloudsMode = state => state?.ui?.addRegionCloudsMode;
export const getAddRegionApplicationsMode = state => state?.ui?.addRegionApplicationsMode;
export const getAddCustomerLocationsMode = state => state?.ui?.addCustomerLocationsMode;
export const getAddRegionPartnershipAndSuppliersMode = state => state?.ui?.addRegionPartnershipAndSuppliersMode;
export const getAddReferenceMode = state => state?.ui?.addReferenceMode;
export const getSelectedCompany = state => state?.ui?.selectedCompany;
export const getSelectedCompanyDetails = state => state?.ui?.selectedCompanyDetails;
export const getSelectedProjectDetails = state => state?.ui?.selectedProjectDetails;
export const getSelectedDetailsFromProject = state => state?.ui?.selectedDetailsFromProject;
export const getRemoveRow = state => state?.ui?.removeRowById;
export const getUploadErrorInfo = state => state?.ui?.uploadErrorInfo;
export const getPublishErrorInfo = state => state?.ui?.publishErrorInfo;
export const getAddProjectBriefcaseEducationalMaterialsMode = state => state?.ui?.addProjectBriefcaseEducationalMaterialsMode;
export const getAddProjectBriefcaseCustomerDocumentsMode = state => state?.ui?.addProjectBriefcaseCustomerDocumentMode;
export const getDiscoverRegionsSetRequirementsMode = state => state?.ui?.discoverRegionsSetRequirementsMode;
export const getFutureStateMode = state => state?.ui?.futureStateMode;
export const getSelectedDiscoverRegionActiveState = state => state?.ui?.selectedDiscoverRegionActiveState;
export const getSelectedFilterFacets = state => state.ui?.selectedFilterFacets;
export const getReProjectDetailRegionTabs = state => state?.ui?.reProjectDetailRegionTabs;
export const refetchCompliance = state => state?.ui?.refetchCompliance;
export const getRefetchPartners = state => state?.ui?.refetchPartners;
export const getDiscoverRegionTabNavTo = state => state?.ui?.discoverRegionTabNavTo;
export const getPageNum = state => state?.ui?.page;
export const getSortOrder = state => state?.ui?.order;
export const getSortOrderBy = state => state?.ui?.orderBy;
export const getPageNumProjectDocuments = state => state?.ui?.pageProjectDocuments;
export const getPageNumCustomerDocPanel = state => state?.ui?.pageCustomerDocPanel;
export const getSortOrderProjectDocuments = state => state?.ui?.orderProjectDocuments;
export const getSortOrderCustomerDocPanel = state => state?.ui?.orderCustomerDocPanel;
export const getSortOrderProjectDocumentsBy = state => state?.ui?.orderProjectDocumentsBy;
export const getSortOrderCustomerDocPanelBy = state => state?.ui?.orderCustomerDocPanelBy;
export const getSortOrderSolBriefsProjectDocuments = state => state?.ui?.orderSolutionBriefs;
export const getSortOrderSolBriefsProjectDocumentsBy = state => state?.ui?.orderSolutionBriefsBy;
export const getPageNumEducationalMaterials = state => state?.ui?.pageEducationalMaterials;
export const getPageNumSolutionBriefs = state => state?.ui?.pageSolutionBriefs;
export const getDiscoverRegionEditNameMode = state => state?.ui?.discoverRegionsEditNameMode;
export const getStartWithFutureState = state => state?.ui?.startWithFutureState;
export const getAdditionalProjects = state => state?.ui?.additionalProjects;
export const getAdditionalProjectBriefs = state => state?.ui?.additionalProjectBriefs;
export const getAdditionalSolutionBriefs = state => state?.ui?.additionalSolutionBriefs;
export const getAllPublishedMarketingFromBriefs = state => state?.ui?.allPublishedMarketing;
export const getAllIcons = state => state?.ui?.allIcons;
export const getAssociatedMarketingRaw = state => state?.ui?.associatedMarketingRaw;
export const getClientPortfolioTab = state => state?.ui?.clientPortfolioTab;
export const getActiveDetail = state => state?.ui?.activeDetail;
export const getActiveOnRamp = state => state?.ui?.activeOnRamp;
export const getActiveProjectSection = state => state?.ui?.activeProjectTab;
export const getDRDataCenters = state => state?.ui?.drDataCenters;
export const getCloudOnRampList = state => state?.ui?.cloudOnRamps;
export const getLocationLatency = state => state?.ui?.locationLatency;
export const getLocationLatencyOnLoad = state => state?.ui?.locationLatencyOnLoad;
export const getLocationDGx = state => state?.ui?.locationDGx;
export const getProjectDetailError = state => state?.ui?.projectDetailError;
export const getProjectDetailFulfilled = state => state?.ui?.projectDetailFulfilled;
export const getOpenAssociatedCompany = state => state?.ui?.openAssociatedCompany;
export const getActiveHoveredDetail = state => state?.ui?.activeHoveredDetail;
export const getToggleFunctionId = state => state?.ui?.toggleFunctionId;

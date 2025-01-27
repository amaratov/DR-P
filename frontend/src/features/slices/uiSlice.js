import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';
import { REGIONS_INNER_TABS, SUB_TABS, TABS } from '../../utils/constants/constants';
import { isEmpty, mergeArraysOfObjWithoutDuplicateProp } from '../../utils/utils';

const initialState = {
  selectedUserDetails: {},
  selectedCompany: {},
  selectedCompanyDetails: {},
  selectedProjectDetails: {},
  selectedDetailsFromProject: [],
  selectedUseCaseDetails: {},
  selectedIndustryVerticalDetails: {},
  selectedMarketingDetails: {},
  selectedReferenceDocDetails: {},
  selectedIconDetails: {},
  selectedProjectBriefcase: {},
  selectedSolutionBrief: {},
  selectedDataCentreDetails: {},
  selectedRegionCloudDetails: {},
  selectedRegionCustomerLocationDetails: {},
  selectedRegionApplicationDetails: {},
  selectedFilterFacets: {
    types: [],
    type: [],
    industryVertical: [],
    useCase: [],
    partners: [],
    technologies: [],
    hub: [],
    otherTags: [],
  },
  editMode: '',
  detailsMode: '',
  filterMode: '',
  uploadMode: '',
  publishMode: '',
  downloadMode: '',
  recentlyAdded: '',
  recentlyEdited: '',
  recentlyArchived: false,
  archiveMode: '',
  activateMode: '',
  forceTableRefresh: '',
  page: 0,
  order: 'asc',
  orderBy: 'name',
  pageProjectDocuments: 0,
  orderProjectDocuments: 'asc',
  orderProjectDocumentsBy: 'docName',
  pageCustomerDocPanel: 0,
  orderCustomerDocPanel: 'asc',
  orderCustomerDocPanelBy: 'docName',
  pageEducationalMaterials: 0,
  orderEducationalMaterials: 'asc',
  orderEducationalMaterialsBy: 'name',
  pageSolutionBriefs: 0,
  orderSolutionBriefs: 'asc',
  orderSolutionBriefsBy: 'originalFilename',
  addUserMode: false,
  addUseCaseMode: false,
  addIndustryVertical: false,
  addCompanyMode: false,
  addMarketingMode: false,
  addIconMode: false,
  addReferenceMode: false,
  addProjectMode: { open: false, companyDetails: {} },
  addProjectBriefcaseEducationalMaterialsMode: false,
  addProjectBriefcaseCustomerDocumentMode: false,
  addComplianceMode: false,
  addDataCenterMode: false,
  addRegionCloudsMode: false,
  addRegionApplicationsMode: false,
  addCustomerLocationsMode: false,
  addRegionPartnershipAndSuppliersMode: '',
  projectDetailsMode: { open: false, project: {} },
  removeRowById: '',
  uploadErrorInfo: { hasError: false, errorMsg: '' },
  publishErrorInfo: { hasError: false, errorMsg: '' },
  discoverRegionsSetRequirementsMode: false,
  futureStateMode: false,
  selectedDiscoverRegionActiveState: {
    regionName: '',
    region: '',
    view: SUB_TABS.INITIAL_REGIONS,
    state: REGIONS_INNER_TABS.CURRENT_STATE,
    isFuture: false,
  },
  selectedAllCompliance: [],
  selectedDiscoverRegionAddApplicationValues: [],
  selectedDiscoverRegionAddPartnershipAndSuppliersValues: [],
  reRenderGrid: false,
  reProjectDetailRegionTabs: false,
  refetchCompliance: false,
  refetchPartners: false,
  discoverRegionTabNavTo: '',
  discoverRegionsEditNameMode: {},
  startWithFutureState: false,
  additionalProjects: [],
  additionalProjectBriefs: [],
  additionalSolutionBriefs: [],
  allPublishedMarketing: [],
  allIcons: [],
  associatedMarketingRaw: [],
  clientPortfolioTab: TABS.ALL_COMPANIES,
  activeDetail: null,
  activeHoveredDetail: null,
  activeOnRamp: null,
  activeProjectTab: '',
  drDataCenters: [],
  cloudOnRamps: [],
  locationLatency: [],
  locationLatencyOnLoad: [],
  locationDGx: [],
  projectDetailError: '',
  projectDetailFulfilled: false,
  openAssociatedCompany: false,
  toggleFunctionId: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedUserDetails: (state, action) => {
      state.selectedUserDetails = action.payload;
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    setSelectedCompanyDetails: (state, action) => {
      state.selectedCompanyDetails = action.payload;
    },
    setSelectedProjectDetails: (state, action) => {
      state.selectedProjectDetails = action.payload;
    },
    setSelectedUseCaseDetails: (state, action) => {
      state.selectedUseCaseDetails = action.payload;
    },
    setSelectedIndustryVerticalDetails: (state, action) => {
      state.selectedIndustryVerticalDetails = action.payload;
    },
    setSelectedMarketingDetails: (state, action) => {
      state.selectedMarketingDetails = action.payload;
    },
    setSelectedReferenceDocDetails: (state, action) => {
      state.selectedReferenceDocDetails = action.payload;
    },
    setSelectedIconDetails: (state, action) => {
      state.selectedIconDetails = action.payload;
    },
    setSelectedProjectBriefcaseDetails: (state, action) => {
      state.selectedProjectBriefcase = action.payload;
    },
    setSelectedSolutionBriefDetails: (state, action) => {
      state.selectedSolutionBrief = action.payload;
    },
    setSelectedDataCentreDetails: (state, action) => {
      state.selectedDataCentreDetails = action.payload;
    },
    setSelectedRegionCloudDetails: (state, action) => {
      state.selectedRegionCloudDetails = action.payload;
    },
    setSelectedRegionCustomerLocationDetails: (state, action) => {
      state.selectedRegionCustomerLocationDetails = action.payload;
    },
    setSelectedRegionApplicationDetails: (state, action) => {
      state.selectedRegionApplicationDetails = action.payload;
    },
    setSelectedDiscoverRegionAddApplicationValues: (state, action) => {
      state.selectedDiscoverRegionAddApplicationValues = action.payload;
    },
    setSelectedAllCompliance: (state, action) => {
      state.selectedAllCompliance = action.payload;
    },
    setSelectedAllDataCentres: (state, action) => {
      state.setSelectedAllDataCentres = action.payload;
    },
    setSelectedDiscoverRegionAddPartnershipAndSuppliersValues: (state, action) => {
      state.selectedDiscoverRegionAddPartnershipAndSuppliersValues = action.payload;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    resetEditMode: state => {
      state.editMode = '';
    },
    setDetailsMode: (state, action) => {
      state.detailsMode = action.payload;
    },
    resetDetailsMode: state => {
      state.detailsMode = '';
    },
    setFilterMode: (state, action) => {
      state.filterMode = action.payload;
    },
    resetFilterMode: state => {
      state.filterMode = '';
    },
    setUploadMode: (state, action) => {
      state.uploadMode = action.payload;
    },
    resetUploadMode: state => {
      state.uploadMode = '';
    },
    setPublishMode: (state, action) => {
      state.publishMode = action.payload;
    },
    resetPublishMode: state => {
      state.publishMode = '';
    },
    setDownloadMode: (state, action) => {
      state.downloadMode = action.payload;
    },
    resetDownloadMode: state => {
      state.downloadMode = '';
    },
    setRecentlyAdded: (state, action) => {
      state.recentlyAdded = action.payload;
    },
    resetRecentlyAdded: state => {
      state.recentlyAdded = '';
    },
    setRecentlyEdited: (state, action) => {
      state.recentlyEdited = action.payload;
    },
    resetRecentlyEdited: state => {
      state.recentlyEdited = '';
    },
    setArchiveMode: (state, action) => {
      state.archiveMode = action.payload;
    },
    resetArchiveMode: state => {
      state.archiveMode = '';
    },
    setRecentlyArchived: state => {
      state.recentlyArchived = true;
    },
    resetRecentlyArchived: state => {
      state.recentlyArchived = false;
    },
    setActivateMode: (state, action) => {
      state.activateMode = action.payload;
    },
    resetActivateMode: state => {
      state.activateMode = '';
    },
    setForceTableRefreshTab: (state, action) => {
      state.forceTableRefresh = action.payload;
    },
    resetForceTableRefreshTab: state => {
      state.forceTableRefresh = '';
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetPage: (state, action) => {
      state.page = 0;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    resetOrder: (state, action) => {
      state.order = 'asc';
    },
    setOrderBy: (state, action) => {
      state.orderBy = action.payload;
    },
    resetOrderBy: (state, action) => {
      state.orderBy = 'name';
    },
    setProjectDocumentsPage: (state, action) => {
      state.pageProjectDocuments = action.payload;
    },
    resetProjectDocumentsPage: (state, action) => {
      state.pageProjectDocuments = 0;
    },
    setOrderProjectDocuments: (state, action) => {
      state.orderProjectDocuments = action.payload;
    },
    resetOrderProjectDocuments: (state, action) => {
      state.orderProjectDocuments = 'asc';
    },
    setOrderProjectDocumentsBy: (state, action) => {
      state.orderProjectDocumentsBy = action.payload;
    },
    resetOrderProjectDocumentsBy: (state, action) => {
      state.orderProjectDocumentsBy = 'docName';
    },
    setCustomerDocPanelPage: (state, action) => {
      state.pageCustomerDocPanel = action.payload;
    },
    resetCustomerDocPanelPage: (state, action) => {
      state.pageCustomerDocPanel = 0;
    },
    setOrderCustomerDocPanel: (state, action) => {
      state.orderCustomerDocPanel = action.payload;
    },
    resetOrderCustomerDocPanel: (state, action) => {
      state.orderCustomerDocPanel = 'asc';
    },
    setOrderCustomerDocPanelBy: (state, action) => {
      state.orderCustomerDocPanelBy = action.payload;
    },
    resetOrderCustomerDocPanelBy: (state, action) => {
      state.orderCustomerDocPanelBy = 'docName';
    },
    setEducationalMaterialsPage: (state, action) => {
      state.pageEducationalMaterials = action.payload;
    },
    resetEducationalMaterialsPage: (state, action) => {
      state.pageEducationalMaterials = 0;
    },
    setOrderEducationalMaterials: (state, action) => {
      state.orderEducationalMaterials = action.payload;
    },
    resetOrderEducationalMaterials: (state, action) => {
      state.orderEducationalMaterials = 'asc';
    },
    setOrderEducationalMaterialsBy: (state, action) => {
      state.orderEducationalMaterialsBy = action.payload;
    },
    resetOrderEducationalMaterialsBy: (state, action) => {
      state.orderEducationalMaterialsBy = 'name';
    },
    setSolutionBriefsPage: (state, action) => {
      state.pageSolutionBriefs = action.payload;
    },
    resetSolutionBriefsPage: (state, action) => {
      state.pageSolutionBriefs = 0;
    },
    setOrderSolutionBriefs: (state, action) => {
      state.orderSolutionBriefs = action.payload;
    },
    resetOrderSolutionBriefs: (state, action) => {
      state.orderSolutionBriefs = 'asc';
    },
    setOrderSolutionBriefsBy: (state, action) => {
      state.orderSolutionBriefsBy = action.payload;
    },
    resetSolutionBriefsBy: (state, action) => {
      state.orderSolutionBriefsBy = 'originalFilename';
    },
    openAddUserMode: state => {
      state.addUserMode = true;
    },
    resetAddUserMode: state => {
      state.addUserMode = false;
    },
    openAddUseCaseMode: state => {
      state.addUseCaseMode = true;
    },
    resetAddUseCaseMode: state => {
      state.addUseCaseMode = false;
    },
    openAddIndustryVerticalMode: state => {
      state.addIndustryVertical = true;
    },
    resetAddIndustryVerticalMode: state => {
      state.addIndustryVertical = false;
    },
    resetEditUseCaseMode: state => {
      state.editMode = false;
    },
    resetEditIndustryVerticalMode: state => {
      state.editMode = false;
    },
    openAddCompanyMode: state => {
      state.addCompanyMode = true;
    },
    resetAddCompanyMode: state => {
      state.addCompanyMode = false;
    },
    openAddMarketingMode: state => {
      state.addMarketingMode = true;
    },
    resetAddMarketingMode: state => {
      state.addMarketingMode = false;
    },
    openAddProjectMode: (state, action) => {
      state.addProjectMode = { open: true, companyDetails: action?.payload || {} };
    },
    resetAddProjectMode: state => {
      state.addProjectMode = { open: false, companyDetails: {} };
    },
    openAddIconMode: state => {
      state.addIconMode = true;
    },
    resetAddIconMode: state => {
      state.addIconMode = false;
    },
    openProjectDetailsMode: (state, action) => {
      state.projectDetailsMode = { open: true, project: action?.payload?.project || {}, company: action?.payload?.company || {} };
    },
    resetProjectDetailsMode: state => {
      state.projectDetailsMode = initialState.projectDetailsMode;
    },
    openAddProjectBriefcaseEducationalMaterialsMode: state => {
      state.addProjectBriefcaseEducationalMaterialsMode = true;
    },
    resetAddProjectBriefcaseEducationalMaterialsMode: state => {
      state.addProjectBriefcaseEducationalMaterialsMode = false;
    },
    openAddProjectBriefcaseCustomerDocumentMode: state => {
      state.addProjectBriefcaseCustomerDocumentMode = true;
    },
    resetAddProjectBriefcaseCustomerDocumentMode: state => {
      state.addProjectBriefcaseCustomerDocumentMode = false;
    },
    openAddComplianceMode: state => {
      state.addComplianceMode = true;
    },
    resetAddComplianceMode: state => {
      state.addComplianceMode = false;
    },
    openAddDataCenterMode: state => {
      state.addDataCenterMode = true;
    },
    resetAddDataCenterMode: state => {
      state.addDataCenterMode = false;
    },
    openAddRegionCloudsMode: state => {
      state.addRegionCloudsMode = true;
    },
    resetAddRegionCloudsMode: state => {
      state.addRegionCloudsMode = false;
    },
    openAddRegionApplicationsMode: state => {
      state.addRegionApplicationsMode = true;
    },
    resetAddRegionApplicationsMode: state => {
      state.addRegionApplicationsMode = false;
    },
    openAddCustomerLocationsMode: state => {
      state.addCustomerLocationsMode = true;
    },
    resetAddCustomerLocationsMode: state => {
      state.addCustomerLocationsMode = false;
    },
    openAddRegionPartnershipAndSuppliersMode: (state, action) => {
      state.addRegionPartnershipAndSuppliersMode = action.payload;
    },
    resetAddRegionPartnershipAndSuppliersMode: state => {
      state.addRegionPartnershipAndSuppliersMode = '';
    },
    openDiscoverRegionsSetRequirementsMode: state => {
      state.discoverRegionsSetRequirementsMode = true;
    },
    resetDiscoverRegionsSetRequirementsMode: state => {
      state.discoverRegionsSetRequirementsMode = false;
    },
    openDiscoverRegionsEditNameMode: (state, action) => {
      state.discoverRegionsEditNameMode = action.payload;
    },
    resetDiscoverRegionsEditNameMode: state => {
      state.discoverRegionsEditNameMode = {};
    },
    openFutureStateMode: state => {
      state.futureStateMode = true;
    },
    resetFutureStateMode: state => {
      state.futureStateMode = false;
    },
    openAddReferenceMode: state => {
      state.addReferenceMode = true;
    },
    resetAddReferenceMode: state => {
      state.addReferenceMode = false;
    },
    removeRow: (state, action) => {
      state.removeRowById = action.payload;
    },
    resetRemoveRow: state => {
      state.removeRowById = '';
    },
    setUploadErrorInfo: (state, action) => {
      state.uploadErrorInfo = {
        hasError: true,
        errorMsg: action?.payload || '',
      };
    },
    resetUploadErrorInfo: state => {
      state.uploadErrorInfo = {
        hasError: false,
        errorMsg: '',
      };
    },
    setPublishErrorInfo: (state, action) => {
      state.publishErrorInfo = {
        hasError: true,
        errorMsg: action?.payload || '',
      };
    },
    resetPublishErrorInfo: state => {
      state.uploadErpublishErrorInfororInfo = {
        hasError: false,
        errorMsg: '',
      };
    },
    setSelectedDiscoverRegionActiveState: (state, action) => {
      state.selectedDiscoverRegionActiveState = {
        regionName: action?.payload?.regionName || '',
        region: action?.payload?.region || '',
        view: action?.payload?.view || SUB_TABS.INITIAL_REGIONS,
        state: action?.payload?.state || '',
        isFuture: action?.payload?.isFuture || false,
        isSaveChangesActive: action?.payload?.isSaveChangesActive || false,
      };
    },
    resetSelectedDiscoverRegionActiveState: (state, action) => {
      state.selectedDiscoverRegionActiveState = {
        regionName: '',
        region: '',
        view: '',
        state: REGIONS_INNER_TABS.CURRENT_STATE,
        isFuture: false,
        isSaveChangesActive: false,
      };
    },
    setSelectedFilterFacets: (state, action) => {
      state.selectedFilterFacets = action.payload;
    },
    resetSelectedFilterFacets: state => {
      state.selectedFilterFacets = {
        type: [],
        types: [],
        industryVertical: [],
        useCase: [],
        partners: [],
        technologies: [],
        hub: [],
        otherTags: [],
      };
    },
    refreshProjectDetailRegionTabs: state => {
      state.reProjectDetailRegionTabs = !state.reProjectDetailRegionTabs;
    },
    setRefetchCompliance: (state, action) => {
      state.refetchCompliance = action.payload;
    },
    resetRefetchCompliance: state => {
      state.refetchCompliance = false;
    },
    setActiveDetail: (state, action) => {
      state.activeDetail = action.payload;
    },
    setActiveOnRamp: (state, action) => {
      state.activeOnRamp = action.payload;
    },
    setActiveHoveredDetail: (state, action) => {
      state.activeHoveredDetail = action.payload;
    },
    setActiveProjectTab: (state, action) => {
      state.activeProjectTab = action.payload;
    },
    setDiscoverRegionTabNavTo: (state, action) => {
      state.discoverRegionTabNavTo = action.payload;
    },
    resetDiscoverRegionTabNavTo: state => {
      state.discoverRegionTabNavTo = '';
    },
    setRefetchPartners: (state, action) => {
      state.refetchPartners = true;
    },
    resetRefetchPartners: state => {
      state.refetchPartners = false;
    },
    setStartWithFutureState: (state, action) => {
      state.startWithFutureState = action.payload;
    },
    setAdditionalProjects: (state, action) => {
      state.additionalProjects = action.payload;
    },
    resetAdditionalProjects: (state, action) => {
      state.additionalProjects = [];
    },
    setAdditionalProjectBriefs: (state, action) => {
      state.additionalProjectBriefs = action.payload;
    },
    resetAdditionalProjectBriefs: (state, action) => {
      state.additionalProjectBriefs = [];
    },
    setAdditionalSolBriefs: (state, action) => {
      state.additionalSolutionBriefs = action.payload;
    },
    resetAdditionalSolBriefs: (state, action) => {
      state.additionalSolutionBriefs = [];
    },
    setAllPublishedMarketing: (state, action) => {
      state.allPublishedMarketing = action.payload;
    },
    resetAllPublishedMarketing: (state, action) => {
      state.allPublishedMarketing = [];
    },
    setAllIcons: (state, action) => {
      state.allIcons = action.payload;
    },
    resetAllIcons: (state, action) => {
      state.allIcons = action.payload;
    },
    setAssociatedMarketingRaw: (state, action) => {
      state.associatedMarketingRaw = action.payload;
    },
    resetAssociatedMarketingRaw: (state, action) => {
      state.associatedMarketingRaw = [];
    },
    setClientPortfolioTab: (state, action) => {
      state.clientPortfolioTab = action.payload; // TODO have list to filter valid values?
    },
    setDrDataCenters: (state, action) => {
      state.drDataCenters = action.payload;
    },
    clearProjectDetailError: state => {
      state.projectDetailError = '';
    },
    setProjectDetailFulfilled: (state, action) => {
      state.projectDetailFulfilled = action.payload;
    },
    setOpenAssociatedCompany: (state, action) => {
      state.openAssociatedCompany = action.payload;
    },
    toggleLocationLatencyOnLoad: (state, action) => {
      const found = state.locationLatencyOnLoad?.find(l => {
        if (l?.isOnRampOrigin && l?.isOnRampEnd) {
          return (
            l?.originId === action.payload?.originId &&
            l?.onRampOriginParentId === action.payload?.onRampOriginParentId &&
            l?.endpointId === action.payload?.endpointId &&
            l?.onRampEndParentId === action.payload?.onRampEndParentId
          );
        }
        if (!l?.isOnRampOrigin && l?.isOnRampEnd) {
          return (
            l?.originId === action.payload.originId &&
            l?.endpointId === action.payload?.endpointId &&
            l?.onRampEndParentId === action.payload?.onRampEndParentId
          );
        }
        if (l?.isOnRampOrigin && !l?.isOnRampEnd) {
          return (
            l?.originId === action.payload?.originId &&
            l?.onRampOriginParentId === action.payload?.onRampOriginParentId &&
            l.endpointId === action.payload.endpointId
          );
        }
        return l?.originId === action.payload?.originId && l?.endpointId === action.payload?.endpointId;
      });
      if (!found) {
        state.locationLatencyOnLoad.push(action.payload);
      } else {
        state.locationLatencyOnLoad = state.locationLatencyOnLoad.filter(l => {
          if (l?.isOnRampOrigin && l?.isOnRampEnd) {
            return (
              l?.originId !== action.payload?.originId &&
              l.onRampOriginParentId !== action.payload?.onRampOriginParentId &&
              l.endpointId !== action.payload?.endpointId &&
              l.onRampEndParentId !== action.payload?.onRampEndParentId
            );
          }
          if (!l?.isOnRampOrigin && l?.isOnRampEnd) {
            return (
              l?.originId !== action.payload?.originId &&
              l.endpointId !== action.payload?.endpointId &&
              l.onRampEndParentId !== action.payload?.onRampEndParentId
            );
          }
          if (l?.isOnRampOrigin && !l?.isOnRampEnd) {
            return (
              l?.originId !== action.payload?.originId &&
              l.onRampOriginParentId !== action.payload?.onRampOriginParentId &&
              l?.endpointId !== action.payload?.endpointId
            );
          }
          return l.originId !== action.payload.originId && l.endpointId !== action.payload.endpointId;
        });
      }
    },
    resetLocationLatencyOnLoad: state => {
      state.locationLatencyOnLoad = [];
    },
    setToggleFunctionId: (state, action) => {
      state.toggleFunctionId = action?.payload;
    },
    resetToggleFunctionId: state => {
      state.toggleFunctionId = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.updateUser.fulfilled, state => {
        state.editMode = '';
        state.selectedUserDetails = {};
      })
      .addCase(backendService.createUser.fulfilled, state => {
        state.addUserMode = false;
      })
      .addCase(backendService.createCompany.fulfilled, (state, action) => {
        state.addCompanyMode = false;
        state.recentlyAdded = action?.payload?.company?.id || '';
      })
      .addCase(backendService.updateCompany.fulfilled, (state, action) => {
        state.editMode = '';
        state.selectedCompanyDetails = {};
        state.recentlyEdited = action?.payload?.company?.id || '';
      })
      .addCase(backendService.createProject.fulfilled, state => {
        state.addProjectMode = { open: false, companyDetails: {} };
      })
      .addCase(backendService.updateProject.fulfilled, state => {
        state.editMode = '';
        state.selectedProjectDetails = {};
      })
      .addCase(backendService.createUseCase.fulfilled, (state, action) => {
        state.addUseCaseMode = false;
        state.recentlyAdded = action?.payload?.usecase?.id || '';
      })
      .addCase(backendService.createMarketing.fulfilled, (state, action) => {
        state.uploadErrorInfo = { hasError: false, errorMsg: '' };
      })
      .addCase(backendService.createMarketing.rejected, (state, action) => {
        state.uploadErrorInfo = { hasError: true, errorMsg: action.payload?.error?.errors || '' };
      })
      .addCase(backendService.createIcon.fulfilled, (state, action) => {
        state.addIconMode = false;
        state.recentlyAdded = action?.payload?.icon?.id || '';
        state.uploadErrorInfo = { hasError: false, errorMsg: '' };
      })
      .addCase(backendService.createIcon.rejected, (state, action) => {
        const msg = action.payload?.error?.errors?.[0]?.message?.replace('iconName', 'Icon Name') || '';
        state.uploadErrorInfo = { hasError: true, errorMsg: msg };
      })
      .addCase(backendService.createReferenceArchitecture.fulfilled, (state, action) => {
        state.addReferenceMode = false;
        state.recentlyAdded = action?.payload?.document?.id || '';
        state.uploadErrorInfo = { hasError: false, errorMsg: '' };
      })
      .addCase(backendService.createReferenceArchitecture.rejected, (state, action) => {
        state.uploadErrorInfo = { hasError: true, errorMsg: action.payload?.error?.errors || '' };
      })
      .addCase(backendService.createCustomerDocument.fulfilled, state => {
        state.uploadErrorInfo = { hasError: false, errorMsg: '' };
      })
      .addCase(backendService.createCustomerDocument.rejected, (state, action) => {
        const msg = action.payload?.error?.errors?.[0]?.message || '';
        state.uploadErrorInfo = { hasError: true, errorMsg: msg };
      })
      .addCase(backendService.updateUseCase.fulfilled, (state, action) => {
        state.editMode = '';
        state.selectedUseCaseDetails = {};
        state.recentlyEdited = action?.payload?.usecase?.id || '';
      })
      .addCase(backendService.getCompanyById.fulfilled, (state, action) => {
        state.selectedCompanyDetails = action.payload?.company;
      })
      .addCase(backendService.getUserById.fulfilled, (state, action) => {
        state.selectedUserDetails = action.payload?.user;
      })
      .addCase(backendService.getProjectById.fulfilled, (state, action) => {
        state.selectedProjectDetails = action.payload?.project;
      })
      .addCase(backendService.getProjectDetails.fulfilled, (state, action) => {
        state.selectedDetailsFromProject = action.payload?.details;
      })
      .addCase(backendService.updateProjectDetails.fulfilled, (state, action) => {
        state.projectDetailError = '';
        state.projectDetailFulfilled = true;
        const index = state.selectedDetailsFromProject?.findIndex(detail => detail.id === action.payload?.detail.id);
        state.selectedDetailsFromProject[index] = action.payload?.detail;
      })
      .addCase(backendService.updateProjectDetails.rejected, (state, action) => {
        state.projectDetailError = action?.payload?.error;
      })
      .addCase(backendService.publishSolutionBriefcase.fulfilled, (state, action) => {
        state.selectedSolutionBrief = {};
        state.publishMode = '';
      })
      .addCase(backendService.createSolutionBriefcase.fulfilled, (state, action) => {
        state.uploadMode = '';
      })
      .addCase(backendService.updateSolutionBriefcase.fulfilled, (state, action) => {
        state.editMode = '';
        state.selectedSolutionBrief = {};
      })
      .addCase(backendService.detachIcon.fulfilled, state => {
        state.selectedIconDetails = {
          ...state.selectedIconDetails,
          storageLocation: null,
        };
      })
      .addCase(backendService.getComplianceByName.fulfilled, (state, action) => {
        state.selectedIconDetails = action.payload?.icons?.[0] || {};
      })
      .addCase(backendService.getIconByName.fulfilled, (state, action) => {
        state.selectedIconDetails = action.payload?.icons?.[0] || {};
      })
      .addCase(backendService.newProjectDetail.fulfilled, (state, action) => {
        state.projectDetailError = '';
        state.projectDetailFulfilled = true;
        state.selectedDetailsFromProject.push(action.payload);
      })
      .addCase(backendService.deleteProjectDetail.fulfilled, (state, _) => {
        state.projectDetailError = '';
        state.projectDetailFulfilled = true;
      })
      .addCase(backendService.newProjectDetail.rejected, (state, action) => {
        state.projectDetailError = action?.payload;
      })
      .addCase(backendService.getDRLocations.fulfilled, (state, action) => {
        state.drDataCenters = action.payload;
      })
      .addCase(backendService.getCloudOnRamps.fulfilled, (state, action) => {
        state.cloudOnRamps = action.payload;
      })
      .addCase(backendService.getLocationLatency.fulfilled, (state, action) => {
        const validResult = !isEmpty(action.payload?.latency);
        if (validResult) {
          const index = state.locationLatency.findIndex(
            l =>
              l.addressA?.formatted_address === action.payload?.addressA?.formatted_address &&
              l.addressZ?.formatted_address === action.payload?.addressZ?.formatted_address
          );
          if (index !== -1) {
            state.locationLatency[index] = action.payload;
          } else {
            state.locationLatency.push(action.payload);
          }
        }
        state.locationLatencyOnLoad = state.locationLatencyOnLoad.filter(l => {
          if (l?.isOnRampOrigin && l?.isOnRampEnd) {
            return (
              l?.originId !== action.payload?.originId &&
              l.onRampOriginParentId !== action.payload?.onRampOriginParentId &&
              l.endpointId !== action.payload?.endpointId &&
              l.onRampEndParentId !== action.payload?.onRampEndParentId
            );
          }
          if (!l?.isOnRampOrigin && l?.isOnRampEnd) {
            return (
              l?.originId !== action.payload?.originId &&
              l.endpointId !== action.payload?.endpointId &&
              l.onRampEndParentId !== action.payload?.onRampEndParentId
            );
          }
          if (l?.isOnRampOrigin && !l?.isOnRampEnd) {
            return (
              l?.originId !== action.payload?.originId &&
              l.onRampOriginParentId !== action.payload?.onRampOriginParentId &&
              l?.endpointId !== action.payload?.endpointId
            );
          }
          return l.originId !== action.payload.originId && l.endpointId !== action.payload.endpointId;
        });
      })
      .addCase(backendService.getLocationDGx.fulfilled, (state, action) => {
        const copy = state.locationDGx;
        state.locationDGx = mergeArraysOfObjWithoutDuplicateProp(copy, action.payload, 'dgx_city');
      });
  },
});

export const {
  setSelectedUserDetails,
  setSelectedCompany,
  setSelectedCompanyDetails,
  setSelectedProjectDetails,
  setSelectedUseCaseDetails,
  setSelectedIndustryVerticalDetails,
  setSelectedMarketingDetails,
  setSelectedReferenceDocDetails,
  setSelectedIconDetails,
  setSelectedProjectBriefcaseDetails,
  setSelectedSolutionBriefDetails,
  setSelectedDataCentreDetails,
  setSelectedRegionCloudDetails,
  setSelectedRegionCustomerLocationDetails,
  setSelectedRegionApplicationDetails,
  setSelectedDiscoverRegionAddApplicationValues,
  setSelectedAllCompliance,
  setSelectedAllDataCentres,
  setSelectedDiscoverRegionAddPartnershipAndSuppliersValues,
  setEditMode,
  resetEditMode,
  setDetailsMode,
  resetDetailsMode,
  setFilterMode,
  resetFilterMode,
  setUploadMode,
  resetUploadMode,
  setPublishMode,
  resetPublishMode,
  setDownloadMode,
  resetDownloadMode,
  setRecentlyAdded,
  resetRecentlyAdded,
  setRecentlyEdited,
  resetRecentlyEdited,
  setRecentlyArchived,
  resetRecentlyArchived,
  setArchiveMode,
  resetArchiveMode,
  setActivateMode,
  resetActivateMode,
  setForceTableRefreshTab,
  resetForceTableRefreshTab,
  setPage,
  resetPage,
  setOrder,
  resetOrder,
  setOrderBy,
  resetOrderBy,
  setProjectDocumentsPage,
  resetProjectDocumentsPage,
  setOrderProjectDocuments,
  resetOrderProjectDocuments,
  setOrderProjectDocumentsBy,
  resetOrderProjectDocumentsBy,
  setCustomerDocPanelPage,
  resetCustomerDocPanelPage,
  setOrderCustomerDocPanel,
  resetOrderCustomerDocPanel,
  setOrderCustomerDocPanelBy,
  resetOrderCustomerDocPanelBy,
  setEducationalMaterialsPage,
  resetEducationalMaterialsPage,
  setOrderEducationalMaterials,
  resetOrderEducationalMaterials,
  setOrderEducationalMaterialsBy,
  resetOrderEducationalMaterialsBy,
  setSolutionBriefsPage,
  resetSolutionBriefsPage,
  setOrderSolutionBriefs,
  resetOrderSolutionBriefs,
  setOrderSolutionBriefsBy,
  resetSolutionBriefsBy,
  openAddUserMode,
  resetAddUserMode,
  openAddUseCaseMode,
  openAddIndustryVerticalMode,
  resetAddIndustryVerticalMode,
  resetAddUseCaseMode,
  resetEditUseCaseMode,
  resetEditIndustryVerticalMode,
  openAddCompanyMode,
  resetAddCompanyMode,
  openAddMarketingMode,
  resetAddMarketingMode,
  openAddProjectMode,
  resetAddProjectMode,
  openAddIconMode,
  resetAddIconMode,
  openProjectDetailsMode,
  resetProjectDetailsMode,
  openAddProjectBriefcaseEducationalMaterialsMode,
  resetAddProjectBriefcaseEducationalMaterialsMode,
  openAddProjectBriefcaseCustomerDocumentMode,
  resetAddProjectBriefcaseCustomerDocumentMode,
  openAddComplianceMode,
  resetAddComplianceMode,
  openAddDataCenterMode,
  resetAddDataCenterMode,
  openAddRegionCloudsMode,
  resetAddRegionCloudsMode,
  openAddCustomerLocationsMode,
  resetAddCustomerLocationsMode,
  openAddRegionApplicationsMode,
  resetAddRegionApplicationsMode,
  openAddRegionPartnershipAndSuppliersMode,
  resetAddRegionPartnershipAndSuppliersMode,
  openDiscoverRegionsSetRequirementsMode,
  resetDiscoverRegionsSetRequirementsMode,
  openFutureStateMode,
  resetFutureStateMode,
  openAddReferenceMode,
  resetAddReferenceMode,
  removeRow,
  resetRemoveRow,
  setUploadErrorInfo,
  resetUploadErrorInfo,
  setPublishErrorInfo,
  resetPublishErrorInfo,
  setSelectedDiscoverRegionActiveState,
  resetSelectedDiscoverRegionActiveState,
  setSelectedFilterFacets,
  resetSelectedFilterFacets,
  refreshProjectDetailRegionTabs,
  setRefetchCompliance,
  resetRefetchCompliance,
  setDiscoverRegionTabNavTo,
  resetDiscoverRegionTabNavTo,
  setRefetchPartners,
  resetRefetchPartners,
  openDiscoverRegionsEditNameMode,
  resetDiscoverRegionsEditNameMode,
  setStartWithFutureState,
  setAdditionalProjects,
  resetAdditionalProjects,
  setAdditionalProjectBriefs,
  resetAdditionalProjectBriefs,
  setAdditionalSolBriefs,
  resetAdditionalSolBriefs,
  setAllPublishedMarketing,
  resetAllPublishedMarketing,
  setAllIcons,
  resetAllIcons,
  setAssociatedMarketingRaw,
  resetAssociatedMarketingRaw,
  setClientPortfolioTab,
  setActiveDetail,
  setActiveOnRamp,
  setActiveHoveredDetail,
  setActiveProjectTab,
  clearProjectDetailError,
  setProjectDetailFulfilled,
  setOpenAssociatedCompany,
  toggleLocationLatencyOnLoad,
  resetLocationLatencyOnLoad,
  setToggleFunctionId,
  resetToggleFunctionId,
} = uiSlice.actions;

export default uiSlice.reducer;

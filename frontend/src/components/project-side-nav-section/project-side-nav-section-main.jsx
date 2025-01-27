import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {
  ProjectSideNavContentHeader,
  ProjectSideNavContentHeaderText,
  ProjectBriefcaseSubHeaderText,
  ProjectSideNavContentMain,
  ProjectSideNavContentSection,
  ProjectSideNavContentSectionTabPanel,
  ProjectSideNavContentSectionTabs,
  ProjectSideNavExitIcon,
  ProjectSideNavIcon,
  ProjectSideNavLogoIcon,
  ProjectSideNavMainWrapper,
  ProjectSideNavPanel,
  ProjectSideNavContentHeaderButtonContainer,
} from './project-side-nav-section-main-styled';
import SideNavLogo from '../../images/Digital_Realty_Logo_Simple.svg';
import DiscoverActiveIcon from '../../images/model-side-panel/nav_discover_active.svg';
import DiscoverDefaultIcon from '../../images/model-side-panel/nav_discover_default.svg';
import DiscoverDisabledIcon from '../../images/model-side-panel/nav_discover_disabled.svg';
import ModelActiveIcon from '../../images/model-side-panel/nav_model_active.svg';
import ModelDefaultIcon from '../../images/model-side-panel/nav_model_default.svg';
import ModelDisabledIcon from '../../images/model-side-panel/nav_model_disabled.svg';
import BriefcaseActiveIcon from '../../images/model-side-panel/nav_briefcase_active.svg';
import BriefcaseDefaultIcon from '../../images/model-side-panel/nav_briefcase_default.svg';
import BriefcaseDisabledIcon from '../../images/model-side-panel/nav_briefcase_disabled.svg';
import ExitActiveIcon from '../../images/model-side-panel/nav_exit_active.svg';
import ExitDefaultIcon from '../../images/model-side-panel/nav_exit_default.svg';
import SolBriefActiveIcon from '../../images/model-side-panel/nav_solbrief_active.svg';
import SolBriefDefaultIcon from '../../images/model-side-panel/nav_solbrief_default.svg';
import SolBriefDisabledIcon from '../../images/model-side-panel/nav_solbrief_disabled.svg';
import LibraryActiveIcon from '../../images/model-side-panel/nav_library_active.svg';
import LibraryDefaultIcon from '../../images/model-side-panel/nav_library_default.svg';
import LibraryDisabledIcon from '../../images/model-side-panel/nav_library_disabled.svg';
import { TABS, BUTTON_ICON, BUTTON_STYLE, EDIT_MODE, AllRoles, PATH_NAME, DISCOVER_REGION_FIELDS, FEATURE_CONFIG } from '../../utils/constants/constants';
import { DRDivider } from '../app/app-styled';
import { TabItem, TabsWrapper } from '../tabs/tab-styled';
import { a11yProps, getHumanReadableFileSize, getLatestVersionForSolutionBrief, getProjectInitialLetter, isEmpty } from '../../utils/utils';
import TabPanel from '../tabs/tab-panel';
import DiscoverProjectDetails from './discover/discover-project-detail/discover-project-details';
import DiscoverRegionSection from './discover/discover-regions/discover-region-section';
import {
  setSelectedProjectDetails,
  openAddProjectBriefcaseEducationalMaterialsMode,
  setUploadMode,
  setDownloadMode,
  setActiveProjectTab,
  resetSolutionBriefsPage,
  resetEducationalMaterialsPage,
  resetProjectDocumentsPage,
  setAdditionalSolBriefs,
  setFilterMode,
  openAddProjectBriefcaseCustomerDocumentMode,
  resetPage,
  resetOrder,
  resetOrderBy,
  resetUploadErrorInfo,
} from '../../features/slices/uiSlice';
import CustomButton from '../form-elements/custom-button';
import Model from './model/model';
import ProjectBriefcaseList from './project-briefcase/project-briefcase-list';
import MarketingMaterialsPanel from './project-briefcase/marketing-materials-panel/marketing-materials-panel';
import SolutionBriefList from './solution-brief/solution-brief-list';
import UploadSolutionBrief from './solution-brief/upload-solution-brief';
import DownloadSolutionBrief from './solution-brief/download-solution-brief';
import { getWhoAmI } from '../../features/selectors';
import {
  getSelectedProjectDetails,
  getEditMode,
  getActiveProjectSection,
  getAdditionalSolutionBriefs,
  getSelectedDetailsFromProject,
} from '../../features/selectors/ui';
import { backendService } from '../../services/backend';
import { getCurrentProjectBriefcase } from '../../features/selectors/projectBriefcase';
import PublishSolutionBrief from './solution-brief/publish-solution-brief';
import { getCurrentSolutionBriefs, getRecentlyCreatedSolutionBrief, getTriggerDownloadBriefState } from '../../features/selectors/solutionBrief';
import EditSolutionBrief from './solution-brief/edit-solution-brief';
import EducationalMaterialsList from './project-briefcase/educational-materials-list';
import SolutionBriefsProjectBriefcaseList from './project-briefcase/solution-briefs-project-briefcase-list';
import SideNavLibrary from './library/library';
import MarketingFilterPanel from './project-briefcase/marketing-materials-panel/marketing-filter-panel';
import CustomerDocumentsPanel from './project-briefcase/customer-documents-panel/customer-documents-panel';
import PublishProjectBriefcase from './project-briefcase/publish-project-briefcase';
import { getAllConnections } from '../../features/selectors/connection';

function ProjectSideNavSectionMain({ onLoadTab, isRegion, isConnect }) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // navigate
  const navigate = useNavigate();

  // selector
  const whoami = useSelector(getWhoAmI);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const currentProjectBriefCase = useSelector(getCurrentProjectBriefcase);
  const currentSolutionBriefCase = useSelector(getCurrentSolutionBriefs);
  const solutionBriefs = useSelector(getAdditionalSolutionBriefs);
  const recentCreatedBrief = useSelector(getRecentlyCreatedSolutionBrief);
  const triggerDownload = useSelector(getTriggerDownloadBriefState);
  const editMode = useSelector(getEditMode);
  const activeProjectSection = useSelector(getActiveProjectSection);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const allConnections = useSelector(getAllConnections);

  // state
  const [activeTabLoad, setActiveTab] = useState(isRegion ? TABS.REGIONS : TABS.PROJECT_DETAILS);
  const [openDownload, setOpenDownload] = useState(false);
  const [openPublishProjectBriefcase, setOpenPublishProjectBriefcase] = useState(false);
  const [isPublishingProjectBreifcase, setIsPublishingProjectBreifcase] = useState(false);
  const [isFinishedProjectBreifcase, setIsFinishedProjectBreifcase] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingStart, setIsDownloadingStart] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [highLightIcon, setHighlightIcon] = useState(null);

  // memo
  const isFilterVisible = useMemo(() => {
    return currentProjectBriefCase?.associatedMarketing?.length > 0;
  }, [currentProjectBriefCase]);

  const activeSection = useMemo(() => {
    if (activeProjectSection === '') {
      return onLoadTab;
    }
    if (activeProjectSection !== onLoadTab) {
      window.location.reload();
    }
    return activeProjectSection;
  }, [activeProjectSection, onLoadTab]);

  const activeTab = useMemo(() => {
    if (activeSection === TABS.DISCOVER) {
      const regionValue = isRegion ? TABS.REGIONS : TABS.PROJECT_DETAILS;
      if (activeTabLoad !== regionValue) {
        window.location.reload();
      }
    }
    return activeTabLoad;
  }, [activeTabLoad, isRegion, activeSection]);

  const allRegionsList = useMemo(() => {
    return detailsFromSelectedProject?.filter(x => x?.type === 'regions');
  }, [detailsFromSelectedProject]);

  // const
  const useRole = whoami?.role?.name?.toLowerCase() || '';
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(useRole);
  const canViewAllMarketing = useRole === AllRoles.ADMIN || useRole === AllRoles.SOLUTIONS_ARCHITECT || useRole === AllRoles.MARKETING;
  const cannotViewLibrary = useRole !== AllRoles.ADMIN && useRole !== AllRoles.SOLUTIONS_ARCHITECT;
  const showEditSolutionBriefMode = activeSection === TABS.SOLUTION_BRIEF && editMode === EDIT_MODE.EDIT_SOLUTION_BRIEF && isAdminOrSA;
  const isMarketing = whoami?.role?.name?.toLowerCase() === AllRoles.MARKETING;
  // Region tab label was "Regions" but going to have "Project Details" as per requested from BA
  const reginTabLabel = 'Project Details';
  // "DR-696 description: For Entering the Model they should have at least on on the offices/clouds or datacenters in discovery"
  const validArr = [DISCOVER_REGION_FIELDS.DATA_CENTRES, DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS, DISCOVER_REGION_FIELDS.CLOUDS];
  const modelHasDataToShow = detailsFromSelectedProject?.some(d => validArr.includes(d?.type));
  // "DR-696 Briefcase(solution brief) also should be disabled if user did not complete connections"
  const hasNoConnectionsYet = isEmpty(allConnections);
  // "DR-696 Solution brief icon should be hidden for all the users except SAs and Admins."

  useEffect(() => {}, [activeSection, getActiveProjectSection]);

  // func
  const renderTabIcon = useCallback(
    tabName => {
      const showHighLight = highLightIcon === tabName;
      const isActive = activeSection === tabName;
      if (tabName === TABS.DISCOVER) {
        // probably not gonna have a case where discover is disabled
        // if (disabled) {
        //   return DiscoverDisabledIcon;
        // }
        if (isActive || showHighLight) {
          return DiscoverActiveIcon;
        }
        return DiscoverDefaultIcon;
      }
      if (tabName === TABS.MODEL) {
        if (!modelHasDataToShow) {
          return ModelDisabledIcon;
        }
        if (isActive || showHighLight) {
          return ModelActiveIcon;
        }
        return ModelDefaultIcon;
      }
      if (tabName === TABS.PROJECT_BRIEFCASE) {
        if (isActive || showHighLight) {
          return BriefcaseActiveIcon;
        }
        return BriefcaseDefaultIcon;
      }
      if (tabName === TABS.SOLUTION_BRIEF) {
        if (hasNoConnectionsYet || !isAdminOrSA) {
          return SolBriefDisabledIcon;
        }
        if (isActive || showHighLight) {
          return SolBriefActiveIcon;
        }
        return SolBriefDefaultIcon;
      }
      if (tabName === TABS.LIBRARY) {
        // if (disabled) {
        //   return LibraryDisabledIcon;
        // }
        if (isActive || showHighLight) {
          return LibraryActiveIcon;
        }
        return LibraryDefaultIcon;
      }
      return highLightIcon === 'exit' ? ExitActiveIcon : ExitDefaultIcon;
    },
    [activeSection, highLightIcon, modelHasDataToShow]
  );

  const handleIconClick = val => {
    dispatch(setActiveProjectTab(val));
    dispatch(resetUploadErrorInfo()); // Project Summary doesn't clear error message on navigate. Do it here.
    const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
    if (val === TABS.DISCOVER) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}`);
    }
    if (val === TABS.MODEL) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}`);
    }
    if (val === TABS.PROJECT_BRIEFCASE) {
      dispatch(resetPage());
      dispatch(resetOrder());
      dispatch(resetOrderBy());
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.PROJECT_BRIEFCASE}`);
    }
    if (val === TABS.SOLUTION_BRIEF && isAdminOrSA) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.SOLUTION_BRIEFCASE}`);
    }
    if (val === TABS.LIBRARY) {
      dispatch(resetPage());
      dispatch(resetOrder());
      dispatch(resetOrderBy());
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.LIBRARY}`);
    }
    dispatch(setActiveProjectTab(val));
  };

  const handleChange = (event, newVal) => {
    setActiveTab(newVal);
    dispatch(resetSolutionBriefsPage());
    dispatch(resetEducationalMaterialsPage());
    dispatch(resetProjectDocumentsPage());
    dispatch(resetUploadErrorInfo()); // Project Summary doesn't clear error message on navigate. Do it here.
    const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
    if (newVal === TABS.REGIONS) {
      if (allRegionsList.length === 0) {
        navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.PROJECT_MODELER_REGION}`);
      } else {
        const firstHalf = `${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.PROJECT_MODELER_REGION}/${routeParams?.regionId || allRegionsList[0]?.id}`;
        const secondHalf = routeParams?.regionStateTab ? `/${routeParams?.regionStateTab}` : PATH_NAME.REGION_STATE_TABS.COMPLIANCE;
        navigate(firstHalf + secondHalf);
      }
    } else {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}`);
    }
  };

  const handleUploadSelect = useCallback(() => {
    if (activeSection === TABS.SOLUTION_BRIEF) {
      dispatch(setUploadMode(TABS.SOLUTION_BRIEF));
    }
  }, [dispatch, activeSection]);

  const handleAddProjectBriefcaseClick = useCallback(() => {
    dispatch(openAddProjectBriefcaseEducationalMaterialsMode());
  }, [dispatch]);

  const handleAddProjectDocumentClick = useCallback(() => {
    dispatch(openAddProjectBriefcaseCustomerDocumentMode());
  }, [dispatch]);

  const handleAddSolutionBriefInProjectBriefClick = useCallback(() => {
    if (activeSection === TABS.PROJECT_BRIEFCASE) {
      dispatch(setUploadMode(TABS.SOLUTION_BRIEF));
    }
  }, [dispatch, activeSection]);

  const handleAllSolutionBriefRetrieval = useCallback(
    async params => {
      try {
        const initialValues = await dispatch(backendService.getSolutionBriefcaseByProjectId(params));
        let solutionBriefValuesToRetrieve = initialValues?.payload?.solutionBriefcases || [];
        if (initialValues?.payload?.numPages > 1) {
          /* eslint-disable no-await-in-loop */
          for (let x = 1; x < initialValues?.payload?.numPages; x += 1) {
            params.page = x;
            const additionalValues = await dispatch(backendService.getSolutionBriefcaseByProjectId(params));
            const arrayValue = additionalValues?.payload?.solutionBriefcases || [];
            solutionBriefValuesToRetrieve = [...solutionBriefValuesToRetrieve, ...arrayValue];
          }
        }
        await dispatch(setAdditionalSolBriefs([...solutionBriefValuesToRetrieve]));
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch]
  );

  const handleAddMarketings = useCallback(
    listOfValues => {
      const currentAssociatedMarketing = currentProjectBriefCase?.associatedMarketing || [];
      const marketingToBeAdded = listOfValues.map(el => ({
        id: el.id,
        addedBy: {
          id: whoami?.id || null,
          firstName: whoami?.firstName || '',
          lastName: whoami?.lastName || '',
        },
        addedDate: new Date().toISOString(),
      }));
      const newMarketingSet = [...new Set([...currentAssociatedMarketing, ...marketingToBeAdded])];
      if (currentProjectBriefCase?.id) {
        const UpdatedProjectBriefcase = {
          ...currentProjectBriefCase,
          associatedMarketing: newMarketingSet,
        };
        dispatch(backendService.updateProjectBriefcase(UpdatedProjectBriefcase));
      } else {
        const newProjectBriefcase = {
          projectId: currentProjectInfo?.id || routeParams?.id || null,
          associatedMarketing: newMarketingSet,
          publishedMarketing: [],
        };
        dispatch(backendService.createProjectBriefcase(newProjectBriefcase));
      }
    },
    [currentProjectBriefCase, currentProjectInfo, routeParams, whoami, dispatch]
  );

  const handleAddCustomerDocument = useCallback(
    listOfValues => {
      const currentAssociatedCustomerDocument = currentProjectBriefCase?.associatedDocument || [];
      const customerDocumentToBeAdded = listOfValues.map(el => ({
        id: el.id,
        addedBy: {
          id: whoami?.id || null,
          firstName: whoami?.firstName || '',
          lastName: whoami?.lastName || '',
        },
        addedDate: new Date().toISOString(),
        fileSize: el.fileSize || '',
        createdAt: el.createdAt || '',
        createdBy: el.createdBy || '',
        docName: el.docName || '',
      }));
      const newCustomerDocumentSet = [...new Set([...currentAssociatedCustomerDocument, ...customerDocumentToBeAdded])];
      if (currentProjectBriefCase?.id) {
        const UpdatedProjectBriefcase = {
          ...currentProjectBriefCase,
          associatedDocument: newCustomerDocumentSet,
        };
        dispatch(backendService.updateProjectBriefcase(UpdatedProjectBriefcase));
      } else {
        const newProjectBriefcase = {
          projectId: currentProjectInfo?.id || routeParams?.id || null,
          associatedDocument: newCustomerDocumentSet,
          publishedDocument: [],
        };
        dispatch(backendService.createProjectBriefcase(newProjectBriefcase));
      }
    },
    [currentProjectBriefCase, currentProjectInfo, routeParams, whoami, dispatch]
  );

  const handleRemoveMarketing = useCallback(
    marketingIdToBeRemoved => {
      const updatedAssociatedMarketing = currentProjectBriefCase?.associatedMarketing?.filter(mk => mk.id !== marketingIdToBeRemoved);
      const UpdatedProjectBriefcase = {
        ...currentProjectBriefCase,
        associatedMarketing: updatedAssociatedMarketing,
      };
      dispatch(backendService.updateProjectBriefcase(UpdatedProjectBriefcase));
    },
    [currentProjectBriefCase, dispatch]
  );

  const handleRemoveCustomerDocument = useCallback(
    customerDocumentIdToBeRemoved => {
      const updatedAssociatedCustomerDocument = currentProjectBriefCase?.associatedDocument?.filter(mk => mk.id !== customerDocumentIdToBeRemoved);
      const UpdatedProjectBriefcase = {
        ...currentProjectBriefCase,
        associatedDocument: updatedAssociatedCustomerDocument,
      };
      dispatch(backendService.updateProjectBriefcase(UpdatedProjectBriefcase));
    },
    [currentProjectBriefCase, dispatch]
  );

  const handleGenerateSolutionBrief = useCallback(async () => {
    dispatch(setDownloadMode(TABS.SOLUTION_BRIEF));
    setOpenDownload(true);
    setIsGenerating(true);
    setIsDownloadingStart(false);
    setIsFinished(false);
    setTimeout(async () => {
      const projectId = currentProjectInfo?.id || routeParams?.id;
      const currDateTimeForFileName = moment(new Date()).tz('America/Vancouver').format('MMDDYYYY_HHmmss');
      const currDateTimeForDefaultNotes = moment(new Date()).tz('America/Vancouver').format('YYYY-MM-DD HH:mm');
      const defaultNotes = `Generated at ${currDateTimeForDefaultNotes}(pst)`;

      const originalFilename = `solution_brief_${currDateTimeForFileName || '00000000_000000'}_${whoami?.firstName?.toLowerCase() || 'unknown'}.pdf`;
      const projectInitial = getProjectInitialLetter(currentProjectInfo?.title);
      const latestVersionObj = getLatestVersionForSolutionBrief(projectInitial, currentSolutionBriefCase);
      const fileSize = getHumanReadableFileSize(currentProjectInfo?.size) || '';
      const finalData = { projectId, originalFilename, fileSize, notes: defaultNotes, publishedBy: null, ...latestVersionObj };
      const results = await dispatch(backendService.createSolutionBriefcase(finalData));
      setTimeout(async () => {
        if (results?.payload?.solutionBriefcase?.id) {
          setIsGenerating(false);
          setIsDownloadingStart(true);
          setIsFinished(false);
          const createdSolutionBrief = results?.payload?.solutionBriefcase;
          const generateRes = await dispatch(backendService.generateSolutionBriefcase(createdSolutionBrief));
          // try delete broken brief
          if (generateRes.error) {
            dispatch(backendService.deleteSolutionBriefcase(createdSolutionBrief?.id));
          } else {
            await dispatch(
              backendService.updateSolutionBriefcase({
                id: results?.payload?.solutionBriefcase?.id,
                fileSize: getHumanReadableFileSize(generateRes?.payload?.stats?.size),
              })
            );
          }
        }
        setTimeout(async () => {
          setIsGenerating(false);
          setIsDownloadingStart(false);
          setIsFinished(true);
          if (currentProjectInfo?.id || routeParams?.id) {
            const params = {
              projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
            };
            await handleAllSolutionBriefRetrieval(params);
          }
        }, 5000);
      }, 5000);
    }, 5000);
  }, [
    whoami,
    currentProjectInfo,
    currentSolutionBriefCase,
    routeParams,
    dispatch,
    setIsGenerating,
    setIsDownloadingStart,
    setIsFinished,
    handleAllSolutionBriefRetrieval,
  ]);

  const handleExit = useCallback(() => {
    dispatch(setSelectedProjectDetails({}));
    dispatch(resetPage());
    dispatch(resetOrder());
    dispatch(resetOrderBy());
    dispatch(setActiveProjectTab(TABS.DISCOVER));
    navigate('/client-portfolio');
  }, [dispatch, navigate]);

  const handlePublishMarketings = useCallback(async () => {
    await setIsFinishedProjectBreifcase(false);
    await setOpenPublishProjectBriefcase(true);
    await setIsPublishingProjectBreifcase(true);
    if (currentProjectBriefCase?.id) dispatch(backendService.publishProjectBriefcase(currentProjectBriefCase?.id));
    const publishSolutionBriefs = solutionBriefs.filter(y => y?.publishedBy !== null);
    if (publishSolutionBriefs?.length > 0) {
      const projectInitial = getProjectInitialLetter(currentProjectInfo?.title);
      /* eslint-disable no-await-in-loop */
      for (let b = 0; b < publishSolutionBriefs.length; b += 1) {
        const latestVersionObj = getLatestVersionForSolutionBrief(projectInitial, currentSolutionBriefCase, true);
        const finalData = {
          id: publishSolutionBriefs?.[b]?.id,
          briefcaseMajorVersion: latestVersionObj.briefcaseMajorVersion,
          notes: solutionBriefs?.[b]?.notes,
        };
        await dispatch(backendService.publishSolutionBriefcase(finalData));
      }
    }
    setTimeout(() => {
      setIsPublishingProjectBreifcase(false);
      setIsFinishedProjectBreifcase(true);
      if (currentProjectInfo?.id || routeParams?.id) {
        const params = {
          projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
        };
        handleAllSolutionBriefRetrieval(params);
      }
    }, 15000);
  }, [
    dispatch,
    currentProjectBriefCase?.id,
    solutionBriefs,
    currentProjectInfo,
    handleAllSolutionBriefRetrieval,
    routeParams,
    currentSolutionBriefCase,
    setIsFinishedProjectBreifcase,
    setIsPublishingProjectBreifcase,
    setOpenPublishProjectBriefcase,
  ]);

  const openFilter = useCallback(() => {
    dispatch(setFilterMode(TABS.PROJECT_BRIEFCASE));
  }, [dispatch]);

  // effect
  useEffect(() => {
    dispatch(backendService.whoami());
    const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
    dispatch(backendService.getProjectDetails(projectId));
    dispatch(backendService.getProjectConnections(projectId));
  }, [dispatch, currentProjectInfo, routeParams]);

  useEffect(() => {
    if (isMarketing) navigate(PATH_NAME.ARTIFACT_LIBRARY);
  }, [isMarketing, navigate]);

  useEffect(() => {
    const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
    const path = window.location.pathname;
    if (!isAdminOrSA && (path.endsWith(PATH_NAME.SOLUTION_BRIEFCASE) || activeSection === TABS.SOLUTION_BRIEF))
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}`);
  }, [isAdminOrSA, navigate]);

  useEffect(() => {
    if (currentProjectInfo?.id || routeParams?.id) {
      const params = {
        projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
      };
      dispatch(backendService.getProjectBriefcaseByProjectId(params));
      handleAllSolutionBriefRetrieval(params);
    }
  }, [dispatch, currentProjectInfo, routeParams, handleAllSolutionBriefRetrieval]);

  // manually trigger download
  useEffect(() => {
    if (!isEmpty(recentCreatedBrief) && triggerDownload) {
      dispatch(backendService.downloadSolutionBriefcase(recentCreatedBrief));
    }
  }, [recentCreatedBrief, triggerDownload, dispatch]);

  return (
    <ProjectSideNavMainWrapper>
      <ProjectSideNavPanel noBorderRadius={activeSection === TABS.MODEL}>
        <ProjectSideNavLogoIcon src={SideNavLogo} alt="side-nav-logo" />
        <ProjectSideNavIcon
          onClick={() => handleIconClick(TABS.DISCOVER)}
          isActive={activeSection === TABS.DISCOVER}
          onMouseOver={() => setHighlightIcon(TABS.DISCOVER)}
          onMouseLeave={() => setHighlightIcon(null)}>
          <img src={renderTabIcon(TABS.DISCOVER)} alt="discover" />
          Discover
        </ProjectSideNavIcon>
        <ProjectSideNavIcon
          onClick={() => handleIconClick(TABS.MODEL)}
          disabled={!modelHasDataToShow}
          isActive={activeSection === TABS.MODEL}
          onMouseOver={() => setHighlightIcon(TABS.MODEL)}
          onMouseLeave={() => setHighlightIcon(null)}>
          <img src={renderTabIcon(TABS.MODEL)} alt="model" />
          Model
        </ProjectSideNavIcon>
        <ProjectSideNavIcon
          onClick={() => handleIconClick(TABS.PROJECT_BRIEFCASE)}
          isActive={activeSection === TABS.PROJECT_BRIEFCASE}
          onMouseOver={() => setHighlightIcon(TABS.PROJECT_BRIEFCASE)}
          onMouseLeave={() => setHighlightIcon(null)}>
          <img src={renderTabIcon(TABS.PROJECT_BRIEFCASE)} alt="briefcase" />
          Briefcase
        </ProjectSideNavIcon>
        {isAdminOrSA && (
          <ProjectSideNavIcon
            onClick={() => handleIconClick(TABS.SOLUTION_BRIEF)}
            disabled={hasNoConnectionsYet || !isAdminOrSA}
            isActive={activeSection === TABS.SOLUTION_BRIEF}
            onMouseOver={() => setHighlightIcon(TABS.SOLUTION_BRIEF)}
            onMouseLeave={() => setHighlightIcon(null)}>
            <img src={renderTabIcon(TABS.SOLUTION_BRIEF)} alt="solution brief" />
            Sol. Brief
          </ProjectSideNavIcon>
        )}
        {!cannotViewLibrary && (
          <>
            <DRDivider margin="-5px 25px 25px 15px" isBorderColor isFaded />
            <ProjectSideNavIcon
              onClick={() => handleIconClick(TABS.LIBRARY)}
              isActive={activeSection === TABS.LIBRARY}
              onMouseOver={() => setHighlightIcon(TABS.LIBRARY)}
              onMouseLeave={() => setHighlightIcon(null)}>
              <img src={renderTabIcon(TABS.LIBRARY)} alt="library" />
              Library
            </ProjectSideNavIcon>
          </>
        )}
        <ProjectSideNavExitIcon
          src={renderTabIcon(null)}
          alt="exit"
          onClick={handleExit}
          onMouseOver={() => setHighlightIcon('exit')}
          onMouseLeave={() => setHighlightIcon(null)}
        />
      </ProjectSideNavPanel>
      <ProjectSideNavContentMain style={activeSection === TABS.MODEL ? { paddingTop: '0px', width: '100%' } : {}}>
        {activeSection === TABS.DISCOVER && (
          <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column' }}>
            <ProjectSideNavContentHeaderText>{TABS.DISCOVER}</ProjectSideNavContentHeaderText>
          </ProjectSideNavContentHeader>
        )}
        {activeSection === TABS.SOLUTION_BRIEF && isAdminOrSA && (
          <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '1fr 0.2fr' }}>
            <ProjectSideNavContentHeaderText>{TABS.SOLUTION_BRIEF}</ProjectSideNavContentHeaderText>
            <ProjectSideNavContentHeaderButtonContainer>
              <CustomButton
                buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                icon={BUTTON_ICON.LIGHTBULB}
                buttonText="Generate"
                type="button"
                padding="0 24px 0 0"
                onClickFunc={() => handleGenerateSolutionBrief()}
              />
              <CustomButton
                buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                icon={BUTTON_ICON.FILE_DOWNLOAD}
                buttonText="Upload / Add version"
                type="button"
                padding="2px 0 0 0"
                onClickFunc={() => handleUploadSelect()}
                customMinWidth="194px"
              />
            </ProjectSideNavContentHeaderButtonContainer>
          </ProjectSideNavContentHeader>
        )}
        {activeSection === TABS.PROJECT_BRIEFCASE && (
          <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '1fr 0.2fr' }}>
            <ProjectSideNavContentHeaderText>{TABS.PROJECT_BRIEFCASE}</ProjectSideNavContentHeaderText>
            <ProjectSideNavContentHeaderButtonContainer>
              {canViewAllMarketing && (
                <CustomButton
                  buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                  icon={BUTTON_ICON.CLOUD_UPLOAD_ICON}
                  buttonText="Publish"
                  type="button"
                  padding="2px 0 0 0"
                  onClickFunc={handlePublishMarketings}
                />
              )}
            </ProjectSideNavContentHeaderButtonContainer>
          </ProjectSideNavContentHeader>
        )}
        {activeSection !== TABS.MODEL && activeSection !== TABS.LIBRARY && <DRDivider margin="0 0 20px 0" />}
        {activeSection === TABS.DISCOVER && (
          <ProjectSideNavContentSection>
            <ProjectSideNavContentSectionTabs>
              <TabsWrapper
                value={activeTab}
                onChange={handleChange}
                TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}
                style={{ minHeight: '39px' }}>
                <TabItem
                  label={TABS.PROJECT_DETAILS}
                  {...a11yProps(0)}
                  value={TABS.PROJECT_DETAILS}
                  noPadding
                  style={{ height: '39px', minHeight: '39px' }}
                  customMargin="0 24px 0 0"
                />
                <TabItem label={reginTabLabel} {...a11yProps(1)} value={TABS.REGIONS} noPadding style={{ height: '39px', minHeight: '39px' }} />
              </TabsWrapper>
            </ProjectSideNavContentSectionTabs>
            <ProjectSideNavContentSectionTabPanel style={{ marginTop: '0px' }}>
              <TabPanel value={activeTab} index={0} mapTo={TABS.PROJECT_DETAILS}>
                <DiscoverProjectDetails />
              </TabPanel>
              <TabPanel value={activeTab} index={1} mapTo={TABS.REGIONS}>
                <DiscoverRegionSection />
              </TabPanel>
            </ProjectSideNavContentSectionTabPanel>
          </ProjectSideNavContentSection>
        )}
        {activeSection === TABS.MODEL && <Model isConnect={isConnect} />}
        {activeSection === TABS.PROJECT_BRIEFCASE && (
          <div>
            <div>
              {activeSection === TABS.PROJECT_BRIEFCASE && (
                <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '1fr 0.2fr' }}>
                  <ProjectBriefcaseSubHeaderText>Project Documents</ProjectBriefcaseSubHeaderText>
                  <ProjectSideNavContentHeaderButtonContainer>
                    {canViewAllMarketing && !isMarketing && (
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                        icon={BUTTON_ICON.ADD_BORDERLESS}
                        buttonText="Add"
                        type="button"
                        padding="0 24px 0 0"
                        onClickFunc={handleAddProjectDocumentClick}
                      />
                    )}
                  </ProjectSideNavContentHeaderButtonContainer>
                </ProjectSideNavContentHeader>
              )}
            </div>
            <ProjectBriefcaseList handleRemoveCustomerDocument={handleRemoveCustomerDocument} />
            <div>
              {activeSection === TABS.PROJECT_BRIEFCASE && (
                <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '1fr 0.2fr' }}>
                  <ProjectBriefcaseSubHeaderText style={{ marginTop: '30px' }}>Educational Materials</ProjectBriefcaseSubHeaderText>
                  <ProjectSideNavContentHeaderButtonContainer style={{ position: 'relative', bottom: '-15px' }}>
                    {canViewAllMarketing && isFilterVisible && (
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                        icon={BUTTON_ICON.FILTER_OUTLINED}
                        buttonText="Filter"
                        type="button"
                        padding="0 24px 0 0"
                        onClickFunc={openFilter}
                      />
                    )}
                    {canViewAllMarketing && (
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                        icon={BUTTON_ICON.ADD_BORDERLESS}
                        buttonText="Add"
                        type="button"
                        padding="0 24px 0 0"
                        onClickFunc={handleAddProjectBriefcaseClick}
                      />
                    )}
                  </ProjectSideNavContentHeaderButtonContainer>
                </ProjectSideNavContentHeader>
              )}
            </div>
            <EducationalMaterialsList handleRemoveMarketing={handleRemoveMarketing} />
            <div>
              {activeSection === TABS.PROJECT_BRIEFCASE && (
                <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '1fr 0.2fr' }}>
                  <ProjectBriefcaseSubHeaderText style={{ marginTop: '30px' }}>Solution Briefs</ProjectBriefcaseSubHeaderText>
                  <ProjectSideNavContentHeaderButtonContainer style={{ position: 'relative', bottom: '-15px' }}>
                    {canViewAllMarketing && !isMarketing && (
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                        icon={BUTTON_ICON.ADD_BORDERLESS}
                        buttonText="Add"
                        type="button"
                        padding="0 24px 0 0"
                        onClickFunc={handleAddSolutionBriefInProjectBriefClick}
                      />
                    )}
                  </ProjectSideNavContentHeaderButtonContainer>
                </ProjectSideNavContentHeader>
              )}
            </div>
            <SolutionBriefsProjectBriefcaseList />
          </div>
        )}
        {activeSection === TABS.LIBRARY && <SideNavLibrary />}
        {activeSection === TABS.PROJECT_BRIEFCASE && (
          <MarketingMaterialsPanel currentProjectBriefCase={currentProjectBriefCase} handleAddMarketings={handleAddMarketings} />
        )}
        {activeSection === TABS.PROJECT_BRIEFCASE && <MarketingFilterPanel />}
        {activeSection === TABS.PROJECT_BRIEFCASE && <CustomerDocumentsPanel handleAddCustomerDocuments={handleAddCustomerDocument} />}
        {activeSection === TABS.SOLUTION_BRIEF && isAdminOrSA && <SolutionBriefList />}
        {(activeSection === TABS.SOLUTION_BRIEF || activeSection === TABS.PROJECT_BRIEFCASE) && !openDownload && (
          <UploadSolutionBrief fromProjectBreifcase={activeSection === TABS.PROJECT_BRIEFCASE} />
        )}
        {activeSection === TABS.PROJECT_BRIEFCASE && openPublishProjectBriefcase && (
          <PublishProjectBriefcase
            isPublishing={openPublishProjectBriefcase}
            shutOffScreen={setOpenPublishProjectBriefcase}
            isGenerating={isPublishingProjectBreifcase}
            isFinished={isFinishedProjectBreifcase}
          />
        )}
        {(activeSection === TABS.SOLUTION_BRIEF || activeSection === TABS.PROJECT_BRIEFCASE) && (
          <PublishSolutionBrief currentSolutionBriefCase={currentSolutionBriefCase} />
        )}
        {activeSection === TABS.SOLUTION_BRIEF && openDownload && (
          <DownloadSolutionBrief shutOffScreen={setOpenDownload} isGenerating={isGenerating} isDownloadingStart={isDownloadingStart} isFinished={isFinished} />
        )}
        {showEditSolutionBriefMode && <EditSolutionBrief />}
      </ProjectSideNavContentMain>
    </ProjectSideNavMainWrapper>
  );
}

ProjectSideNavSectionMain.prototype = {
  onLoadTab: PropTypes.string.isRequired,
  isRegion: PropTypes.bool,
  isConnect: PropTypes.bool,
};

ProjectSideNavSectionMain.defaultProps = {
  isRegion: false,
  isConnect: false,
};

export default ProjectSideNavSectionMain;

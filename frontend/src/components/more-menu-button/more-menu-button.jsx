import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeRow,
  setEditMode,
  setSelectedUseCaseDetails,
  setSelectedCompany,
  setArchiveMode,
  resetRecentlyArchived,
  setSelectedIndustryVerticalDetails,
  setSelectedMarketingDetails,
  setSelectedReferenceDocDetails,
  setSelectedIconDetails,
  setSelectedProjectDetails,
  setPublishMode,
  setSelectedSolutionBriefDetails,
  setSelectedDataCentreDetails,
  setSelectedRegionCloudDetails,
  setSelectedRegionApplicationDetails,
  setSelectedRegionCustomerLocationDetails,
  openDiscoverRegionsEditNameMode,
  resetPage,
  resetOrder,
  resetOrderBy,
  setAdditionalSolBriefs,
  setForceTableRefreshTab,
} from '../../features/slices/uiSlice';
import {
  getPageNum,
  getRecentlyArchived,
  getSelectedCompany,
  getSelectedDiscoverRegionActiveState,
  getSelectedIndustryVerticalDetails,
  getSelectedUseCaseDetails,
  getSortOrder,
  getSortOrderBy,
} from '../../features/selectors/ui';
import { DISCOVER_REGION_FIELDS, EDIT_MODE, FEATURE_CONFIG, PATH_NAME, REGIONS_INNER_TABS, TABS } from '../../utils/constants/constants';
import { backendService } from '../../services/backend';
import { UseCaseWithProjectsMenuItem, IndustryVerticalWithCompanyMenuItem, DefaultMenuItem, MoreMenuWrapper } from './more-menu-button-styled';
import { getDocuments } from '../../features/selectors/common';
import { canAccessFeature } from '../../features/selectors';
import { isEmpty } from '../../utils/utils';

const ITEM_HEIGHT = 50;

function MoreMenuButton({
  rowDetails,
  isUserDetails,
  isCompany,
  isCompanyDetails,
  isProject,
  isUseCaseDetails,
  isIndustryVerticalDetails,
  isMarketingDetails,
  isYourProjectDetails,
  isSolutionBriefDetails,
  isSolutionBriefProjectBriefcaseDetails,
  hasCompany,
  hasProject,
  isOpen,
  transitionToggle,
  isArtifactIcon,
  isReferenceArchitectureDetails,
  isMyCompanies,
  searchText,
  isProjectDocument,
  isAssociatedMarketing,
  panelForEdit,
  handleRemoveMarketing,
  handleEditNotes,
  discoverRegionEditTitleValue,
  visible,
  isRegionTab,
  subTabs,
  setSubTabs,
  detailsFromSelectedProject,
  updateActiveSection,
}) {
  // dispatch
  const dispatch = useDispatch();

  // navigate
  const navigate = useNavigate();

  // params
  const routeParams = useParams();

  // state
  const [anchorEl, setAnchorEl] = useState(null);

  // selector
  const isRecentlyArchived = useSelector(getRecentlyArchived);
  const isSelectedUseCase = useSelector(getSelectedUseCaseDetails);
  const isSelectedCompany = useSelector(getSelectedCompany);
  const isSelectedIndustryVertical = useSelector(getSelectedIndustryVerticalDetails);
  const selectedRegionValues = useSelector(getSelectedDiscoverRegionActiveState);
  const documents = useSelector(getDocuments);
  const canAccessAdminPanelEditAndTag = useSelector(state => canAccessFeature(state, 'ADMIN_PANEL_EDIT'));
  const canAccessAdminPanelArchive = useSelector(state => canAccessFeature(state, 'ADMIN_PANEL_ARCHIVE'));
  const canAccessAdminPanelActivate = useSelector(state => canAccessFeature(state, 'ADMIN_PANEL_ACTIVATE'));
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // const
  const open = Boolean(anchorEl);
  const isArchived = rowDetails?.archived;
  const extraHeight = hasProject || hasCompany || isMarketingDetails || isArtifactIcon || isReferenceArchitectureDetails || isProject || isSolutionBriefDetails;
  const extraWidth =
    (isUseCaseDetails && hasProject) || (isIndustryVerticalDetails && hasCompany) || isMarketingDetails || isArtifactIcon || isReferenceArchitectureDetails;

  // func
  const getEditModeVal = () => {
    if (isUserDetails) return EDIT_MODE.EDIT_USER;
    if (isCompanyDetails) return EDIT_MODE.EDIT_COMPANY;
    if (isProject) return EDIT_MODE.EDIT_PROJECT;
    if (isUseCaseDetails) return EDIT_MODE.EDIT_USE_CASE;
    if (isIndustryVerticalDetails) return EDIT_MODE.EDIT_INDUSTRY_VERTICAL;
    if (isMarketingDetails) return EDIT_MODE.EDIT_MARKETING;
    if (isReferenceArchitectureDetails) return EDIT_MODE.EDIT_REFERENCE;
    if (isArtifactIcon) return EDIT_MODE.EDIT_ICON;
    if (panelForEdit) return panelForEdit;
    return '';
  };
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    if (isUserDetails) {
      dispatch(backendService.getUserById(rowDetails?.id));
      dispatch(backendService.getCompaniesByArchived(false));
    }
    if (isCompanyDetails) dispatch(backendService.getCompanyById(rowDetails?.id));
    if (isProject) dispatch(backendService.getProjectById(rowDetails?.id));
    if (isUseCaseDetails) dispatch(setSelectedUseCaseDetails(rowDetails));
    if (isIndustryVerticalDetails) dispatch(setSelectedIndustryVerticalDetails(rowDetails));
    if (isMarketingDetails) dispatch(setSelectedMarketingDetails(rowDetails));
    if (isReferenceArchitectureDetails) dispatch(setSelectedReferenceDocDetails(rowDetails));
    if (isArtifactIcon) dispatch(setSelectedIconDetails(rowDetails));
    if (panelForEdit === EDIT_MODE.EDIT_REGION_DATA_CENTRE) {
      dispatch(setSelectedDataCentreDetails(rowDetails));
    }
    if (panelForEdit === EDIT_MODE.EDIT_REGION_CLOUDS) {
      dispatch(setSelectedRegionCloudDetails(rowDetails));
    }
    if (panelForEdit === EDIT_MODE.EDIT_REGION_APPLICATIONS) {
      dispatch(setSelectedRegionApplicationDetails(rowDetails));
    }
    if (panelForEdit === EDIT_MODE.EDIT_REGION_COMPLIANCE) {
      dispatch(backendService.getComplianceByName(rowDetails?.named));
    }
    if (panelForEdit === EDIT_MODE.EDIT_REGION_PARTNERSHIP_AND_SUPPLIERS) {
      dispatch(backendService.getIconByName(rowDetails?.named));
    }
    if (panelForEdit === EDIT_MODE.EDIT_REGION_CUSTOMER_LOCATIONS) {
      // when clone future state, the future applications, clouds and datacenters don't exist
      // so the current values get carried over, needs to check and update the future customer location details
      // trigger an update to make sure it has the correct future values
      let customerLocationDetails = { ...rowDetails };
      const typeArr = [DISCOVER_REGION_FIELDS.DATA_CENTRES, DISCOVER_REGION_FIELDS.APPLICATIONS, DISCOVER_REGION_FIELDS.CLOUDS];
      const futureStates = detailsFromSelectedProject.filter(d => d?.isFuture && typeArr.includes(d?.type));
      const appArr = rowDetails?.extras?.applications?.reduce((acc, id) => {
        const found = detailsFromSelectedProject?.find(d => d.id === id);
        const foundFuture = futureStates?.find(fs => fs.named === found?.named);
        if (foundFuture && foundFuture?.id !== id) acc.push(foundFuture?.id);
        return acc;
      }, []);
      const datacenterArr = rowDetails?.extras?.datacenters?.reduce((acc, id) => {
        const found = detailsFromSelectedProject?.find(d => d.id === id);
        const foundFuture = futureStates?.find(fs => fs.named === found?.named);
        if (foundFuture && foundFuture?.id !== id) acc.push(foundFuture?.id);
        return acc;
      }, []);
      const cloudArr = rowDetails?.extras?.clouds?.reduce((acc, id) => {
        const found = detailsFromSelectedProject?.find(d => d.id === id);
        const foundFuture = futureStates?.find(fs => fs.named === found?.named);
        if (foundFuture && foundFuture?.id !== id) acc.push(foundFuture?.id);
        return acc;
      }, []);
      if (rowDetails?.isFuture) {
        const needToUpdateFutureDetail = appArr?.length > 0 || datacenterArr?.length > 0 || cloudArr?.length > 0;
        if (appArr?.length > 0) {
          customerLocationDetails = { ...customerLocationDetails, extras: { ...customerLocationDetails.extras, applications: appArr } };
        }
        if (datacenterArr?.length > 0) {
          customerLocationDetails = { ...customerLocationDetails, extras: { ...customerLocationDetails.extras, datacenters: datacenterArr } };
        }
        if (cloudArr?.length > 0) {
          customerLocationDetails = { ...customerLocationDetails, extras: { ...customerLocationDetails.extras, clouds: cloudArr } };
        }
        if (needToUpdateFutureDetail) {
          const finalData = {
            detailId: customerLocationDetails.id,
            ...customerLocationDetails,
          };
          dispatch(backendService.updateProjectDetails(finalData));
        }
      } else {
        if (appArr?.length > 0) {
          customerLocationDetails = {
            ...customerLocationDetails,
            extras: { ...customerLocationDetails.extras, applications: rowDetails?.extras?.applications },
          };
        }
        if (datacenterArr?.length > 0) {
          customerLocationDetails = { ...customerLocationDetails, extras: { ...customerLocationDetails.extras, datacenters: rowDetails?.extras?.datacenters } };
        }
        if (cloudArr?.length > 0) {
          customerLocationDetails = { ...customerLocationDetails, extras: { ...customerLocationDetails.extras, clouds: rowDetails?.extras?.clouds } };
        }
      }

      setTimeout(() => {
        dispatch(backendService.getProjectDetails(customerLocationDetails.projectId));
        dispatch(setSelectedRegionCustomerLocationDetails(customerLocationDetails));
        dispatch(setEditMode(getEditModeVal()));
      }, 1000);
    }
    if (isRegionTab) {
      dispatch(openDiscoverRegionsEditNameMode(rowDetails));
    }
    // separated the edit customer location to give it enough time to update the future details
    if (panelForEdit !== EDIT_MODE.EDIT_REGION_CUSTOMER_LOCATIONS) dispatch(setEditMode(getEditModeVal()));
    setAnchorEl(null);
  };

  const handleArchive = () => {
    if (isUserDetails) dispatch(backendService.deleteUser(rowDetails?.id));
    if (isProject) {
      transitionToggle();
      dispatch(backendService.deleteProject(rowDetails?.id));
    }
    if (isMarketingDetails) {
      transitionToggle();
      setTimeout(() => {
        dispatch(backendService.deleteMarketing(rowDetails?.id));
        setTimeout(() => {
          dispatch(backendService.searchMarketings(searchText));
          dispatch(setForceTableRefreshTab(TABS.MARKETING));
        }, 500);
      }, 500);
    }
    if (isReferenceArchitectureDetails) {
      transitionToggle();
      setTimeout(() => {
        dispatch(backendService.deleteReferenceArchitecture(rowDetails?.id));
        dispatch(setForceTableRefreshTab(TABS.REFERENCE_ARCHITECTURE));
      }, 500);
    }
    if (isArtifactIcon) dispatch(backendService.deleteIcon(rowDetails?.id));
    dispatch(removeRow(rowDetails?.id));
    setAnchorEl(null);
  };

  const handleArchiveCompany = () => {
    dispatch(setSelectedCompany(rowDetails));
    dispatch(setArchiveMode(rowDetails));
    setAnchorEl(null);
  };
  const handleArchiveUseCase = () => {
    dispatch(setSelectedUseCaseDetails(rowDetails));
    dispatch(setArchiveMode(rowDetails));
    setAnchorEl(null);
  };
  const handleArchiveIndustryVertical = () => {
    dispatch(setSelectedIndustryVerticalDetails(rowDetails));
    dispatch(setArchiveMode(rowDetails));
    setAnchorEl(null);
  };

  const handleActivate = () => {
    if (isUserDetails) dispatch(backendService.activateUser(rowDetails?.id));
    if (isCompanyDetails) {
      transitionToggle();
      dispatch(backendService.activateCompany(rowDetails?.id));
      setTimeout(() => {
        if (isMyCompanies) {
          dispatch(backendService.getMyCompanies());
        } else {
          const sortOrderBy =
            orderBy === 'projectCount'
              ? [
                  ['name', order],
                  ['id', order],
                  ['industryVertical', order],
                ]
              : [[orderBy, order]];
          dispatch(backendService.getCompaniesByParams({ archived: true, page, order: sortOrderBy }));
        }
      }, 300);
    }
    if (isProject) {
      transitionToggle();
      dispatch(backendService.activateProject(rowDetails?.id));
    }
    if (isUseCaseDetails) {
      const filteredDocuments = documents?.filter(document => document?.useCases.filter(id => id === rowDetails.id)?.length > 0);
      if (filteredDocuments?.length > 0) {
        for (let index = 0; index < filteredDocuments?.length; index += 1) {
          const updateUseCases = filteredDocuments[index]?.useCases?.filter(usecase => usecase !== rowDetails.id);
          const updateDocument = {
            ...filteredDocuments[index],
            usecases: updateUseCases,
          };
          dispatch(backendService.updateDocuments(updateDocument));
        }
      }
      transitionToggle();
      setTimeout(() => {
        dispatch(backendService.activateUseCase(rowDetails?.id));
      }, 500);
    }
    if (isIndustryVerticalDetails) {
      const filteredDocuments = documents?.filter(document => document?.industryVertical.filter(id => id === rowDetails.id)?.length > 0);
      if (filteredDocuments?.length > 0) {
        for (let index = 0; index < filteredDocuments?.length; index += 1) {
          const updateIndustryVertical = filteredDocuments[index]?.industryVertical?.filter(industryvertical => industryvertical !== rowDetails.id);
          const updateDocument = {
            ...filteredDocuments[index],
            industryVertical: updateIndustryVertical,
          };
          dispatch(backendService.updateDocuments(updateDocument));
        }
      }
      transitionToggle();
      setTimeout(() => {
        dispatch(backendService.activateIndustryVertical(rowDetails?.id));
      }, 500);
    }
    if (isMarketingDetails) {
      transitionToggle();
      setTimeout(() => {
        dispatch(backendService.activateMarketing(rowDetails?.id));
      }, 500);
    }
    if (isReferenceArchitectureDetails) {
      transitionToggle();
      setTimeout(() => {
        dispatch(backendService.activateReferenceArchitecture(rowDetails?.id));
      }, 500);
    }
    if (isArtifactIcon) dispatch(backendService.activateIcon(rowDetails?.id));
    dispatch(removeRow(rowDetails?.id));
    setAnchorEl(null);
  };

  const handleViewTeam = useCallback(() => {
    transitionToggle();
  }, [transitionToggle]);

  const handleDownload = () => {
    if (isArtifactIcon) {
      dispatch(backendService.downloadIcon(rowDetails));
    }
    if (isMarketingDetails || isAssociatedMarketing) {
      dispatch(backendService.downloadMarketing(rowDetails));
    }
    if (isReferenceArchitectureDetails) {
      dispatch(backendService.downloadReferenceArchitecture(rowDetails));
    }
    if (isProjectDocument) {
      dispatch(backendService.downloadCustomerDocument(rowDetails));
    }
    if (isSolutionBriefDetails || isSolutionBriefProjectBriefcaseDetails) {
      dispatch(backendService.downloadSolutionBriefcase(rowDetails));
    }
    setAnchorEl(null);
  };

  const handleProjectModelerClick = () => {
    if (isProject) {
      dispatch(setSelectedProjectDetails(rowDetails));
      dispatch(resetPage());
      dispatch(resetOrder());
      dispatch(resetOrderBy());
      navigate(`/project-modeler/${rowDetails?.id}`);
    }
  };

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

  const handleProjectDocumentRemove = () => {
    if (isProjectDocument && !isAssociatedMarketing) {
      dispatch(backendService.deleteCustomerDocument(rowDetails?.id));
    } else if (isAssociatedMarketing) {
      transitionToggle();
      setTimeout(() => {
        handleRemoveMarketing(rowDetails?.id);
      }, 500);
    }
    if (isSolutionBriefProjectBriefcaseDetails) {
      const finalData = { id: rowDetails?.id, publishedBy: 'null' };
      dispatch(backendService.updateSolutionBriefcase(finalData));
      setTimeout(() => {
        if (routeParams?.id) {
          const params = {
            projectId: routeParams?.id || 'unknown',
          };
          handleAllSolutionBriefRetrieval(params);
        }
      }, 500);
    }
  };

  const handlePublish = () => {
    if (isSolutionBriefDetails || isSolutionBriefProjectBriefcaseDetails) {
      dispatch(setSelectedSolutionBriefDetails(rowDetails));
      dispatch(setPublishMode(TABS.SOLUTION_BRIEF));
      setAnchorEl(null);
    }
  };

  const handleDelete = () => {
    if (isRegionTab) {
      const body = {
        projectId: rowDetails.projectId,
        detailId: rowDetails.id,
        region: rowDetails.region,
      };
      dispatch(backendService.deleteRegionFromProjectDetail(body));
      setTimeout(() => {
        const copy = subTabs.filter(tab => tab !== rowDetails.named);
        setSubTabs(copy);
        dispatch(backendService.getProjectDetails(rowDetails.projectId));
        if (copy.length > 0) {
          if (routeParams?.regionId && routeParams?.regionId !== rowDetails?.id) {
            updateActiveSection(selectedRegionValues?.regionName || copy[0], undefined);
          } else {
            updateActiveSection(copy[0], undefined);
          }
        } else {
          navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${rowDetails.projectId}${PATH_NAME.PROJECT_MODELER_REGION}`);
        }
      }, 800);
    }
    if (panelForEdit && Object.values(EDIT_MODE).find(mode => mode === panelForEdit)) {
      const { projectId } = rowDetails;
      const deleteBody = {
        projectId,
        detailId: rowDetails.id,
      };
      dispatch(backendService.deleteProjectDetail(deleteBody));
      setTimeout(() => dispatch(backendService.getProjectDetails(projectId)), 800);
    }
    setAnchorEl(null);
  };

  // effect
  useEffect(() => {
    if (isRecentlyArchived && (isSelectedUseCase === rowDetails || isSelectedIndustryVertical === rowDetails || isSelectedCompany === rowDetails)) {
      transitionToggle();
      dispatch(resetRecentlyArchived());
    }
  }, [dispatch, transitionToggle, isRecentlyArchived, isSelectedUseCase, isSelectedIndustryVertical, isSelectedCompany, rowDetails]);

  return (
    <MoreMenuWrapper hideHoverEffect={isSolutionBriefDetails} visible={visible} isRegionTab={isRegionTab}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ borderRadius: 'unset', color: isProjectDocument ? 'var(--color-homeworld)' : 'var(--color-aluminium)', padding: isArtifactIcon ? '4px' : '8px' }}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            maxHeight: extraHeight ? ITEM_HEIGHT * 8 : ITEM_HEIGHT * 2,
            width: extraWidth ? '252px' : '120px',
            backgroundColor: 'var(--color-homeworld)',
            color: 'var(--color-la-luna)',
          },
        }}>
        {isYourProjectDetails && !isOpen && (
          <DefaultMenuItem key={1} onClick={handleViewTeam}>
            View Team
          </DefaultMenuItem>
        )}
        {isYourProjectDetails && isOpen && (
          <DefaultMenuItem key={1} onClick={handleViewTeam}>
            Hide Team
          </DefaultMenuItem>
        )}
        {isSolutionBriefDetails && (
          <DefaultMenuItem key={0} borderBottom onClick={() => handlePublish()}>
            Publish
          </DefaultMenuItem>
        )}
        {isSolutionBriefDetails && !isSolutionBriefProjectBriefcaseDetails && (
          <DefaultMenuItem
            key={1}
            borderBottom
            onClick={() => {
              setAnchorEl(null);
              handleEditNotes();
            }}>
            Edit Notes
          </DefaultMenuItem>
        )}
        {isSolutionBriefDetails && (
          <DefaultMenuItem key={2} onClick={handleDownload}>
            Download
          </DefaultMenuItem>
        )}
        {(isMarketingDetails || isArtifactIcon || isReferenceArchitectureDetails || isYourProjectDetails || isProjectDocument || isAssociatedMarketing) && (
          <DefaultMenuItem key={0} onClick={handleDownload}>
            Download
          </DefaultMenuItem>
        )}
        {(isMarketingDetails || isArtifactIcon || isReferenceArchitectureDetails) && (
          <DefaultMenuItem key={2} onClick={handleEdit} disabled={!canAccessAdminPanelEditAndTag}>
            Edit
          </DefaultMenuItem>
        )}
        {!isMarketingDetails &&
          !isArtifactIcon &&
          !isReferenceArchitectureDetails &&
          !isYourProjectDetails &&
          !isProjectDocument &&
          !isSolutionBriefDetails &&
          !isSolutionBriefProjectBriefcaseDetails &&
          !isAssociatedMarketing && (
            <DefaultMenuItem key={0} onClick={handleEdit} borderBottom>
              Edit
            </DefaultMenuItem>
          )}
        {isArchived && (
          <DefaultMenuItem key={1} disabled={!canAccessAdminPanelActivate} onClick={handleActivate}>
            Activate
          </DefaultMenuItem>
        )}
        {!isArchived && isCompany && !isUseCaseDetails && !hasProject && (
          <DefaultMenuItem key={1} onClick={handleArchiveCompany}>
            Archive
          </DefaultMenuItem>
        )}
        {!isArchived && isUseCaseDetails && !isCompany && !hasProject && (
          <DefaultMenuItem key={1} onClick={handleArchiveUseCase}>
            Archive
          </DefaultMenuItem>
        )}
        {!isArchived && isUseCaseDetails && hasProject && (
          <UseCaseWithProjectsMenuItem key={1}>
            <p>Archive</p>
            <p style={{ fontSize: '14px' }}>Use cases with projects linked to them can&#39;t be archived.</p>
          </UseCaseWithProjectsMenuItem>
        )}
        {!isArchived && isIndustryVerticalDetails && !hasCompany && (
          <DefaultMenuItem key={1} onClick={handleArchiveIndustryVertical}>
            Archive
          </DefaultMenuItem>
        )}
        {!isArchived && isIndustryVerticalDetails && hasCompany && (
          <IndustryVerticalWithCompanyMenuItem key={1}>
            <p>Archive</p>
            <p style={{ fontSize: '14px' }}>Industry Verticals with companies linked to them can&#39;t be archived.</p>
          </IndustryVerticalWithCompanyMenuItem>
        )}
        {!isArchived &&
          !isCompany &&
          !isUseCaseDetails &&
          !isIndustryVerticalDetails &&
          !isYourProjectDetails &&
          !isProjectDocument &&
          !isSolutionBriefDetails &&
          !isSolutionBriefProjectBriefcaseDetails &&
          !isAssociatedMarketing &&
          panelForEdit === '' &&
          !isRegionTab && (
            <DefaultMenuItem
              key={1}
              onClick={handleArchive}
              disabled={(isMarketingDetails || isArtifactIcon || isReferenceArchitectureDetails) && !canAccessAdminPanelArchive}>
              Archive
            </DefaultMenuItem>
          )}
        {isProject && (
          <DefaultMenuItem key={2} onClick={handleProjectModelerClick} borderTop>
            Modeler
          </DefaultMenuItem>
        )}
        {(isProjectDocument || isAssociatedMarketing || (isSolutionBriefProjectBriefcaseDetails && isSolutionBriefDetails)) && (
          <DefaultMenuItem key={1} onClick={handleProjectDocumentRemove} borderTop={isAssociatedMarketing || isSolutionBriefProjectBriefcaseDetails}>
            Remove
          </DefaultMenuItem>
        )}
        {!(isProjectDocument || isAssociatedMarketing) &&
          (isRegionTab ||
            panelForEdit === EDIT_MODE.EDIT_REGION_DATA_CENTRE ||
            panelForEdit === EDIT_MODE.EDIT_REGION_CLOUDS ||
            panelForEdit === EDIT_MODE.EDIT_REGION_APPLICATIONS ||
            panelForEdit === EDIT_MODE.EDIT_REGION_CUSTOMER_LOCATIONS) && (
            <DefaultMenuItem key={2} onClick={handleDelete}>
              Remove
            </DefaultMenuItem>
          )}
      </Menu>
    </MoreMenuWrapper>
  );
}

MoreMenuButton.propTypes = {
  rowDetails: PropTypes.shape({}),
  isUserDetails: PropTypes.bool,
  isCompany: PropTypes.bool,
  isCompanyDetails: PropTypes.bool,
  isProject: PropTypes.bool,
  isUseCaseDetails: PropTypes.bool,
  isIndustryVerticalDetails: PropTypes.bool,
  isMarketingDetails: PropTypes.bool,
  isYourProjectDetails: PropTypes.bool,
  isSolutionBriefDetails: PropTypes.bool,
  isSolutionBriefProjectBriefcaseDetails: PropTypes.bool,
  hasCompany: PropTypes.bool,
  hasProject: PropTypes.bool,
  isOpen: PropTypes.bool,
  isArtifactIcon: PropTypes.bool,
  isReferenceArchitectureDetails: PropTypes.bool,
  isMyCompanies: PropTypes.bool,
  isProjectDocument: PropTypes.bool,
  isAssociatedMarketing: PropTypes.bool,
  transitionToggle: PropTypes.func,
  handleRemoveMarketing: PropTypes.func,
  handleEditNotes: PropTypes.func,
  searchText: PropTypes.string,
  panelForEdit: PropTypes.string,
  discoverRegionEditTitleValue: PropTypes.string,
  visible: PropTypes.bool,
  isRegionTab: PropTypes.bool,
  subTabs: PropTypes.arrayOf(PropTypes.shape({})),
  setSubTabs: PropTypes.func,
  detailsFromSelectedProject: PropTypes.arrayOf(PropTypes.shape({})),
  updateActiveSection: PropTypes.func,
};

MoreMenuButton.defaultProps = {
  rowDetails: {},
  isUserDetails: false,
  isCompany: false,
  isCompanyDetails: false,
  isProject: false,
  isUseCaseDetails: false,
  isIndustryVerticalDetails: false,
  isMarketingDetails: false,
  isYourProjectDetails: false,
  isSolutionBriefDetails: false,
  isSolutionBriefProjectBriefcaseDetails: false,
  hasCompany: false,
  hasProject: false,
  isOpen: false,
  isArtifactIcon: false,
  isReferenceArchitectureDetails: false,
  isMyCompanies: false,
  isProjectDocument: false,
  isAssociatedMarketing: false,
  transitionToggle: () => {},
  handleRemoveMarketing: () => {},
  handleEditNotes: () => {},
  searchText: '',
  panelForEdit: '',
  discoverRegionEditTitleValue: '',
  visible: true,
  isRegionTab: false,
  subTabs: [],
  setSubTabs: () => {},
  detailsFromSelectedProject: [],
  updateActiveSection: () => {},
};

export default MoreMenuButton;

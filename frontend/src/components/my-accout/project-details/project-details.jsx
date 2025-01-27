import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Backdrop, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  SidePanelContentItem,
  SidePanelContentWrapper,
  SidePanelEdgePatch,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelDetailsText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSaveButtonWrapper,
  SidePanelLine,
} from '../../side-panel/side-panel-styled';
import TextInput from '../../form-elements/text-input';
import {
  FilledValueRemoveIcon,
  FilledValueText,
  FilledValueWrapper,
  FilledDetailedWrapper,
  LabelContainer,
  LabelIcon,
  LabelText,
  ValueText,
} from '../account-info/account-info-styled';
import { getNameFromId, isEmpty } from '../../../utils/utils';
import CustomButton from '../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE, EDIT_MODE, PATH_NAME, Roles, TABS } from '../../../utils/constants/constants';
import { UserListItemMainContainer, UserListItemTextInner, UserListPrimaryText, UserListSecondaryText } from '../admin-panel/user-management/user-list-styled';
import CustomChip from '../../chip/custom-chip';
import SelectionPanel from '../selection-panel/selection-panel';
import AssociatedUsersPanel from '../associated-users/associated-users-panel';
import UserDetails from '../user-details/user-details';
import AddUserPanel from '../add-user/add-user-panel';
import {
  getEditMode,
  getSelectedProjectDetails,
  getProjectDetailsMode,
  getClientPortfolioTab,
  getPageNum,
  getSortOrder,
  getSortOrderBy,
} from '../../../features/selectors/ui';
import { resetEditMode, setSelectedProjectDetails, resetProjectDetailsMode, setEditMode } from '../../../features/slices/uiSlice';
import { backendService } from '../../../services/backend';
import { getAllActiveCompanies } from '../../../features/selectors/company';
import { getAllActiveUseCases } from '../../../features/selectors/useCase';
import { getAllRoles } from '../../../features/selectors';
import { DRDivider } from '../../app/app-styled';

function ProjectDetails({ isAdminOrSA }) {
  // dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useForm
  const { register, handleSubmit, reset } = useForm();

  // selectors
  const editMode = useSelector(getEditMode);
  const selectedProjectDetails = useSelector(getSelectedProjectDetails);
  const viewProjectDetails = useSelector(getProjectDetailsMode);
  const allCompany = useSelector(getAllActiveCompanies);
  const activeUseCases = useSelector(getAllActiveUseCases);
  const useCases = (activeUseCases || []).filter(useCase => !useCase.archived);
  const allRoles = useSelector(getAllRoles);
  const portfolioActiveTab = useSelector(getClientPortfolioTab);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // state
  const [openUseCases, setOpenUseCases] = useState(false);
  const [openAssociatedUsers, setOpenAssociatedUsers] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({ useCases: [], associatedUsers: [] });
  const [useCaseList, setUseCaseList] = useState([]);

  // const
  const isEditProjectMode = editMode === EDIT_MODE.EDIT_PROJECT;
  const isViewProjectMode = viewProjectDetails?.open;
  const projectDetails = viewProjectDetails?.project || {};
  const companyName = allCompany?.find(comp => comp.id === selectedProjectDetails?.companyId)?.name || '';

  // func
  const getRoleName = id => {
    if (Roles.includes(id.toLowerCase())) return id;
    return allRoles?.find(role => role.id === id)?.name || '';
  };

  const launchModeler = useCallback(() => {
    //TODO setup information needed for visualizer page and clear project view here
    const projectId = selectedProjectDetails?.id;
    const finalPath = `${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}`;
    dispatch(resetProjectDetailsMode());
    navigate(finalPath);
  }, [dispatch, navigate, selectedProjectDetails]);

  const initSelectedProjectData = useCallback(() => {
    if (!isEmpty(selectedProjectDetails)) {
      setAdditionalValues({
        useCases: selectedProjectDetails?.useCases || [],
        associatedUsers: selectedProjectDetails?.associatedUsers || [],
      });
    } else if (!isEmpty(projectDetails)) {
      setAdditionalValues({
        useCases: projectDetails?.useCases || [],
        associatedUsers: projectDetails?.associatedUsers || [],
      });
    }
  }, [selectedProjectDetails, projectDetails, setAdditionalValues]);

  const handlePanelClose = useCallback(() => {
    setOpenUseCases(false);
    setOpenAssociatedUsers(false);
    reset();
    setAdditionalValues({ useCases: [], associatedUsers: [] });
    dispatch(setSelectedProjectDetails({}));
    dispatch(resetEditMode());
    if (portfolioActiveTab === TABS.ALL_COMPANIES) dispatch(backendService.getCompaniesByParams({ archived: false, page, order: [[orderBy, order]] }));
    if (portfolioActiveTab === TABS.ARCHIVED_COMPANIES) dispatch(backendService.getCompaniesByParams({ archived: true, page, order: [[orderBy, order]] }));
    if (portfolioActiveTab === TABS.MY_COMPANIES) dispatch(backendService.getMyCompaniesByParams({ archived: false, page, order: [[orderBy, order]] }));
  }, [dispatch, portfolioActiveTab, setOpenUseCases, setOpenAssociatedUsers, setAdditionalValues, reset]);

  const handleDetailPanelClose = useCallback(() => {
    setOpenUseCases(false);
    setOpenAssociatedUsers(false);
    setAdditionalValues({ useCases: [], associatedUsers: [] });
    dispatch(setSelectedProjectDetails({}));
    dispatch(resetProjectDetailsMode());
  }, [dispatch, setOpenUseCases, setOpenAssociatedUsers, setAdditionalValues]);

  const handleEditButtonClick = useCallback(
    id => {
      handleDetailPanelClose();
      dispatch(backendService.getProjectById(id));
      dispatch(setEditMode(EDIT_MODE.EDIT_PROJECT));
    },
    [dispatch, setEditMode, backendService]
  );

  const handleClick = useCallback(
    (val, fieldName) => {
      if (fieldName === 'useCases') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
      if (fieldName === 'associatedUsers') {
        const containsVal = additionalValues?.[fieldName]?.find(el => el.id === val.id);
        if (containsVal) {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.filter(el => el.id !== val.id) });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.concat(val) });
        }
      }
    },
    [additionalValues, setAdditionalValues]
  );

  const handleUseCasesOpen = () => {
    setOpenAssociatedUsers(false);
    setOpenUseCases(true);
  };

  const handleAssociatedUserOpen = () => {
    setOpenUseCases(false);
    setOpenAssociatedUsers(true);
  };

  const handleUseCasesRemove = val => {
    handleClick(val, 'useCases');
    if (additionalValues?.useCases?.length === 0) {
      setOpenAssociatedUsers(false);
      setOpenUseCases(true);
    }
  };

  const handleAssociatedUsersRemove = val => {
    handleClick(val, 'associatedUsers');
    if (additionalValues?.associatedUsers?.length === 0) {
      setOpenUseCases(false);
      setOpenAssociatedUsers(true);
    }
  };

  const submitForm = data => {
    const associatedUserIds = additionalValues?.associatedUsers?.map(usr => usr.id);
    const finalData = {
      id: selectedProjectDetails?.id,
      ...data,
      ...additionalValues,
      associatedUsers: associatedUserIds,
      companyId: selectedProjectDetails?.companyId,
    };
    setOpenUseCases(false);
    setOpenAssociatedUsers(false);
    dispatch(backendService.updateProject(finalData));
  };

  // effect
  useEffect(() => {
    if (isEditProjectMode) {
      reset({
        title: selectedProjectDetails?.title,
      });
      initSelectedProjectData();
    }
  }, [isEditProjectMode, reset, selectedProjectDetails, initSelectedProjectData]);

  //Get list of all use cases for selected value match
  useEffect(async () => {
    const initialValues = await dispatch(backendService.getUseCasesByParams({ archived: false, order: [['name', 'asc']] }));
    let useCaseValuesToRetrieve = initialValues?.payload?.usecases || [];
    if (initialValues?.payload?.numPages > 1) {
      /* eslint-disable no-await-in-loop */
      for (let x = 1; x < initialValues?.payload?.numPages; x += 1) {
        const additionalValues = await dispatch(backendService.getUseCasesByParams({ archived: false, page: x, order: [['name', 'asc']] }));
        const arrayValue = additionalValues?.payload?.usecases || [];
        useCaseValuesToRetrieve = [...useCaseValuesToRetrieve, ...arrayValue];
      }
    }
    setUseCaseList(useCaseValuesToRetrieve);
    await dispatch(backendService.getUseCasesByParams({ archived: false, order: [['name', 'asc']] }));
  }, []);

  return (
    <div>
      <SidePanelEdgePatch showPatch={openUseCases || openAssociatedUsers} useLeft="430px" style={{ height: '150vh' }} />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={!isEmpty(selectedProjectDetails) || !isEmpty(projectDetails)}
      />
      {isViewProjectMode && (
        <SwipeableDrawer
          disableEnforceFocus
          hideBackdrop
          anchor="left"
          open={!isEmpty(projectDetails)}
          onClose={() => handleDetailPanelClose()}
          onOpen={() => {}}
          PaperProps={{
            style: {
              marginLeft: '8px',
              borderRadius: '30px',
              boxShadow: 'unset',
              border: 'unset',
            },
          }}>
          <Box sx={{ minWidth: 350, position: 'relative' }} role="presentation">
            <SidePanelMainWrapper>
              <SidePanelHeaderWrapper paddingBottom="0px">
                <SidePanelHeaderText>Project Details</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handleDetailPanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                {isAdminOrSA && (
                  <SidePanelContentWrapper onClick={() => handleEditButtonClick(projectDetails?.id)}>
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                      icon={BUTTON_ICON.EDIT}
                      buttonText="Edit Project"
                      type="button"
                      padding="0"
                    />
                  </SidePanelContentWrapper>
                )}
                <SidePanelLine />
                <SidePanelContentWrapper>
                  <ValueText>Company</ValueText>
                  <SidePanelDetailsText>{viewProjectDetails?.company?.name}</SidePanelDetailsText>
                </SidePanelContentWrapper>
                <SidePanelLine />
                <SidePanelContentWrapper>
                  <ValueText>Project Name</ValueText>
                  <SidePanelDetailsText>{projectDetails?.title}</SidePanelDetailsText>
                </SidePanelContentWrapper>
                {!isEmpty(projectDetails?.useCases) && (
                  <>
                    <SidePanelLine />
                    <SidePanelContentWrapper>
                      <LabelContainer>
                        <ValueText>Use Cases</ValueText>
                      </LabelContainer>
                      {projectDetails?.useCases?.map(id => (
                        <FilledDetailedWrapper key={`key-${id}`}>
                          <FilledValueText>{getNameFromId(id, useCaseList)}</FilledValueText>
                        </FilledDetailedWrapper>
                      ))}
                    </SidePanelContentWrapper>
                  </>
                )}
                {!isEmpty(projectDetails?.associatedUsers) && (
                  <>
                    <SidePanelLine />
                    <SidePanelContentWrapper>
                      <LabelContainer>
                        <ValueText>Associated Users</ValueText>
                      </LabelContainer>
                      {projectDetails?.associatedUsers?.map(el => (
                        <FilledDetailedWrapper key={`key-${el?.id}`}>
                          <UserListItemMainContainer>
                            <UserListItemTextInner>
                              <UserListSecondaryText>{el?.firstName}</UserListSecondaryText> <UserListPrimaryText>{el?.lastName}</UserListPrimaryText>
                            </UserListItemTextInner>
                            <CustomChip label={getRoleName(el?.role)} />
                          </UserListItemMainContainer>
                        </FilledDetailedWrapper>
                      ))}
                    </SidePanelContentWrapper>
                  </>
                )}
              </SidePanelContentWrapper>
            </SidePanelMainWrapper>
            <SidePanelSaveButtonWrapper customLeft="30px" onClick={() => launchModeler()}>
              <CustomButton buttonStyle={BUTTON_STYLE.ROUNDED_STYLE} buttonText="Launch Modeler" customMinWidth="300px" customMinHeight="56px" />
            </SidePanelSaveButtonWrapper>
          </Box>
        </SwipeableDrawer>
      )}
      {isEditProjectMode && (
        <>
          <SwipeableDrawer
            disableEnforceFocus
            hideBackdrop
            anchor="left"
            open={!isEmpty(selectedProjectDetails)}
            onClose={() => handleDetailPanelClose()}
            onOpen={() => {}}
            PaperProps={{
              style: {
                marginLeft: '8px',
                borderRadius: '30px',
                boxShadow: 'unset',
                border: 'unset',
              },
            }}>
            <form onSubmit={handleSubmit(submitForm)} style={{ position: 'relative' }}>
              <Box sx={{ minWidth: 350, position: 'relative' }} role="presentation">
                <SidePanelMainWrapper>
                  <SidePanelHeaderWrapper>
                    <SidePanelHeaderText>Edit Project</SidePanelHeaderText>
                    <SidePanelHeaderCloseBtn>
                      <CloseIcon onClick={handlePanelClose} />
                    </SidePanelHeaderCloseBtn>
                  </SidePanelHeaderWrapper>
                  <SidePanelContentWrapper>
                    <SidePanelContentItem>
                      <LabelText>Company</LabelText>
                      <ValueText>{companyName}</ValueText>
                    </SidePanelContentItem>
                    <SidePanelContentItem>
                      <TextInput
                        id="title"
                        label="Project Title"
                        placeholder=""
                        variant="standard"
                        required
                        register={register}
                        autoFocus="false"
                        customWidth="400px"
                      />
                    </SidePanelContentItem>
                    <SidePanelContentItem>
                      {(!isEmpty(additionalValues?.useCases) || openUseCases) && (
                        <LabelContainer onClick={() => handleUseCasesOpen()}>
                          <LabelText>Use Cases</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.useCases) &&
                        additionalValues?.useCases?.map(id => (
                          <FilledValueWrapper key={`key-${id}`}>
                            <FilledValueText>{getNameFromId(id, useCaseList)}</FilledValueText>
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleUseCasesRemove(id)}
                              />
                            </FilledValueRemoveIcon>
                          </FilledValueWrapper>
                        ))}
                      {isEmpty(additionalValues?.useCases) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add Use Case"
                          marginTop="60px"
                          type="button"
                          customMinWidth="400px"
                          customMinHeight="50px"
                          onClickFunc={() => handleUseCasesOpen()}
                        />
                      )}
                      <DRDivider />
                    </SidePanelContentItem>
                    <SidePanelContentItem>
                      {(!isEmpty(additionalValues?.associatedUsers) || openAssociatedUsers) && (
                        <LabelContainer onClick={() => handleAssociatedUserOpen()}>
                          <LabelText>Associated Users</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.associatedUsers) &&
                        additionalValues?.associatedUsers?.map(el => (
                          <FilledValueWrapper key={`key-${el?.id}`}>
                            <UserListItemMainContainer>
                              <UserListItemTextInner onClick={() => {}}>
                                {(el?.firstName?.length || 0) + (el?.lastName?.length || 0) > 20 && (
                                  <>
                                    {(el?.firstName?.length || 0) > 20 && <UserListSecondaryText>{el?.firstName?.substring(0, 20)} ...</UserListSecondaryText>}
                                    {(el?.firstName?.length || 0) <= 20 && (
                                      <>
                                        <UserListSecondaryText>{el?.firstName}</UserListSecondaryText>
                                        <UserListPrimaryText>{el?.lastName?.substring(0, 19 - el.firstName.length || 1)} ...</UserListPrimaryText>
                                      </>
                                    )}
                                  </>
                                )}
                                {(el?.firstName?.length || 0) + (el?.lastName?.length || 0) <= 20 && (
                                  <>
                                    <UserListSecondaryText>{el?.firstName}</UserListSecondaryText>
                                    <UserListPrimaryText>{el?.lastName}</UserListPrimaryText>
                                  </>
                                )}
                              </UserListItemTextInner>
                              <CustomChip label={getRoleName(el?.role)} />
                            </UserListItemMainContainer>
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleAssociatedUsersRemove(el)}
                              />
                            </FilledValueRemoveIcon>
                          </FilledValueWrapper>
                        ))}
                      {isEmpty(additionalValues?.associatedUsers) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add User"
                          marginTop="60px"
                          type="button"
                          customMinWidth="400px"
                          customMinHeight="50px"
                          onClickFunc={() => handleAssociatedUserOpen()}
                        />
                      )}
                    </SidePanelContentItem>
                  </SidePanelContentWrapper>
                </SidePanelMainWrapper>
                <SidePanelSaveButtonWrapper customLeft="75px">
                  <CustomButton
                    buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                    buttonText="Save Changes"
                    type="submit"
                    customMinWidth="300px"
                    customMinHeight="56px"
                  />
                </SidePanelSaveButtonWrapper>
              </Box>
            </form>
          </SwipeableDrawer>
          {openUseCases && (
            <SelectionPanel
              options={useCaseList}
              openIndustry={openUseCases}
              setOpenIndustry={setOpenUseCases}
              additionalValues={additionalValues}
              handleClick={handleClick}
              isUseCase
              leftPositionDrawerContainer={480}
            />
          )}
          <AssociatedUsersPanel
            openAssociatedUsers={openAssociatedUsers}
            setOpenAssociatedUsers={setOpenAssociatedUsers}
            additionalValues={additionalValues}
            handleClick={handleClick}
            leftPositionDrawerContainer={480}
          />
          <UserDetails />
          <AddUserPanel isAddCustomer associateToCompany associateToProject />
        </>
      )}
    </div>
  );
}

ProjectDetails.propTypes = {
  isAdminOrSA: PropTypes.bool,
};

ProjectDetails.defaultProps = {
  isAdminOrSA: false,
};

export default ProjectDetails;

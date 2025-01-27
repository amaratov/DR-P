import React, { useCallback, useEffect, useState } from 'react';
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
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSaveButtonWrapper,
} from '../../side-panel/side-panel-styled';
import TextInput from '../../form-elements/text-input';
import {
  FilledValueRemoveIcon,
  FilledValueText,
  FilledValueWrapper,
  LabelContainer,
  LabelIcon,
  LabelText,
  ValueText,
} from '../account-info/account-info-styled';
import { isEmpty } from '../../../utils/utils';
import CustomButton from '../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';
import { UserListItemMainContainer, UserListItemTextInner, UserListPrimaryText, UserListSecondaryText } from '../admin-panel/user-management/user-list-styled';
import CustomChip from '../../chip/custom-chip';
import SelectionPanel from '../selection-panel/selection-panel';
import AssociatedUsersPanel from '../associated-users/associated-users-panel';
import UserDetails from '../user-details/user-details';
import AddUserPanel from '../add-user/add-user-panel';
import { getAddProjectMode } from '../../../features/selectors/ui';
import { resetAddProjectMode, setSelectedProjectDetails } from '../../../features/slices/uiSlice';
import { backendService } from '../../../services/backend';
import { DRDivider } from '../../app/app-styled';

function AddProjectPanel() {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // selectors
  const addProjectMode = useSelector(getAddProjectMode);
  const isAddProjectMode = addProjectMode?.open;

  // state
  const [openUseCases, setOpenUseCases] = useState(false);
  const [openAssociatedUsers, setOpenAssociatedUsers] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({ useCases: [], associatedUsers: [] });
  const [useCaseList, setUseCaseList] = useState([]);
  const [isDisableCreateProject, setIsDisableCreateProject] = useState(false);

  // func
  const mapUseCaseIdToName = id => {
    return useCaseList?.find(useCase => useCase.id === id)?.name || 'unknown';
  };

  const handlePanelClose = useCallback(() => {
    setOpenUseCases(false);
    setOpenAssociatedUsers(false);
    reset();
    setAdditionalValues({ useCases: [], associatedUsers: [] });
    dispatch(resetAddProjectMode());
    dispatch(setSelectedProjectDetails({}));
  }, [dispatch, setOpenUseCases, setOpenAssociatedUsers, setAdditionalValues, reset]);

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
    setIsDisableCreateProject(true);
    const associatedUserIds = additionalValues?.associatedUsers?.map(usr => usr.id);
    const finalData = {
      ...data,
      ...additionalValues,
      associatedUsers: associatedUserIds,
      companyId: addProjectMode?.companyDetails?.id,
    };
    setOpenUseCases(false);
    setOpenAssociatedUsers(false);
    dispatch(backendService.createProject(finalData));
    dispatch(setSelectedProjectDetails({}));
    setTimeout(() => {
      setIsDisableCreateProject(false);
    }, 1000);
  };

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
        open={isAddProjectMode}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={isAddProjectMode}
        onClose={() => {}}
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
                <SidePanelHeaderText>Create a Project</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem>
                  <LabelText>Company</LabelText>
                  <ValueText>{addProjectMode?.companyDetails?.name}</ValueText>
                  <CustomButton
                    buttonStyle={BUTTON_STYLE.MINI_OUTLINED_DIV_STYLE}
                    icon={BUTTON_ICON.LINK}
                    buttonText="Change Company"
                    marginTop="20px"
                    type="button"
                    customMinWidth="150px"
                    customMinHeight="20px"
                    onClickFunc={() => {}}
                  />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  <TextInput
                    id="title"
                    label="Project Title"
                    placeholder=""
                    variant="standard"
                    register={register}
                    autoFocus="false"
                    error={errors?.title}
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
                    additionalValues?.useCases?.map(el => (
                      <FilledValueWrapper key={`key-${el}`}>
                        <FilledValueText>{mapUseCaseIdToName(el)}</FilledValueText>
                        <FilledValueRemoveIcon>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleUseCasesRemove(el)}
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
                          <CustomChip label={el?.role.toLowerCase()} />
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
                buttonText="Create Project"
                type="submit"
                customMinWidth="300px"
                customMinHeight="50px"
                disableButton={isDisableCreateProject}
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
          leftPositionDrawerContainer={475}
        />
      )}
      {openAssociatedUsers && (
        <AssociatedUsersPanel
          openAssociatedUsers={openAssociatedUsers}
          setOpenAssociatedUsers={setOpenAssociatedUsers}
          additionalValues={additionalValues}
          handleClick={handleClick}
          leftPositionDrawerContainer={475}
        />
      )}
      <UserDetails />
      <AddUserPanel isAddCustomer associateToCompany associateToProject />
    </div>
  );
}

AddProjectPanel.propTypes = {};

export default AddProjectPanel;

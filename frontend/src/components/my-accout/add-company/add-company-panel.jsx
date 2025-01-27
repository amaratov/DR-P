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
import CustomButton from '../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';
import { FilledValueRemoveIcon, FilledValueText, FilledValueWrapper, LabelContainer, LabelIcon, LabelText } from '../account-info/account-info-styled';
import TextInput from '../../form-elements/text-input';
import { getAddCompanyMode } from '../../../features/selectors/ui';
import { resetAddCompanyMode } from '../../../features/slices/uiSlice';
import { isEmpty } from '../../../utils/utils';
import SelectionPanel from '../selection-panel/selection-panel';
import SalesForcePanel from '../sales-force/sales-force-panel';
import { backendService } from '../../../services/backend';
import AssociatedUsersPanel from '../associated-users/associated-users-panel';
import { UserListItemMainContainer, UserListItemTextInner, UserListPrimaryText, UserListSecondaryText } from '../admin-panel/user-management/user-list-styled';
import CustomChip from '../../chip/custom-chip';
import AddUserPanel from '../add-user/add-user-panel';
import { DRDivider } from '../../app/app-styled';

function AddCompanyPanel() {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  // selectors
  const isAddCompanyMode = useSelector(getAddCompanyMode);

  // state
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openSalesForce, setOpenSalesForce] = useState(false);
  const [openAssociatedUsers, setOpenAssociatedUsers] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({ industryVertical: [], salesforceId: [], associatedUsers: [] });
  const [industryVerticalList, setIndustryVerticalList] = useState([]);

  // func
  const mapIndustryVerticalIdToName = id => {
    return industryVerticalList?.find(industryVert => industryVert.id === id)?.name || 'unknown';
  };

  const handlePanelClose = useCallback(() => {
    setOpenIndustry(false);
    setOpenSalesForce(false);
    setOpenAssociatedUsers(false);
    reset();
    setAdditionalValues({ industryVertical: [], salesforceId: [], associatedUsers: [] });
    dispatch(resetAddCompanyMode());
  }, [dispatch, setOpenIndustry, setOpenSalesForce, setOpenAssociatedUsers, setAdditionalValues, reset]);

  const handleClick = useCallback(
    (val, fieldName) => {
      if (fieldName === 'industryVertical') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
      if (fieldName === 'salesforceId') {
        const containsVal = additionalValues?.[fieldName]?.find(el => el.field === val.field && el.id === val.id);
        if (containsVal) {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.filter(el => el.field !== val.field && el.id !== val.id) });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.concat(val) });
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

  const handleIndustryOpen = () => {
    setOpenSalesForce(false);
    setOpenAssociatedUsers(false);
    setOpenIndustry(true);
  };

  const handleSaleForceOpen = () => {
    setOpenIndustry(false);
    setOpenAssociatedUsers(false);
    setOpenSalesForce(true);
  };

  const handleAssociatedUserOpen = () => {
    setOpenIndustry(false);
    setOpenSalesForce(false);
    setOpenAssociatedUsers(true);
  };

  const handleIndustryRemove = val => {
    handleClick(val, 'industryVertical');
    if (additionalValues?.industryVertical?.length === 0) {
      setOpenSalesForce(false);
      setOpenAssociatedUsers(false);
      setOpenIndustry(true);
    }
  };

  const handleSaleForceRemove = val => {
    handleClick(val, 'salesforceId');
    if (additionalValues?.salesforceId?.length === 0) {
      setOpenIndustry(false);
      setOpenAssociatedUsers(false);
      setOpenSalesForce(true);
    }
  };

  const handleAssociatedUsersRemove = val => {
    handleClick(val, 'associatedUsers');
    if (additionalValues?.associatedUsers?.length === 0) {
      setOpenIndustry(false);
      setOpenSalesForce(false);
      setOpenAssociatedUsers(true);
    }
  };

  const handleFormChange = () => {
    const currentFormValues = getValues();
    if (!isEmpty(currentFormValues?.name) && disableSubmit) setDisableSubmit(false);
    if (isEmpty(currentFormValues?.name) && !disableSubmit) setDisableSubmit(true);
  };

  const submitForm = data => {
    const associatedUserIds = additionalValues?.associatedUsers?.map(usr => usr.id);
    const finalData = {
      ...data,
      ...additionalValues,
      associatedUsers: associatedUserIds,
    };
    setOpenIndustry(false);
    setOpenSalesForce(false);
    setOpenAssociatedUsers(false);
    dispatch(backendService.createCompany(finalData));
  };

  //Get list of all industry verticals for selected value match
  useEffect(async () => {
    const initialValues = await dispatch(backendService.getIndustryVerticalByParams({ archived: false, order: [['name', 'asc']] }));
    let industryVerticalValuesToRetrieve = initialValues?.payload?.industryverticals || [];
    if (initialValues?.payload?.numPages > 1) {
      /* eslint-disable no-await-in-loop */
      for (let x = 1; x < initialValues?.payload?.numPages; x += 1) {
        const additionalValues = await dispatch(backendService.getIndustryVerticalByParams({ archived: false, page: x, order: [['name', 'asc']] }));
        const arrayValue = additionalValues?.payload?.industryverticals || [];
        industryVerticalValuesToRetrieve = [...industryVerticalValuesToRetrieve, ...arrayValue];
      }
    }
    setIndustryVerticalList(industryVerticalValuesToRetrieve);
    await dispatch(backendService.getIndustryVerticalByParams({ archived: false, order: [['name', 'asc']] }));
  }, []);

  // mui drawer need to have the disableEnforceFocus
  // otherwise text fields on other component on the same screen won't get focused
  return (
    <div>
      <SidePanelEdgePatch showPatch={openIndustry || openSalesForce || openAssociatedUsers} useLeft="430px" style={{ height: '100vh' }} />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={isAddCompanyMode}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={isAddCompanyMode}
        onClose={() => {}}
        onOpen={() => {}}
        PaperProps={{
          style: {
            marginLeft: '8px',
            borderRadius: '30px',
            boxShadow: 'unset',
            border: 'unset',
            maxWidth: '500px',
          },
        }}>
        <form onChange={handleFormChange} onSubmit={handleSubmit(submitForm)} style={{ position: 'relative' }}>
          <Box sx={{ minWidth: 350, position: 'relative' }} role="presentation">
            <SidePanelMainWrapper>
              <SidePanelHeaderWrapper>
                <SidePanelHeaderText>Add a Company</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem>
                  <TextInput
                    id="name"
                    label="Company Name"
                    placeholder="Untitled Company"
                    variant="standard"
                    required
                    register={register}
                    autoFocus="false"
                    error={errors?.name}
                    customWidth="400px"
                  />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.industryVertical) || openIndustry) && (
                    <LabelContainer onClick={() => handleIndustryOpen()}>
                      <LabelText>Industry Vertical</LabelText>
                      <LabelIcon>
                        <ArrowForwardIosIcon />
                      </LabelIcon>
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.industryVertical) &&
                    additionalValues?.industryVertical?.map(id => (
                      <FilledValueWrapper key={`key-${id}`}>
                        <FilledValueText>{mapIndustryVerticalIdToName(id)}</FilledValueText>
                        <FilledValueRemoveIcon>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleIndustryRemove(id)}
                          />
                        </FilledValueRemoveIcon>
                      </FilledValueWrapper>
                    ))}
                  {isEmpty(additionalValues?.industryVertical) && !openIndustry && (
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Industry Vertical"
                      marginTop="60px"
                      type="button"
                      customMinWidth="400px"
                      customMinHeight="50px"
                      onClickFunc={() => handleIndustryOpen()}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.salesforceId) || openSalesForce) && (
                    <LabelContainer onClick={() => handleSaleForceOpen()}>
                      <LabelText>Salesforce ID</LabelText>
                      <LabelIcon>
                        <ArrowForwardIosIcon />
                      </LabelIcon>
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.salesforceId) &&
                    additionalValues?.salesforceId?.map(el => (
                      <FilledValueWrapper>
                        <FilledValueText>
                          {el?.field} | {el?.id}
                        </FilledValueText>
                        <FilledValueRemoveIcon>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleSaleForceRemove(el)}
                          />
                        </FilledValueRemoveIcon>
                      </FilledValueWrapper>
                    ))}
                  {isEmpty(additionalValues?.salesforceId) && !openSalesForce && (
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Salesforce ID"
                      marginTop="60px"
                      type="button"
                      customMinWidth="400px"
                      customMinHeight="50px"
                      onClickFunc={() => handleSaleForceOpen()}
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
                  {isEmpty(additionalValues?.associatedUsers) && !openAssociatedUsers && (
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Associated Users"
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
                buttonText="Add Company"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
                disabled={disableSubmit}
              />
            </SidePanelSaveButtonWrapper>
          </Box>
        </form>
      </SwipeableDrawer>
      {openIndustry && (
        <SelectionPanel
          options={industryVerticalList}
          openIndustry={openIndustry}
          setOpenIndustry={setOpenIndustry}
          additionalValues={additionalValues}
          handleClick={handleClick}
          leftPositionDrawerContainer={475}
        />
      )}
      <SalesForcePanel openSalesForce={openSalesForce} setOpenSalesForce={setOpenSalesForce} handleClick={handleClick} leftPositionDrawerContainer={475} />
      <AssociatedUsersPanel
        isAddOrEditCompany
        openAssociatedUsers={openAssociatedUsers}
        setOpenAssociatedUsers={setOpenAssociatedUsers}
        additionalValues={additionalValues}
        handleClick={handleClick}
        leftPositionDrawerContainer={475}
      />
      <AddUserPanel isAddCustomer associateToCompany associateToProject />
    </div>
  );
}

export default AddCompanyPanel;

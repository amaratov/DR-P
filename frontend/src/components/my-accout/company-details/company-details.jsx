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
import { BUTTON_ICON, BUTTON_STYLE, DETAILS_MODE, EDIT_MODE, Roles, TABS } from '../../../utils/constants/constants';
import { FilledValueRemoveIcon, FilledValueText, FilledValueWrapper, LabelContainer, LabelIcon, LabelText } from '../account-info/account-info-styled';
import TextInput from '../../form-elements/text-input';
import {
  getClientPortfolioTab,
  getDetailsMode,
  getEditMode,
  getPageNum,
  getSelectedCompanyDetails,
  getSortOrder,
  getSortOrderBy,
} from '../../../features/selectors/ui';
import { resetAddCompanyMode, resetDetailsMode, resetEditMode, setSelectedCompanyDetails } from '../../../features/slices/uiSlice';
import SelectionPanel from '../selection-panel/selection-panel';
import SalesForcePanel from '../sales-force/sales-force-panel';
import CustomChip from '../../chip/custom-chip';
import UserDetails from '../user-details/user-details';
import AddUserPanel from '../add-user/add-user-panel';
import AssociatedUsersPanel from '../associated-users/associated-users-panel';
import { UserListItemMainContainer, UserListItemTextInner, UserListPrimaryText, UserListSecondaryText } from '../admin-panel/user-management/user-list-styled';
import { isEmpty } from '../../../utils/utils';
import { backendService } from '../../../services/backend';
import { getAllRoles } from '../../../features/selectors';
import { DRDivider } from '../../app/app-styled';

function CompanyDetails() {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const { register, handleSubmit, reset } = useForm();

  // selectors
  const editMode = useSelector(getEditMode);
  const detailsMode = useSelector(getDetailsMode);
  const selectedCompanyDetails = useSelector(getSelectedCompanyDetails);
  const allRoles = useSelector(getAllRoles);
  const portfolioActiveTab = useSelector(getClientPortfolioTab);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // state
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openSalesForce, setOpenSalesForce] = useState(false);
  const [openAssociatedUsers, setOpenAssociatedUsers] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({ industryVertical: [], salesforceId: [], associatedUsers: [] });
  const [industryVerticalList, setIndustryVerticalList] = useState([]);

  // const
  const isEditCompanyMode = editMode === EDIT_MODE.EDIT_COMPANY;
  const isDetailsMode = detailsMode === DETAILS_MODE.COMPANY_DETAILS;

  // func
  const mapIndustryVerticalIdToName = id => {
    return industryVerticalList?.find(industryVert => industryVert.id === id)?.name || 'unknown';
  };

  const getRoleName = id => {
    if (Roles.includes(id.toLowerCase())) return id;
    return allRoles?.find(role => role.id === id)?.name || '';
  };

  const initSelectedCompanyData = useCallback(() => {
    if (!isEmpty(selectedCompanyDetails)) {
      setAdditionalValues({
        industryVertical: selectedCompanyDetails?.industryVertical || [],
        salesforceId: selectedCompanyDetails?.salesforceId || [],
        associatedUsers: selectedCompanyDetails?.associatedUsers || [],
      });
    }
  }, [selectedCompanyDetails, setAdditionalValues]);

  const handlePanelClose = useCallback(() => {
    setOpenIndustry(false);
    setOpenSalesForce(false);
    setOpenAssociatedUsers(false);
    reset();
    setAdditionalValues({ industryVertical: [], salesforceId: [], associatedUsers: [] });
    dispatch(setSelectedCompanyDetails({}));
    dispatch(resetEditMode());
    dispatch(resetDetailsMode());
    dispatch(resetAddCompanyMode());
    const sortOrderBy =
      orderBy === 'projectCount'
        ? [
            ['name', order],
            ['id', order],
            ['industryVertical', order],
          ]
        : [[orderBy, order]];
    if (portfolioActiveTab === TABS.ALL_COMPANIES) {
      dispatch(backendService.getCompaniesByParams({ archived: false, page, order: sortOrderBy }));
    }
    if (portfolioActiveTab === TABS.ARCHIVED_COMPANIES) {
      dispatch(backendService.getCompaniesByParams({ archived: true, page, order: sortOrderBy }));
    }
    if (portfolioActiveTab === TABS.MY_COMPANIES) {
      dispatch(backendService.getMyCompaniesByParams({ archived: false, page, order: sortOrderBy }));
    }
  }, [dispatch, portfolioActiveTab, setOpenIndustry, setOpenSalesForce, setOpenAssociatedUsers, setAdditionalValues, reset]);

  const handleClick = useCallback(
    (val, fieldName) => {
      if (fieldName === 'industryVertical') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(id => id !== val);
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

  const submitForm = data => {
    const associatedUserIds = additionalValues?.associatedUsers?.map(usr => usr.id);
    const finalData = {
      id: selectedCompanyDetails?.id,
      ...data,
      ...additionalValues,
      associatedUsers: associatedUserIds,
    };
    setOpenIndustry(false);
    setOpenSalesForce(false);
    setOpenAssociatedUsers(false);
    dispatch(backendService.updateCompany(finalData));
  };

  // effect
  useEffect(() => {
    if (isEditCompanyMode || isDetailsMode) {
      reset({
        name: selectedCompanyDetails?.name,
      });
      initSelectedCompanyData();
    }
  }, [isEditCompanyMode, reset, selectedCompanyDetails, initSelectedCompanyData]);

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
        open={!isEmpty(selectedCompanyDetails)}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={!isEmpty(selectedCompanyDetails)}
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
                <SidePanelHeaderText>{isDetailsMode ? 'Company Details' : 'Edit Company'}</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem>
                  <TextInput
                    id="name"
                    label="Company Name"
                    placeholder=""
                    variant="standard"
                    required
                    register={register}
                    autoFocus="false"
                    customWidth="400px"
                    disabled={isDetailsMode}
                  />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.industryVertical) || openIndustry) && (
                    <LabelContainer
                      onClick={() => {
                        if (!isDetailsMode) {
                          handleIndustryOpen();
                        }
                      }}>
                      <LabelText>Industry Vertical</LabelText>
                      {!isDetailsMode && (
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      )}
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.industryVertical) && (
                    <>
                      {additionalValues?.industryVertical?.map(id => (
                        <FilledValueWrapper key={`key-${id}`}>
                          <FilledValueText>{mapIndustryVerticalIdToName(id)}</FilledValueText>
                          {!isDetailsMode && (
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleIndustryRemove(id)}
                              />
                            </FilledValueRemoveIcon>
                          )}
                        </FilledValueWrapper>
                      ))}
                      {isDetailsMode && <DRDivider />}
                    </>
                  )}
                  {isEmpty(additionalValues?.industryVertical) && !isDetailsMode && (
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
                  {!isDetailsMode && <DRDivider />}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.salesforceId) || openSalesForce) && (
                    <LabelContainer
                      onClick={() => {
                        if (!isDetailsMode) {
                          handleSaleForceOpen();
                        }
                      }}>
                      <LabelText>Salesforce ID</LabelText>
                      {!isDetailsMode && (
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      )}
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.salesforceId) && (
                    <>
                      {additionalValues?.salesforceId?.map(el => (
                        <FilledValueWrapper>
                          <FilledValueText>
                            {el?.field} | {el?.id}
                          </FilledValueText>
                          {!isDetailsMode && (
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleSaleForceRemove(el)}
                              />
                            </FilledValueRemoveIcon>
                          )}
                        </FilledValueWrapper>
                      ))}
                      {isDetailsMode && <DRDivider />}
                    </>
                  )}
                  {isEmpty(additionalValues?.salesforceId) && !isDetailsMode && (
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
                  {!isDetailsMode && <DRDivider />}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.associatedUsers) || openAssociatedUsers) && (
                    <LabelContainer
                      onClick={() => {
                        if (!isDetailsMode) {
                          handleAssociatedUserOpen();
                        }
                      }}>
                      <LabelText>Associated Users</LabelText>
                      {!isDetailsMode && (
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      )}
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.associatedUsers) && (
                    <>
                      {additionalValues?.associatedUsers?.map(el => (
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
                          {!isDetailsMode && (
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleAssociatedUsersRemove(el)}
                              />
                            </FilledValueRemoveIcon>
                          )}
                        </FilledValueWrapper>
                      ))}
                      {isDetailsMode && <DRDivider />}
                    </>
                  )}
                  {isEmpty(additionalValues?.associatedUsers) && !isDetailsMode && (
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
            {!isDetailsMode && (
              <SidePanelSaveButtonWrapper customLeft="75px">
                <CustomButton buttonStyle={BUTTON_STYLE.ROUNDED_STYLE} buttonText="Save Changes" type="submit" customMinWidth="300px" customMinHeight="56px" />
              </SidePanelSaveButtonWrapper>
            )}
          </Box>
        </form>
      </SwipeableDrawer>
      <SelectionPanel
        options={industryVerticalList}
        openIndustry={openIndustry}
        setOpenIndustry={setOpenIndustry}
        additionalValues={additionalValues}
        handleClick={handleClick}
        leftPositionDrawerContainer={475}
      />
      <SalesForcePanel openSalesForce={openSalesForce} setOpenSalesForce={setOpenSalesForce} handleClick={handleClick} leftPositionDrawerContainer={475} />
      <AssociatedUsersPanel
        openAssociatedUsers={openAssociatedUsers}
        setOpenAssociatedUsers={setOpenAssociatedUsers}
        additionalValues={additionalValues}
        handleClick={handleClick}
        leftPositionDrawerContainer={475}
      />
      <UserDetails />
      <AddUserPanel isAddCustomer />
    </div>
  );
}

export default CompanyDetails;

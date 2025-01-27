import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Backdrop, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Icon from '@mdi/react';
import { mdiFileOutline } from '@mdi/js';
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
  SidePanelFileInactiveText,
  FileText,
} from '../../../../../side-panel/side-panel-styled';
import CustomButton from '../../../../../form-elements/custom-button';
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  EDIT_MODE,
  FEATURE_CONFIG,
  HUB_OPTIONS,
  PANELS,
  PARTNER_OPTIONS,
  TECHNOLOGY_OPTIONS,
  TYPE_OPTIONS,
} from '../../../../../../utils/constants/constants';
import {
  FilledValueRemoveIcon,
  FilledValueText,
  FilledValueWrapper,
  LabelContainer,
  LabelIcon,
  LabelText,
  LabelTextAltColor,
  ValueText,
} from '../../../../account-info/account-info-styled';
import TextInput from '../../../../../form-elements/text-input';
import { getEditMode, getSelectedReferenceDocDetails } from '../../../../../../features/selectors/ui';
import { resetEditMode, setRecentlyEdited, setSelectedReferenceDocDetails } from '../../../../../../features/slices/uiSlice';
import SelectionPanel from '../../../../selection-panel/selection-panel';
import { getNameFromId, isEmpty } from '../../../../../../utils/utils';
import { backendService } from '../../../../../../services/backend';
import { getIndustryVerticals, getOtherTags } from '../../../../../../features/selectors/common';
import { DRDivider } from '../../../../../app/app-styled';
import { getAllActiveUseCases, getHasLoadedUseCases } from '../../../../../../features/selectors/useCase';
import DuplicateNameError from '../../../../upload-error/duplicate-name-error';
import { getHasLoadedIndustryVerticals } from '../../../../../../features/selectors/industryVertical';
import SearchInput from '../../../../../search/search-input';
import { canAccessFeature } from '../../../../../../features/selectors';

function ReferenceArchitectureDetails({ referenceArchitectures, setAllReferenceArchitecture }) {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const { register, handleSubmit, reset } = useForm();

  // selectors
  const editMode = useSelector(getEditMode);
  const selectedReferenceDocDetails = useSelector(getSelectedReferenceDocDetails);
  const industryVerticals = useSelector(getIndustryVerticals);
  const otherTags = useSelector(getOtherTags);
  const hasLoadedIndustryVerticals = useSelector(getHasLoadedIndustryVerticals);
  const hasLoadedUseCases = useSelector(getHasLoadedUseCases);
  const canAccessAdminPanelEdit = useSelector(state => canAccessFeature(state, 'ADMIN_PANEL_EDIT'));
  const useCases = useSelector(getAllActiveUseCases);

  // state
  const [openType, setOpenType] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openUseCases, setOpenUseCases] = useState(false);
  const [openPartners, setOpenPartners] = useState(false);
  const [openTechnologies, setOpenTechnologies] = useState(false);
  const [openHub, setOpenHub] = useState(false);
  const [openOtherTags, setOpenOtherTags] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isGreyOut, setIsGreyOut] = useState(true);
  const [additionalValues, setAdditionalValues] = useState({
    originalFileName: '',
    documentName: '',
    types: [],
    industryVertical: [],
    useCases: [],
    partners: [],
    technologies: [],
    hub: [],
    otherTags: [],
  });
  const [industryVerticalList, setIndustryVerticalList] = useState([]);
  const [useCaseList, setUseCaseList] = useState([]);
  const [initialName, setInitialName] = useState('');

  // const
  const isEditReferenceMode = editMode === EDIT_MODE.EDIT_REFERENCE && canAccessAdminPanelEdit;

  // func
  const mapUseCaseIdToName = id => {
    return useCaseList?.find(useCase => useCase.id === id)?.name || 'unknown';
  };
  const mapIndustryVerticalIdToName = id => {
    return industryVerticalList?.find(industryVert => industryVert.id === id)?.name || 'unknown';
  };
  const initSelectedReferenceData = useCallback(() => {
    if (!isEmpty(selectedReferenceDocDetails)) {
      setAdditionalValues({
        originalFileName: selectedReferenceDocDetails?.originalFilename || '',
        documentName: selectedReferenceDocDetails?.name || selectedReferenceDocDetails?.docName || '',
        industryVertical: selectedReferenceDocDetails?.industryVertical || [],
        useCases: selectedReferenceDocDetails?.useCase || [],
        partners: selectedReferenceDocDetails?.partners || [],
        types: selectedReferenceDocDetails?.types || [],
        technologies: selectedReferenceDocDetails?.technologies || [],
        hub: selectedReferenceDocDetails?.hub || [],
        otherTags: selectedReferenceDocDetails?.otherTags || [],
      });
      setInitialName(selectedReferenceDocDetails?.name || selectedReferenceDocDetails?.docName || '');
    }
  }, [selectedReferenceDocDetails, setAdditionalValues, setInitialName]);

  const getAllRefDocsIfNone = async () => {
    try {
      if (referenceArchitectures?.length === 0) {
        const initialActiveRefValues = await dispatch(backendService.getAllActiveReferenceArchitecture({ archived: false, order: [['docName', 'asc']] }));
        let activeRefDocValuesToRetrieve = initialActiveRefValues?.payload?.documents || [];
        if (initialActiveRefValues?.payload?.numPages > 1) {
          /* eslint-disable no-await-in-loop */
          for (let x = 1; x < initialActiveRefValues?.payload?.numPages; x += 1) {
            const additionalValues = await dispatch(
              backendService.getAllActiveReferenceArchitecture({ archived: false, page: x, order: [['docName', 'asc']] })
            );
            const arrayValue = additionalValues?.payload?.documents || [];
            activeRefDocValuesToRetrieve = [...activeRefDocValuesToRetrieve, ...arrayValue];
          }
        }
        const initialArchivedRefValues = await dispatch(backendService.getAllArchivedReferenceArchitecture({ order: [['docName', 'asc']] }));
        let archivedRefDecValuesToRetrieve = initialArchivedRefValues?.payload?.documents || [];
        if (initialArchivedRefValues?.payload?.numPages > 1) {
          /* eslint-disable no-await-in-loop */
          for (let y = 1; y < initialArchivedRefValues?.payload?.numPages; y += 1) {
            const additionalValues = await dispatch(backendService.getAllArchivedReferenceArchitecture({ page: y, order: [['docName', 'asc']] }));
            const arrayValue = additionalValues?.payload?.documents || [];
            archivedRefDecValuesToRetrieve = [...archivedRefDecValuesToRetrieve, ...arrayValue];
          }
        }
        setAllReferenceArchitecture([...activeRefDocValuesToRetrieve, ...archivedRefDecValuesToRetrieve]);
        await dispatch(backendService.getAllActiveReferenceArchitecture({ archived: false, order: [['docName', 'asc']] }));
      }
    } catch (err) {
      console.log(err);
    }
    return referenceArchitectures;
  };

  const isDuplicateNameError = useCallback(
    async value => {
      if (value === initialName || value === '') {
        return false;
      }
      const checkAgainstValues = referenceArchitectures?.length === 0 ? await getAllRefDocsIfNone() : referenceArchitectures;
      for (let i = 0; i < checkAgainstValues?.length; i += 1) {
        if (checkAgainstValues[i]?.docName === value) {
          setIsNameError(true);
          console.log('A file with that name already exists!');
          return true;
        }
      }
      return false;
    },
    [referenceArchitectures, setIsNameError, initialName]
  );

  const handlePanelClose = useCallback(() => {
    setOpenType(false);
    setOpenIndustry(false);
    setOpenUseCases(false);
    setOpenPartners(false);
    setOpenTechnologies(false);
    setOpenHub(false);
    setOpenOtherTags(false);
    setIsGreyOut(true);
    reset();
    setAdditionalValues({
      originalFileName: '',
      documentName: '',
      types: [],
      industryVertical: [],
      useCases: [],
      partners: [],
      technologies: [],
      hub: [],
      otherTags: [],
    });
    dispatch(setSelectedReferenceDocDetails({}));
    dispatch(resetEditMode());
  }, [dispatch, setOpenType, setOpenIndustry, setOpenUseCases, setOpenPartners, setAdditionalValues, reset]);

  const handleClick = useCallback(
    (val, fieldName) => {
      setIsGreyOut(false);
      const localOptions = fieldName === 'types' || fieldName === 'partners' || fieldName === 'technologies' || fieldName === 'hub';
      if (localOptions) {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
      if (fieldName === 'industryVertical') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
      if (fieldName === 'useCases') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
      if (fieldName === 'otherTags') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
    },
    [additionalValues, setAdditionalValues, setIsGreyOut]
  );

  const handleOnNotesChange = useCallback(() => {
    if (isGreyOut) {
      setIsGreyOut(false);
    }
  }, [setIsGreyOut, isGreyOut]);

  // will refine in the future with just activePanel state instead of multiple states
  const handleOpen = value => {
    if (value === PANELS.TYPE) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenType(true);
    } else if (value === PANELS.INDUSTRY_VERTICAL) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenType(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenIndustry(true);
    } else if (value === PANELS.USE_CASE) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenUseCases(true);
    } else if (value === PANELS.PARTNER) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenPartners(true);
    } else if (value === PANELS.TECHNOLOGY) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenTechnologies(true);
    } else if (value === PANELS.HUB) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenOtherTags(false);
      setOpenHub(true);
    } else if (value === PANELS.OTHER_TAGS) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(true);
    } else {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenTechnologies(false);
    }
  };

  const handleTypeRemove = val => {
    handleClick(val, 'types');
    if (additionalValues?.types?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenType(true);
    }
  };

  const handleIndustryRemove = val => {
    handleClick(val, 'industryVertical');
    if (additionalValues?.industryVertical?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenType(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenIndustry(true);
    }
  };

  const handleUseCasesRemove = val => {
    handleClick(val, 'useCases');
    if (additionalValues?.useCases?.length === 0) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenUseCases(true);
    }
  };

  const handlePartnersRemove = val => {
    handleClick(val, 'partners');
    if (additionalValues?.partners?.length === 0) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenPartners(true);
    }
  };

  const handleTechnologiesRemove = val => {
    handleClick(val, 'technologies');
    if (additionalValues?.technologies?.length === 0) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenTechnologies(true);
    }
  };

  const handleHubRemove = val => {
    handleClick(val, 'hub');
    if (additionalValues?.hub?.length === 0) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenOtherTags(false);
      setOpenHub(true);
    }
  };

  const handleOtherTagsRemove = val => {
    handleClick(val, 'otherTags');
    if (additionalValues?.otherTags?.length === 0) {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(true);
    }
  };

  const submitForm = async data => {
    setIsGreyOut(true);
    const isDuplicate = await isDuplicateNameError(data?.name);
    const finalData = {
      id: selectedReferenceDocDetails?.id,
      originalFilename: selectedReferenceDocDetails?.originalFilename,
      docName: data?.name || initialName,
      notes: data?.notes,
      types: additionalValues?.types,
      industryVertical: additionalValues.industryVertical,
      useCase: additionalValues?.useCases,
      partners: additionalValues?.partners,
      technologies: additionalValues?.technologies,
      hub: additionalValues?.hub,
      otherTags: additionalValues?.otherTags,
    };
    if (isDuplicate) {
      return;
    }
    setOpenType(false);
    setOpenIndustry(false);
    setOpenUseCases(false);
    setOpenPartners(false);
    setOpenHub(false);
    setOpenTechnologies(false);
    setOpenOtherTags(false);
    const result = await dispatch(backendService.updateReferenceArchitecture(finalData));
    console.log(result);
    if (result?.error) {
      setIsNameError(true);
      setSelectedReferenceDocDetails({
        documentName: data?.name,
        types: additionalValues.types,
        industryVertical: additionalValues.industryVertical,
        useCases: additionalValues.useCases,
        partners: additionalValues.partners,
        technologies: additionalValues.technologies,
        hub: additionalValues.hub,
        otherTags: additionalValues.otherTags,
        notes: data?.notes,
      });
    } else {
      for (let x = 0; x < referenceArchitectures?.length; x += 1) {
        if (referenceArchitectures[x]?.docName === initialName) {
          const newRefArcs = referenceArchitectures;
          newRefArcs[x] = result?.payload?.document;
          setAllReferenceArchitecture(newRefArcs);
          break;
        }
      }
      dispatch(setRecentlyEdited(finalData.id));
      dispatch(setSelectedReferenceDocDetails({}));
      dispatch(resetEditMode);
    }
    setIsGreyOut(false);
  };

  // effect
  useEffect(() => {
    if (isEditReferenceMode) {
      reset({
        name: selectedReferenceDocDetails?.name || selectedReferenceDocDetails?.docName,
        notes: selectedReferenceDocDetails?.notes,
      });
      initSelectedReferenceData();
    }
    if (!hasLoadedIndustryVerticals && industryVerticals?.length === 0) {
      dispatch(backendService.getAllIndustryVertical());
    }
    if (!hasLoadedUseCases && useCases?.length === 0) {
      dispatch(backendService.getAllUseCases());
    }
  }, [
    isEditReferenceMode,
    industryVerticals,
    useCases,
    dispatch,
    reset,
    selectedReferenceDocDetails,
    initSelectedReferenceData,
    hasLoadedIndustryVerticals,
    hasLoadedUseCases,
  ]);

  useEffect(() => {
    dispatch(backendService.getOtherTags());
  }, [dispatch]);

  //Get list of all use cases and industry verticals for selected value match
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

    const initialValues2 = await dispatch(backendService.getIndustryVerticalByParams({ archived: false, order: [['name', 'asc']] }));
    let industryVerticalValuesToRetrieve = initialValues2?.payload?.industryverticals || [];
    if (initialValues2?.payload?.numPages > 1) {
      /* eslint-disable no-await-in-loop */
      for (let y = 1; y < initialValues2?.payload?.numPages; y += 1) {
        const additionalValues = await dispatch(backendService.getIndustryVerticalByParams({ archived: false, page: y, order: [['name', 'asc']] }));
        const arrayValue = additionalValues?.payload?.industryverticals || [];
        industryVerticalValuesToRetrieve = [...industryVerticalValuesToRetrieve, ...arrayValue];
      }
    }
    setIndustryVerticalList(industryVerticalValuesToRetrieve);
    await dispatch(backendService.getIndustryVerticalByParams({ archived: false, order: [['name', 'asc']] }));
  }, []);

  return (
    <div>
      <SidePanelEdgePatch showPatch={openType || openIndustry || openUseCases || openPartners || openTechnologies || openHub || openOtherTags} />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={!isEmpty(selectedReferenceDocDetails)}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={!isEmpty(selectedReferenceDocDetails)}
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
                <SidePanelHeaderText>{isEditReferenceMode ? 'Edit' : 'View'} Document</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem>
                  <SidePanelFileInactiveText style={{ fontSize: '16px' }}>
                    <div style={{ color: 'grey', justifySelf: 'center', paddingTop: '3px' }}>
                      <Icon path={mdiFileOutline} size={1} horizontal vertical rotate={180} />
                    </div>
                    <FileText title={selectedReferenceDocDetails?.originalFilename}>{selectedReferenceDocDetails?.originalFilename}</FileText>
                  </SidePanelFileInactiveText>
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelTextAltColor>Document Name</LabelTextAltColor>
                      <ValueText>{selectedReferenceDocDetails?.name || selectedReferenceDocDetails?.docName || ''}</ValueText>
                    </>
                  )}
                  {isEditReferenceMode && (
                    <TextInput
                      id="name"
                      label="Document Name"
                      placeholder=""
                      variant="standard"
                      required
                      register={register}
                      autoFocus="false"
                      onMouseDown={handleOnNotesChange}
                    />
                  )}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelTextAltColor>Notes</LabelTextAltColor>
                      <ValueText>{selectedReferenceDocDetails?.notes || ''}</ValueText>
                    </>
                  )}
                  {isEditReferenceMode && (
                    <TextInput
                      id="notes"
                      label="Notes"
                      placeholder={selectedReferenceDocDetails?.notes || ''}
                      variant="standard"
                      required
                      register={register}
                      autoFocus="false"
                      onMouseDown={() => {
                        handleOnNotesChange();
                      }}
                    />
                  )}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelContainer>
                        <LabelText>Type</LabelText>
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      </LabelContainer>
                      {!isEmpty(selectedReferenceDocDetails?.types) &&
                        selectedReferenceDocDetails?.types?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                          </FilledValueWrapper>
                        ))}
                    </>
                  )}
                  {isEditReferenceMode && (
                    <>
                      {(!isEmpty(additionalValues?.types) || openType) && (
                        <LabelContainer onClick={() => handleOpen(PANELS.TYPE)}>
                          <LabelText>Type</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.types) &&
                        additionalValues?.types?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleTypeRemove(val)}
                              />
                            </FilledValueRemoveIcon>
                          </FilledValueWrapper>
                        ))}
                      {isEmpty(additionalValues?.types) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add Type"
                          marginTop="60px"
                          type="button"
                          customMinWidth="300px"
                          customMinHeight="50px"
                          onClickFunc={() => handleOpen(PANELS.TYPE)}
                        />
                      )}
                    </>
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelContainer>
                        <LabelText>Vertical</LabelText>
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      </LabelContainer>
                      {!isEmpty(selectedReferenceDocDetails?.industryVertical) &&
                        selectedReferenceDocDetails?.industryVertical?.map(id => (
                          <FilledValueWrapper key={`key-${id}`}>
                            <FilledValueText>{mapIndustryVerticalIdToName(id)}</FilledValueText>
                          </FilledValueWrapper>
                        ))}
                    </>
                  )}
                  {isEditReferenceMode && (
                    <>
                      {(!isEmpty(additionalValues?.industryVertical) || openIndustry) && (
                        <LabelContainer onClick={() => handleOpen(PANELS.INDUSTRY_VERTICAL)}>
                          <LabelText>Vertical</LabelText>
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
                      {isEmpty(additionalValues?.industryVertical) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add Vertical"
                          marginTop="60px"
                          type="button"
                          customMinWidth="300px"
                          customMinHeight="50px"
                          onClickFunc={() => handleOpen(PANELS.INDUSTRY_VERTICAL)}
                        />
                      )}
                    </>
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelContainer>
                        <LabelText>Use Cases</LabelText>
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      </LabelContainer>
                      {!isEmpty(selectedReferenceDocDetails?.useCases) &&
                        selectedReferenceDocDetails?.useCases?.map(id => (
                          <FilledValueWrapper key={`key-${id}`}>
                            <FilledValueText>{mapUseCaseIdToName(id)}</FilledValueText>
                          </FilledValueWrapper>
                        ))}
                    </>
                  )}
                  {isEditReferenceMode && (
                    <>
                      {(!isEmpty(additionalValues?.useCases) || openUseCases) && (
                        <LabelContainer onClick={() => handleOpen(PANELS.USE_CASE)}>
                          <LabelText>Use Cases</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.useCases) &&
                        additionalValues?.useCases?.map(id => (
                          <FilledValueWrapper key={`key-${id}`}>
                            <FilledValueText>{mapUseCaseIdToName(id)}</FilledValueText>
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
                          customMinWidth="300px"
                          customMinHeight="50px"
                          onClickFunc={() => handleOpen(PANELS.USE_CASE)}
                        />
                      )}
                    </>
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelContainer>
                        <LabelText>Partners</LabelText>
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      </LabelContainer>
                      {!isEmpty(selectedReferenceDocDetails?.partners) &&
                        selectedReferenceDocDetails?.partners?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                          </FilledValueWrapper>
                        ))}
                    </>
                  )}
                  {isEditReferenceMode && (
                    <>
                      {(!isEmpty(additionalValues?.partners) || openPartners) && (
                        <LabelContainer onClick={() => handleOpen(PANELS.PARTNER)}>
                          <LabelText>Partners</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.partners) &&
                        additionalValues?.partners?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handlePartnersRemove(val)}
                              />
                            </FilledValueRemoveIcon>
                          </FilledValueWrapper>
                        ))}
                      {isEmpty(additionalValues?.partners) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add Partner"
                          marginTop="60px"
                          type="button"
                          customMinWidth="300px"
                          customMinHeight="50px"
                          onClickFunc={() => handleOpen(PANELS.PARTNER)}
                        />
                      )}
                    </>
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelContainer>
                        <LabelText>Technologies</LabelText>
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      </LabelContainer>
                      {!isEmpty(selectedReferenceDocDetails?.technologies) &&
                        selectedReferenceDocDetails?.technologies?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                          </FilledValueWrapper>
                        ))}
                    </>
                  )}
                  {isEditReferenceMode && (
                    <>
                      {(!isEmpty(additionalValues?.technologies) || openTechnologies) && (
                        <LabelContainer onClick={() => handleOpen(PANELS.TECHNOLOGY)}>
                          <LabelText>Technologies</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.technologies) &&
                        additionalValues?.technologies?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleTechnologiesRemove(val)}
                              />
                            </FilledValueRemoveIcon>
                          </FilledValueWrapper>
                        ))}
                      {isEmpty(additionalValues?.technologies) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add Technologies"
                          marginTop="60px"
                          type="button"
                          customMinWidth="300px"
                          customMinHeight="50px"
                          onClickFunc={() => handleOpen(PANELS.TECHNOLOGY)}
                        />
                      )}
                    </>
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelContainer>
                        <LabelText>Hub</LabelText>
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      </LabelContainer>
                      {!isEmpty(selectedReferenceDocDetails?.hub) &&
                        selectedReferenceDocDetails?.hub?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                          </FilledValueWrapper>
                        ))}
                    </>
                  )}
                  {isEditReferenceMode && (
                    <>
                      {(!isEmpty(additionalValues?.hub) || openHub) && (
                        <LabelContainer onClick={() => handleOpen(PANELS.HUB)}>
                          <LabelText>Hub</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.hub) &&
                        additionalValues?.hub?.map(val => (
                          <FilledValueWrapper key={`key-${val}`}>
                            <FilledValueText>{val}</FilledValueText>
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleHubRemove(val)}
                              />
                            </FilledValueRemoveIcon>
                          </FilledValueWrapper>
                        ))}
                      {isEmpty(additionalValues?.hub) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add Hub"
                          marginTop="60px"
                          type="button"
                          customMinWidth="300px"
                          customMinHeight="50px"
                          onClickFunc={() => handleOpen(PANELS.HUB)}
                        />
                      )}
                    </>
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditReferenceMode && (
                    <>
                      <LabelContainer>
                        <LabelText>Other Tags</LabelText>
                        <LabelIcon>
                          <ArrowForwardIosIcon />
                        </LabelIcon>
                      </LabelContainer>
                      {!isEmpty(selectedReferenceDocDetails?.otherTags) &&
                        selectedReferenceDocDetails?.otherTags?.map(id => (
                          <FilledValueWrapper key={`key-${id}`}>
                            <FilledValueText>{getNameFromId(id, otherTags)}</FilledValueText>
                          </FilledValueWrapper>
                        ))}
                    </>
                  )}
                  {isEditReferenceMode && (
                    <>
                      {(!isEmpty(additionalValues?.otherTags) || openOtherTags) && (
                        <LabelContainer onClick={() => handleOpen(PANELS.OTHER_TAGS)}>
                          <LabelText>Other Tags</LabelText>
                          <LabelIcon>
                            <ArrowForwardIosIcon />
                          </LabelIcon>
                        </LabelContainer>
                      )}
                      {!isEmpty(additionalValues?.otherTags) &&
                        additionalValues?.otherTags?.map(id => (
                          <FilledValueWrapper key={`key-${id}`}>
                            <FilledValueText>{getNameFromId(id, otherTags)}</FilledValueText>
                            <FilledValueRemoveIcon>
                              <CustomButton
                                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                                icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                                buttonText="Remove"
                                type="button"
                                onClickFunc={() => handleOtherTagsRemove(id)}
                              />
                            </FilledValueRemoveIcon>
                          </FilledValueWrapper>
                        ))}
                      {isEmpty(additionalValues?.otherTags) && (
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                          icon={BUTTON_ICON.ADD_BORDERLESS}
                          buttonText="Add Other Tags"
                          marginTop="60px"
                          type="button"
                          customMinWidth="300px"
                          customMinHeight="50px"
                          onClickFunc={() => handleOpen(PANELS.OTHER_TAGS)}
                        />
                      )}
                    </>
                  )}
                  <DRDivider />
                </SidePanelContentItem>
              </SidePanelContentWrapper>
            </SidePanelMainWrapper>
            {isEditReferenceMode && (
              <SidePanelSaveButtonWrapper customLeft="30px">
                <CustomButton
                  buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                  buttonText="Save Changes"
                  type="submit"
                  customMinWidth="300px"
                  customMinHeight="56px"
                  disableButton={isGreyOut}
                />
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
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={TYPE_OPTIONS}
        openIndustry={openType}
        setOpenIndustry={setOpenType}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isType
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={useCaseList || []}
        openIndustry={openUseCases}
        setOpenIndustry={setOpenUseCases}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isUseCase
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={PARTNER_OPTIONS}
        openIndustry={openPartners}
        setOpenIndustry={setOpenPartners}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isPartner
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={TECHNOLOGY_OPTIONS}
        openIndustry={openTechnologies}
        setOpenIndustry={setOpenTechnologies}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isTechnologies
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={HUB_OPTIONS}
        openIndustry={openHub}
        setOpenIndustry={setOpenHub}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isHub
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        renderSearchComponent={(props, ref) => <SearchInput ref={ref} {...props} searchBarOpen placeholder="Search or add other tags" />}
        renderCreateNewComponent={({ clearSearch, searchText }) => (
          <CustomButton
            buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
            icon={BUTTON_ICON.ADD_BORDERLESS}
            buttonText="Add new tag"
            marginTop="60px"
            type="button"
            customMinWidth="300px"
            customMinHeight="50px"
            onClickFunc={() => {
              dispatch(backendService.createOtherTag(searchText))
                .unwrap()
                .then(res => {
                  return dispatch(backendService.getOtherTags())
                    .unwrap()
                    .then(() => res);
                })
                .then(res => {
                  handleClick(res.tag.id, 'otherTags');
                });
              clearSearch();
            }}
            disabled={isEmpty(searchText)}
          />
        )}
        options={otherTags}
        openIndustry={openOtherTags}
        setOpenIndustry={setOpenOtherTags}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isOtherTags
        leftPositionDrawerContainer={375}
      />
      {isNameError && <DuplicateNameError setIsActive={setIsNameError} editModeName="referenceDoc" />}
    </div>
  );
}

ReferenceArchitectureDetails.propTypes = {
  referenceArchitectures: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setAllReferenceArchitecture: PropTypes.func,
};

ReferenceArchitectureDetails.defaultProps = {
  setAllReferenceArchitecture: () => {},
};

export default ReferenceArchitectureDetails;

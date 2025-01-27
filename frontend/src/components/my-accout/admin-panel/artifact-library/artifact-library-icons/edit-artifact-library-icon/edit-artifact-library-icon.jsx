import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Backdrop, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Icon from '@mdi/react';
import { mdiCloudCheckOutline, mdiCloudUploadOutline, mdiFileOutline, mdiWeatherCloudyAlert } from '@mdi/js';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { FileUploader } from 'react-drag-drop-files';
import * as tus from 'tus-js-client';
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
  UploadFilePreviewContainer,
} from '../../../../../side-panel/side-panel-styled';
import CustomButton from '../../../../../form-elements/custom-button';
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  EDIT_MODE,
  HUB_OPTIONS,
  ICON_DISCOVER_MODEL_VALUES,
  ICON_FILE_TYPES,
  PARTNER_OPTIONS,
  TECHNOLOGY_OPTIONS,
} from '../../../../../../utils/constants/constants';
import { FilledValueRemoveIcon, FilledValueText, FilledValueWrapper, LabelContainer, LabelIcon, LabelText } from '../../../../account-info/account-info-styled';
import TextInput from '../../../../../form-elements/text-input';
import { getEditMode, getSelectedIconDetails } from '../../../../../../features/selectors/ui';
import { resetEditMode, resetUploadErrorInfo, setRecentlyEdited, setSelectedIconDetails, setUploadErrorInfo } from '../../../../../../features/slices/uiSlice';
import SelectionPanel from '../../../../selection-panel/selection-panel';
import { getAPIValueFromId, getNameFromId, isEmpty } from '../../../../../../utils/utils';
import { backendService } from '../../../../../../services/backend';
import { getIndustryVerticals, getOtherTags } from '../../../../../../features/selectors/common';
import { DRDivider } from '../../../../../app/app-styled';
import { getAllActiveUseCases, getHasLoadedUseCases } from '../../../../../../features/selectors/useCase';
import DuplicateNameError from '../../../../upload-error/duplicate-name-error';
import { getHasLoadedIndustryVerticals } from '../../../../../../features/selectors/industryVertical';
import SearchInput from '../../../../../search/search-input';
import { getDefaultIcons } from '../../../../../../features/selectors/artifactIcon';

const partners = [...PARTNER_OPTIONS];
const technologies = [...TECHNOLOGY_OPTIONS];
const hub = [...HUB_OPTIONS];
const discoveryModel = [...ICON_DISCOVER_MODEL_VALUES];

const initFormValues = {
  originalFileName: '',
  iconName: '',
  types: [],
  industryVertical: [],
  useCases: [],
  partners: [],
  technologies: [],
  hub: [],
  tag: [],
  otherTags: [],
  notes: '',
};

function EditArtifactLibraryIcon() {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const { register, handleSubmit, reset, watch } = useForm();

  // selectors
  const editMode = useSelector(getEditMode);
  const selectedIconDetails = useSelector(getSelectedIconDetails);
  const industryVerticals = useSelector(getIndustryVerticals);
  const hasLoadedIndustryVerticals = useSelector(getHasLoadedIndustryVerticals);
  const hasLoadedUseCases = useSelector(getHasLoadedUseCases);
  const otherTags = useSelector(getOtherTags);
  const useCases = useSelector(getAllActiveUseCases);
  const defaultIcons = useSelector(getDefaultIcons);

  // state
  const [openDiscoveryModelingUse, setOpenDiscoveryModelingUse] = useState(false);
  const [openOtherTags, setOpenOtherTags] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openUseCases, setOpenUseCases] = useState(false);
  const [openPartners, setOpenPartners] = useState(false);
  const [openTechnologies, setOpenTechnologies] = useState(false);
  const [openHub, setOpenHub] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({ ...initFormValues });
  const [initAdditionalValues, setInitAdditionalValues] = useState({ ...initFormValues });
  const [dropboxBackgroundColour, setDropboxBackgroundColour] = useState('#e7eafb');
  const [dropBoxColor, setDropboxColor] = useState('var(--color-homeworld)');
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [isGreyOut, setIsGreyOut] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [idToBeDetached, setIdToBeDetached] = useState(null);
  const [industryVerticalList, setIndustryVerticalList] = useState([]);
  const [useCaseList, setUseCaseList] = useState([]);

  // watch form value
  const watchIconName = watch('name');
  const watchNotes = watch('notes');

  // const
  const isEditIconMode =
    editMode === EDIT_MODE.EDIT_ICON || editMode === EDIT_MODE.EDIT_REGION_COMPLIANCE || editMode === EDIT_MODE.EDIT_REGION_PARTNERSHIP_AND_SUPPLIERS;
  const previewUrl = `${selectedIconDetails.storageLocation}`;
  const showFileUploader = showUploader || isEmpty(selectedIconDetails?.storageLocation);

  // func
  const mapUseCaseIdToName = id => {
    return useCaseList?.find(useCase => useCase.id === id)?.name || 'unknown';
  };
  const mapIndustryVerticalIdToName = id => {
    return industryVerticalList?.find(industryVert => industryVert.id === id)?.name || 'unknown';
  };
  const setIsUploadError = useCallback(() => {
    dispatch(setUploadErrorInfo({ hasError: true, errorMsg: '' }));
  }, [dispatch]);

  const resetUploadError = useCallback(() => {
    dispatch(resetUploadErrorInfo());
  }, [dispatch]);

  const onError = useCallback(
    error => {
      console.log(error);
      setIsError(true);
      setIsUploading(false);
      setFile(null);
      setFileName('');
      setIsGreyOut(true);
    },
    [setIsError, setIsUploading, setFile, setFileName, setIsGreyOut]
  );

  const onDrop = useCallback(
    value => {
      setFile(value);
      setFileName(value.name);
      setIsError(false);
      setIsUploading(true);
      setIsGreyOut(false);
    },
    [setIsError, setIsUploading, setFile, setFileName, setIsGreyOut]
  );

  const initDetach = useCallback(() => {
    setShowUploader(true);
    setIdToBeDetached(selectedIconDetails.id);
  }, [setShowUploader]);

  const handleDetach = useCallback(() => {
    const isUsingDefault = defaultIcons?.some(icon => icon?.storageLocation === selectedIconDetails?.storageLocation);
    dispatch(backendService.detachIcon({ id: selectedIconDetails.id, isUsingDefault }));
  }, [dispatch, selectedIconDetails, defaultIcons]);

  const resetValues = useCallback(() => {
    setFile(null);
    setFileName('');
    setIsUploading(false);
    setIsError(false);
    setShowUploader(false);
    setIdToBeDetached(null);
  }, [setFile, setFileName, setIsUploading, setIsError]);

  const initSelectedIconData = useCallback(() => {
    if (!isEmpty(selectedIconDetails)) {
      const values = {
        tag: discoveryModel.reduce((acc, { id, apiValue }) => (apiValue === selectedIconDetails?.tag ? acc.concat(id) : acc), []),
        originalFileName: selectedIconDetails?.originalFilename || '',
        iconName: selectedIconDetails?.iconName || '',
        industryVertical: selectedIconDetails?.industryVertical || [],
        useCases: selectedIconDetails?.useCase || [],
        partners: selectedIconDetails?.partners || [],
        types: selectedIconDetails?.types || [],
        technologies: selectedIconDetails?.technologies || [],
        hub: selectedIconDetails?.hub || [],
        otherTags: selectedIconDetails?.otherTags || [],
        notes: selectedIconDetails?.notes || '',
      };

      setAdditionalValues(values);
      setInitAdditionalValues(values);
    }
  }, [selectedIconDetails, setAdditionalValues]);

  const handlePanelClose = useCallback(() => {
    setOpenOtherTags(false);
    setOpenType(false);
    setOpenIndustry(false);
    setOpenUseCases(false);
    setOpenPartners(false);
    setOpenTechnologies(false);
    setOpenHub(false);
    setOpenDiscoveryModelingUse(false);
    reset();
    setAdditionalValues({ ...initFormValues });
    setInitAdditionalValues({ ...initFormValues });
    dispatch(setSelectedIconDetails({}));
    dispatch(resetEditMode());
  }, [
    dispatch,
    setOpenType,
    setOpenIndustry,
    setOpenUseCases,
    setOpenPartners,
    setOpenDiscoveryModelingUse,
    setOpenTechnologies,
    setOpenHub,
    setOpenOtherTags,
    setAdditionalValues,
    reset,
  ]);

  const handleClick = useCallback(
    (val, fieldName) => {
      if (fieldName === 'tag') {
        const containsVal = additionalValues?.[fieldName]?.find(el => el.field === val.field && el.id === val.id);
        if (containsVal) {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.filter(el => el.field !== val.field && el.id !== val.id) });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.concat(val) });
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
      if (fieldName === 'types') {
        const containsVal = additionalValues?.[fieldName]?.find(el => el.field === val.field && el.id === val.id);
        if (containsVal) {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.filter(el => el.field !== val.field && el.id !== val.id) });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues?.[fieldName]?.concat(val) });
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
      if (fieldName === 'partners') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
      if (fieldName === 'technologies') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
      if (fieldName === 'hub') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
    },
    [additionalValues, setAdditionalValues]
  );

  const noChanges = useMemo(() => {
    const nameChanged = watchIconName && watchIconName !== selectedIconDetails.iconName;
    const notesChanged = watchNotes && watchNotes !== selectedIconDetails.notes;
    const hasFileForUploading = file && !isError;
    return isEqual(additionalValues, initAdditionalValues) && !nameChanged && !hasFileForUploading && !notesChanged;
  }, [additionalValues, initAdditionalValues, watchIconName, watchNotes, file]);

  const handleOpen = value => {
    if (value === 'otherTags') {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(true);
    } else if (value === 'tag') {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDiscoveryModelingUse(true);
    } else if (value === 'Type') {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenOtherTags(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenType(true);
    } else if (value === 'Vertical') {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenIndustry(true);
    } else if (value === 'UseCases') {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenPartners(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenUseCases(true);
    } else if (value === 'Partner') {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenPartners(true);
    } else if (value === 'Technologies') {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenDiscoveryModelingUse(false);
      setOpenHub(false);
      setOpenPartners(false);
      setOpenTechnologies(true);
    } else if (value === 'Hub') {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenDiscoveryModelingUse(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(true);
    } else {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
    }
  };

  const handleOtherTagsRemove = val => {
    handleClick(val, 'otherTags');
    if (additionalValues?.otherTags?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(true);
    }
  };

  const handleDiscoverModelRemove = val => {
    handleClick(val, 'tag');
    if (additionalValues?.tag?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenType(false);
      setOpenOtherTags(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDiscoveryModelingUse(true);
    }
  };

  const handleTypeRemove = val => {
    handleClick(val, 'types');
    if (additionalValues?.types?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenOtherTags(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDiscoveryModelingUse(false);
      setOpenType(true);
    }
  };

  const handleIndustryRemove = val => {
    handleClick(val, 'industryVertical');
    if (additionalValues?.industryVertical?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDiscoveryModelingUse(false);
      setOpenIndustry(true);
    }
  };

  const handleUseCasesRemove = val => {
    handleClick(val, 'useCases');
    if (additionalValues?.useCases?.length === 0) {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDiscoveryModelingUse(false);
      setOpenUseCases(true);
    }
  };

  const handlePartnersRemove = val => {
    handleClick(val, 'partners');
    if (additionalValues?.partners?.length === 0) {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDiscoveryModelingUse(false);
      setOpenPartners(true);
    }
  };

  const handleTechnologiesRemove = val => {
    handleClick(val, 'technologies');
    if (additionalValues?.technologies?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenOtherTags(false);
      setOpenHub(false);
      setOpenTechnologies(true);
    }
  };

  const handleHubRemove = val => {
    handleClick(val, 'hub');
    if (additionalValues?.hub?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenOtherTags(false);
      setOpenTechnologies(false);
      setOpenHub(true);
    }
  };

  const submitForm = async data => {
    const finalData = {
      id: selectedIconDetails?.id,
      tag: getAPIValueFromId(additionalValues?.tag[0], ICON_DISCOVER_MODEL_VALUES),
      originalFilename: selectedIconDetails?.originalFilename,
      iconName: data?.name,
      notes: data?.notes,
      types: additionalValues?.types,
      industryVertical: additionalValues.industryVertical,
      useCase: additionalValues?.useCases,
      partners: additionalValues?.partners,
      technologies: additionalValues?.technologies || [],
      hub: additionalValues?.hub || [],
      otherTags: additionalValues?.otherTags || [],
    };
    setOpenOtherTags(false);
    setOpenType(false);
    setOpenIndustry(false);
    setOpenUseCases(false);
    setOpenPartners(false);
    setOpenDiscoveryModelingUse(false);
    setOpenTechnologies(false);
    setOpenHub(false);
    if (file) {
      const final = await new tus.Upload(file, {
        endpoint: `${window.location.origin}/api/v1/icon/${selectedIconDetails?.id}/upload`,
        retryDelays: [0, 3000, 5000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError: error => {
          console.log(`Failed because: ${error}`);
          setIsUploadError(true);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          // console.log(`${bytesUploaded}, ${bytesTotal}, ${percentage}%`);
        },
        onSuccess: () => {
          console.log('Upload successful!');
        },
      });
      final.start();
      if (final?.error) {
        setIsUploadError(true);
        setIsError(true);
      } else {
        if (showUploader) handleDetach(idToBeDetached);
        finalData.originalFilename = file.name;
        resetValues();
      }
    }

    const result = await dispatch(backendService.updateIcon(finalData));
    dispatch(setRecentlyEdited(result?.payload?.icon?.id));
    if (result?.error) {
      setIsNameError(true);
      setSelectedIconDetails({
        tag: additionalValues?.tag,
        iconName: data?.name,
        otherTags: additionalValues.otherTags,
        types: additionalValues.types,
        industryVertical: additionalValues.industryVertical,
        useCases: additionalValues.useCases,
        partners: additionalValues.partners,
        notes: data?.notes,
        technologies: additionalValues?.technologies,
        hub: additionalValues?.hub,
      });
    } else {
      dispatch(setRecentlyEdited(finalData.id));
      dispatch(setSelectedIconDetails({}));
      setIsSubmitting(true);
    }
  };

  // effect
  useEffect(() => {
    if (isEditIconMode) {
      reset({
        name: selectedIconDetails?.iconName,
        notes: selectedIconDetails?.notes,
      });
      initSelectedIconData();
    }
    if (!hasLoadedIndustryVerticals && industryVerticals?.length === 0) {
      dispatch(backendService.getAllIndustryVertical());
    }
    if (!hasLoadedUseCases && useCases?.length === 0) {
      dispatch(backendService.getAllUseCases());
    }
    if (isSubmitting) {
      dispatch(backendService.getAllMarketing());
      setIsSubmitting(false);
      dispatch(resetEditMode);
    }
  }, [
    isEditIconMode,
    isSubmitting,
    industryVerticals,
    useCases,
    dispatch,
    reset,
    selectedIconDetails,
    initSelectedIconData,
    setIsSubmitting,
    hasLoadedIndustryVerticals,
    hasLoadedUseCases,
  ]);

  useEffect(() => {
    dispatch(backendService.getOtherTags());
    dispatch(backendService.searchDefaultIcons());
  }, [dispatch]);

  useEffect(() => {
    if (!file) {
      setIsGreyOut(true);
    }
    if (isUploading) {
      setDropboxBackgroundColour('#00b11f36');
      setDropboxColor('#1db81d');
    } else if (isError) {
      setDropboxBackgroundColour('#ff00003b');
      setDropboxColor('#ff000091');
    } else if (dropboxBackgroundColour !== '#e7eafb') {
      setDropboxBackgroundColour('#e7eafb');
      setDropboxColor('var(--color-homeworld)');
    }
  }, [file, isUploading, isError]);

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
      <SidePanelEdgePatch
        showPatch={openOtherTags || openType || openIndustry || openUseCases || openPartners || openHub || openTechnologies || openOtherTags}
      />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={!isEmpty(selectedIconDetails)}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={!isEmpty(selectedIconDetails)}
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
                <SidePanelHeaderText>Edit Icon</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem>
                  {!showFileUploader && (
                    <SidePanelFileInactiveText style={{ fontSize: '16px' }}>
                      <div style={{ color: 'grey', justifySelf: 'center', paddingTop: '3px' }}>
                        <Icon path={mdiFileOutline} size={1} horizontal vertical rotate={180} />
                      </div>
                      <FileText title={selectedIconDetails?.originalFilename}>{selectedIconDetails?.originalFilename}</FileText>
                      <div>
                        <CustomButton buttonStyle={BUTTON_STYLE.ICON_BUTTON} icon={BUTTON_ICON.CANCEL} type="button" onClickFunc={initDetach} />
                      </div>
                    </SidePanelFileInactiveText>
                  )}
                  {showFileUploader && (
                    <FileUploader
                      multiple={false}
                      // handleChange={handleFileDragged}
                      name="file"
                      types={ICON_FILE_TYPES}
                      hoverTitle=" "
                      onTypeError={error => onError(error)}
                      onDrop={onDrop}
                      onSelect={onDrop}>
                      <div
                        style={{
                          color: dropBoxColor,
                          alignItems: 'center',
                          justifyContent: 'center',
                          display: 'flex',
                          backgroundColor: dropboxBackgroundColour,
                          borderRadius: '7px',
                        }}>
                        {isError && (
                          <div style={{ display: 'contents' }}>
                            <Icon path={mdiWeatherCloudyAlert} size={1} horizontal vertical rotate={180} />
                            <p style={{ paddingLeft: '0.5rem' }}>Upload Error</p>
                          </div>
                        )}
                        {isUploading && (
                          <div style={{ display: 'contents' }}>
                            <Icon path={mdiCloudCheckOutline} size={1} horizontal vertical rotate={180} />
                            <p style={{ paddingLeft: '0.5rem' }}>Ready for Upload</p>
                          </div>
                        )}
                        {!isError && !isUploading && (
                          <div style={{ display: 'contents' }}>
                            <Icon path={mdiCloudUploadOutline} size={1} horizontal vertical rotate={180} />
                            <p style={{ paddingLeft: '0.5rem' }}>Drop / Select File to Upload</p>
                          </div>
                        )}
                      </div>
                    </FileUploader>
                  )}
                </SidePanelContentItem>

                <SidePanelContentItem>
                  <UploadFilePreviewContainer>
                    {!showFileUploader && <img src={previewUrl} alt="file-preview" />}
                    {showFileUploader && file && <img src={URL.createObjectURL(file)} alt="file-preview" />}
                  </UploadFilePreviewContainer>
                </SidePanelContentItem>

                <SidePanelContentItem>
                  <TextInput id="name" label="Icon Name" placeholder="" variant="standard" required register={register} autoFocus="false" />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.tag) || openDiscoveryModelingUse) && (
                    <LabelContainer onClick={() => handleOpen('tag')}>
                      <LabelText>Discovery/Modelling Use</LabelText>
                      <LabelIcon>
                        <ArrowForwardIosIcon />
                      </LabelIcon>
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.tag) &&
                    additionalValues?.tag?.map(id => (
                      <FilledValueWrapper key={`key-${id}`}>
                        <FilledValueText>{getNameFromId(id, discoveryModel)}</FilledValueText>
                        <FilledValueRemoveIcon>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleDiscoverModelRemove(id)}
                          />
                        </FilledValueRemoveIcon>
                      </FilledValueWrapper>
                    ))}
                  {isEmpty(additionalValues?.tag) && (
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Discover/Modeling Tag"
                      marginTop="20px"
                      marginBottom="20px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('tag')}
                    />
                  )}
                  <DRDivider margin="0px 0px 10px 0px" />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  <TextInput
                    id="notes"
                    label="Notes"
                    // placeholder={additionalValues?.notes}
                    defaultValue={selectedIconDetails?.notes}
                    variant="standard"
                    required
                    register={register}
                    autoFocus="false"
                  />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.industryVertical) || openIndustry) && (
                    <LabelContainer onClick={() => handleOpen('Vertical')}>
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
                      onClickFunc={() => handleOpen('Vertical')}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.useCases) || openUseCases) && (
                    <LabelContainer onClick={() => handleOpen('UseCases')}>
                      <LabelText>Usecases</LabelText>
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
                      buttonText="Add Usecase"
                      marginTop="60px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('UseCases')}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.partners) || openPartners) && (
                    <LabelContainer onClick={() => handleOpen('Partner')}>
                      <LabelText>Partners</LabelText>
                      <LabelIcon>
                        <ArrowForwardIosIcon />
                      </LabelIcon>
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.partners) &&
                    additionalValues?.partners?.map(id => (
                      <FilledValueWrapper key={`key-${id}`}>
                        <FilledValueText>{getNameFromId(id, partners)}</FilledValueText>
                        <FilledValueRemoveIcon>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handlePartnersRemove(id)}
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
                      onClickFunc={() => handleOpen('Partner')}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.technologies) || openTechnologies) && (
                    <LabelContainer onClick={() => handleOpen('Technologies')}>
                      <LabelText>Technologies</LabelText>
                      <LabelIcon>
                        <ArrowForwardIosIcon />
                      </LabelIcon>
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.technologies) &&
                    additionalValues?.technologies?.map(id => (
                      <FilledValueWrapper key={`key-${id}`}>
                        <FilledValueText>{getNameFromId(id, technologies)}</FilledValueText>
                        <FilledValueRemoveIcon>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleTechnologiesRemove(id)}
                          />
                        </FilledValueRemoveIcon>
                      </FilledValueWrapper>
                    ))}
                  {isEmpty(additionalValues?.technologies) && (
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Technologies Tag"
                      marginTop="20px"
                      marginBottom="20px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('Technologies')}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.hub) || openHub) && (
                    <LabelContainer onClick={() => handleOpen('Hub')}>
                      <LabelText>Hub</LabelText>
                      <LabelIcon>
                        <ArrowForwardIosIcon />
                      </LabelIcon>
                    </LabelContainer>
                  )}
                  {!isEmpty(additionalValues?.hub) &&
                    additionalValues?.hub?.map(id => (
                      <FilledValueWrapper key={`key-${id}`}>
                        <FilledValueText>{getNameFromId(id, hub)}</FilledValueText>
                        <FilledValueRemoveIcon>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleHubRemove(id)}
                          />
                        </FilledValueRemoveIcon>
                      </FilledValueWrapper>
                    ))}
                  {isEmpty(additionalValues?.hub) && (
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Hub Tag"
                      marginTop="20px"
                      marginBottom="20px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('Hub')}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {(!isEmpty(additionalValues?.otherTags) || openOtherTags) && (
                    <LabelContainer onClick={() => handleOpen('otherTags')}>
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
                      buttonText="Add Other Tag"
                      marginTop="20px"
                      marginBottom="20px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('otherTags')}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
              </SidePanelContentWrapper>
            </SidePanelMainWrapper>
            <SidePanelSaveButtonWrapper customLeft="30px">
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Save Changes"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
                disableButton={noChanges || (showFileUploader && !isUploading)}
              />
            </SidePanelSaveButtonWrapper>
          </Box>
        </form>
      </SwipeableDrawer>
      <SelectionPanel
        options={discoveryModel}
        openIndustry={openDiscoveryModelingUse}
        setOpenIndustry={setOpenDiscoveryModelingUse}
        additionalValues={additionalValues}
        handleClick={handleClick}
        leftPositionDrawerContainer={375}
        isDiscoveryModel
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
        leftPositionDrawerContainer={375}
        isOtherTags
      />
      <SelectionPanel
        options={industryVerticalList}
        openIndustry={openIndustry}
        setOpenIndustry={setOpenIndustry}
        additionalValues={additionalValues}
        handleClick={handleClick}
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
        options={partners}
        openIndustry={openPartners}
        setOpenIndustry={setOpenPartners}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isPartner
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={technologies}
        openIndustry={openTechnologies}
        setOpenIndustry={setOpenTechnologies}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isTechnologies
        specialCase
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={hub}
        openIndustry={openHub}
        setOpenIndustry={setOpenHub}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isHub
        specialCase
        leftPositionDrawerContainer={375}
      />
      <SelectionPanel
        options={partners}
        openIndustry={openPartners}
        setOpenIndustry={setOpenPartners}
        additionalValues={additionalValues}
        handleClick={handleClick}
        isPartner
        specialCase
        leftPositionDrawerContainer={375}
      />
      {isNameError && <DuplicateNameError setIsActive={setIsNameError} editModeName="artifactIcon" />}
    </div>
  );
}

EditArtifactLibraryIcon.propTypes = {};

export default EditArtifactLibraryIcon;

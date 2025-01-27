import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as tus from 'tus-js-client';
import { Backdrop, Box } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { FileUploader } from 'react-drag-drop-files';
import Icon from '@mdi/react';
import { mdiCloudCheckOutline, mdiCloudUploadOutline, mdiFileOutline, mdiWeatherCloudyAlert } from '@mdi/js';
import TextInput from '../../../../../form-elements/text-input';
import CustomButton from '../../../../../form-elements/custom-button';
import { FilledValueRemoveIcon, FilledValueText, FilledValueWrapper, LabelContainer, LabelIcon, LabelText } from '../../../../account-info/account-info-styled';
import {
  FileText,
  SidePanelContentItem,
  SidePanelContentWrapper,
  SidePanelEdgePatch,
  SidePanelFileInactiveText,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSaveButtonWrapper,
  UploadFilePreviewContainer,
} from '../../../../../side-panel/side-panel-styled';
import { DRDivider } from '../../../../../app/app-styled';
import SelectionPanel from '../../../../selection-panel/selection-panel';
import UploadError from '../../../../upload-error/upload-error';
import { getFilterParams, getAPIValueFromId, getNameFromId, isEmpty } from '../../../../../../utils/utils';
import { getAddIconMode, getUploadErrorInfo, getSelectedFilterFacets } from '../../../../../../features/selectors/ui';
import { getIndustryVerticals, getOtherTags } from '../../../../../../features/selectors/common';
import { getAllActiveUseCases } from '../../../../../../features/selectors/useCase';
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  HUB_OPTIONS,
  ICON_DISCOVER_MODEL_VALUES,
  ICON_FILE_TYPES,
  PARTNER_OPTIONS,
  TECHNOLOGY_OPTIONS,
} from '../../../../../../utils/constants/constants';
import {
  resetAddIconMode,
  resetUploadErrorInfo,
  setRecentlyAdded,
  setRefetchCompliance,
  setRefetchPartners,
  setUploadErrorInfo,
} from '../../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../../services/backend';
import SearchInput from '../../../../../search/search-input';
import {
  ArtifactLibraryDefaultIconsWrapper,
  ArtifactLibraryIcon,
  ArtifactLibraryIconContainer,
  ArtifactLibraryIconNameFieldContainer,
  ArtifactLibraryIconsItem,
  ArtifactLibraryIconsItemThumbnail,
  ArtifactLibraryIconsItemTitle,
} from '../artifact-library-icon-styled';
import { getDefaultIcons } from '../../../../../../features/selectors/artifactIcon';
import DuplicateNameError from '../../../../upload-error/duplicate-name-error';

const partners = [...PARTNER_OPTIONS];
const technologies = [...TECHNOLOGY_OPTIONS];
const hub = [...HUB_OPTIONS];
const discoveryModel = [...ICON_DISCOVER_MODEL_VALUES];

const initFormValues = {
  types: [],
  industryVertical: [],
  useCases: [],
  partners: [],
  technologies: [],
  hub: [],
  tag: [],
  otherTags: [],
  defaultIcon: {},
};

const duplicateNameCheck = 'iconName must be unique' || 'Icon Name must be unique';

function AddArtifactLibraryIconPanel() {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const {
    getValues,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { discoveryModel: false } });

  // selectors
  const isAddIconMode = useSelector(getAddIconMode);
  const industryVerticals = useSelector(getIndustryVerticals);
  const otherTags = useSelector(getOtherTags);
  const useCases = useSelector(getAllActiveUseCases);
  const uploadError = useSelector(getUploadErrorInfo);
  const defaultIcons = useSelector(getDefaultIcons);
  const filterFacets = useSelector(getSelectedFilterFacets);

  // const
  const isUploadError = uploadError?.hasError;
  const uploadErrorMsg = uploadError?.errorMsg;

  // state
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isNameError, setIsNameError] = useState(uploadErrorMsg === duplicateNameCheck);
  const [isGreyOut, setIsGreyOut] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [openDiscoveryModelingUse, setOpenDiscoveryModelingUse] = useState(false);
  const [openOtherTags, setOpenOtherTags] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openUseCases, setOpenUseCases] = useState(false);
  const [openPartners, setOpenPartners] = useState(false);
  const [openTechnologies, setOpenTechnologies] = useState(false);
  const [openHub, setOpenHub] = useState(false);
  const [openDefaultIcon, setOpenDefaultIcon] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({ ...initFormValues });
  const [dropboxBackgroundColour, setDropboxBackgroundColour] = useState('#e7eafb');
  const [dropBoxColor, setDropboxColor] = useState('var(--color-homeworld)');
  const [industryVerticalList, setIndustryVerticalList] = useState([]);
  const [useCaseList, setUseCaseList] = useState([]);

  // func
  const mapUseCaseIdToName = id => {
    return useCaseList?.find(useCase => useCase.id === id)?.name || 'unknown';
  };
  const mapIndustryVerticalIdToName = id => {
    return industryVerticalList?.find(industryVert => industryVert.id === id)?.name || 'unknown';
  };
  const setIsUploadError = useCallback(
    msg => {
      dispatch(setUploadErrorInfo(msg));
    },
    [dispatch]
  );

  const resetUploadError = useCallback(() => {
    dispatch(resetUploadErrorInfo());
  }, [dispatch]);

  const resetValues = useCallback(() => {
    setFile(null);
    setFileName('');
    setIsUploading(false);
    setIsError(false);
    setOpenOtherTags(false);
    setOpenType(false);
    setOpenIndustry(false);
    setOpenUseCases(false);
    setOpenPartners(false);
    setOpenDiscoveryModelingUse(false);
    reset();
    setAdditionalValues({ ...initFormValues });
  }, [
    setFile,
    setFileName,
    setIsUploading,
    setIsError,
    setOpenOtherTags,
    setOpenType,
    setOpenIndustry,
    setOpenUseCases,
    setOpenPartners,
    reset,
    setAdditionalValues,
  ]);

  const resetAfterNameError = useCallback(
    buttonValue => {
      if (buttonValue === 'Cancel') {
        resetValues();
      } else {
        setIsError(false);
        resetUploadError();
        reset({ name: null });
      }
    },
    [setIsError, resetValues, resetUploadError, reset]
  );

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
      // somehow value is not getting updated, so calling setValue here
      // commented out as per request to leave it blank(but keep it here in case we want it back)
      // setValue('name', value.name);
      setIsError(false);
      setIsUploading(true);
      setIsGreyOut(false);
    },
    [setIsError, setIsUploading, setFile, setFileName, setIsGreyOut]
  );

  const isDuplicateNameError = useCallback(
    value => {
      if (value === duplicateNameCheck) {
        setIsNameError(true);
        return true;
      }
      return false;
    },
    [setIsNameError]
  );

  const handlePanelClose = useCallback(() => {
    resetValues();
    dispatch(resetAddIconMode());
  }, [dispatch, setOpenType, setOpenIndustry, setOpenUseCases, setOpenPartners, setAdditionalValues, reset]);

  const removeFileName = useCallback(() => {
    setFileName('');
    setFile(null);
    setIsUploading(false);
    setIsError(false);
    setAdditionalValues({ ...additionalValues, defaultIcon: {} });
    setValue('name', null);
  }, [setFileName, setFile, setIsUploading, setIsError]);

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

  const handleDefaultIconSelect = useCallback(
    val => {
      setAdditionalValues({ ...additionalValues, defaultIcon: val });
      setOpenDefaultIcon(false);
      setFile(null);
      setFileName(val?.originalFilename || 'unknown');
      // commented out as per request to leave it blank(but keep it here in case we want it back)
      // setValue('name', val?.originalFilename);
      setIsUploading(false);
      setIsError(false);
      setIsGreyOut(false);
    },
    [additionalValues, setAdditionalValues, setOpenDefaultIcon, setFile, setFileName, setIsUploading, setIsError]
  );

  const handleOpen = value => {
    if (value === 'otherTags') {
      setOpenDefaultIcon(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(true);
    } else if (value === 'tag') {
      setOpenDefaultIcon(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDiscoveryModelingUse(true);
    } else if (value === 'Type') {
      setOpenDefaultIcon(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenOtherTags(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenType(true);
    } else if (value === 'Vertical') {
      setOpenDefaultIcon(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenIndustry(true);
    } else if (value === 'UseCases') {
      setOpenDefaultIcon(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenPartners(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenUseCases(true);
    } else if (value === 'Partner') {
      setOpenDefaultIcon(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenPartners(true);
    } else if (value === 'Technologies') {
      setOpenDefaultIcon(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenDiscoveryModelingUse(false);
      setOpenHub(false);
      setOpenPartners(false);
      setOpenTechnologies(true);
    } else if (value === 'Hub') {
      setOpenDefaultIcon(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenDiscoveryModelingUse(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(true);
    } else if (value === 'defaultIcon') {
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenDiscoveryModelingUse(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenDefaultIcon(true);
    } else {
      setOpenDefaultIcon(false);
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

  const handleIndustryRemove = val => {
    handleClick(val, 'industryVertical');
    if (additionalValues?.industryVertical?.length === 0) {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenOtherTags(false);
      setOpenType(false);
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
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
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
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
      setOpenDiscoveryModelingUse(false);
      setOpenTechnologies(false);
      setOpenHub(false);
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

  const submitForm = useCallback(
    async data => {
      const finalData = {
        tag: getAPIValueFromId(additionalValues.tag[0], ICON_DISCOVER_MODEL_VALUES),
        industryVertical: additionalValues.industryVertical,
        useCase: additionalValues.useCases,
        notes: data.notes,
        otherTags: additionalValues.otherTags,
        technologies: additionalValues.technologies,
        hub: additionalValues.hub,
        types: additionalValues.types,
        partners: additionalValues.partners,
        originalFilename: additionalValues?.defaultIcon?.originalFilename || file?.name,
        iconName: data.name,
        storageLocation: additionalValues?.defaultIcon?.storageLocation,
      };
      const results = await dispatch(backendService.createIcon(finalData));
      dispatch(setRecentlyAdded(results?.payload?.icon?.id));
      const nameError = isDuplicateNameError(results?.payload?.error?.errors?.[0]?.message || '');
      if (!nameError) {
        setOpenOtherTags(false);
        setOpenType(false);
        setOpenIndustry(false);
        setOpenUseCases(false);
        setOpenPartners(false);
        setOpenDiscoveryModelingUse(false);
        setOpenTechnologies(false);
        setOpenHub(false);
      }
      if (isEmpty(additionalValues?.defaultIcon?.storageLocation) && file) {
        const final = await new tus.Upload(file, {
          endpoint: `${window.location.origin}/api/v1/icon/${results?.payload?.icon?.id}/upload`,
          retryDelays: [0, 3000, 5000],
          metadata: {
            filename: file.name,
            filetype: file.type,
          },
          onError: error => {
            console.log(`Failed because: ${error}`);
            setIsUploadError(error);
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
          setIsUploadError(final?.error);
        } else {
          if (!nameError) {
            resetValues();
          }
          setTimeout(() => {
            const params = getFilterParams(filterFacets, false);
            dispatch(backendService.getAllActiveIcon(params));
            dispatch(backendService.searchDefaultIcons());
          }, 1000);
          dispatch(setRefetchCompliance(true));
          dispatch(setRefetchPartners(true));
        }
      }
    },
    [
      setOpenType,
      setOpenIndustry,
      setOpenUseCases,
      setOpenPartners,
      setOpenDiscoveryModelingUse,
      setOpenTechnologies,
      setOpenHub,
      dispatch,
      file,
      additionalValues,
      resetValues,
      isDuplicateNameError,
      isNameError,
    ]
  );

  // effect
  useEffect(() => {
    // init
    dispatch(backendService.getAllIndustryVertical());
    dispatch(backendService.getAllUseCases());
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
  }, [
    industryVerticals,
    useCases,
    file,
    isUploading,
    isError,
    dropboxBackgroundColour,
    setDropboxBackgroundColour,
    setDropboxColor,
    setIsUploading,
    setIsGreyOut,
  ]);

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

  // mui drawer need to have the disableEnforceFocus
  // otherwise text fields on other component on the same screen won't get focused
  return (
    <div>
      <SidePanelEdgePatch
        showPatch={openOtherTags || openType || openIndustry || openUseCases || openPartners || openTechnologies || openHub || openDefaultIcon}
      />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={isAddIconMode}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={isAddIconMode}
        onClose={() => {}}
        onOpen={() => {}}
        sx={{
          position: isUploadError && isAddIconMode ? 'relative' : 'fixed',
        }}
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
                <SidePanelHeaderText>Add Icon</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                {file?.name && (
                  <SidePanelContentItem>
                    <SidePanelFileInactiveText style={{ fontSize: '16px' }}>
                      <div style={{ color: 'grey', justifySelf: 'center', paddingTop: '3px' }}>
                        <Icon path={mdiFileOutline} size={1} horizontal vertical rotate={180} />
                      </div>
                      <FileText title={file?.name}>{file?.name}</FileText>
                      <div>
                        <CustomButton buttonStyle={BUTTON_STYLE.ICON_BUTTON} icon={BUTTON_ICON.CANCEL} type="button" onClickFunc={removeFileName} />
                      </div>
                    </SidePanelFileInactiveText>
                  </SidePanelContentItem>
                )}
                {isEmpty(additionalValues?.defaultIcon) && (
                  <SidePanelContentItem>
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
                            <p style={{ paddingLeft: '0.5rem' }}>Ready to Upload</p>
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
                  </SidePanelContentItem>
                )}
                {(file || !isEmpty(additionalValues?.defaultIcon?.storageLocation)) && (
                  <SidePanelContentItem>
                    <UploadFilePreviewContainer>
                      {file && <img src={URL.createObjectURL(file)} alt="file-preview" />}
                      {additionalValues?.defaultIcon?.storageLocation && <img src={additionalValues?.defaultIcon?.storageLocation} alt="file-preview" />}
                    </UploadFilePreviewContainer>
                  </SidePanelContentItem>
                )}
                <SidePanelContentItem>
                  <CustomButton
                    altText
                    buttonStyle={BUTTON_STYLE.DIV_STYLE_TEXT_BUTTON}
                    buttonText="Select From Library"
                    useColor="#646464"
                    bgColor="var(--color-la-luna)"
                    customMinWidth="100px"
                    customMinHeight="30px"
                    onClickFunc={() => handleOpen('defaultIcon')}
                  />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
                  <ArtifactLibraryIconNameFieldContainer adjustMarginBottom={!isEmpty(fileName)}>
                    <TextInput
                      id="name"
                      label="Icon Name"
                      placeholder="Add icon name"
                      variant="standard"
                      required
                      register={register}
                      autoFocus="false"
                      error={errors?.name}
                      disabled={isGreyOut}
                    />
                  </ArtifactLibraryIconNameFieldContainer>
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
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
                      onClickFunc={() => {
                        if (!isGreyOut) {
                          handleOpen('tag');
                        }
                      }}
                    />
                  )}
                  <DRDivider margin="0px 0px 10px 0px" />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
                  <TextInput
                    id="notes"
                    label="Notes"
                    placeholder="Add Notes"
                    variant="standard"
                    required
                    register={register}
                    autoFocus="false"
                    disabled={isGreyOut}
                    maxLength={460}
                  />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
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
                      buttonText="Add Vertical Tag"
                      marginTop="20px"
                      marginBottom="20px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => {
                        if (!isGreyOut) {
                          handleOpen('Vertical');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
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
                      buttonText="Add Usecase Tag"
                      marginTop="20px"
                      marginBottom="20px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => {
                        if (!isGreyOut) {
                          handleOpen('UseCases');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
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
                      buttonText="Add Partner Tag"
                      marginTop="20px"
                      marginBottom="20px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => {
                        if (!isGreyOut) {
                          handleOpen('Partner');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
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
                      onClickFunc={() => {
                        if (!isGreyOut) {
                          handleOpen('Technologies');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
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
                      onClickFunc={() => {
                        if (!isGreyOut) {
                          handleOpen('Hub');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
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
                      onClickFunc={() => {
                        if (!isGreyOut) {
                          handleOpen('otherTags');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
              </SidePanelContentWrapper>
            </SidePanelMainWrapper>
            <SidePanelSaveButtonWrapper customLeft="30px">
              <CustomButton
                bgColor={isGreyOut && 'grey'}
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Save Changes"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
                disableButton={!file && isEmpty(additionalValues?.defaultIcon?.storageLocation)}
              />
            </SidePanelSaveButtonWrapper>
          </Box>
        </form>
      </SwipeableDrawer>
      <SelectionPanel
        options={defaultIcons}
        openIndustry={openDefaultIcon}
        setOpenIndustry={setOpenDefaultIcon}
        additionalValues={additionalValues}
        handleClick={() => {}}
        leftPositionDrawerContainer={375}
        isSelectFromLibrary
        renderContentSection={({ foundOptions: options }) => (
          <ArtifactLibraryDefaultIconsWrapper>
            {options?.map(op => (
              <ArtifactLibraryIconsItem style={{ cursor: 'pointer' }} onClick={() => handleDefaultIconSelect(op)} onKeyDown={() => handleDefaultIconSelect(op)}>
                <ArtifactLibraryIconsItemThumbnail>
                  <ArtifactLibraryIconContainer>
                    <ArtifactLibraryIcon imgUrl={op?.storageLocation}>{!op?.storageLocation && <QuestionMarkIcon />}</ArtifactLibraryIcon>
                  </ArtifactLibraryIconContainer>
                </ArtifactLibraryIconsItemThumbnail>
                <ArtifactLibraryIconsItemTitle>{op?.iconName || 'unknown'}</ArtifactLibraryIconsItemTitle>
              </ArtifactLibraryIconsItem>
            ))}
          </ArtifactLibraryDefaultIconsWrapper>
        )}
      />
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
      {isUploadError && uploadErrorMsg !== duplicateNameCheck && isAddIconMode && (
        <UploadError
          uploadErrorMsg={uploadErrorMsg}
          resetUploadError={resetUploadError}
          fileType={additionalValues.types.length > 0 ? ICON_FILE_TYPES[additionalValues.types[0] - 1] : ' XXmb '}
        />
      )}
      {isNameError && <DuplicateNameError setIsActive={setIsNameError} cancelAndRenameFunc={resetAfterNameError} addModeName="artifactIcon" />}
    </div>
  );
}

export default AddArtifactLibraryIconPanel;

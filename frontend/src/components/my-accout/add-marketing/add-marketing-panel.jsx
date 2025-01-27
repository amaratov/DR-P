import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FileUploader } from 'react-drag-drop-files';
import { useForm } from 'react-hook-form';
import * as tus from 'tus-js-client';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Backdrop, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { mdiCloudUploadOutline, mdiWeatherCloudyAlert, mdiCloudCheckOutline } from '@mdi/js';
import Icon from '@mdi/react';
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
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  HUB_OPTIONS,
  MARKETING_DOCUMENT_FILE_TYPES,
  PARTNER_OPTIONS,
  TECHNOLOGY_OPTIONS,
  TYPE_OPTIONS,
} from '../../../utils/constants/constants';
import { FilledValueRemoveIcon, FilledValueText, FilledValueWrapper, LabelContainer, LabelIcon, LabelText } from '../account-info/account-info-styled';
import TextInput from '../../form-elements/text-input';
import SearchInput from '../../search/search-input';
import { getAddMarketingMode, getUploadErrorInfo } from '../../../features/selectors/ui';
import {
  resetAddMarketingMode,
  resetUploadErrorInfo,
  setOrder,
  setOrderBy,
  setPage,
  setRecentlyAdded,
  setUploadErrorInfo,
} from '../../../features/slices/uiSlice';
import { getHumanReadableFileSize, getNameFromId, isEmpty } from '../../../utils/utils';
import SelectionPanel from '../selection-panel/selection-panel';
import { backendService } from '../../../services/backend';
import { getIndustryVerticals, getOtherTags } from '../../../features/selectors/common';
import { DRDivider } from '../../app/app-styled';
import { getAllActiveUseCases } from '../../../features/selectors/useCase';
import { getAllMarketings } from '../../../features/selectors/marketing';
import UploadError from '../upload-error/upload-error';
import DuplicateNameError from '../upload-error/duplicate-name-error';
import MaxSizeError from '../upload-error/max-size-error';

function AddMarketingPanel({ marketings, setAllMarketings }) {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // selectors
  const isAddMarketingMode = useSelector(getAddMarketingMode);
  const industryVerticals = useSelector(getIndustryVerticals);
  const useCases = useSelector(getAllActiveUseCases);
  const otherTags = useSelector(getOtherTags);
  const isUploadError = useSelector(getUploadErrorInfo)?.hasError;

  // state
  const [isError, setIsError] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isMaxSizeError, setIsMaxSizeError] = useState(false);
  const [isMaxSizeErrorAmount, setIsMaxSizeErrorAmount] = useState('XXmb');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGreyOut, setIsGreyOut] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [openType, setOpenType] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openUseCases, setOpenUseCases] = useState(false);
  const [openPartners, setOpenPartners] = useState(false);
  const [openTechnologies, setOpenTechnologies] = useState(false);
  const [openHub, setOpenHub] = useState(false);
  const [openOtherTags, setOpenOtherTags] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({
    types: [],
    industryVertical: [],
    useCases: [],
    partners: [],
    technologies: [],
    hub: [],
    otherTags: [],
  });
  const [dropboxBackgroundColour, setDropboxBackgroundColour] = useState('#e7eafb');
  const [dropBoxColor, setDropboxColor] = useState('var(--color-homeworld)');
  const [holdType, setHoldType] = useState('');
  const [industryVerticalList, setIndustryVerticalList] = useState([]);
  const [useCaseList, setUseCaseList] = useState([]);

  // memo
  const maxFileSize = useMemo(() => {
    return { ifElse: 10000000, maxSize: '10mb' };
  }, []);

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

  const resetValues = useCallback(() => {
    setFile(null);
    setFileName('');
    setIsDownloading(false);
    setIsError(false);
    setOpenType(false);
    setOpenIndustry(false);
    setOpenUseCases(false);
    setOpenPartners(false);
    setOpenTechnologies(false);
    setOpenHub(false);
    setOpenOtherTags(false);
    reset();
    setAdditionalValues({ types: [], industryVertical: [], useCases: [], partners: [], technologies: [], hub: [], otherTags: [] });
  }, [
    setFile,
    setFileName,
    setIsDownloading,
    setIsError,
    setOpenType,
    setOpenIndustry,
    setOpenUseCases,
    setOpenPartners,
    setOpenTechnologies,
    setOpenHub,
    setOpenOtherTags,
    reset,
    setAdditionalValues,
  ]);

  const onError = useCallback(
    error => {
      console.log(error);
      setIsError(true);
      setIsDownloading(false);
      setFile(null);
      setFileName('');
      setIsGreyOut(true);
    },
    [setIsError, setIsDownloading, setFile, setFileName, setIsGreyOut]
  );

  const isDuplicateNameError = useCallback(
    value => {
      for (let i = 0; i < marketings?.length; i += 1) {
        if (marketings[i]?.docName === value) {
          setIsNameError(true);
          onError('A file with that name already exists!');
          return true;
        }
      }
      return false;
    },
    [marketings, setIsNameError, onError]
  );

  const isMaxSize = useCallback(
    error => {
      setIsMaxSizeError(true);
      onError(error);
    },
    [setIsMaxSizeError, onError]
  );

  const onDrop = useCallback(
    value => {
      if (value.size > maxFileSize.ifElse) {
        isMaxSize('The file is too big!');
        setIsMaxSizeErrorAmount(`${value.size / 1000000}mb`);
      } else {
        setFile(value);
        setFileName(value.name);
        // somehow value is not getting updated, so calling setValue here
        setValue('name', value.name);
        setIsError(false);
        setIsDownloading(true);
        setIsGreyOut(false);
        isDuplicateNameError(value.name);
      }
    },
    [setIsError, setIsDownloading, setFile, setFileName, setIsGreyOut, isDuplicateNameError, isMaxSize, setIsMaxSizeErrorAmount, maxFileSize]
  );

  const onDragging = useCallback(
    checkDrag => {
      setIsGreyOut(checkDrag);
    },
    [setIsGreyOut]
  );

  const handlePanelClose = useCallback(() => {
    setOpenType(false);
    setOpenIndustry(false);
    setOpenUseCases(false);
    setOpenPartners(false);
    setOpenHub(false);
    setOpenOtherTags(false);
    reset();
    setAdditionalValues({ types: [], industryVertical: [], useCases: [], partners: [], technologies: [], hub: [], otherTags: [] });
    dispatch(resetAddMarketingMode());
  }, [dispatch, setOpenType, setOpenIndustry, setOpenUseCases, setOpenPartners, setOpenHub, setOpenOtherTags, setAdditionalValues, reset]);

  const removeFileName = useCallback(() => {
    setFileName('');
    setFile(null);
    setIsDownloading(false);
    setIsError(false);
  }, [setFileName, setFile, setIsDownloading, setIsError]);

  const handleClick = useCallback(
    (val, fieldName) => {
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
    [additionalValues, setAdditionalValues]
  );

  const handleOpen = value => {
    if (value === 'Type') {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenIndustry(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenType(true);
    } else if (value === 'Vertical') {
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenType(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenIndustry(true);
    } else if (value === 'UseCases') {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenUseCases(true);
    } else if (value === 'Partner') {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenPartners(true);
    } else if (value === 'Technology') {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      setOpenTechnologies(true);
    } else if (value === 'Hub') {
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenOtherTags(false);
      setOpenHub(true);
    } else if (value === 'otherTags') {
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

  const submitForm = useCallback(
    async data => {
      setIsGreyOut(true);
      const errorFound = await isDuplicateNameError(data.name);
      if (errorFound) {
        return;
      }
      const finalData = {
        industryVertical: additionalValues.industryVertical,
        useCase: additionalValues.useCases,
        notes: data.notes,
        types: additionalValues.types,
        partners: additionalValues.partners,
        technologies: additionalValues.technologies,
        originalFilename: file?.name,
        docName: data.name,
        hub: additionalValues.hub,
        fileSize: getHumanReadableFileSize(file?.size),
      };
      setOpenType(false);
      setOpenIndustry(false);
      setOpenUseCases(false);
      setOpenPartners(false);
      setOpenTechnologies(false);
      setOpenHub(false);
      setOpenOtherTags(false);
      const results = await dispatch(backendService.createMarketing(finalData));
      dispatch(setRecentlyAdded(results?.payload?.document?.id));
      const final = await new tus.Upload(file, {
        endpoint: `${window.location.origin}/api/v1/marketingdocument/${results?.payload?.document?.id}/upload`,
        retryDelays: [0, 3000, 5000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError: error => {
          console.log(`Failed because: ${error}`);
          setIsUploadError();
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          // console.log(`${bytesUploaded}, ${bytesTotal}, ${percentage}%`);
        },
        onSuccess: () => {
          console.log('Upload successful!');
          setAllMarketings([...marketings, results?.payload?.document]);
        },
      });
      final.start();
      if (final?.error) {
        setIsUploadError();
      } else {
        const type = file?.type;
        setHoldType(type || '');
        handlePanelClose();
        resetValues();
      }
      dispatch(setPage(0));
      dispatch(setOrder('asc'));
      dispatch(setOrderBy('docName'));
    },
    [
      setIsGreyOut,
      isDuplicateNameError,
      setIsUploadError,
      setOpenType,
      setOpenIndustry,
      setOpenUseCases,
      setOpenPartners,
      setOpenTechnologies,
      setOpenHub,
      setOpenOtherTags,
      dispatch,
      file,
      additionalValues,
      setHoldType,
      resetValues,
      handlePanelClose,
      marketings,
      setAllMarketings,
    ]
  );

  //handle on mount/unmount
  useEffect(async () => {
    if (marketings?.length === 0) {
      const initialActiveValues = await dispatch(backendService.getAllActiveMarketings({ archived: false, order: [['docName', 'asc']] }));
      let activeMarketingValuesToRetrieve = initialActiveValues?.payload?.documents || [];
      if (initialActiveValues?.payload?.numPages > 1) {
        /* eslint-disable no-await-in-loop */
        for (let x = 1; x < initialActiveValues?.payload?.numPages; x += 1) {
          const additionalValues = await dispatch(backendService.getAllActiveMarketings({ archived: false, page: x, order: [['docName', 'asc']] }));
          const arrayValue = additionalValues?.payload?.documents || [];
          activeMarketingValuesToRetrieve = [...activeMarketingValuesToRetrieve, ...arrayValue];
        }
      }
      const initialArchivedValues = await dispatch(backendService.getAllArchivedMarketings({ order: [['docName', 'asc']] }));
      let archivedMarketingValuesToRetrieve = initialArchivedValues?.payload?.documents || [];
      if (initialArchivedValues?.payload?.numPages > 1) {
        /* eslint-disable no-await-in-loop */
        for (let y = 1; y < initialArchivedValues?.payload?.numPages; y += 1) {
          const additionalValues = await dispatch(backendService.getAllArchivedMarketings({ page: y, order: [['docName', 'asc']] }));
          const arrayValue = additionalValues?.payload?.documents || [];
          archivedMarketingValuesToRetrieve = [...archivedMarketingValuesToRetrieve, ...arrayValue];
        }
      }
      setAllMarketings([...activeMarketingValuesToRetrieve, ...archivedMarketingValuesToRetrieve]);
      await dispatch(backendService.getAllMarketing());
      await dispatch(backendService.getAllActiveMarketings({ archived: false, order: [['docName', 'asc']] }));
    }
    if (industryVerticals?.length === 0) {
      dispatch(backendService.getAllIndustryVertical());
    }
    if (useCases?.length === 0) {
      dispatch(backendService.getAllUseCases());
    }

    dispatch(backendService.getOtherTags());
  }, []);

  useEffect(() => {
    if (!file) {
      setIsGreyOut(true);
    }
    if (isDownloading) {
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
    isDownloading,
    isError,
    dropboxBackgroundColour,
    setDropboxBackgroundColour,
    setDropboxColor,
    setIsDownloading,
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
      <SidePanelEdgePatch showPatch={openType || openIndustry || openUseCases || openPartners} />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={isAddMarketingMode}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={isAddMarketingMode}
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
                <SidePanelHeaderText>Add Document</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem>
                  <FileUploader
                    multiple={false}
                    // handleChange={handleFileDragged}
                    name="file"
                    types={MARKETING_DOCUMENT_FILE_TYPES}
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
                      {isDownloading && (
                        <div style={{ display: 'contents' }}>
                          <Icon path={mdiCloudCheckOutline} size={1} horizontal vertical rotate={180} />
                          <p style={{ paddingLeft: '0.5rem' }}>Successfully Uploaded</p>
                        </div>
                      )}
                      {!isError && !isDownloading && (
                        <div style={{ display: 'contents' }}>
                          <Icon path={mdiCloudUploadOutline} size={1} horizontal vertical rotate={180} />
                          <p style={{ paddingLeft: '0.5rem' }}>Drop / Select File to Upload</p>
                        </div>
                      )}
                    </div>
                  </FileUploader>
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
                  <div style={{ marginBottom: fileName ? '-3rem' : '0' }}>
                    <TextInput
                      id="name"
                      label="Document Name"
                      placeholder="Add document name"
                      defaultValue={fileName}
                      variant="standard"
                      required
                      register={register}
                      autoFocus="false"
                      error={errors?.name}
                      disabled={isGreyOut}
                    />
                    {fileName && !errors?.name && (
                      <div style={{ display: 'flex', position: 'relative', top: '-70px', justifyContent: 'right', width: 'fit-content', float: 'right' }}>
                        <CustomButton
                          bgColor="red"
                          buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                          icon={BUTTON_ICON.CANCEL}
                          buttonText="Remove"
                          type="button"
                          onClickFunc={removeFileName}
                        />
                      </div>
                    )}
                  </div>
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
                  {(!isEmpty(additionalValues?.types) || openType) && (
                    <LabelContainer onClick={() => handleOpen('Type')}>
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
                      onClickFunc={() => {
                        if (isDownloading) {
                          handleOpen('Type');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
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
                      buttonText="Add Vertical"
                      marginTop="60px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => {
                        if (isDownloading) {
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
                      onClickFunc={() => {
                        if (isDownloading) {
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
                      onClickFunc={() => {
                        if (isDownloading) {
                          handleOpen('Partner');
                        }
                      }}
                    />
                  )}
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem greyOut={isGreyOut}>
                  {(!isEmpty(additionalValues?.technologies) || openTechnologies) && (
                    <LabelContainer onClick={() => handleOpen('Technology')}>
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
                      onClickFunc={() => {
                        if (isDownloading) {
                          handleOpen('Technology');
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
                      onClickFunc={() => {
                        if (isDownloading) {
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
                      buttonText="Add Other Tags"
                      marginTop="60px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => {
                        if (isDownloading) {
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
                disableButton={isGreyOut}
              />
            </SidePanelSaveButtonWrapper>
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
        renderSearchComponent={props => <SearchInput {...props} searchBarOpen placeholder="Search or add other tags" />}
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
              const res = dispatch(backendService.createOtherTag(searchText));
              dispatch(backendService.getOtherTags());
              handleClick(res.payload.tag.id, 'otherTags');
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
      {isUploadError && isAddMarketingMode && <UploadError resetUploadError={resetUploadError} fileType={holdType !== '' ? holdType : ' XXmb'} />}
      {isNameError && isAddMarketingMode && <DuplicateNameError setIsActive={setIsNameError} cancelAndRenameFunc={resetValues} addModeName="marketing" />}
      {isMaxSizeError && isAddMarketingMode && <MaxSizeError setIsActive={setIsMaxSizeError} maxSize={maxFileSize.maxSize} fileSize={isMaxSizeErrorAmount} />}
    </div>
  );
}

AddMarketingPanel.propTypes = {
  marketings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setAllMarketings: PropTypes.func,
};

AddMarketingPanel.defaultProps = {
  setAllMarketings: () => {},
};

export default AddMarketingPanel;

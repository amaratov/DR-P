import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { mdiCloudUploadOutline, mdiWeatherCloudyAlert, mdiCloudCheckOutline } from '@mdi/js';
import Icon from '@mdi/react';
import * as tus from 'tus-js-client';
import { getUploadMode, getUploadErrorInfo, getSelectedProjectDetails } from '../../../features/selectors/ui';
import { TABS, SOLUTION_BRIEF_FILE_TYPES, BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import {
  UploadSolutionBriefBackground,
  UploadSolutionBriefBox,
  UploadSolutionBriefText,
  UploadSolutionBriefContentWrapper,
  UploadSolutionBriefContentContainer,
  UploadSolutionBriefSubHeaderText,
} from './solution-brief-style';
import TextInput from '../../form-elements/text-input';
import { resetUploadErrorInfo, resetUploadMode, setAdditionalSolBriefs, setRecentlyAdded, setUploadErrorInfo } from '../../../features/slices/uiSlice';
import MaxSizeError from '../../my-accout/upload-error/max-size-error';
import UploadError from '../../my-accout/upload-error/upload-error';
import { getCurrentSolutionBriefs } from '../../../features/selectors/solutionBrief';
import { getHumanReadableFileSize, getLatestVersionForSolutionBrief, getProjectInitialLetter } from '../../../utils/utils';
import { getWhoAmI } from '../../../features/selectors';
import { backendService } from '../../../services/backend';

function UploadSolutionBrief({ fromProjectBreifcase }) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // memo
  const maxFileSize = useMemo(() => {
    return { ifElse: 10000000, maxSize: '10mb' };
  }, []);

  // selector
  const whoami = useSelector(getWhoAmI);
  const uploadMode = useSelector(getUploadMode);
  const isUploadError = useSelector(getUploadErrorInfo)?.hasError;
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const currentSolutionBriefCase = useSelector(getCurrentSolutionBriefs);

  // state
  const [addVersion, setAddVersion] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isMaxSizeError, setIsMaxSizeError] = useState(false);
  const [isMaxSizeErrorAmount, setIsMaxSizeErrorAmount] = useState('XXmb');
  const [isFileInitialized, setIsFileInitialized] = useState(false);
  const [showInitFile, setShowInitFile] = useState(false);
  const [isGreyOut, setIsGreyOut] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [dropboxBackgroundColour, setDropboxBackgroundColour] = useState('#e7eafb');
  const [dropBoxColor, setDropboxColor] = useState('var(--color-homeworld)');
  const [holdType, setHoldType] = useState('');

  // constant
  const isUploadMode = uploadMode === TABS.SOLUTION_BRIEF || isUploadError;

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // function
  const onError = useCallback(
    error => {
      console.log(error);
      setIsError(true);
      setIsFileInitialized(false);
      setFile(null);
      setFileName('');
      setIsGreyOut(true);
    },
    [setIsError, setIsFileInitialized, setFile, setFileName, setIsGreyOut]
  );

  const isMaxSize = useCallback(
    error => {
      setIsMaxSizeError(true);
      onError(error);
    },
    [setIsMaxSizeError, onError]
  );

  const setIsUploadError = useCallback(
    msg => {
      dispatch(setUploadErrorInfo(msg?.stack || msg));
    },
    [dispatch]
  );

  const resetUploadError = useCallback(() => {
    dispatch(resetUploadErrorInfo());
  }, [dispatch]);

  const handleNotesValidation = useCallback(
    value => {
      if (value?.target?.name === 'notes') {
        if (value?.target?.value !== '') {
          setIsNotes(true);
        } else if (value.target?.value === '' && isNotes) {
          setIsNotes(false);
        }
      }
    },
    [setIsNotes, isNotes]
  );

  const handleRemoveTempFile = useCallback(() => {
    setFile(null);
    setFileName(null);
    setIsError(false);
    setIsFileInitialized(false);
    setShowInitFile(false);
    reset();
  }, [reset, setFile, setFileName, setIsFileInitialized, setShowInitFile, setIsError]);

  const handleCancelUpload = useCallback(() => {
    dispatch(resetUploadMode());
    setFile(null);
    setFileName(null);
    setIsError(false);
    setIsFileInitialized(false);
    setShowInitFile(false);
    reset();
  }, [dispatch, reset, setFile, setFileName, setIsFileInitialized, setShowInitFile, setIsError]);

  const onDrop = useCallback(
    value => {
      if (value.size > maxFileSize.ifElse) {
        isMaxSize('The file is too big!');
        setIsMaxSizeErrorAmount(`${value.size / 1000000}mb`);
      } else {
        setFile(value);
        setFileName(value.name);
        setIsError(false);
        setIsFileInitialized(true);
        setIsGreyOut(false);
      }
    },
    [setIsError, setIsFileInitialized, setFile, setFileName, setIsGreyOut, isMaxSize, setIsMaxSizeErrorAmount, maxFileSize]
  );

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

  const submitForm = useCallback(
    async data => {
      let isError = false;
      const projectId = currentProjectInfo?.id || routeParams?.id;
      const originalFilename = file?.name;
      const projectInitial = getProjectInitialLetter(currentProjectInfo?.title);
      const latestVersionObj = getLatestVersionForSolutionBrief(projectInitial, currentSolutionBriefCase);
      const fileSize = getHumanReadableFileSize(file?.size) || '';
      const finalData = {
        projectId,
        originalFilename,
        fileSize,
        notes: data?.notes || '',
        publishedBy: fromProjectBreifcase ? 'project brief' : null,
        ...latestVersionObj,
      };
      const results = await dispatch(backendService.createSolutionBriefcase(finalData));
      const final = await new tus.Upload(file, {
        endpoint: `${window.location.origin}/api/v1/solution_briefcase/${results?.payload?.solutionBriefcase?.id}/upload`,
        retryDelays: [0, 3000, 5000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError: error => {
          console.log(`Failed because: ${error}`);
          isError = true;
          if (error?.message?.includes('The file for this url was not found')) {
            setIsNameError(true);
          }
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

      setTimeout(async () => {
        if (!isError) {
          if (currentProjectInfo?.id || routeParams?.id) {
            const params = {
              projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
            };
            handleAllSolutionBriefRetrieval(params);
          }
          if (fromProjectBreifcase) {
            dispatch(setRecentlyAdded(results?.payload?.solutionBriefcase?.id));
          }
          resetUploadError();
        } else {
          await dispatch(backendService.deleteSolutionBriefcase(results?.payload?.solutionBriefcase?.id));
        }
        reset();
      }, 1500);
    },
    [
      currentProjectInfo,
      routeParams,
      currentSolutionBriefCase,
      file,
      dispatch,
      handleAllSolutionBriefRetrieval,
      fromProjectBreifcase,
      reset,
      resetUploadError,
      setIsUploadError,
      setIsNameError,
    ]
  );

  useEffect(() => {
    if (file && isNotes) {
      setAddVersion(true);
    } else if (addVersion && (!isNotes || file === null)) {
      setAddVersion(false);
    }
  }, [file, isNotes, setAddVersion, addVersion]);

  useEffect(() => {
    if (isFileInitialized) {
      setDropboxBackgroundColour('#00b11f36');
      setDropboxColor('#1db81d');
    } else if (isError) {
      setDropboxBackgroundColour('#ff00003b');
      setDropboxColor('#ff000091');
    } else if (dropboxBackgroundColour !== '#e7eafb') {
      setDropboxBackgroundColour('#e7eafb');
      setDropboxColor('var(--color-homeworld)');
    }
  }, [isFileInitialized, isError, dropboxBackgroundColour, setDropboxBackgroundColour, setDropboxColor]);

  useEffect(() => {
    if (isFileInitialized && !showInitFile) {
      setTimeout(() => {
        setIsFileInitialized(false);
        setShowInitFile(true);
      }, 1000);
    }
  }, [isFileInitialized, showInitFile]);

  return (
    <UploadSolutionBriefBackground open={isUploadMode}>
      <form onChange={value => handleNotesValidation(value)} onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <UploadSolutionBriefBox>
            <UploadSolutionBriefText>Upload Solution Brief</UploadSolutionBriefText>
            <div>
              <div>
                <FileUploader
                  multiple={false}
                  name="file"
                  types={SOLUTION_BRIEF_FILE_TYPES}
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
                    {isFileInitialized && !showInitFile && (
                      <div style={{ display: 'contents' }}>
                        <Icon path={mdiCloudCheckOutline} size={1} horizontal vertical rotate={180} />
                        <p style={{ paddingLeft: '0.5rem' }}>Successfully Uploaded</p>
                      </div>
                    )}
                    {showInitFile && file && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'nowrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          padding: '0 10px',
                        }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <InsertDriveFileOutlinedIcon />
                          <p style={{ paddingLeft: '0.5rem' }}>{fileName || ''}</p>
                        </div>
                        <div style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={() => handleRemoveTempFile()} onKeyDown={() => handleRemoveTempFile()}>
                          <CancelOutlinedIcon />
                        </div>
                      </div>
                    )}
                    {!isError && !isFileInitialized && !showInitFile && (
                      <div style={{ display: 'contents' }}>
                        <Icon path={mdiCloudUploadOutline} size={1} horizontal vertical rotate={180} />
                        <p style={{ paddingLeft: '0.5rem' }}>Drop / Select File to Upload</p>
                      </div>
                    )}
                  </div>
                </FileUploader>
              </div>
            </div>
            <UploadSolutionBriefContentWrapper>
              <UploadSolutionBriefContentContainer>
                <UploadSolutionBriefSubHeaderText />
                <TextInput
                  id="notes"
                  label={`${fromProjectBreifcase ? 'File Requirements' : 'Notes'}`}
                  type="text"
                  placeholder="Add Notes"
                  variant="standard"
                  register={register}
                  error={errors?.name}
                  longScreen
                />
              </UploadSolutionBriefContentContainer>
            </UploadSolutionBriefContentWrapper>
            <UploadSolutionBriefContentWrapper style={{ display: 'grid', gridAutoFlow: 'column', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={handleCancelUpload}
              />
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText={`${fromProjectBreifcase ? 'Add to Briefcase' : 'Add Version'}`}
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
                disableButton={!addVersion}
              />
            </UploadSolutionBriefContentWrapper>
          </UploadSolutionBriefBox>
        </Box>
      </form>
      {isUploadError && !isNameError && isUploadMode && <UploadError resetUploadError={resetUploadError} fileType={holdType !== '' ? holdType : ' XXmb'} />}
      {isNameError && isUploadMode && (
        <UploadError
          resetUploadError={() => {
            setIsNameError(false);
            resetUploadError();
          }}
          fileType={holdType !== '' ? holdType : ' XXmb'}
          uploadErrorMsg={
            'Unable to access the file for upload. Please rename the file so there are no spaces (example: change " " into "_" where possible). Special characters may also need to be removed. Please try uploading your file again.'
          }
        />
      )}
      {isMaxSizeError && isUploadMode && <MaxSizeError setIsActive={setIsMaxSizeError} maxSize={maxFileSize.maxSize} fileSize={isMaxSizeErrorAmount} />}
    </UploadSolutionBriefBackground>
  );
}

UploadSolutionBrief.prototype = {
  fromProjectBreifcase: PropTypes.bool,
};

UploadSolutionBrief.defaultProps = {
  fromProjectBreifcase: false,
};

export default UploadSolutionBrief;

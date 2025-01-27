import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import * as tus from 'tus-js-client';
import Icon from '@mdi/react';
import { mdiCloudCheckOutline, mdiCloudUploadOutline, mdiWeatherCloudyAlert, mdiCloseCircle } from '@mdi/js';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box } from '@mui/material';
import {
  DiscoverProjectDetailAssociatedFileItem,
  DiscoverProjectDetailAssociatedFileItemLeft,
  DiscoverProjectDetailAssociatedFileItemRight,
  DiscoverProjectDetailAssociatedFileItemText,
  DiscoverProjectDetailHeader,
  DiscoverProjectDetailInputField,
  DiscoverProjectDetailInputLabel,
  DiscoverProjectDetailInputWrapper,
  DiscoverProjectDetailSubHeader,
  DiscoverProjectDetailWrapper,
} from './discover-project-details-styled';
import { getSelectedProjectDetails, getUploadErrorInfo } from '../../../../features/selectors/ui';
import { backendService } from '../../../../services/backend';
import { resetUploadErrorInfo, setUploadErrorInfo } from '../../../../features/slices/uiSlice';
import { getProjectAssociatedDocuments } from '../../../../features/selectors/customerDocument';
import MoreMenuButton from '../../../more-menu-button/more-menu-button';
import { getHumanReadableFileSize, isEmpty } from '../../../../utils/utils';
import TextInput from '../../../form-elements/text-input';
import { DiscoverRegionNotesErrorField } from '../discover-regions/discover-region-section-styled';
import CustomButton from '../../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE, AllRoles } from '../../../../utils/constants/constants';
import { getWhoAmI } from '../../../../features/selectors';

function DiscoverProjectDetails() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const associatedDocuments = useSelector(getProjectAssociatedDocuments);
  const uploadError = useSelector(getUploadErrorInfo);
  const whoami = useSelector(getWhoAmI);

  // state
  const [dropboxBackgroundColour, setDropboxBackgroundColour] = useState('rgba(30, 25, 245, 0.04)');
  const [dropboxBackgroundSize, setDropboxBackgroundSize] = useState('100%');
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [noteVal, setNoteVal] = useState(undefined);
  const [noteError, setNoteError] = useState({});

  // const
  const uploadErrorMsg =
    uploadError?.errorMsg && uploadError?.errorMsg?.includes('docName must be unique')
      ? ' -- Can not upload because file name already exists'
      : uploadError?.errorMsg || '';
  const roleName = whoami?.role?.name?.toLowerCase();
  const isCustomer = roleName === AllRoles.CUSTOMER;
  const isSales = roleName === AllRoles.SALES;
  const isSolutionsEngineer = roleName === AllRoles.SOLUTIONS_ENGINEER;
  const isAdmin = roleName === AllRoles.ADMIN;
  const isSA = roleName === AllRoles.SOLUTIONS_ARCHITECT;

  //func
  const resetUploadError = useCallback(() => {
    dispatch(resetUploadErrorInfo());
  }, [dispatch]);

  const setError = useCallback(
    error => {
      if (!isEmpty(error)) {
        dispatch(setUploadErrorInfo(error));
      }
      setFile(null);
      setDropboxBackgroundColour('red');
      setIsUploading(false);
      setTimeout(() => {
        setIsError(null);
        resetUploadError();
        setDropboxBackgroundColour('rgba(30, 25, 245, 0.04)');
      }, 10000);
    },
    [dispatch, setFile, setDropboxBackgroundColour, setIsUploading, setTimeout, setIsError, resetUploadError, isEmpty]
  );

  useEffect(() => {
    setIsError(uploadError?.hasError || false);
  }, [uploadError]);

  const onDrop = useCallback(
    value => {
      resetUploadError();
      setFile(value);
      setIsError(false);
      setIsUploading(true);
    },
    [resetUploadError, setIsError, setIsUploading, setFile]
  );

  const handleNoteSave = useCallback(
    val => {
      if (val?.length > 2000) {
        setNoteError({ msg: 'Note should be less than 2000 characters' });
      } else {
        setNoteError({});
        const putBody = {
          id: currentProjectInfo.id,
          notes: val,
        };
        dispatch(backendService.updateProject(putBody));
        // setTimeout(() => dispatch(backendService.getProjectById(currentProjectInfo.id)), 100);
      }
    },
    [currentProjectInfo, setNoteError]
  );

  const handleRemoveNotes = useCallback(() => {
    handleNoteSave('');
    setNoteVal('');
    setNoteError({});
  }, [handleNoteSave, setNoteVal, setNoteError]);

  const handleDownloadFile = function (doc) {
    dispatch(backendService.downloadCustomerDocument(doc));
  };

  // effect
  useEffect(() => {
    if (isEmpty(currentProjectInfo)) {
      dispatch(backendService.getProjectById(routeParams?.id));
    }
  }, [currentProjectInfo, dispatch, routeParams]);

  useEffect(() => {
    if (currentProjectInfo?.id || routeParams?.id) {
      const params = {
        projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
        archived: false,
      };
      dispatch(backendService.getCustomerDocumentByProjectId(params));
    }
  }, [dispatch, currentProjectInfo.id, routeParams]);

  useEffect(() => {
    setNoteVal(currentProjectInfo?.notes);
  }, [setNoteVal, currentProjectInfo]);

  useEffect(async () => {
    if (file && file?.size && file?.name) {
      const finalData = {
        projectId: currentProjectInfo?.id || routeParams?.id,
        originalFilename: file?.name,
        docName: file?.name,
        fileSize: getHumanReadableFileSize(file?.size),
      };
      const results = await dispatch(backendService.createCustomerDocument(finalData));
      if (results?.error) {
        setError(null);
      } else {
        const final = new tus.Upload(file, {
          endpoint: `${window.location.origin}/api/v1/customerdocument/${results?.payload?.document?.id}/upload`,
          retryDelays: [0, 3000, 5000],
          metadata: {
            filename: file.name,
            filetype: file.type,
          },
          onError: error => {
            setError(error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            setDropboxBackgroundColour('linear-gradient(270deg, #0085FF -56.63%, #7B36D2 100%) no-repeat');
            setDropboxBackgroundSize(`${percentage}%`);
            // console.log(`${bytesUploaded}, ${bytesTotal}, ${percentage}%`);
          },
          onSuccess: () => {
            //console.log('Upload successful!');
            resetUploadError();
            setDropboxBackgroundColour('#66bb6a');
            setIsUploading(false);
            setTimeout(() => {
              setFile(null);
              setDropboxBackgroundColour('rgba(30, 25, 245, 0.04)');
            }, 5000);
          },
        });
        final.start();
      }
    }
  }, [file, dispatch, currentProjectInfo, resetUploadError, setError, setFile]);

  return (
    <DiscoverProjectDetailWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DiscoverProjectDetailHeader>Relevant Documention</DiscoverProjectDetailHeader>
        {!isCustomer && !isSales && !isSolutionsEngineer && <DiscoverProjectDetailSubHeader>10mb file limit</DiscoverProjectDetailSubHeader>}
      </div>
      {associatedDocuments?.length > 0 &&
        associatedDocuments?.map(doc => (
          <DiscoverProjectDetailAssociatedFileItem key={doc.id}>
            <DiscoverProjectDetailAssociatedFileItemLeft>
              <InsertDriveFileOutlinedIcon />
              <DiscoverProjectDetailAssociatedFileItemText>{doc.docName}</DiscoverProjectDetailAssociatedFileItemText>
            </DiscoverProjectDetailAssociatedFileItemLeft>
            <DiscoverProjectDetailAssociatedFileItemRight>
              {(isAdmin || isSA) && <MoreMenuButton isProjectDocument rowDetails={doc} />}
              {isCustomer && isSolutionsEngineer && isSales && (
                <CustomButton
                  useColor="var(--color-homeworld)"
                  buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                  icon={BUTTON_ICON.FILE_DOWNLOAD}
                  type="button"
                  onClickFunc={() => {
                    handleDownloadFile(doc);
                  }}
                />
              )}
            </DiscoverProjectDetailAssociatedFileItemRight>
          </DiscoverProjectDetailAssociatedFileItem>
        ))}
      {(isAdmin || isSA) && (
        <FileUploader
          multiple={false}
          name="file"
          handleChange={setFile}
          hoverTitle=" "
          maxSize={10}
          onSizeError={error => setError(' -- File size over the 10mb limit.')}
          onDrop={onDrop}
          onSelect={onDrop}>
          <div
            style={{
              color: 'var(--color-homeworld)',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              backgroundColor: 'rgba(30, 25, 245, 0.04)',
              borderRadius: '7px',
              width: '100%',
            }}>
            <div style={{ display: 'contents' }}>
              <Icon path={mdiCloudUploadOutline} size={1} horizontal vertical rotate={180} />
              <p style={{ paddingLeft: '0.5rem' }}>Drop / Select File to Upload</p>
            </div>
          </div>
        </FileUploader>
      )}
      <div
        style={{
          color: 'var(--color-homeworld)',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          background: dropboxBackgroundColour,
          backgroundSize: dropboxBackgroundSize,
          borderRadius: '7px',
        }}>
        {isError && (
          <Box alignItems="center" display="flex" gap="0.5rem" justifyContent="center" position="relative" width="100%">
            <Icon path={mdiWeatherCloudyAlert} size={1} horizontal vertical rotate={180} />
            <p>Upload Error {uploadErrorMsg || ''}</p>
            <Icon
              path={mdiCloseCircle}
              size={1}
              horizontal
              vertical
              onClick={() => setIsError(false)}
              style={{ cursor: 'pointer', position: 'absolute', right: '18px' }}
            />
          </Box>
        )}
        {file && !isError && isUploading && (
          <Box alignItems="center" display="flex" gap="0.5rem" justifyContent="center" position="relative" width="100%">
            <Icon path={mdiCloudCheckOutline} size={1} horizontal vertical rotate={180} />
            <p>Uploading...</p>
          </Box>
        )}
        {file && !isError && !isUploading && (
          <Box alignItems="center" display="flex" gap="0.5rem" justifyContent="center" position="relative" width="100%">
            <Icon path={mdiCloudCheckOutline} size={1} horizontal vertical rotate={180} />
            <p>Successfully Uploaded</p>
            <Icon
              path={mdiCloseCircle}
              size={1}
              horizontal
              vertical
              onClick={() => setFile(null)}
              style={{ cursor: 'pointer', position: 'absolute', right: '18px' }}
            />
          </Box>
        )}
      </div>
      <DiscoverProjectDetailInputWrapper showAtBottom>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DiscoverProjectDetailInputLabel>Project Notes</DiscoverProjectDetailInputLabel>
          {!isEmpty(currentProjectInfo?.notes) && (isAdmin || isSA) && (
            <div>
              <CustomButton buttonStyle={BUTTON_STYLE.END_ICON_BUTTON} icon={BUTTON_ICON.CANCEL} type="button" onClickFunc={handleRemoveNotes} />
            </div>
          )}
        </div>
        <TextInput
          id="notes"
          variant="standard"
          placeholder="Please let us know anything specific about this deployment and if you are entering new regions and etc."
          value={noteVal}
          autoFocus="false"
          longScreen
          multiline
          usesValue
          onBlur={e => handleNoteSave(e.target?.value)}
          onChange={e => setNoteVal(e.target?.value)}
          error={!isEmpty(noteError?.msg)}
          disabled={isCustomer || isSales || isSolutionsEngineer}
        />
        {!isEmpty(noteError) && <DiscoverRegionNotesErrorField>{noteError?.msg}</DiscoverRegionNotesErrorField>}
      </DiscoverProjectDetailInputWrapper>
    </DiscoverProjectDetailWrapper>
  );
}

DiscoverProjectDetails.prototype = {};

DiscoverProjectDetails.defaultProps = {};

export default DiscoverProjectDetails;

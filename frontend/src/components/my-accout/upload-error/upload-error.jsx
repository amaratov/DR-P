import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { BUTTON_STYLE, MARKETING_DOCUMENT_FILE_VALUES } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { UploadErrorPage, UploadErrorWrapper } from './upload-error-styled';

function UploadError({ fileType, resetUploadError, uploadErrorMsg }) {
  const toggle = useCallback(() => {
    resetUploadError();
  }, [resetUploadError]);

  const fileSize = MARKETING_DOCUMENT_FILE_VALUES.filter(value => value?.type === fileType)?.[0]?.maxSize;
  const generalMsg = `The file you are trying to upload is ${fileType}, the max size of the file you are able to upload is ${
    fileSize || 'XXmb'
  }, please try uploading your
          file again.`;

  return (
    <UploadErrorPage>
      <UploadErrorWrapper>
        <h1 style={{ fontSize: '36px', fontWeight: '600' }}>Upload Error</h1>
        <p style={{ marginBottom: '2.5rem', fontSize: '20px', fontWeight: 300 }}>{uploadErrorMsg || generalMsg}</p>
        <CustomButton
          buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
          buttonText="Continue"
          type="button"
          bgColor="var(--color-homeworld)"
          customMinWidth="400px"
          customMinHeight="56px"
          onClickFunc={() => {
            toggle();
          }}
        />
      </UploadErrorWrapper>
    </UploadErrorPage>
  );
}

UploadError.propTypes = {
  fileType: PropTypes.string.isRequired,
  resetUploadError: PropTypes.func.isRequired,
  uploadErrorMsg: PropTypes.string,
};

UploadError.defaultProps = {
  uploadErrorMsg: '',
};

export default UploadError;

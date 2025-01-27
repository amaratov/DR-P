import React from 'react';
import PropTypes from 'prop-types';
import { BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { MaxSizeErrorPage, MaxSizeErrorWrapper } from './upload-error-styled';

function MaxSizeError({ setIsActive, maxSize, fileSize }) {
  return (
    <MaxSizeErrorPage>
      <MaxSizeErrorWrapper>
        <h1 style={{ fontSize: '36px', fontWeight: '600' }}>Upload Error</h1>
        <p style={{ marginBottom: '2.5rem', fontSize: '20px', fontWeight: 300 }}>
          The file you are trying to upload is {fileSize}, the max size of the file you are able to upload is {maxSize || 'XXmb'}, please try uploading your
          file again.
        </p>
        <CustomButton
          buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
          buttonText="Continue"
          type="button"
          bgColor="var(--color-homeworld)"
          customMinWidth="400px"
          customMinHeight="56px"
          onClickFunc={() => setIsActive(value => !value)}
        />
      </MaxSizeErrorWrapper>
    </MaxSizeErrorPage>
  );
}

MaxSizeError.propTypes = {
  setIsActive: PropTypes.func.isRequired,
  maxSize: PropTypes.string.isRequired,
  fileSize: PropTypes.string,
};

MaxSizeError.defaultProps = {
  fileSize: 'XXmb',
};

export default MaxSizeError;

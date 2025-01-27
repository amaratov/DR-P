import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { NameErrorPage, NameErrorWrapper } from './upload-error-styled';
import {
  resetAddIconMode,
  resetAddMarketingMode,
  resetAddReferenceMode,
  resetEditMode,
  setSelectedIconDetails,
  setSelectedMarketingDetails,
  setSelectedReferenceDocDetails,
} from '../../../features/slices/uiSlice';

function DuplicateNameError({ setIsActive, cancelAndRenameFunc, addModeName, editModeName }) {
  const dispatch = useDispatch();

  const toggle = useCallback(() => {
    setIsActive(value => !value);
  }, [setIsActive]);

  const turnOffEdit = useCallback(() => {
    if (editModeName === 'marketing') {
      dispatch(setSelectedMarketingDetails({}));
    }
    if (editModeName === 'artifactIcon') {
      dispatch(setSelectedIconDetails({}));
    }
    if (editModeName === 'referenceDoc') {
      dispatch(setSelectedReferenceDocDetails({}));
    }
    dispatch(resetEditMode);
    setIsActive(value => !value);
  }, [dispatch, setIsActive, editModeName]);

  const turnOffAdd = useCallback(() => {
    if (addModeName === 'marketing') {
      dispatch(resetAddMarketingMode());
    }
    if (addModeName === 'artifactIcon') {
      dispatch(resetAddIconMode());
    }
    if (addModeName === 'referenceDoc') {
      dispatch(resetAddReferenceMode());
    }
    setIsActive(value => !value);
  }, [dispatch, addModeName, setIsActive]);

  return (
    <NameErrorPage>
      <NameErrorWrapper>
        <h1 style={{ fontSize: '36px', lineHeight: '3rem', marginBottom: '0' }}>The name already exists</h1>
        <p style={{ lineHeight: '1.5rem', width: '23rem' }}>The name you have entered already exists. Please change the name to continue.</p>
        <CustomButton
          buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
          buttonText="Cancel"
          type="button"
          customMinWidth="400px"
          customMinHeight="56px"
          onClickFunc={() => {
            cancelAndRenameFunc('Cancel');
            if (addModeName !== '') {
              turnOffAdd();
            } else if (editModeName !== '') {
              turnOffEdit();
            } else {
              setIsActive(value => !value);
            }
          }}
        />
        <CustomButton
          buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
          buttonText="Rename File"
          bgColor="var(--color-homeworld)"
          type="button"
          customMinWidth="400px"
          customMinHeight="56px"
          onClickFunc={() => {
            toggle();
            cancelAndRenameFunc('Rename');
          }}
        />
      </NameErrorWrapper>
    </NameErrorPage>
  );
}

DuplicateNameError.propTypes = {
  setIsActive: PropTypes.func.isRequired,
  cancelAndRenameFunc: PropTypes.func,
  addModeName: PropTypes.string,
  editModeName: PropTypes.string,
};

DuplicateNameError.defaultProps = {
  addModeName: '',
  editModeName: '',
  cancelAndRenameFunc: () => {},
};

export default DuplicateNameError;

import React from 'react';
import { ModelPopupContent, ModelPopupWrapper } from './model-popup-styled';
import CustomButton from '../../../form-elements/custom-button';
import { BUTTON_STYLE } from '../../../../utils/constants/constants';

function ModelPopup({ setOpenConfirmPopup, confirmFunc }) {
  return (
    <ModelPopupWrapper>
      <ModelPopupContent>
        <h1 style={{ fontSize: '36px', fontWeight: '600' }}>Are you sure?</h1>
        <p style={{ marginBottom: '2.5rem', fontSize: '20px', fontWeight: 300 }}>
          The location you are attempting to deactivate has an active connection. Deactivating this location will permanently delete any associated connections.
        </p>
        <CustomButton
          buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
          buttonText="Cancel"
          type="button"
          customMinWidth="400px"
          customMinHeight="56px"
          onClickFunc={() => setOpenConfirmPopup(false)}
        />
        <div style={{ marginBottom: '16px' }} />
        <CustomButton
          buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
          buttonText="Deactivate"
          type="button"
          bgColor="var(--color-homeworld)"
          customMinWidth="400px"
          customMinHeight="56px"
          onClickFunc={confirmFunc}
        />
      </ModelPopupContent>
    </ModelPopupWrapper>
  );
}

export default ModelPopup;

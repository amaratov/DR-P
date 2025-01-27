import React from 'react';
import { ConnectionPopupContent, ConnectionPopupWrapper } from './connect-styled';
import { BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';

function ConnectionPopup({ setOpenConfirmPopup, connectionName, handleRemoveConnection, connectionNum }) {
  return (
    <ConnectionPopupWrapper>
      <ConnectionPopupContent>
        <h1 style={{ fontSize: '36px', fontWeight: '600' }}>Are you sure?</h1>
        <p style={{ marginBottom: '2.5rem', fontSize: '20px', fontWeight: 300 }}>
          {`You are removing a connection group “${connectionName}” which contains ${connectionNum} connection${
            connectionNum > 1 ? 's' : ''
          }. This cannot be undone.`}
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
          buttonText="Delete Connection Group"
          type="button"
          bgColor="var(--color-homeworld)"
          customMinWidth="400px"
          customMinHeight="56px"
          onClickFunc={handleRemoveConnection}
        />
      </ConnectionPopupContent>
    </ConnectionPopupWrapper>
  );
}

export default ConnectionPopup;

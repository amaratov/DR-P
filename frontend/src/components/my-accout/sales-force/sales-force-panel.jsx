import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  SidePanelContentItem,
  SidePanelContentWrapper,
  SidePanelDrawerWrapper,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSaveButtonWrapper,
} from '../../side-panel/side-panel-styled';
import { BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import TextInput from '../../form-elements/text-input';
import { isEmpty } from '../../../utils/utils';

function SalesForcePanel({ openSalesForce, setOpenSalesForce, handleClick, leftPositionDrawerContainer }) {
  // form
  const { register, handleSubmit, reset, getValues } = useForm();

  // state
  const [disableSubmit, setDisableSubmit] = useState(true);

  // const
  const openWidth = openSalesForce ? '500px' : '0';

  // func
  const handleFormChange = () => {
    const currentFormValues = getValues();
    if (!isEmpty(currentFormValues?.salesforceFieldName) && !isEmpty(currentFormValues?.salesforceFieldValue) && disableSubmit) setDisableSubmit(false);
    if ((isEmpty(currentFormValues?.salesforceFieldName) || isEmpty(currentFormValues?.salesforceFieldValue)) && !disableSubmit) setDisableSubmit(true);
  };

  const submitForm = data => {
    handleClick([{ field: data?.salesforceFieldName, id: data?.salesforceFieldValue }], 'salesforceId');
    setOpenSalesForce(false);
    reset();
  };

  return (
    <SidePanelDrawerWrapper
      disableEnforceFocus
      hideBackdrop
      anchor="left"
      leftPositionDrawerContainer={leftPositionDrawerContainer}
      open={openSalesForce}
      openWidth={openWidth}
      onClose={() => setOpenSalesForce(false)}
      PaperProps={{
        style: {
          marginLeft: `${leftPositionDrawerContainer}px`,
          backgroundColor: '#f0ecfc',
          borderTopRightRadius: '30px',
          borderBottomRightRadius: '30px',
          boxShadow: 'unset',
        },
      }}>
      <form onChange={handleFormChange} onSubmit={handleSubmit(submitForm)} style={{ position: 'relative' }}>
        <Box sx={{ minWidth: openWidth, position: 'relative' }}>
          <SidePanelMainWrapper>
            <SidePanelHeaderWrapper>
              <SidePanelHeaderText>Add Salesforce ID</SidePanelHeaderText>
              <SidePanelHeaderCloseBtn>
                <CloseIcon onClick={() => setOpenSalesForce(false)} />
              </SidePanelHeaderCloseBtn>
            </SidePanelHeaderWrapper>
            <SidePanelContentWrapper>
              <SidePanelContentItem>
                <TextInput
                  id="salesforceFieldName"
                  label="Salesforce Field Name"
                  placeholder="Enter Field Name"
                  type="text"
                  variant="standard"
                  register={register}
                  customWidth="400px"
                />
              </SidePanelContentItem>
              <SidePanelContentItem>
                <TextInput
                  id="salesforceFieldValue"
                  label="Salesforce Field Value"
                  placeholder="Enter Field Value"
                  type="text"
                  variant="standard"
                  register={register}
                  customWidth="400px"
                />
              </SidePanelContentItem>
            </SidePanelContentWrapper>
          </SidePanelMainWrapper>
          <SidePanelSaveButtonWrapper customLeft="420px">
            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
              buttonText="Save Salesforce Information"
              type="submit"
              customMinWidth="400px"
              customMinHeight="56px"
              disabled={disableSubmit}
            />
          </SidePanelSaveButtonWrapper>
        </Box>
      </form>
    </SidePanelDrawerWrapper>
  );
}

SalesForcePanel.propTypes = {
  openSalesForce: PropTypes.bool.isRequired,
  setOpenSalesForce: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  leftPositionDrawerContainer: PropTypes.number,
};

SalesForcePanel.defaultProps = {
  leftPositionDrawerContainer: 378,
};

export default SalesForcePanel;

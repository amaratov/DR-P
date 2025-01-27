import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Box, SwipeableDrawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  SidePanelContentWrapper,
  SidePanelEdgePatch,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
} from '../../../../../side-panel/side-panel-styled';
import SelectionPanel from '../../../../../my-accout/selection-panel/selection-panel';
import DependencySection from './dependeny-section';
import CustomButton from '../../../../../form-elements/custom-button';
import { BUTTON_STYLE } from '../../../../../../utils/constants/constants';

function DependenciesSidePanel({
  haveOptionsPanelDisplayOnOpen,
  onClose,
  onOpen,
  onRemove,
  onSelection,
  open,
  options,
  panelHeaderText,
  renderContent,
  renderSidePanelContent,
  selected,
  selectionPanelType,
}) {
  const [openOptions, setOpenOptions] = useState(haveOptionsPanelDisplayOnOpen && open);

  useEffect(() => setOpenOptions(haveOptionsPanelDisplayOnOpen && open), [haveOptionsPanelDisplayOnOpen, open]);

  return (
    <div>
      <SidePanelEdgePatch showPatch={openOptions} />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={open}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        PaperProps={{
          style: {
            marginLeft: '8px',
            borderRadius: '30px',
            boxShadow: 'unset',
            border: 'unset',
            height: '100%',
          },
        }}>
        <form onSubmit={() => {}} style={{ height: 'inherit', position: 'relative' }}>
          <Box height="inherit" minWidth="350" position="relative" role="presentation">
            <SidePanelMainWrapper height="inherit">
              <SidePanelHeaderWrapper>
                <SidePanelHeaderText>{panelHeaderText}</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={onClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>{renderContent({ setOpenSidebar: setOpenOptions })}</SidePanelContentWrapper>
              <Box bottom="14px" position="absolute">
                <CustomButton
                  buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                  buttonText="Confirm Selection"
                  bgColor="var(--color-homeworld)"
                  customMinWidth="290px"
                  customMinHeight="60px"
                  onClickFunc={() => onClose()}
                />
              </Box>
            </SidePanelMainWrapper>
          </Box>
        </form>
      </SwipeableDrawer>
      <SelectionPanel
        additionalValues={selected}
        options={options}
        openIndustry={openOptions}
        setOpenIndustry={setOpenOptions}
        handleClick={onSelection}
        {...{ [selectionPanelType]: true }}
        leftPositionDrawerContainer={370}
        renderContentSection={renderSidePanelContent}
      />
    </div>
  );
}

DependenciesSidePanel.prototype = {
  haveOptionsPanelDisplayOnOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onRemove: PropTypes.func,
  onSelection: PropTypes.func,
  open: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.objectOf({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), name: PropTypes.string })).isRequired,
  panelHeaderText: PropTypes.string,
  renderContent: PropTypes.func,
  renderSidePanelContent: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  selectionPanelType: PropTypes.oneOf(['isApplication', 'isCloud', 'isDataCenter']),
};

DependenciesSidePanel.defaultProps = {
  haveOptionsPanelDisplayOnOpen: false,
  onClose: () => {},
  onOpen: () => {},
  onRemove: () => {},
  onSelection: () => {},
  open: true,
  panelHeaderText: 'Dependencies',
  renderContent: () => {},
  renderSidePanelContent: null,
  selected: [],
  selectionPanelTypes: '',
};

export default DependenciesSidePanel;

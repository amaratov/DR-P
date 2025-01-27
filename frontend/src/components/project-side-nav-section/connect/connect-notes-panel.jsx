import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, ClickAwayListener } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ConnectNoteEditContainer, ConnectNoteViewArea, SubPanelHeaderCloseBtn } from './connect-styled';
import {
  SidePanelContentWrapper,
  SidePanelDrawerWrapper,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSubHeaderActionBtn,
  SidePanelSubHeaderActions,
  SidePanelSubHeaderText,
  SidePanelSubHeaderWrapper,
} from '../../side-panel/side-panel-styled';
import TextInput from '../../form-elements/text-input';
import { ModelPanelVerticalDivider } from '../model/model-styled';
import { backendService } from '../../../services/backend';
import { isEmpty } from '../../../utils/utils';

function ConnectNotesPanel({ connectionData, setConnectionData, editExistingConnect, setOpenNotePanel, isAdminOrSA }) {
  // dispatch
  const dispatch = useDispatch();

  // state
  const [startEdit, setStartEdit] = useState(false);
  const [noteVal, setNoteVal] = useState(null);

  // func
  const handleNoteSave = useCallback(() => {
    if (!isEmpty(editExistingConnect)) {
      const putData = {
        id: editExistingConnect.id,
        projectId: editExistingConnect.projectId,
        notes: noteVal,
      };
      dispatch(backendService.updateProjectConnections(putData));
      setTimeout(() => {
        setStartEdit(false);
        dispatch(backendService.getProjectConnections(editExistingConnect.projectId));
      }, 800);
    } else {
      setConnectionData({ ...connectionData, notes: noteVal });
      setTimeout(() => {
        setStartEdit(false);
      }, 500);
    }
  }, [noteVal, editExistingConnect, dispatch, setConnectionData, setStartEdit]);

  // effect
  useEffect(() => {
    if (noteVal === null && editExistingConnect?.notes) setNoteVal(editExistingConnect?.notes);
  }, [noteVal, editExistingConnect]);

  return (
    <SidePanelDrawerWrapper
      disableEnforceFocus
      hideBackdrop
      anchor="left"
      leftPositionDrawerContainer={575}
      open="true"
      openWidth="500px"
      onClose={() => {}}
      PaperProps={{
        style: {
          marginLeft: '490px',
          backgroundColor: '#f0ecfc',
          borderTopRightRadius: '30px',
          borderBottomRightRadius: '30px',
          boxShadow: 'unset',
        },
      }}>
      <ClickAwayListener onClickAway={() => {}}>
        <Box sx={{ minWidth: '500px' }}>
          <SidePanelMainWrapper>
            <SidePanelHeaderWrapper>
              <SidePanelHeaderText>{editExistingConnect?.name || connectionData?.name || ''} Notes</SidePanelHeaderText>
              <SubPanelHeaderCloseBtn>
                <CloseIcon onClick={() => setOpenNotePanel(false)} />
              </SubPanelHeaderCloseBtn>
            </SidePanelHeaderWrapper>
            <SidePanelSubHeaderWrapper>
              <SidePanelSubHeaderText>Relevant Connection Notes</SidePanelSubHeaderText>
              {isAdminOrSA && (
                <SidePanelSubHeaderActions>
                  {!startEdit && <SidePanelSubHeaderActionBtn onClick={() => setStartEdit(true)}>Edit Note</SidePanelSubHeaderActionBtn>}
                  {startEdit && (
                    <>
                      <SidePanelSubHeaderActionBtn onClick={() => setStartEdit(false)} isCancelBtn>
                        Cancel
                      </SidePanelSubHeaderActionBtn>
                      <ModelPanelVerticalDivider />
                      <SidePanelSubHeaderActionBtn onClick={() => handleNoteSave()}>Save Changes</SidePanelSubHeaderActionBtn>
                    </>
                  )}
                </SidePanelSubHeaderActions>
              )}
            </SidePanelSubHeaderWrapper>
            <SidePanelContentWrapper>
              {!startEdit && <ConnectNoteViewArea>{noteVal}</ConnectNoteViewArea>}
              {startEdit && (
                <ConnectNoteEditContainer>
                  <TextInput
                    id="notes"
                    variant="standard"
                    placeholder="Add Connection Notes"
                    value={noteVal}
                    autoFocus="false"
                    longScreen
                    multiline
                    usesValue
                    onChange={e => setNoteVal(e.target.value)}
                  />
                </ConnectNoteEditContainer>
              )}
            </SidePanelContentWrapper>
          </SidePanelMainWrapper>
        </Box>
      </ClickAwayListener>
    </SidePanelDrawerWrapper>
  );
}

export default ConnectNotesPanel;

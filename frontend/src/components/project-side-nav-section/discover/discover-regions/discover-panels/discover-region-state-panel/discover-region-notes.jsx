import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  DiscoverRegionNotesErrorField,
  DiscoverRegionStateBubbleNoteFieldContainer,
  DiscoverRegionStateBubbleNoteFieldLabel,
} from '../../discover-region-section-styled';
import TextInput from '../../../../../form-elements/text-input';
import { BUTTON_ICON, BUTTON_STYLE, PROJECT_DETAIL_NOTE_TYPE, PROJECT_DETAILS_NOTE_TYPE } from '../../../../../../utils/constants/constants';
import { getNotesPlaceholder, isEmpty } from '../../../../../../utils/utils';
import { backendService } from '../../../../../../services/backend';
import { getSelectedDetailsFromProject, getSelectedDiscoverRegionActiveState, getSelectedProjectDetails } from '../../../../../../features/selectors/ui';
import CustomButton from '../../../../../form-elements/custom-button';

const tabArr = [
  PROJECT_DETAILS_NOTE_TYPE.COMPLIANCE_NOTE,
  PROJECT_DETAILS_NOTE_TYPE.PARTNER_HW_NOTE,
  PROJECT_DETAILS_NOTE_TYPE.PARTNER_NSP_NOTE,
  PROJECT_DETAILS_NOTE_TYPE.PARTNER_VAR_NOTE,
  PROJECT_DETAILS_NOTE_TYPE.PARTNER_MIGRATION_NOTE,
  PROJECT_DETAILS_NOTE_TYPE.PARTNER_SW_NOTE,
];
function DiscoverRegionNotes({ fieldId }) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // state
  const [noteVal, setNoteVal] = useState(undefined);
  const [noteError, setNoteError] = useState({});

  // selector
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);

  // const
  const currentNote = useMemo(() => {
    return detailsFromSelectedProject?.find(
      detail =>
        detail?.named === fieldId &&
        detail?.region === activeRegionAndState?.region &&
        detail?.type === PROJECT_DETAIL_NOTE_TYPE &&
        detail?.isFuture === activeRegionAndState?.isFuture
    );
  }, [detailsFromSelectedProject, activeRegionAndState]);

  const showNoteField = tabArr.includes(fieldId);
  const showHeader = fieldId === PROJECT_DETAILS_NOTE_TYPE.COMPLIANCE_NOTE;
  const customMarginTop = showHeader ? '38px' : '0';

  // func
  const handleNoteSave = useCallback(
    async text => {
      if (text?.length > 2000) {
        setNoteError({ msg: 'Note should be less than 2000 characters' });
      } else {
        if (noteError?.msg === 'Note should be less than 2000 characters') {
          setNoteError({ msg: '' });
        }
        const projectId = currentProjectInfo?.id || routeParams?.id;
        const detailId = currentNote?.id;
        if (!detailId) {
          const body = {
            projectId,
            named: fieldId,
            region: activeRegionAndState?.region,
            projectNotes: text,
            stateInfo: activeRegionAndState?.state,
            type: PROJECT_DETAIL_NOTE_TYPE,
            isFuture: activeRegionAndState?.isFuture,
          };
          await dispatch(backendService.newProjectDetail(body));
        } else if (detailId && currentNote?.projectNotes !== text) {
          const putBody = {
            projectId,
            detailId,
            named: fieldId,
            region: activeRegionAndState?.region,
            projectNotes: text,
            stateInfo: activeRegionAndState?.state,
            type: PROJECT_DETAIL_NOTE_TYPE,
            isFuture: activeRegionAndState?.isFuture || false,
          };
          await dispatch(backendService.updateProjectDetails(putBody));
        }
        setTimeout(() => dispatch(backendService.getProjectDetails(projectId)), 1000);
      }
    },
    [currentNote, currentProjectInfo, routeParams, activeRegionAndState, dispatch, noteError, setNoteError]
  );

  const handleRemoveNotes = useCallback(() => {
    handleNoteSave('');
    setNoteVal('');
  }, [handleNoteSave, setNoteVal]);

  useEffect(() => {
    const projectId = currentProjectInfo?.id || routeParams?.id;
    dispatch(backendService.getProjectDetails(projectId));
  }, []);

  useEffect(() => {
    setNoteVal(currentNote?.projectNotes);
  }, [setNoteVal, currentNote]);

  if (!showNoteField) {
    return null;
  }
  return (
    <DiscoverRegionStateBubbleNoteFieldContainer customMarginTop={customMarginTop} customWidth="99%">
      {!isEmpty(currentNote?.projectNotes) && (
        <div style={{ position: 'relative', marginTop: '-2.5rem', marginLeft: '3px', left: 'calc(100% - 10px)', top: '35px', width: 'min-content' }}>
          <CustomButton buttonStyle={BUTTON_STYLE.END_ICON_BUTTON} icon={BUTTON_ICON.CANCEL} type="button" onClickFunc={handleRemoveNotes} />
        </div>
      )}
      {showHeader && <DiscoverRegionStateBubbleNoteFieldLabel>Compliance Notes</DiscoverRegionStateBubbleNoteFieldLabel>}
      <TextInput
        id={fieldId}
        variant="standard"
        placeholder={getNotesPlaceholder(fieldId)}
        value={noteVal}
        autoFocus="false"
        longScreen
        multiline
        usesValue
        onBlur={e => handleNoteSave(e.target?.value)}
        onChange={e => setNoteVal(e.target?.value)}
        error={!isEmpty(noteError?.msg)}
      />
      {!isEmpty(noteError) && <DiscoverRegionNotesErrorField>{noteError?.msg}</DiscoverRegionNotesErrorField>}
    </DiscoverRegionStateBubbleNoteFieldContainer>
  );
}

DiscoverRegionNotes.prototype = {
  fieldId: PropTypes.string.isRequired,
};

DiscoverRegionNotes.defaultProps = {};

export default DiscoverRegionNotes;

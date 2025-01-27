import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { getEditMode, getSelectedProjectDetails, getSelectedSolutionBriefDetails } from '../../../features/selectors/ui';
import { getCurrentSolutionBriefs } from '../../../features/selectors/solutionBrief';
import { BUTTON_STYLE, EDIT_MODE, TABS } from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import {
  PublishSolutionBriefBackground,
  PublishSolutionBriefBox,
  PublishSolutionBriefContentContainer,
  PublishSolutionBriefContentWrapper,
  PublishSolutionBriefSubHeaderText,
  PublishSolutionBriefText,
} from './solution-brief-style';
import MaxLengthDisplay from '../../max-length-display/max-length-display';
import TextInput from '../../form-elements/text-input';
import CustomButton from '../../form-elements/custom-button';
import { resetEditMode } from '../../../features/slices/uiSlice';

function EditSolutionBrief() {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const editMode = useSelector(getEditMode);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const currentSolutionBriefCase = useSelector(getCurrentSolutionBriefs);
  const selectedSolutionBrief = useSelector(getSelectedSolutionBriefDetails);

  // state
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [notesLength, setNotesLength] = useState(0);
  const [hasError, setHasError] = useState(false);

  // constant
  const isOpen = editMode === EDIT_MODE.EDIT_SOLUTION_BRIEF;
  const maxLength = 280;
  const forceAutoFocus = true;

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleNotesValidation = useCallback(
    value => {
      if (value?.target?.name === 'notes') {
        if ((value.target?.value === '' && isNotes) || value?.target?.value?.length > maxLength) {
          setIsNotes(false);
        } else if (value?.target?.value !== '') {
          setIsNotes(true);
        }
        setNotesLength(value?.target?.value?.length || 0);
      }
    },
    [setIsNotes, isNotes, setNotesLength]
  );

  const submitForm = useCallback(
    data => {
      const finalData = { id: selectedSolutionBrief?.id, notes: data.notes };
      dispatch(backendService.updateSolutionBriefcase(finalData));
      reset();
    },
    [currentProjectInfo, currentSolutionBriefCase, selectedSolutionBrief, dispatch]
  );

  useEffect(() => {
    if (isNotes) {
      setReadyToSubmit(true);
    } else if (readyToSubmit && !isNotes) {
      setReadyToSubmit(false);
    }
  }, [isNotes, setReadyToSubmit, readyToSubmit]);

  return (
    <PublishSolutionBriefBackground open={isOpen}>
      <form onChange={value => handleNotesValidation(value)} onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <PublishSolutionBriefBox>
            <PublishSolutionBriefText>Edit Solution Brief Notes</PublishSolutionBriefText>
            <PublishSolutionBriefContentWrapper>
              <PublishSolutionBriefContentContainer>
                <div style={{ display: 'grid', gridAutoFlow: 'column' }}>
                  <PublishSolutionBriefSubHeaderText>Notes</PublishSolutionBriefSubHeaderText>
                  <MaxLengthDisplay currentLength={notesLength} maxLength={maxLength} isEditSolutionBriefNotes />
                </div>
                <TextInput
                  id="notes"
                  type="text"
                  placeholder="Enter version notes"
                  defaultValue={selectedSolutionBrief?.notes || ''}
                  variant="standard"
                  register={register}
                  error={errors?.name}
                  longScreen
                  maxLength={maxLength}
                  forceAutoFocus={forceAutoFocus}
                />
              </PublishSolutionBriefContentContainer>
            </PublishSolutionBriefContentWrapper>
            <PublishSolutionBriefContentWrapper style={{ display: 'grid', gridAutoFlow: 'column', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetEditMode());
                  reset();
                }}
              />
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Save Changes"
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
                disableButton={!readyToSubmit}
              />
            </PublishSolutionBriefContentWrapper>
          </PublishSolutionBriefBox>
        </Box>
      </form>
      {hasError && isOpen && <div>Publishing Error!</div>}
    </PublishSolutionBriefBackground>
  );
}

EditSolutionBrief.propTypes = {};
EditSolutionBrief.defaultProps = {};

export default EditSolutionBrief;

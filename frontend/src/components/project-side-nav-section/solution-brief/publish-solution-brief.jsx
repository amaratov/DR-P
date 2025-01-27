import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { getPublishMode, getPublishErrorInfo, getSelectedSolutionBriefDetails, getSelectedProjectDetails } from '../../../features/selectors/ui';
import { TABS, BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import {
  PublishSolutionBriefBackground,
  PublishSolutionBriefBox,
  PublishSolutionBriefText,
  PublishSolutionBriefContentWrapper,
  PublishSolutionBriefContentContainer,
  PublishSolutionBriefSubHeaderText,
} from './solution-brief-style';
import TextInput from '../../form-elements/text-input';
import { resetPublishMode, setAdditionalSolBriefs } from '../../../features/slices/uiSlice';
import { getCurrentSolutionBriefs } from '../../../features/selectors/solutionBrief';
import MaxLengthDisplay from '../../max-length-display/max-length-display';
import { backendService } from '../../../services/backend';
import { getLatestVersionForSolutionBrief, getProjectInitialLetter } from '../../../utils/utils';

function PublishSolutionBrief() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const publishMode = useSelector(getPublishMode);
  const isPublishError = useSelector(getPublishErrorInfo)?.hasError;
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const currentSolutionBriefCase = useSelector(getCurrentSolutionBriefs);
  const selectedSolutionBrief = useSelector(getSelectedSolutionBriefDetails);

  // state
  const [publishBrief, setPublishBrief] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [notesLength, setNotesLength] = useState(0);

  // constant
  const isPublishMode = publishMode === TABS.SOLUTION_BRIEF;
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

  const handleAllSolutionBriefRetrieval = useCallback(
    async params => {
      try {
        const initialValues = await dispatch(backendService.getSolutionBriefcaseByProjectId(params));
        let solutionBriefValuesToRetrieve = initialValues?.payload?.solutionBriefcases || [];
        if (initialValues?.payload?.numPages > 1) {
          /* eslint-disable no-await-in-loop */
          for (let x = 1; x < initialValues?.payload?.numPages; x += 1) {
            params.page = x;
            const additionalValues = await dispatch(backendService.getSolutionBriefcaseByProjectId(params));
            const arrayValue = additionalValues?.payload?.solutionBriefcases || [];
            solutionBriefValuesToRetrieve = [...solutionBriefValuesToRetrieve, ...arrayValue];
          }
        }
        await dispatch(setAdditionalSolBriefs([...solutionBriefValuesToRetrieve]));
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch]
  );

  const submitForm = useCallback(
    data => {
      const projectInitial = getProjectInitialLetter(currentProjectInfo?.title);
      const latestVersionObj = getLatestVersionForSolutionBrief(projectInitial, currentSolutionBriefCase, true);
      const finalData = { id: selectedSolutionBrief?.id, notes: data.notes, briefcaseMajorVersion: latestVersionObj.briefcaseMajorVersion };
      dispatch(backendService.publishSolutionBriefcase(finalData));
      setTimeout(() => {
        if (currentProjectInfo?.id || routeParams?.id) {
          const params = {
            projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
          };
          handleAllSolutionBriefRetrieval(params);
        }
      }, 1000);
      reset();
    },
    [currentProjectInfo, currentSolutionBriefCase, selectedSolutionBrief, dispatch]
  );

  useEffect(() => {
    if (isNotes) {
      setPublishBrief(true);
    } else if (publishBrief && !isNotes) {
      setPublishBrief(false);
    }
  }, [isNotes, setPublishBrief, publishBrief]);

  return (
    <PublishSolutionBriefBackground open={isPublishMode}>
      <form onChange={value => handleNotesValidation(value)} onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <PublishSolutionBriefBox>
            <PublishSolutionBriefText>Publish Solution Brief</PublishSolutionBriefText>
            <PublishSolutionBriefContentWrapper>
              <PublishSolutionBriefContentContainer>
                <div style={{ display: 'grid', gridAutoFlow: 'column' }}>
                  <PublishSolutionBriefSubHeaderText>Notes</PublishSolutionBriefSubHeaderText>
                  <MaxLengthDisplay currentLength={notesLength} maxLength={maxLength} isPublishSolutionBrief />
                </div>
                <TextInput
                  id="notes"
                  type="text"
                  placeholder="Enter version notes"
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
                  dispatch(resetPublishMode());
                  reset();
                }}
              />
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Publish Solution Brief"
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
                disableButton={!publishBrief}
              />
            </PublishSolutionBriefContentWrapper>
          </PublishSolutionBriefBox>
        </Box>
      </form>
      {isPublishError && isPublishMode && <div>Publishing Error!</div>}
    </PublishSolutionBriefBackground>
  );
}

PublishSolutionBrief.prototype = {};

PublishSolutionBrief.defaultProps = {};

export default PublishSolutionBrief;

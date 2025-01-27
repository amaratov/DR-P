import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, LinearProgress } from '@mui/material';
import { getDownloadMode } from '../../../features/selectors/ui';
import { TABS } from '../../../utils/constants/constants';
import {
  DownloadSolutionBriefBackground,
  DownloadSolutionBriefBox,
  DownloadSolutionBriefHeader,
  DownloadSolutionBriefText,
  DownloadSolutionBriefEmail,
  DownloadSolutionBriefBarValues,
  DownloadSolutionBriefBarValueLeft,
  DownloadSolutionBriefBarValueRight,
} from './solution-brief-style';
import { resetDownloadMode } from '../../../features/slices/uiSlice';

function DownloadSolutionBrief({ shutOffScreen, isGenerating, isDownloadingStart, isFinished }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const downloadMode = useSelector(getDownloadMode);

  // state
  const [progress, setProgress] = useState(0);
  const [linearBarText, setLinearBarText] = useState('Generating PDF document');

  // constant
  const isDownloading = downloadMode === TABS.SOLUTION_BRIEF;

  // TODO Change the use effect into a function that updates the progress
  // depending on download value from API
  useEffect(() => {
    if (isFinished) {
      setTimeout(() => {
        dispatch(resetDownloadMode());
        shutOffScreen(prev => !prev);
      }, 500);
    }
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100 || oldProgress === 99) {
          return 99;
        }
        if (isDownloadingStart && oldProgress > 79 && oldProgress < 99) {
          setLinearBarText('Downloading document...');
          const diff = Math.random() * 10;
          if (oldProgress + diff > 99) {
            return 99;
          }
          return Math.min(oldProgress + diff, 100);
        }
        if (isGenerating && oldProgress <= 79) {
          setLinearBarText('Generating PDF document');
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        }
        return oldProgress;
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, [progress, dispatch, shutOffScreen, isFinished, isGenerating, isDownloadingStart]);

  return (
    <DownloadSolutionBriefBackground open={isDownloading}>
      <Box role="presentation">
        <DownloadSolutionBriefBox>
          <DownloadSolutionBriefHeader>Downloading...</DownloadSolutionBriefHeader>
          <DownloadSolutionBriefText>
            Your download will start shortly, if you have any issues please contact
            <DownloadSolutionBriefEmail>pdxmodeler@digitalrealty.com</DownloadSolutionBriefEmail>
          </DownloadSolutionBriefText>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              background: `linear-gradient(to right, #f1f1f8 ${progress}%, var(--color-aluminium) 100%)`,
              height: '1.5rem',
              borderRadius: '20px',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(to right, var(--color-imperial) ${100 - progress}%, var(--color-homeworld) 100%)`,
                borderRadius: '20px',
              },
            }}
          />
          <DownloadSolutionBriefBarValues>
            <DownloadSolutionBriefBarValueLeft>{linearBarText}</DownloadSolutionBriefBarValueLeft>
            <DownloadSolutionBriefBarValueRight>{Math.floor(progress)}%</DownloadSolutionBriefBarValueRight>
          </DownloadSolutionBriefBarValues>
        </DownloadSolutionBriefBox>
      </Box>
    </DownloadSolutionBriefBackground>
  );
}

DownloadSolutionBrief.prototype = {
  shutOffScreen: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
  isDownloadingStart: PropTypes.bool,
  isFinished: PropTypes.bool,
};

DownloadSolutionBrief.defaultProps = {
  isGenerating: false,
  isDownloadingStart: false,
  isFinished: false,
};

export default DownloadSolutionBrief;

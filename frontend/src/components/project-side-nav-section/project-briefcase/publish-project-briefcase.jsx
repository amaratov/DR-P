import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, LinearProgress } from '@mui/material';
import { getPublishMode } from '../../../features/selectors/ui';
import { TABS } from '../../../utils/constants/constants';
import {
  PublishProjectBriefcaseBackground,
  PublishProjectBriefcaseBox,
  PublishProjectBriefcaseHeader,
  PublishProjectBriefcaseText,
  PublishProjectBriefcaseBarValues,
  PublishProjectBriefcaseBarValueLeft,
  PublishProjectBriefcaseBarValueRight,
} from './publish-project-briefcase-style';

function PublishProjectBriefcase({ isPublishing, shutOffScreen, isGenerating, isFinished }) {
  // dispatch
  const dispatch = useDispatch();

  // state
  const [progress, setProgress] = useState(0);
  const [linearBarText, setLinearBarText] = useState('Generating Customer View');

  useEffect(() => {
    if (isFinished) {
      setTimeout(() => {
        shutOffScreen(false);
      }, 500);
    }
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100 || oldProgress === 99) {
          return 99;
        }
        if (isGenerating && oldProgress < 99) {
          setLinearBarText('Generating Customer View');
          const diff = Math.random() * 10;
          if (oldProgress + diff > 99) {
            return 99;
          }
          return Math.min(oldProgress + diff, 100);
        }
        return oldProgress;
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, [progress, dispatch, shutOffScreen, isFinished, isGenerating]);

  return (
    <PublishProjectBriefcaseBackground open={isPublishing}>
      <Box role="presentation">
        <PublishProjectBriefcaseBox>
          <PublishProjectBriefcaseHeader>Publishing Project Briefcase</PublishProjectBriefcaseHeader>
          <PublishProjectBriefcaseText>
            The project briefcase is being published for customers to see, we will also be notrying them via email of updates to the project briefcase
          </PublishProjectBriefcaseText>
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
          <PublishProjectBriefcaseBarValues>
            <PublishProjectBriefcaseBarValueLeft>{linearBarText}</PublishProjectBriefcaseBarValueLeft>
            <PublishProjectBriefcaseBarValueRight>{Math.floor(progress)}%</PublishProjectBriefcaseBarValueRight>
          </PublishProjectBriefcaseBarValues>
        </PublishProjectBriefcaseBox>
      </Box>
    </PublishProjectBriefcaseBackground>
  );
}

PublishProjectBriefcase.prototype = {
  shutOffScreen: PropTypes.func.isRequired,
  isPublishing: PropTypes.bool,
  isGenerating: PropTypes.bool,
  isFinished: PropTypes.bool,
};

PublishProjectBriefcase.defaultProps = {
  isGenerating: false,
  isFinished: false,
  isPublishing: false,
};

export default PublishProjectBriefcase;

import React from 'react';
import PropTypes from 'prop-types';
import { MaxLengthDisplayWrapper } from './max-length-display-style';

function MaxLengthDisplay({ currentLength, maxLength, isPublishSolutionBrief, isEditSolutionBriefNotes }) {
  return (
    <MaxLengthDisplayWrapper
      isPublishSolutionBrief={isEditSolutionBriefNotes || isPublishSolutionBrief}
      isJustifiedRight={isPublishSolutionBrief || isEditSolutionBriefNotes}>
      {currentLength}/{maxLength}
    </MaxLengthDisplayWrapper>
  );
}

MaxLengthDisplay.prototype = {
  currentLength: PropTypes.number.isRequired,
  maxLength: PropTypes.number.isRequired,
  isPublishSolutionBrief: PropTypes.bool,
  isEditSolutionBriefNotes: PropTypes.bool,
};

MaxLengthDisplay.defaultProps = {
  isPublishSolutionBrief: false,
  isEditSolutionBriefNotes: false,
};

export default MaxLengthDisplay;

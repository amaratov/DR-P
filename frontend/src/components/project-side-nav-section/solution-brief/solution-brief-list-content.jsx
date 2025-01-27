import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import {
  SolutionBriefItemAuthor,
  SolutionBriefItemAuthorFullName,
  SolutionBriefItemAuthorHeader,
  SolutionBriefItemContent,
  SolutionBriefItemFileName,
  SolutionBriefItemFileNameHeader,
  SolutionBriefItemFileNameText,
  SolutionBriefItemNotes,
  SolutionBriefItemNotesHeader,
  SolutionBriefItemNotesText,
  SolutionBriefItemVersion,
  SolutionBriefItemVersionBottomText,
  SolutionBriefItemVersionMidText,
  SolutionBriefItemVersionTopText,
  SolutionBriefListItem,
  SolutionBriefListItemBranchDiagram,
  SolutionBriefListItemOuter,
  SolutionBriefListItemPublishIndicator,
} from './solution-brief-style';
import { getFullName, formatSolutionBriefVersion, isEmpty, sortArrayOfObjByVal } from '../../../utils/utils';
import { setEditMode, setSelectedSolutionBriefDetails } from '../../../features/slices/uiSlice';
import { EDIT_MODE } from '../../../utils/constants/constants';
import { getAdditionalSolutionBriefs } from '../../../features/selectors/ui';

function SolutionBriefListContent({ solutionBriefs }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const allSolutionBriefs = useSelector(getAdditionalSolutionBriefs);

  // memo
  const currentPublishedSolutionBrief = useMemo(() => {
    if (isEmpty(allSolutionBriefs)) return [];
    const sortedBriefs = [...allSolutionBriefs]
      .sort(sortArrayOfObjByVal('publishedDate', false))
      ?.filter(brief => brief.publishedDate !== null && !isEmpty(brief.publishedDate));
    return sortedBriefs?.[0];
  }, [allSolutionBriefs]);

  // func
  const handleEditNotes = useCallback(
    brief => {
      dispatch(setSelectedSolutionBriefDetails(brief));
      dispatch(setEditMode(EDIT_MODE.EDIT_SOLUTION_BRIEF));
    },
    [dispatch]
  );

  return (
    <List dense={false}>
      {solutionBriefs &&
        solutionBriefs?.map(brief => {
          const briefVersion = formatSolutionBriefVersion(brief?.briefcaseVersionCode, brief?.briefcaseMajorVersion, brief?.briefcaseMinorVersion);
          const createdByFullName = getFullName(brief?.fullCreatedBy?.firstName, brief?.fullCreatedBy?.lastName);
          const originalFileName = brief?.originalFilename || '';
          const briefNotes = brief?.notes || '';
          const isPublished = brief?.id === currentPublishedSolutionBrief?.id;
          return (
            <SolutionBriefListItemOuter>
              <SolutionBriefListItemBranchDiagram>
                <SolutionBriefListItemPublishIndicator isPublished={isPublished} />
              </SolutionBriefListItemBranchDiagram>
              <SolutionBriefListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <MoreMenuButton rowDetails={brief} isSolutionBriefDetails handleEditNotes={() => handleEditNotes(brief)} />
                  </IconButton>
                }>
                <SolutionBriefItemVersion isPublished={isPublished}>
                  <SolutionBriefItemVersionTopText isPublished={isPublished}>Version</SolutionBriefItemVersionTopText>
                  <SolutionBriefItemVersionMidText isPublished={isPublished}>{briefVersion}</SolutionBriefItemVersionMidText>
                  {isPublished && <SolutionBriefItemVersionBottomText>published</SolutionBriefItemVersionBottomText>}
                </SolutionBriefItemVersion>
                <SolutionBriefItemContent>
                  <SolutionBriefItemAuthor>
                    <SolutionBriefItemAuthorHeader>Author</SolutionBriefItemAuthorHeader>
                    <SolutionBriefItemAuthorFullName>{createdByFullName}</SolutionBriefItemAuthorFullName>
                  </SolutionBriefItemAuthor>
                  <SolutionBriefItemFileName>
                    <SolutionBriefItemFileNameHeader>File Name</SolutionBriefItemFileNameHeader>
                    <SolutionBriefItemFileNameText>{originalFileName}</SolutionBriefItemFileNameText>
                  </SolutionBriefItemFileName>
                  <SolutionBriefItemNotes>
                    <SolutionBriefItemNotesHeader>Notes</SolutionBriefItemNotesHeader>
                    <SolutionBriefItemNotesText>{briefNotes}</SolutionBriefItemNotesText>
                  </SolutionBriefItemNotes>
                </SolutionBriefItemContent>
              </SolutionBriefListItem>
            </SolutionBriefListItemOuter>
          );
        })}
    </List>
  );
}

SolutionBriefListContent.propTypes = {
  solutionBriefs: PropTypes.shape([]).isRequired,
};

SolutionBriefListContent.defaultProps = {};

export default SolutionBriefListContent;

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import { Fade } from '@mui/material';
import { ArchivedTag, RecentlyAddedOrEditedTag, TableRowWithLBorder } from './custom-table-styled';
import { isEmpty } from '../../utils/utils';
import { setRecentlyAdded, setRecentlyEdited, openProjectDetailsMode, setSelectedProjectDetails } from '../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited } from '../../features/selectors/ui';
import MoreMenuButton from '../more-menu-button/more-menu-button';

function CustomProjectRow({ row, project, searchText, wrapTextWithTags, isAdminOrSA }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyAddedRow = useSelector(getRecentlyAdded);
  const recentlyEdited = useSelector(getRecentlyEdited);

  // const
  const showRecentlyAddedStyled = !isEmpty(recentlyAddedRow) && recentlyAddedRow === row.id;
  const showRecentlyEditedStyled = !isEmpty(recentlyEdited) && recentlyEdited === row.id;

  // state
  const [isArchived, setIsArchived] = useState(project?.moreMenu?.props?.rowDetails?.archived);
  const [isArchivedStyle, setArchivedStyle] = useState(isArchived ? '#c8c8c8' : '');
  const handleChange = useCallback(() => {
    setIsArchived(prev => !prev);
  }, [setIsArchived]);

  // func
  const showProjectDetails = useCallback(
    project => {
      dispatch(setSelectedProjectDetails(project?.moreMenu?.props?.rowDetails));
      dispatch(openProjectDetailsMode({ project: project?.moreMenu?.props?.rowDetails, company: row?.details }));
    },
    [dispatch, row?.details]
  );

  // effect
  useEffect(() => {
    if (showRecentlyEditedStyled) {
      setTimeout(() => {
        dispatch(setRecentlyEdited(''));
      }, 30000);
    }
    if (showRecentlyAddedStyled) {
      setTimeout(() => {
        dispatch(setRecentlyAdded(''));
      }, 30000);
    }
  }, [showRecentlyEditedStyled, showRecentlyAddedStyled, dispatch]);

  useEffect(() => {}, [project]);

  useEffect(() => {
    if (isArchived) {
      setArchivedStyle('#c8c8c8');
    } else {
      setArchivedStyle('');
    }
  }, [isArchived, setArchivedStyle]);

  return (
    <TableRowWithLBorder key={project.id}>
      <TableCell component="th" scope="row" style={{ cursor: 'pointer', color: `${isArchivedStyle}` }} onClick={() => showProjectDetails(project)}>
        {wrapTextWithTags(project.projectName, searchText)}
        <Fade in={project.edited || project.new} mountOnEnter unmountOnExit timeout={500} style={{ display: 'inline', marginLeft: '10px' }}>
          <RecentlyAddedOrEditedTag showNewBorder={project.new} showEditedBorder={project.edited}>
            {project.new ? 'NEW' : 'EDITED'}
          </RecentlyAddedOrEditedTag>
        </Fade>
        {isArchived && <ArchivedTag style={{ display: 'inline', marginLeft: '10px' }}>Archived</ArchivedTag>}
      </TableCell>
      <TableCell style={{ color: `${isArchivedStyle}` }}>{project.projectMemberNumber} Team Members</TableCell>
      <TableCell style={{ color: `${isArchivedStyle}` }}>{project.creator}</TableCell>
      <TableCell style={{ color: `${isArchivedStyle}` }}>{project.created}</TableCell>
      <TableCell style={{ color: `${isArchivedStyle}` }}>{project.lastUpdated}</TableCell>
      <TableCell align="right">
        <MoreMenuButton visible={isAdminOrSA} rowDetails={{ ...project, archived: isArchived }} isProject transitionToggle={handleChange} />
      </TableCell>
    </TableRowWithLBorder>
  );
}

CustomProjectRow.propTypes = {
  row: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  searchText: PropTypes.string,
  wrapTextWithTags: PropTypes.func,
  isAdminOrSA: PropTypes.bool,
};

CustomProjectRow.defaultProps = {
  searchText: '',
  wrapTextWithTags: () => {},
  isAdminOrSA: false,
};

export default CustomProjectRow;

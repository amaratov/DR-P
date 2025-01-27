import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import { mdiCheckCircleOutline, mdiInbox } from '@mdi/js';
import Icon from '@mdi/react';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Collapse, Fade } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  RecentlyAddedOrEditedTag,
  TableNameRecentlyTouched,
  TableNumberText,
  TableRowCollapsibleIconWrapper,
  TableRowText,
  TableTextRoundBorder,
  CompanyToActiveRowSlide,
  CompanyToArchiveRowSlide,
} from './custom-table-styled';
import { AllRoles, BUTTON_ICON, BUTTON_STYLE, COMPANY_TABLE_COLUMN_CONFIG, DETAILS_MODE } from '../../utils/constants/constants';
import CustomButton from '../form-elements/custom-button';
import { isEmpty, wrapTextWithTags } from '../../utils/utils';
import {
  openAddProjectMode,
  setRecentlyAdded,
  setRecentlyEdited,
  setSelectedProjectDetails,
  setDetailsMode,
  setSelectedCompanyDetails,
  resetToggleFunctionId,
} from '../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited, getToggleFunctionId } from '../../features/selectors/ui';
import { getWhoAmI } from '../../features/selectors';
import { backendService } from '../../services/backend';
import CustomProjectRow from './custom-project-row';

function CustomRow({ row, searchText, isAdminOrSA }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyAddedRow = useSelector(getRecentlyAdded);
  const recentlyEdited = useSelector(getRecentlyEdited);
  const whoami = useSelector(getWhoAmI);
  const toggleFunctionId = useSelector(getToggleFunctionId);

  // state
  const [rowOpen, setRowOpen] = useState(false);
  const [checked, setChecked] = useState(true);

  // const
  const showRecentlyAddedStyled = !isEmpty(recentlyAddedRow) && recentlyAddedRow === row.id;
  const showRecentlyEditedStyled = !isEmpty(recentlyEdited) && recentlyEdited === row.id;
  const roleName = whoami?.role?.name?.toLowerCase();
  const isCustomer = roleName === AllRoles.CUSTOMER;

  // func
  const handleChange = useCallback(() => {
    setRowOpen(false);
    setChecked(prev => !prev);
  }, [setChecked, setRowOpen]);

  const handleAddProjectClick = useCallback(() => {
    dispatch(setSelectedProjectDetails({ company: row?.details }));
    dispatch(openAddProjectMode(row?.details));
  }, [dispatch, row?.details]);

  const showCompanyDetails = useCallback(
    company => {
      if (
        roleName === AllRoles.CUSTOMER ||
        roleName === AllRoles.SALES ||
        roleName === AllRoles.SOLUTIONS_ARCHITECT ||
        roleName === AllRoles.SOLUTIONS_ENGINEER ||
        roleName === AllRoles.ADMIN
      ) {
        dispatch(setDetailsMode(DETAILS_MODE.COMPANY_DETAILS));
        dispatch(setSelectedCompanyDetails(company));
        dispatch(backendService.getCompanyById(row?.id));
      }
    },
    [dispatch, roleName, row?.id]
  );

  const showNewOrEditedStyles = columnId => {
    const isCompanyNameColumn = columnId === 'companyName';
    if (isCompanyNameColumn && showRecentlyAddedStyled) return 'new';
    if (isCompanyNameColumn && showRecentlyEditedStyled) return 'edited';
    return '';
  };

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

  useEffect(() => {}, [row.projects]);

  useEffect(() => {
    if (toggleFunctionId === row?.id && checked) {
      handleChange();
      dispatch(resetToggleFunctionId());
      handleChange();
    }
  }, [toggleFunctionId, handleChange, dispatch, checked]);

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
        {COMPANY_TABLE_COLUMN_CONFIG.map(column => {
          const isCompanyNameColumn = column.id === 'companyName';
          const isProjectColumn = column.id === 'projects';
          let value = isProjectColumn ? row[column.id].length : row[column.id];
          if (typeof value === 'object') {
            value = { ...row[column.id], props: { ...row[column.id].props, transitionToggle: handleChange } };
          }
          const formattedValue = column.format ? column.format(value) : value;
          const wrapText = isCompanyNameColumn ? wrapTextWithTags(formattedValue, searchText) : formattedValue;
          const showNewBorder = showNewOrEditedStyles(column.id) === 'new';
          const showEditedBorder = showNewOrEditedStyles(column.id) === 'edited';

          const renderRoundBorder = () => {
            if (isProjectColumn) {
              return <TableTextRoundBorder>{wrapText}</TableTextRoundBorder>;
            }
            return wrapText;
          };
          const renderNumberCol = () => {
            if (isProjectColumn) {
              return <TableNumberText>{wrapText}</TableNumberText>;
            }
            if (isCompanyNameColumn) {
              return (
                <div onClick={() => showCompanyDetails(column?.details)} onKeyDown={() => showCompanyDetails(column?.details)}>
                  {wrapText}
                </div>
              );
            }
            return wrapText;
          };

          return (
            <TableCell key={column.id} align={column.align}>
              {column.rowCollapsible ? (
                <TableRowCollapsibleIconWrapper>
                  <IconButton aria-label="expand row" size="small" onClick={() => setRowOpen(!rowOpen)} sx={{ color: 'var(--color-aluminium)' }}>
                    {rowOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                  </IconButton>
                  <TableNameRecentlyTouched customFontWeight={column?.fontWeight}>
                    {renderNumberCol()}
                    <Fade in={showNewBorder || showEditedBorder} mountOnEnter unmountOnExit timeout={500} style={{ marginLeft: '10px' }}>
                      <RecentlyAddedOrEditedTag showNewBorder={showNewBorder} showEditedBorder={showEditedBorder}>
                        {showNewBorder ? 'NEW' : 'EDITED'}
                      </RecentlyAddedOrEditedTag>
                    </Fade>
                  </TableNameRecentlyTouched>
                </TableRowCollapsibleIconWrapper>
              ) : (
                <TableRowText customFontWeight={column?.fontWeight} isProjectColumn={isProjectColumn}>
                  {renderNumberCol()}
                </TableRowText>
              )}
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: isCustomer ? 'none' : '' }} colSpan={6}>
          <Collapse in={rowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }} style={{ margin: isCustomer && row.projects?.length === 0 ? '0' : '', marginBottom: isCustomer ? '0' : '' }}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row.projects?.length > 0 &&
                    row.projects?.map(project => (
                      <CustomProjectRow row={row} project={project} searchText={searchText} wrapTextWithTags={wrapTextWithTags} isAdminOrSA={isAdminOrSA} />
                    ))}
                </TableBody>
              </Table>
              {isAdminOrSA && (
                <div style={{ marginLeft: '-10px' }}>
                  <CustomButton
                    buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                    icon={BUTTON_ICON.ADD_BORDERLESS}
                    buttonText="Add Project"
                    type="button"
                    padding="4px 4px 4px 20px"
                    onClickFunc={() => handleAddProjectClick()}
                  />
                </div>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <CompanyToActiveRowSlide direction="left" in={!checked && row?.details?.archived} mountOnEnter unmountOnExit timeout={500}>
        <div style={{ color: 'var(--color-aluminium)' }}>
          <Icon path={mdiCheckCircleOutline} size={1} horizontal vertical rotate={180} />
        </div>
      </CompanyToActiveRowSlide>
      <CompanyToArchiveRowSlide direction="left" in={!checked && !row?.details?.archived} mountOnEnter unmountOnExit timeout={500}>
        <div style={{ color: 'var(--color-aluminium)' }}>
          <Icon path={mdiInbox} size={1} horizontal vertical rotate={180} />
        </div>
      </CompanyToArchiveRowSlide>
    </>
  );
}

CustomRow.propTypes = {
  row: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        projectName: PropTypes.string,
        projectMemberNumber: PropTypes.string,
        creator: PropTypes.string,
        created: PropTypes.string,
        lastUpdated: PropTypes.string,
      })
    ).isRequired,
    updatedAt: PropTypes.string.isRequired,
    id: PropTypes.string,
  }).isRequired,
  searchText: PropTypes.string,
  isAdminOrSA: PropTypes.bool,
};

CustomRow.defaultProps = {
  searchText: '',
  isAdminOrSA: false,
};

export default CustomRow;

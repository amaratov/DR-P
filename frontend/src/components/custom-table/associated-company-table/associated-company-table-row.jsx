import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Collapse } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { TableNumberText, TableRowCollapsibleIconWrapper, TableRowText, TableRowWithLBorder, TableTextRoundBorder } from '../custom-table-styled';
import { ASSOCIATED_COMPANY_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { wrapTextWithTags } from '../../../utils/utils';
import { openAddProjectMode } from '../../../features/slices/uiSlice';

function AssociatedCompanyTableRow({ row, searchText }) {
  // dispatch
  const dispatch = useDispatch();

  // state
  const [rowOpen, setRowOpen] = useState(false);

  // func
  const handleAddProjectClick = useCallback(() => {
    dispatch(openAddProjectMode(row?.details));
  }, [dispatch]);

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
        {ASSOCIATED_COMPANY_TABLE_COLUMN_CONFIG.map(column => {
          const isCompanyNameColumn = column.id === 'companyName';
          const isProjectColumn = column.id === 'projects';
          const value = isProjectColumn ? row[column.id].length : row[column.id];
          const formattedValue = column.format ? column.format(value) : value;
          const wrapText = isCompanyNameColumn ? wrapTextWithTags(formattedValue, searchText) : formattedValue;
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
            return wrapText;
          };

          return (
            <TableCell key={column.id} align={column.align}>
              {column.rowCollapsible ? (
                <TableRowCollapsibleIconWrapper>
                  <IconButton aria-label="expand row" size="small" onClick={() => setRowOpen(!rowOpen)} sx={{ color: 'var(--color-aluminium)' }}>
                    {rowOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                  </IconButton>
                  <TableRowText customFontWeight={column?.fontWeight}>{wrapText}</TableRowText>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={rowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row.projects?.length > 0 &&
                    row.projects?.map(project => (
                      <TableRowWithLBorder key={project.id}>
                        <TableCell component="th" scope="row">
                          {wrapTextWithTags(project.projectName, searchText)}
                        </TableCell>
                        <TableCell>{project.creator}</TableCell>
                        <TableCell align="right">{project.moreMenu}</TableCell>
                      </TableRowWithLBorder>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

AssociatedCompanyTableRow.propTypes = {
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
  }).isRequired,
  searchText: PropTypes.string,
};

AssociatedCompanyTableRow.defaultProps = {
  searchText: '',
};

export default AssociatedCompanyTableRow;

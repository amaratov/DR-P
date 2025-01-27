import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Collapse } from '@mui/material';
import { TableRowText, TableCellWithBorderLeft } from '../custom-table-styled';
import { YOUR_PROJECT_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { wrapTextWithTags } from '../../../utils/utils';
import { MemberTableRowText } from './custom-row-project-style';
import { getRoles } from '../../../features/selectors/common';
import { backendService } from '../../../services/backend';
import CustomChip from '../../chip/custom-chip';

function CustomProjectRow({ row, searchText, associatedUsers }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const roles = useSelector(getRoles);

  // state
  const [rowOpen, setRowOpen] = useState(false);

  // constant
  const tableColumnMap = YOUR_PROJECT_TABLE_COLUMN_CONFIG;
  const finalIndexOfUsers = associatedUsers?.length ? associatedUsers.length - 1 : 0;

  // func
  const handleChange = useCallback(() => {
    setRowOpen(prev => !prev);
  }, [setRowOpen]);

  const getRoleName = useCallback(
    id => {
      const role = roles?.filter(value => value?.id === id);
      return role[0]?.name || '';
    },
    [roles]
  );

  // effect
  useEffect(() => {
    if (roles?.length === 0) {
      dispatch(backendService.getRoles());
    }
  }, [dispatch, roles]);

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
        {tableColumnMap.map(column => {
          const isProjectNameColumn = column.id === 'projectName';
          const isMembersColumn = column.id === 'members';
          let value = row[column.id];
          if (typeof value === 'object') {
            value = { ...row[column.id], props: { ...row[column.id].props, transitionToggle: handleChange, isOpen: rowOpen } };
          }
          const formattedValue = column.format ? column.format(value) : value;
          const wrapText = isProjectNameColumn ? wrapTextWithTags(formattedValue, searchText) : formattedValue;
          const renderNumberCol = () => {
            return wrapText;
          };

          if (isMembersColumn) {
            return (
              <TableCellWithBorderLeft key={column.id} align={column.align}>
                <MemberTableRowText customFontWeight={column?.fontWeight} pointerCursor={isProjectNameColumn} onClick={() => {}}>
                  {renderNumberCol()}
                </MemberTableRowText>
              </TableCellWithBorderLeft>
            );
          }

          return (
            <TableCellWithBorderLeft key={column.id} align={column.align}>
              <TableRowText customFontWeight={column?.fontWeight} pointerCursor={isProjectNameColumn} onClick={() => {}}>
                {renderNumberCol()}
              </TableRowText>
            </TableCellWithBorderLeft>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={rowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {associatedUsers?.length > 0 &&
                    associatedUsers?.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell style={{ borderBottom: `${finalIndexOfUsers === index ? '0px' : '1px solid #e0e0e0'}`, padding: '8px 16px' }}>
                          {user.firstName} &#183;&nbsp;
                          <div
                            style={{
                              display: 'inline',
                              color: 'var(--color-homeworld)',
                            }}>
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            float: 'right',
                            width: '100%',
                            borderBottom: `${finalIndexOfUsers === index ? '0px' : '1px solid #e0e0e0'}`,
                            padding: '8px 16px',
                          }}>
                          <div style={{ float: 'right' }}>
                            <CustomChip label={getRoleName(user.role)?.toLowerCase()} />
                          </div>
                        </TableCell>
                      </TableRow>
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

CustomProjectRow.propTypes = {
  row: PropTypes.shape({
    projectName: PropTypes.string.isRequired,
    members: PropTypes.string.isRequired,
    user: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    id: PropTypes.string.isRequired,
  }).isRequired,
  searchText: PropTypes.string,
  associatedUsers: PropTypes.arrayOf(PropTypes.shape({})),
};

CustomProjectRow.defaultProps = {
  searchText: '',
  associatedUsers: [],
};

export default CustomProjectRow;

import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, TableCell, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PROJECT_BRIEFCASE_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { getSortOrderCustomerDocPanelBy } from '../../../features/selectors/ui';

function SortableCustomerDocumentTablePanelHeader(props) {
  const { order, onRequestSort } = props;
  const sortOrderBy = useSelector(getSortOrderCustomerDocPanelBy);
  let orderBy = sortOrderBy === 'createdAt' ? 'dateAdded' : 'documentName';
  orderBy = sortOrderBy === 'fileSize' ? 'size' : orderBy;
  orderBy = sortOrderBy === 'createdBy' ? sortOrderBy : orderBy;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  // constant
  const tableColumnMap = PROJECT_BRIEFCASE_TABLE_COLUMN_CONFIG;

  return (
    <TableHead>
      <TableRow>
        {tableColumnMap.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              IconComponent={KeyboardArrowDownIcon}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

SortableCustomerDocumentTablePanelHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
};

SortableCustomerDocumentTablePanelHeader.defaultProps = {};

export default SortableCustomerDocumentTablePanelHeader;

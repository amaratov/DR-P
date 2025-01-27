import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, TableCell, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { ACTIVE_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG, ARCHIVED_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { getSortOrderBy } from '../../../features/selectors/ui';

function SortableIndustryVerticalTableHeader(props) {
  const { order, onRequestSort, isArchived } = props;
  const sortOrderBy = useSelector(getSortOrderBy);
  let orderBy = sortOrderBy === 'companyCount' ? 'companies' : 'industryVerticalName';
  orderBy = sortOrderBy === 'documentCount' ? 'documents' : orderBy;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  // constant
  const tableColumnMap = isArchived ? ARCHIVED_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG : ACTIVE_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG;

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

SortableIndustryVerticalTableHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  isArchived: PropTypes.bool,
};

SortableIndustryVerticalTableHeader.defaultProps = {
  isArchived: false,
};

export default SortableIndustryVerticalTableHeader;

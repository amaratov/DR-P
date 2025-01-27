import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomSolutionBriefsProjectBriefcaseRow from './custom-row-solution-briefs-project-briefcase';
import SortableSolutionBriefsTableHeader from './sortable-solution-briefs-project-briefcase-table-header';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { getComparator, getFullName, isEmpty, stableSort } from '../../../utils/utils';
import { getPageNumSolutionBriefs, getRemoveRow } from '../../../features/selectors/ui';
import { resetRemoveRow } from '../../../features/slices/uiSlice';
import CustomButton from '../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';

const createSolutionBriefsProjectBriefcasecaseRowData = (
  documentName,
  dateAdded,
  createdBy,
  associatedSolutionBriefDetails,
  size,
  id,
  handleRemoveSolutionBrief,
  handleDownloadDocForCustomer,
  canViewPublishedSolutionBriefOnly
) => {
  if (canViewPublishedSolutionBriefOnly || associatedSolutionBriefDetails?.publishedDate !== null) {
    return {
      documentName,
      createdBy,
      dateAdded,
      size,
      moreMenu: (
        <CustomButton
          buttonStyle={BUTTON_STYLE.ICON_BUTTON}
          icon={BUTTON_ICON.DOWNLOAD}
          type="button"
          rowDetails={associatedSolutionBriefDetails}
          onClickFunc={() => handleDownloadDocForCustomer(associatedSolutionBriefDetails)}
        />
      ),
      id,
    };
  }

  return {
    documentName,
    createdBy,
    dateAdded,
    size,
    moreMenu: (
      <MoreMenuButton
        rowDetails={associatedSolutionBriefDetails}
        isSolutionBriefDetails={associatedSolutionBriefDetails?.publishedDate === null}
        isSolutionBriefProjectBriefcaseDetails
        handleRemoveSolutionBrief={handleRemoveSolutionBrief}
      />
    ),
    id,
  };
};

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'documentName';

function CustomSolutionBriefsProjectBriefcaseTable({
  tableData,
  canViewPublishedSolutionBriefOnly,
  handleRemoveSolutionBrief,
  handleDownloadDocForCustomer,
  maxRowsPerPage,
}) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);
  const page = useSelector(getPageNumSolutionBriefs);

  // state
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);

  // const
  const rowData = tableData.map(data => {
    const fileSize = data?.fileSize || '';
    return createSolutionBriefsProjectBriefcasecaseRowData(
      data.originalFilename || data.docName || data.name,
      data?.updatedAt,
      getFullName(data?.fullCreatedBy?.firstName, data?.fullCreatedBy?.lastName),
      data,
      fileSize,
      data.id,
      handleRemoveSolutionBrief,
      handleDownloadDocForCustomer,
      canViewPublishedSolutionBriefOnly
    );
  });

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    if (!isEmpty(rowData) && !isEmpty(rowToBeRemoved) && !rowData.some(row => row.id === rowToBeRemoved)) {
      dispatch(resetRemoveRow());
    }
  }, [rowData, rowToBeRemoved, dispatch]);

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: '8px solid #f1f1f8',
        boxShadow: '0 0px 10px rgba(0, 0, 0, 0.04), 0 0px 20px rgba(0, 0, 0, 0.04)',
        zIndex: '1008',
        borderRadius: '30px',
      }}>
      <TableContainer sx={{ boxShadow: '0 0 10px #f1f1f8', zIndex: '1010' }}>
        <Table stickyHeader aria-label="sticky table">
          <SortableSolutionBriefsTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rowData, getComparator(order, orderBy))
              .slice(page * maxRowsPerPage, page * maxRowsPerPage + maxRowsPerPage)
              .map(row => {
                return <CustomSolutionBriefsProjectBriefcaseRow row={row} key={row.id} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomSolutionBriefsProjectBriefcaseTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  canViewPublishedSolutionBriefOnly: PropTypes.bool,
  maxRowsPerPage: PropTypes.number,
  handleRemoveSolutionBrief: PropTypes.func,
};

CustomSolutionBriefsProjectBriefcaseTable.defaultProps = {
  maxRowsPerPage: 10,
  canViewPublishedSolutionBriefOnly: false,
  handleRemoveSolutionBrief: () => {},
};

export default CustomSolutionBriefsProjectBriefcaseTable;

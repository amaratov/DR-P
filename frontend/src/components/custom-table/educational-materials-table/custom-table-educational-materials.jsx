import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomEducationalMaterialsRow from './custom-row-educational-materials';
import SortableEducationalMaterialsTableHeader from './sortable-educational-materials-table-header';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { getComparator, isEmpty, stableSort } from '../../../utils/utils';
import { getPageNumEducationalMaterials, getPageNumProjectDocuments, getRemoveRow } from '../../../features/selectors/ui';
import { resetRemoveRow } from '../../../features/slices/uiSlice';
import CustomButton from '../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';

const createEducationalMaterialsRowData = (
  documentName,
  dateAdded,
  createdBy,
  associatedMarketingDetails,
  size,
  id,
  handleRemoveMarketing,
  handleDownloadDocForCustomer,
  canViewPublishedMarketingOnly
) => {
  if (canViewPublishedMarketingOnly) {
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
          onClickFunc={() => handleDownloadDocForCustomer(associatedMarketingDetails)}
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
    moreMenu: <MoreMenuButton rowDetails={associatedMarketingDetails} isAssociatedMarketing handleRemoveMarketing={handleRemoveMarketing} />,
    id,
  };
};

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'documentName';

function CustomEducationalMaterialsTable({
  tableData,
  associatedMarketingInfo,
  canViewPublishedMarketingOnly,
  handleRemoveMarketing,
  handleDownloadDocForCustomer,
  maxRowsPerPage,
}) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);
  const page = useSelector(getPageNumEducationalMaterials);

  // state
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);

  // const
  const rowData = tableData.map(data => {
    const marketingInfo = associatedMarketingInfo.find(mk => mk.id === data.id);
    const createdBy = `${marketingInfo?.addedBy?.firstName || ''} ${marketingInfo?.addedBy?.lastName}`;
    const dateAdded = marketingInfo?.addedDate;
    const fileSize = data?.fileSize || '';
    return createEducationalMaterialsRowData(
      data.name || data.docName,
      dateAdded,
      createdBy,
      data,
      fileSize,
      data.id,
      handleRemoveMarketing,
      handleDownloadDocForCustomer,
      canViewPublishedMarketingOnly
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
          <SortableEducationalMaterialsTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rowData, getComparator(order, orderBy))
              .slice(page * maxRowsPerPage, page * maxRowsPerPage + maxRowsPerPage)
              .map(row => {
                return <CustomEducationalMaterialsRow row={row} key={row.id} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomEducationalMaterialsTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  associatedMarketingInfo: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  canViewPublishedMarketingOnly: PropTypes.bool,
  maxRowsPerPage: PropTypes.number,
  handleRemoveMarketing: PropTypes.func,
};

CustomEducationalMaterialsTable.defaultProps = {
  maxRowsPerPage: 10,
  canViewPublishedMarketingOnly: false,
  handleRemoveMarketing: () => {},
};

export default CustomEducationalMaterialsTable;

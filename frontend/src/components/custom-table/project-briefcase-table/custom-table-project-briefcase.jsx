import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomProjectBriefcaseRow from './custom-row-project-briefcase';
import SortableProjectBriefcaseTableHeader from './sortable-project-briefcase-table-header';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { getComparator, isEmpty, stableSort } from '../../../utils/utils';
import {
  getPageNumProjectDocuments,
  getRemoveRow,
  getSelectedProjectDetails,
  getSortOrderCustomerDocPanel,
  getSortOrderCustomerDocPanelBy,
} from '../../../features/selectors/ui';
import { resetRemoveRow, setOrderCustomerDocPanel, setOrderCustomerDocPanelBy } from '../../../features/slices/uiSlice';
import CustomButton from '../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomProjectBriefcasePanelRow from './custom-row-project-briefcase-panel';
import SortableCustomerDocumentTablePanelHeader from './sortable-customer-document-table-panel-header';
import { backendService } from '../../../services/backend';

const createProjectBriefcaseRowData = (
  documentName,
  dateAdded,
  createdBy,
  associatedMarketingDetails,
  size,
  id,
  handleDownloadDocForCustomer,
  canViewPublishedMarketingOnly,
  handleRemoveCustomerDocument
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
    moreMenu: (
      <MoreMenuButton rowDetails={associatedMarketingDetails} handleRemoveMarketing={handleRemoveCustomerDocument} isProjectDocument isAssociatedMarketing />
    ),
    id,
  };
};

const createPanelCustomerDocRowData = (
  documentName,
  dateAdded,
  createdBy,
  associatedMarketingDetails,
  size,
  id,
  includedValue,
  setPanelSelectedValues,
  alreadyThereValue
) => {
  if (alreadyThereValue) {
    return {
      documentName: (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <CustomButton
            buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
            type="button"
            useColor="var(--color-aluminium)"
            disableButton={alreadyThereValue}
          />
          {documentName}
        </div>
      ),
      createdBy,
      dateAdded,
      size,
      id,
    };
  }
  return {
    documentName: (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <CustomButton
          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
          icon={includedValue ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
          type="button"
          onClickFunc={() => setPanelSelectedValues(associatedMarketingDetails, includedValue)}
        />
        {documentName}
      </div>
    ),
    createdBy,
    dateAdded,
    size,
    id,
  };
};

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'documentName';

function CustomProjectBriefcaseTable({
  tableData,
  canViewPublishedMarketingOnly,
  handleDownloadDocForCustomer,
  maxRowsPerPage,
  panelSelectedValues,
  setPanelSelectedValues,
  alreadyAddedValues,
  handleRemoveCustomerDocument,
  panelView,
}) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selectors
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const rowToBeRemoved = useSelector(getRemoveRow);
  const page = useSelector(getPageNumProjectDocuments);
  const order = useSelector(getSortOrderCustomerDocPanel);
  const orderBy = useSelector(getSortOrderCustomerDocPanelBy);

  // state
  const [orderTable, setOrderTable] = useState(DEFAULT_ORDER);
  const [orderTableBy, setOrderTableBy] = useState(DEFAULT_ORDER_BY);

  // const
  const rowData = tableData.map(data => {
    const createdBy = `${data?.addedBy?.firstName || data?.fullCreatedBy?.firstName || ''} ${data?.addedBy?.lastName || data?.fullCreatedBy?.lastName}`;
    const dateAdded = data?.addedDate;
    const fileSize = data?.fileSize || '';
    if (panelView) {
      const alreadyThereValue = alreadyAddedValues?.filter(value => value?.id === data?.id)?.length > 0;
      const includedValue = panelSelectedValues?.filter(value => value?.id === data?.id)?.length > 0;
      return createPanelCustomerDocRowData(
        data.name || data.docName,
        dateAdded,
        createdBy,
        data,
        fileSize,
        data.id,
        includedValue,
        setPanelSelectedValues,
        alreadyThereValue
      );
    }
    return createProjectBriefcaseRowData(
      data.name || data.docName,
      dateAdded,
      createdBy,
      data,
      fileSize,
      data.id,
      handleDownloadDocForCustomer,
      canViewPublishedMarketingOnly,
      handleRemoveCustomerDocument
    );
  });

  // func
  const handleRequestSort = (event, property) => {
    if (!panelView) {
      const isAsc = orderTableBy === property && orderTable === 'asc';
      setOrderTable(isAsc ? 'desc' : 'asc');
      setOrderTableBy(property);
    } else {
      const isAsc = order === 'asc';
      const newOrder = isAsc ? 'desc' : 'asc';
      const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
      if (property === DEFAULT_ORDER_BY) {
        if (orderBy !== 'docName') {
          dispatch(setOrderCustomerDocPanel('asc'));
          dispatch(setOrderCustomerDocPanelBy('docName'));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [['docName', 'asc']] }));
        } else {
          dispatch(setOrderCustomerDocPanel(newOrder));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'createdBy') {
        if (orderBy !== 'createdBy') {
          dispatch(setOrderCustomerDocPanel('asc'));
          dispatch(setOrderCustomerDocPanelBy('createdBy'));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [['createdBy', 'asc']] }));
        } else {
          dispatch(setOrderCustomerDocPanel(newOrder));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'dateAdded') {
        if (orderBy !== 'createdAt') {
          dispatch(setOrderCustomerDocPanel('asc'));
          dispatch(setOrderCustomerDocPanelBy('createdAt'));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [['createdAt', 'asc']] }));
        } else {
          dispatch(setOrderCustomerDocPanel(newOrder));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'size') {
        if (orderBy !== 'fileSize') {
          dispatch(setOrderCustomerDocPanel('asc'));
          dispatch(setOrderCustomerDocPanelBy('fileSize'));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [['fileSize', 'asc']] }));
        } else {
          dispatch(setOrderCustomerDocPanel(newOrder));
          dispatch(backendService.getCustomerDocumentByProjectIdAndParams({ projectId, limit: maxRowsPerPage, page, order: [[orderBy, newOrder]] }));
        }
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(rowData) && !isEmpty(rowToBeRemoved) && !rowData.some(row => row.id === rowToBeRemoved)) {
      dispatch(resetRemoveRow());
    }
  }, [rowData, rowToBeRemoved, dispatch]);

  if (panelView) {
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
            <SortableCustomerDocumentTablePanelHeader order={order} onRequestSort={handleRequestSort} />
            <TableBody>
              {rowData.map(row => {
                return <CustomProjectBriefcasePanelRow row={row} key={row.id} panelView={panelView} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

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
          <SortableProjectBriefcaseTableHeader order={orderTable} orderBy={orderTableBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rowData, getComparator(orderTable, orderTableBy))
              .slice(page * maxRowsPerPage, page * maxRowsPerPage + maxRowsPerPage)
              .map(row => {
                return <CustomProjectBriefcaseRow row={row} key={row.id} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomProjectBriefcaseTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  canViewPublishedMarketingOnly: PropTypes.bool,
  maxRowsPerPage: PropTypes.number,
  panelSelectedValues: PropTypes.arrayOf(PropTypes.shape({})),
  setPanelSelectedValues: PropTypes.func,
  alreadyAddedValues: PropTypes.arrayOf(PropTypes.shape({})),
  handleRemoveCustomerDocument: PropTypes.func,
  panelView: PropTypes.bool,
};

CustomProjectBriefcaseTable.defaultProps = {
  maxRowsPerPage: 10,
  canViewPublishedMarketingOnly: false,
  panelSelectedValues: [],
  setPanelSelectedValues: () => [],
  alreadyAddedValues: [],
  handleRemoveCustomerDocument: () => {},
  panelView: false,
};

export default CustomProjectBriefcaseTable;

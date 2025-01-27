import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomMarketingRow from './custom-row-marketing';
import SortableMarketingTableHeader from './sortable-marketing-table-header';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { isEmpty } from '../../../utils/utils';
import { getForceTableRefresh, getPageNum, getRemoveRow, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import { resetForceTableRefreshTab, resetRemoveRow, setOrder, setOrderBy } from '../../../features/slices/uiSlice';
import { BUTTON_ICON, BUTTON_STYLE, TABS } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import CustomMarketingPanelRow from './custom-row-marketing-panel';
import { backendService } from '../../../services/backend';

const createMarketingRowData = (documentName, lastUpdated, modifiedBy, marketingDetails, fileType, id, searchText, isArchived) => {
  let type = '';
  try {
    type = fileType.join(', ');
  } catch (e) {
    type = '';
  }
  return {
    documentName,
    lastUpdated,
    modifiedBy,
    fileType: type,
    moreMenu: <MoreMenuButton rowDetails={marketingDetails} isMarketingDetails searchText={{ docName: `%${searchText}%`, archived: isArchived }} />,
    id,
  };
};

const createPanelMarketingRowData = (
  documentName,
  lastUpdated,
  modifiedBy,
  marketingDetails,
  fileType,
  id,
  searchText,
  isArchived,
  includedValue,
  setPanelSelectedValues
) => {
  let type = '';
  try {
    type = fileType.join(', ');
  } catch (e) {
    type = '';
  }
  return {
    documentName: (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <CustomButton
          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
          icon={includedValue ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
          type="button"
          onClickFunc={() => setPanelSelectedValues(marketingDetails, includedValue)}
        />
        {documentName}
      </div>
    ),
    lastUpdated,
    modifiedBy,
    fileType: type,
    moreMenu: <MoreMenuButton rowDetails={marketingDetails} isMarketingDetails searchText={{ docName: `%${searchText}%`, archived: isArchived }} />,
    id,
  };
};

const DEFAULT_ORDER_BY = 'documentName';

function CustomMarketingTable({ tableData, searchText, isArchived, panelSelectedValues, setPanelSelectedValues, panelView }) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);
  const forceTableRefresh = useSelector(getForceTableRefresh);

  // const
  const rowData = tableData.map(data => {
    if (panelView) {
      const includedValue = panelSelectedValues?.filter(value => value?.id === data?.id)?.length > 0;
      return createPanelMarketingRowData(
        data.name || data.docName,
        data.updatedAt,
        data.modifiedBy,
        data,
        data?.types,
        data.id,
        searchText,
        isArchived,
        includedValue,
        setPanelSelectedValues
      );
    }
    return createMarketingRowData(data.name || data.docName, data.updatedAt, data.modifiedBy, data, data?.types, data.id, searchText, isArchived);
  });

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    const docName = !isEmpty(searchText) ? `%${searchText}%` : '';
    if (property === DEFAULT_ORDER_BY) {
      if (orderBy !== 'docName') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('docName'));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [['docName', 'asc']], docName }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [[orderBy, newOrder]], docName }));
      }
    } else if (property === 'lastUpdated') {
      if (orderBy !== 'updatedAt') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('updatedAt'));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [['updatedAt', 'asc']], docName }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [[orderBy, newOrder]], docName }));
      }
    } else if (property === 'modifiedBy') {
      if (orderBy !== 'createdBy') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('createdBy'));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [['createdBy', 'asc']], docName }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [[orderBy, newOrder]], docName }));
      }
    } else if (property === 'fileType') {
      if (orderBy !== 'types') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('types'));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [['types', 'asc']], docName }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [[orderBy, newOrder]], docName }));
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(rowData) && !isEmpty(rowToBeRemoved) && !rowData.some(row => row.id === rowToBeRemoved)) {
      dispatch(resetRemoveRow());
    }
  }, [rowData, rowToBeRemoved, dispatch]);

  useEffect(() => {
    if (forceTableRefresh === TABS.MARKETING) {
      const docName = !isEmpty(searchText) ? `%${searchText}%` : '';
      dispatch(backendService.getAllActiveMarketings({ archived: isArchived, page, order: [[orderBy, order]], docName }));
      dispatch(resetForceTableRefreshTab());
    }
  }, [forceTableRefresh, dispatch]);

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
            <SortableMarketingTableHeader order={order} onRequestSort={handleRequestSort} isArchived={isArchived} />
            <TableBody>
              {rowData.map(row => {
                return <CustomMarketingPanelRow row={row} searchText={searchText} key={row.id} isArchived={isArchived} panelView={panelView} />;
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
          <SortableMarketingTableHeader order={order} onRequestSort={handleRequestSort} isArchived={isArchived} />
          <TableBody>
            {rowData.map(row => {
              return <CustomMarketingRow row={row} searchText={searchText} key={row.id} isArchived={isArchived} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomMarketingTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchText: PropTypes.string,
  panelSelectedValues: PropTypes.arrayOf(PropTypes.shape({})),
  setPanelSelectedValues: PropTypes.func,
  panelView: PropTypes.bool,
};

CustomMarketingTable.defaultProps = {
  searchText: '',
  panelSelectedValues: [],
  setPanelSelectedValues: [],
  panelView: false,
};

export default CustomMarketingTable;

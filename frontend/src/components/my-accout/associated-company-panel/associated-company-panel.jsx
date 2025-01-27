import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  SidePanelContentWrapper,
  SidePanelDrawerWrapper,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
} from '../../side-panel/side-panel-styled';
import AssociatedCompanyTable from '../../custom-table/associated-company-table/associated-company-table';
import { DRDivider } from '../../app/app-styled';
import CustomTablePagination from '../../table-pagination/custom-table-pagination';
import { ROW_PER_PAGE } from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import { getOpenAssociatedCompany } from '../../../features/selectors/ui';
import { setOpenAssociatedCompany } from '../../../features/slices/uiSlice';

function AssociatedCompanyPanel({ selectedUserDetails, companies, handleClick, additionalValues, leftPositionDrawerContainer, numPages }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const openAssociatedCompany = useSelector(getOpenAssociatedCompany);

  // state
  const [page, setPage] = useState(1);

  // func
  const handleSetPage = useCallback(
    val => {
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      dispatch(backendService.getCompaniesByParams({ archived: false, page: pageNum }));
      setPage(val);
    },
    [dispatch, setPage]
  );

  return (
    <SidePanelDrawerWrapper
      disableEnforceFocus
      hideBackdrop
      anchor="left"
      leftPositionDrawerContainer={leftPositionDrawerContainer}
      open={openAssociatedCompany}
      openWidth={700}
      onClose={() => dispatch(setOpenAssociatedCompany(false))}
      PaperProps={{
        style: {
          marginLeft: 360,
          backgroundColor: '#f0ecfc',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderTopRightRadius: '30px',
          borderBottomRightRadius: '30px',
          borderTopLeftRadius: '-30px',
          boxShadow: 'unset',
        },
      }}
      noMarginLeft>
      <Box sx={{ minWidth: 700, overflowY: 'scroll' }}>
        <SidePanelMainWrapper>
          <SidePanelHeaderWrapper>
            <SidePanelHeaderText>Select Corporate Association</SidePanelHeaderText>
            <SidePanelHeaderCloseBtn>
              <CloseIcon onClick={() => dispatch(setOpenAssociatedCompany(false))} />
            </SidePanelHeaderCloseBtn>
          </SidePanelHeaderWrapper>
          <DRDivider margin="20px 0" />
          <SidePanelContentWrapper>
            <AssociatedCompanyTable
              selectedUserDetails={selectedUserDetails}
              tableData={companies}
              searchText=""
              noMarginLeft
              handleClick={handleClick}
              additionalValues={additionalValues}
              page={0}
              maxRowsPerPage={ROW_PER_PAGE}
            />
            {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page} />}
          </SidePanelContentWrapper>
        </SidePanelMainWrapper>
      </Box>
    </SidePanelDrawerWrapper>
  );
}

AssociatedCompanyPanel.propTypes = {
  selectedUserDetails: PropTypes.shape({}).isRequired,
  companies: PropTypes.arrayOf(PropTypes.shape([])).isRequired,
  additionalValues: PropTypes.shape({}).isRequired,
  handleClick: PropTypes.func.isRequired,
  leftPositionDrawerContainer: PropTypes.number,
  numPages: PropTypes.number,
};

AssociatedCompanyPanel.defaultProps = {
  leftPositionDrawerContainer: undefined,
  numPages: 1,
};

export default AssociatedCompanyPanel;

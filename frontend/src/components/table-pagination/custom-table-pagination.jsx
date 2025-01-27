import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { PaginationItem } from '@mui/material';
import { ToggleButton } from './table-pagination-styled';

const prevBtn = () => <ToggleButton type="button">PREVIOUS</ToggleButton>;
const nextBtn = () => <ToggleButton type="button">NEXT</ToggleButton>;

function CustomTablePagination({ setPage, numPages, page }) {
  // func
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(parseInt(value, 10));
    },
    [setPage]
  );

  return (
    <div style={{ display: 'flex', marginTop: '2rem', justifyContent: 'center', width: '100%' }}>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Pagination
          showFirstButton={numPages >= 10}
          showLastButton={numPages >= 10}
          count={numPages}
          page={page}
          color="standard"
          size="large"
          sx={{
            '.MuiPagination-ul': { justifyContent: 'center' },
            '.MuiPaginationItem-previousNext': {
              '&:hover': {
                backgroundColor: 'unset',
              },
            },
            '.MuiPaginationItem-page': {
              '&.Mui-selected': {
                backgroundColor: 'unset',
              },
              backgroundColor: '#fff',
            },
          }}
          onChange={handlePageChange}
          renderItem={item => (
            <PaginationItem
              components={{
                previous: prevBtn,
                next: nextBtn,
              }}
              {...item}
            />
          )}
        />
      </Stack>
    </div>
  );
}

CustomTablePagination.propTypes = {
  setPage: PropTypes.func,
  numPages: PropTypes.number,
  page: PropTypes.number,
};

CustomTablePagination.defaultProps = {
  setPage: () => {},
  numPages: 1,
  page: 1,
};

export default CustomTablePagination;

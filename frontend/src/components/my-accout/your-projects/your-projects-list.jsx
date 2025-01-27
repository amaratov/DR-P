import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { isEmpty } from '../../../utils/utils';
import NoResultsPage from '../../../Pages/no-results-page/no-results-page';
import CustomProjectTable from '../../custom-table/your-projects-table/custom-table-project';
import { ROW_PER_PAGE } from '../../../utils/constants/constants';

function YourProjectsList({ availableProjects, searchText }) {
  // constant
  const maxRowsPerPage = ROW_PER_PAGE;

  // state
  const [page, setPage] = useState(1);

  // func
  const handleIncreasePage = useCallback(() => {
    if (page + 1 < availableProjects.length / maxRowsPerPage) {
      setPage(prev => prev + 1);
    } else {
      setPage(page);
    }
  }, [setPage, page, availableProjects.length]);

  const handleDecreasePage = useCallback(() => {
    if (page - 1 <= 0) {
      setPage(0);
    } else {
      setPage(prev => prev - 1);
    }
  }, [setPage, page]);

  if (isEmpty(availableProjects)) {
    return <NoResultsPage showSearch={!isEmpty(searchText)} />;
  }
  return (
    <div>
      <CustomProjectTable tableData={availableProjects} searchText={searchText} page={0} maxRowsPerPage={maxRowsPerPage} />
      <div style={{ display: 'flex' }}>
        {page > 0 && (
          <div>
            <Button variant="text" onClick={handleDecreasePage}>
              &lt;
            </Button>
          </div>
        )}
        {((page === 0 && availableProjects.length > maxRowsPerPage) || page + 1 < availableProjects.length / maxRowsPerPage) && (
          <div>
            <Button variant="text" onClick={handleIncreasePage}>
              &gt;
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

YourProjectsList.propTypes = {
  availableProjects: PropTypes.shape([]),
  searchText: PropTypes.string,
};

YourProjectsList.defaultProps = {
  availableProjects: [],
  searchText: '',
};

export default YourProjectsList;

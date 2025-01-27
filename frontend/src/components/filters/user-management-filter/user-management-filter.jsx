import React from 'react';
import PropTypes from 'prop-types';
import { UserManagementFilterContainer } from '../filter-styled';
import CustomChip from '../../chip/custom-chip';

function UserManagementFilter({ open, allRoles, filterTerms, handleFilterSelection, setFilterTerms }) {
  return (
    <UserManagementFilterContainer open={open}>
      <CustomChip label="Show All" isHollow isSelected={filterTerms?.length === 0} onClickFunc={() => setFilterTerms([])} />
      {allRoles.map(role => (
        <CustomChip label={role?.name} isHollow isSelected={filterTerms?.includes(role?.name)} onClickFunc={handleFilterSelection} />
      ))}
    </UserManagementFilterContainer>
  );
}

UserManagementFilter.propTypes = {
  open: PropTypes.bool.isRequired,
  allRoles: PropTypes.shape({}).isRequired,
  filterTerms: PropTypes.shape([]).isRequired,
  handleFilterSelection: PropTypes.func.isRequired,
  setFilterTerms: PropTypes.func.isRequired,
};

export default UserManagementFilter;

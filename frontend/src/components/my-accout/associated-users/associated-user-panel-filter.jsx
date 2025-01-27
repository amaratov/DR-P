import React from 'react';
import PropTypes from 'prop-types';
import CustomChip from '../../chip/custom-chip';
import { AssociatedUserPanelFilterContainer } from '../my-account-styled';

function AssociatedUserPanelFilter({ allRoles, filterTerms, handleFilterSelection, setFilterTerms }) {
  return (
    <AssociatedUserPanelFilterContainer>
      <CustomChip label="Show All" isHollow isSelected={filterTerms?.length === 0} onClickFunc={() => setFilterTerms([])} />
      {allRoles.map(role => (
        <CustomChip label={role?.name} isHollow isSelected={filterTerms?.includes(role?.name)} onClickFunc={handleFilterSelection} />
      ))}
    </AssociatedUserPanelFilterContainer>
  );
}

AssociatedUserPanelFilter.propTypes = {
  allRoles: PropTypes.shape({}).isRequired,
  filterTerms: PropTypes.shape([]).isRequired,
  handleFilterSelection: PropTypes.func.isRequired,
  setFilterTerms: PropTypes.func.isRequired,
};

export default AssociatedUserPanelFilter;

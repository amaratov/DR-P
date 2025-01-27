import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  FilterFacetCategory,
  FilterFacetHeader,
  FilterFacetHeaderText,
  FilterFacetOption,
  FilterFacetOptionCheckBox,
  FilterFacetOptionContainer,
  FilterFacetToggleBtn,
  FilterFacetToggleBtnText,
} from '../filter-styled';
import RoundedCheckbox from '../../../images/checkbox_rounded_border_icon.svg';
import RoundedCheckboxChecked from '../../../images/checkbox_rounded_border_icon_checked.svg';
import { FILTER_FACET_INITIAL_NUMBER } from '../../../utils/constants/constants';

function ArtifactLibFilterFacet({ header, options, param, hasMoreToShow, getCheckedState, handleSelectedOptions }) {
  const initialOptions = options?.length < FILTER_FACET_INITIAL_NUMBER ? options : options.slice(0, FILTER_FACET_INITIAL_NUMBER);

  // state
  const [showToggleBtn, setShowToggleBtn] = useState(true);
  const [canShowLess, setCanShowLess] = useState(false);
  const [renderedOptions, setRenderedOptions] = useState(initialOptions);

  // const
  const opCount = options?.length || 0;
  const hasMore = hasMoreToShow(opCount, renderedOptions);

  // func
  const handleShowMoreClick = useCallback(() => {
    setCanShowLess(true);
    setRenderedOptions(options);
  }, [setCanShowLess, setRenderedOptions, options]);

  const handleShowLessClick = useCallback(() => {
    const op = options.slice(0, FILTER_FACET_INITIAL_NUMBER);
    setCanShowLess(false);
    setRenderedOptions(op);
  }, [setCanShowLess, setRenderedOptions, options]);

  // effect
  useEffect(() => {
    if (options?.length < FILTER_FACET_INITIAL_NUMBER && showToggleBtn) setShowToggleBtn(false);
  }, [showToggleBtn, setShowToggleBtn, options]);

  return (
    <FilterFacetCategory>
      <FilterFacetHeader>
        <FilterFacetHeaderText>Filter by {header || 'Uncategorized'}</FilterFacetHeaderText>
      </FilterFacetHeader>
      <FilterFacetOptionContainer>
        {renderedOptions?.length &&
          renderedOptions.map(op => (
            <FilterFacetOption key={op?.id}>
              <FilterFacetOptionCheckBox>
                <Checkbox
                  icon={<img src={RoundedCheckbox} alt="RoundedCheckbox" />}
                  checkedIcon={<img src={RoundedCheckboxChecked} alt="RoundedCheckboxChecked" />}
                  checked={getCheckedState(param, op?.id)}
                  onChange={() => handleSelectedOptions(op, param)}
                  size="medium"
                />
                <div>{op?.name || ''}</div>
              </FilterFacetOptionCheckBox>
            </FilterFacetOption>
          ))}
      </FilterFacetOptionContainer>
      {showToggleBtn && !canShowLess && hasMore && (
        <FilterFacetToggleBtn onClick={handleShowMoreClick} onKeyDown={handleShowMoreClick}>
          <KeyboardArrowDownIcon />
          <FilterFacetToggleBtnText>show more</FilterFacetToggleBtnText>
        </FilterFacetToggleBtn>
      )}
      {canShowLess && (
        <FilterFacetToggleBtn onClick={handleShowLessClick} onKeyDown={handleShowLessClick}>
          <KeyboardArrowUpIcon />
          <FilterFacetToggleBtnText>show less</FilterFacetToggleBtnText>
        </FilterFacetToggleBtn>
      )}
    </FilterFacetCategory>
  );
}

ArtifactLibFilterFacet.propTypes = {
  header: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  param: PropTypes.string.isRequired,
  hasMoreToShow: PropTypes.func.isRequired,
  getCheckedState: PropTypes.func.isRequired,
  handleSelectedOptions: PropTypes.func.isRequired,
};
ArtifactLibFilterFacet.defaultProps = {};

export default ArtifactLibFilterFacet;

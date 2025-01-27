import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@mui/material';
import CustomButton from '../../../form-elements/custom-button';
import {
  MarketingFilterPanelFilterSectionWrapper,
  MarketingFilterPanelFilterValues,
  MarketingFilterPanelFilterCheckboxRow,
} from './marketing-filter-panel-style';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../../utils/constants/constants';

function MarketingFilterValues({ headerText, filterBy, option, handleAddOrRemoveFilterValues, showMore, setShowMore, getCheckedState }) {
  return (
    <MarketingFilterPanelFilterSectionWrapper>
      <h2>{headerText}</h2>
      <MarketingFilterPanelFilterValues>
        {filterBy.map((value, index) => {
          if (index < 8) {
            return (
              <MarketingFilterPanelFilterCheckboxRow key={`${value?.name}${value?.id}`}>
                <Checkbox onChange={() => handleAddOrRemoveFilterValues(value, option)} checked={getCheckedState(option, value?.id)} />
                <div>{value?.name}</div>
              </MarketingFilterPanelFilterCheckboxRow>
            );
          }
          if (showMore) {
            return (
              <MarketingFilterPanelFilterCheckboxRow key={`${value?.name}${value?.id}`}>
                <Checkbox onChange={() => handleAddOrRemoveFilterValues(value, option)} checked={getCheckedState(option, value?.id)} />
                <div>{value?.name}</div>
              </MarketingFilterPanelFilterCheckboxRow>
            );
          }
          return '';
        })}
      </MarketingFilterPanelFilterValues>
      {!showMore && filterBy?.length > 8 && (
        <CustomButton
          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
          icon={BUTTON_ICON.KEYBOARD_ARROW_DOWN}
          buttonText="Show More"
          type="button"
          padding="2px 0 0 0"
          customMinWidth="50px"
          customMinHeight="50px"
          onClickFunc={() => setShowMore(prev => !prev)}
        />
      )}
      {showMore && (
        <CustomButton
          buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
          icon={BUTTON_ICON.KEYBOARD_ARROW_UP}
          buttonText="Show Less"
          type="button"
          padding="2px 0 0 0"
          customMinWidth="50px"
          customMinHeight="50px"
          onClickFunc={() => setShowMore(prev => !prev)}
        />
      )}
    </MarketingFilterPanelFilterSectionWrapper>
  );
}

MarketingFilterValues.prototype = {
  headerText: PropTypes.string.isRequired,
  filterBy: PropTypes.shape([]),
  option: PropTypes.shape([]),
  handleAddOrRemoveFilterValues: PropTypes.func,
  showMore: PropTypes.bool,
  setShowMore: PropTypes.func,
  getCheckedState: PropTypes.func,
};

MarketingFilterValues.defaultProps = {
  filterBy: [],
  handleAddOrRemoveFilterValues: () => {},
  showMore: false,
  setShowMore: () => {},
  getCheckedState: () => {
    return false;
  },
};

export default MarketingFilterValues;

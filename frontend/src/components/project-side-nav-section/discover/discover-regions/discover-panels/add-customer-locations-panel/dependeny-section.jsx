import React from 'react';
import PropTypes from 'prop-types';
import { SidePanelContentItem, SidePanelSubText } from '../../../../../side-panel/side-panel-styled';
import { FilledValueRemoveIcon, FilledValueText, FilledValueWrapper } from '../../../../../my-accout/account-info/account-info-styled';
import CustomButton from '../../../../../form-elements/custom-button';
import { getNameFromId, isEmpty } from '../../../../../../utils/utils';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../../../../utils/constants/constants';
import { TreeLeftAngle } from './add-customer-locations-panel-styled';

function DependencySection({ addDependencyButtonText, dependencyText, onAddDependencyButton, onRemove, options, renderItemIcon, selected, subtitleText }) {
  return (
    <SidePanelContentItem>
      {!isEmpty(selected) ? (
        <>
          <SidePanelSubText>{subtitleText}</SidePanelSubText>
          <p>{dependencyText}</p>
          {selected.map(id => (
            <FilledValueWrapper key={`key-${id}`}>
              <TreeLeftAngle />
              {renderItemIcon()}
              <FilledValueText flexGrow={1}>{getNameFromId(id, options)}</FilledValueText>
              <FilledValueRemoveIcon>
                <CustomButton
                  buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                  icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                  buttonText="Remove"
                  type="button"
                  onClickFunc={() => {
                    onRemove(id);
                  }}
                />
              </FilledValueRemoveIcon>
            </FilledValueWrapper>
          ))}
        </>
      ) : null}

      <CustomButton
        buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
        icon={BUTTON_ICON.ADD_BORDERLESS}
        buttonText={addDependencyButtonText}
        marginTop="20px"
        marginBottom="20px"
        type="button"
        customMinWidth="300px"
        customMinHeight="50px"
        onClickFunc={onAddDependencyButton}
      />
    </SidePanelContentItem>
  );
}

DependencySection.prototype = {
  addDependencyButtonText: PropTypes.string,
  dependencyText: PropTypes.string,
  onAddDependencyButton: PropTypes.func,
  onRemove: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.objectOf({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), name: PropTypes.string })),
  renderItemIcon: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  subtitleText: PropTypes.string,
};

DependencySection.defaultProps = {
  addDependencyButtonText: 'Add Dependency',
  dependencyText: 'Dependency',
  onAddDependencyButton: () => {},
  onRemove: () => {},
  options: [],
  renderItemIcon: () => {},
  selected: [],
  subtitleText: '',
};

export default DependencySection;

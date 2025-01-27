import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  DiscoverRegionSelectGlobeWrapper,
  DiscoverRegionSelectHeader,
  DiscoverRegionSelectionMainRegion,
  DiscoverRegionSelections,
  DiscoverRegionSelectionsLeft,
  DiscoverRegionSelectionsRight,
  DiscoverRegionSelectionsSubmitWrapper,
  DiscoverRegionSelectionSubRegion,
  DiscoverRegionSelectionSubRegionBox,
  DiscoverRegionSelectionSubRegionValue,
  DiscoverRegionSelectWrapper,
  DiscoverRegionTabContentInnerWrapper,
  DiscoverRegionTabContentOuterWrapper,
} from '../discover-region-section-styled';
import { AllRoles, BUTTON_STYLE, REGIONS_INNER_TABS, SUB_TABS, TABS } from '../../../../../utils/constants/constants';
import GlobeImg from '../../../../../images/globe_temp_image.png';
import { getAllRegions } from '../../../../../features/selectors/mvt';
import { backendService } from '../../../../../services/backend';
import { isEmpty } from '../../../../../utils/utils';
import CustomButton from '../../../../form-elements/custom-button';
import { openDiscoverRegionsSetRequirementsMode, setSelectedDiscoverRegionActiveState } from '../../../../../features/slices/uiSlice';
import NoResultsPage from '../../../../../Pages/no-results-page/no-results-page';
import { getWhoAmI } from '../../../../../features/selectors';

function DiscoverRegionInitialSelect({ regionName, existingRegions }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const regionInfo = useSelector(getAllRegions);
  const whoami = useSelector(getWhoAmI);

  // state
  const [activeSection, setActiveSection] = useState(`${SUB_TABS.REGIONS}`);
  const [selectedRegion, setSelectedRegion] = useState('');

  // const
  const americas = isEmpty(regionInfo) ? [] : regionInfo?.filter(regionValue => regionValue?.region === 'Americas')?.[0]?.subregions;
  const emea = isEmpty(regionInfo) ? [] : regionInfo?.filter(regionValue => regionValue?.region === 'EMEA')?.[0]?.subregions;
  const apac = isEmpty(regionInfo) ? [] : regionInfo?.filter(regionValue => regionValue?.region === 'APAC')?.[0]?.subregions;
  const subRegions = {
    Americas: [...americas].sort(),
    EMEA: [...emea].sort(),
    APAC: [...apac].sort(),
  };

  const isCustomer = useMemo(() => {
    return whoami?.role?.name?.toLowerCase() === AllRoles.CUSTOMER;
  }, [whoami?.role?.name]);

  // func
  const handleDiscoverRegionsSetRequirementsModeClick = useCallback(() => {
    dispatch(openDiscoverRegionsSetRequirementsMode());
  }, [dispatch]);

  const handleSetSelectedRegion = useCallback(
    region => {
      const regionExisted = existingRegions?.find(r => r?.region === region);
      if (selectedRegion?.includes(region)) {
        setSelectedRegion('');
        dispatch(setSelectedDiscoverRegionActiveState({ regionName: '', region: '', view: SUB_TABS.INITIAL_REGIONS, state: '' }));
      } else if (!regionExisted) {
        setSelectedRegion(region);
        dispatch(setSelectedDiscoverRegionActiveState({ regionName, region, view: SUB_TABS.INITIAL_REGIONS, state: '' }));
      }
    },
    [dispatch, selectedRegion, setSelectedRegion, existingRegions]
  );

  // handle mount/unmount
  useEffect(() => {
    if (isEmpty(regionInfo)) {
      dispatch(backendService.getRegions());
    }
  }, [regionInfo, dispatch]);

  // effect
  useEffect(() => {
    dispatch(backendService.getRegions());
    if (activeSection === undefined) {
      setActiveSection(SUB_TABS.REGIONS);
      dispatch(
        setSelectedDiscoverRegionActiveState({
          regionName,
          region: '',
          view: SUB_TABS.INITIAL_REGIONS,
          state: REGIONS_INNER_TABS.CURRENT_STATE,
          isFuture: false,
        })
      );
    }
  }, [dispatch, activeSection, setActiveSection]);

  if (isCustomer) {
    return <NoResultsPage activeTab={TABS.REGIONS} />;
  }

  return (
    <DiscoverRegionTabContentOuterWrapper>
      <DiscoverRegionTabContentInnerWrapper>
        <DiscoverRegionSelectWrapper>
          <DiscoverRegionSelectHeader>Select a Region to get started</DiscoverRegionSelectHeader>
          <DiscoverRegionSelections>
            <DiscoverRegionSelectionsLeft>
              {!isEmpty(subRegions?.Americas) && (
                <>
                  <DiscoverRegionSelectionMainRegion>Americas</DiscoverRegionSelectionMainRegion>
                  <DiscoverRegionSelectionSubRegion>
                    {!isEmpty(subRegions?.Americas) &&
                      subRegions?.Americas?.map(val => (
                        <DiscoverRegionSelectionSubRegionBox
                          onClick={() => handleSetSelectedRegion(val)}
                          isSelected={selectedRegion === val}
                          key={val}
                          disableOption={existingRegions?.find(r => r?.region === val)}>
                          <DiscoverRegionSelectionSubRegionValue>{val}</DiscoverRegionSelectionSubRegionValue>
                        </DiscoverRegionSelectionSubRegionBox>
                      ))}
                  </DiscoverRegionSelectionSubRegion>
                </>
              )}
              {!isEmpty(subRegions?.EMEA) && (
                <>
                  <DiscoverRegionSelectionMainRegion>EMEA</DiscoverRegionSelectionMainRegion>
                  <DiscoverRegionSelectionSubRegion>
                    {!isEmpty(subRegions?.EMEA) &&
                      subRegions?.EMEA?.map(val => (
                        <DiscoverRegionSelectionSubRegionBox
                          onClick={() => handleSetSelectedRegion(val)}
                          isSelected={selectedRegion === val}
                          key={val}
                          disableOption={existingRegions?.find(r => r?.region === val)}>
                          <DiscoverRegionSelectionSubRegionValue>{val}</DiscoverRegionSelectionSubRegionValue>
                        </DiscoverRegionSelectionSubRegionBox>
                      ))}
                  </DiscoverRegionSelectionSubRegion>
                </>
              )}
            </DiscoverRegionSelectionsLeft>
            <DiscoverRegionSelectionsRight>
              {!isEmpty(subRegions?.APAC) && (
                <>
                  <DiscoverRegionSelectionMainRegion>APAC</DiscoverRegionSelectionMainRegion>
                  <DiscoverRegionSelectionSubRegion>
                    {!isEmpty(subRegions?.APAC) &&
                      subRegions?.APAC?.map(val => (
                        <DiscoverRegionSelectionSubRegionBox
                          onClick={() => handleSetSelectedRegion(val)}
                          isSelected={selectedRegion === val}
                          key={val}
                          disableOption={existingRegions?.find(r => r?.region === val)}>
                          <DiscoverRegionSelectionSubRegionValue>{val}</DiscoverRegionSelectionSubRegionValue>
                        </DiscoverRegionSelectionSubRegionBox>
                      ))}
                  </DiscoverRegionSelectionSubRegion>
                </>
              )}
            </DiscoverRegionSelectionsRight>
            <DiscoverRegionSelectionsSubmitWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="Continue"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                bgColor="var(--color-homeworld)"
                disableButton={isEmpty(selectedRegion)}
                onClickFunc={handleDiscoverRegionsSetRequirementsModeClick}
              />
            </DiscoverRegionSelectionsSubmitWrapper>
          </DiscoverRegionSelections>
        </DiscoverRegionSelectWrapper>
        <DiscoverRegionSelectGlobeWrapper>
          <div>
            <img src={GlobeImg} alt="GlobeImg" />
          </div>
        </DiscoverRegionSelectGlobeWrapper>
      </DiscoverRegionTabContentInnerWrapper>
    </DiscoverRegionTabContentOuterWrapper>
  );
}

DiscoverRegionInitialSelect.prototype = {
  regionName: PropTypes.string.isRequired,
  existingRegions: PropTypes.shape([]).isRequired,
};

DiscoverRegionInitialSelect.defaultProps = {};

export default DiscoverRegionInitialSelect;

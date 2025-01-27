import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../../form-elements/custom-button';
import { DRDivider } from '../../../app/app-styled';
import { MarketingFilterPanelContainer, MarketingFilterPanelWrapper, MarketingFilterPanelHeader } from './marketing-filter-panel-style';
import { resetFilterMode, setSelectedFilterFacets } from '../../../../features/slices/uiSlice';
import { getFilterMode, getSelectedFilterFacets } from '../../../../features/selectors/ui';
import { BUTTON_ICON, TABS, BUTTON_STYLE, TYPE_OPTIONS, PARTNER_OPTIONS, TECHNOLOGY_OPTIONS, HUB_OPTIONS } from '../../../../utils/constants/constants';
import MarketingFilterValues from './marketing-filter-values';
import { getAllActiveIndustryVerticals } from '../../../../features/selectors/industryVertical';
import { getAllActiveUseCases } from '../../../../features/selectors/useCase';
import { backendService } from '../../../../services/backend';
import { getOtherTags } from '../../../../features/selectors/common';

const facetTemplate = {
  tag: [],
  types: [],
  industryVertical: [],
  useCase: [],
  partners: [],
  technologies: [],
  hub: [],
  otherTags: [],
};

function MarketingFilterPanel() {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const filterMode = useSelector(getFilterMode);
  const industryVerticals = useSelector(getAllActiveIndustryVerticals);
  const useCases = useSelector(getAllActiveUseCases);
  const otherTags = useSelector(getOtherTags);
  const selectedFacets = useSelector(getSelectedFilterFacets);

  // state
  const [showMoreFilterByType, setShowMoreFilterByType] = useState(false);
  const [showMoreFilterByVertical, setShowMoreFilterByVertical] = useState(false);
  const [showMoreFilterByUsecase, setShowMoreFilterByUsecase] = useState(false);
  const [showMoreFilterByPartners, setShowMoreFilterByPartners] = useState(false);
  const [showMoreFilterByTechnologies, setShowMoreFilterByTechnologies] = useState(false);
  const [showMoreFilterByHub, setShowMoreFilterByHub] = useState(false);
  const [showMoreFilterByOther, setShowMoreFilterByOther] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(facetTemplate);

  // func
  const getCheckedState = useCallback(
    (header, opId) => {
      return selectedOptions?.[header]?.some(op => op.id === opId);
    },
    [selectedOptions]
  );

  const handleSetFacets = useCallback(() => {
    dispatch(
      setSelectedFilterFacets({
        tag: selectedOptions?.tag || [],
        types: selectedOptions?.types || [],
        industryVertical: selectedOptions?.industryVertical || [],
        useCase: selectedOptions?.useCase || [],
        partners: selectedOptions?.partners || [],
        technologies: selectedOptions?.technologies || [],
        hub: selectedOptions?.hub || [],
        otherTags: selectedOptions?.otherTags || [],
      })
    );
    dispatch(resetFilterMode());
  }, [dispatch, selectedOptions]);

  const handleClearSelection = useCallback(() => {
    dispatch(resetFilterMode());
  }, [setSelectedOptions]);

  const handleResetValues = useCallback(() => {
    setSelectedOptions({ tag: [], types: [], industryVertical: [], useCase: [], partners: [], technologies: [], hub: [], otherTags: [] });
    // dispatch(resetFilterMode());
  }, [setSelectedOptions, dispatch]);

  const handleAddOrRemoveFilterValues = useCallback(
    (val, category) => {
      const selectedOptionsCopy = { ...selectedOptions };
      const containsVal = selectedOptionsCopy?.[category]?.find(el => el.name === val.name && el.id === val.id);
      if (containsVal) {
        setSelectedOptions({
          ...selectedOptionsCopy,
          [category]: selectedOptionsCopy?.[category]?.filter(el => el.name !== val.name && el.id !== val.id),
        });
      } else {
        setSelectedOptions({ ...selectedOptionsCopy, [category]: selectedOptionsCopy?.[category]?.concat(val) });
      }
    },
    [setSelectedOptions, selectedOptions]
  );

  // effect
  // init options
  useEffect(() => {
    setSelectedOptions({
      tags: selectedFacets?.tags || [],
      types: selectedFacets?.types || [],
      industryVertical: selectedFacets?.industryVertical || [],
      useCase: selectedFacets?.useCase || [],
      partners: selectedFacets?.partners || [],
      technologies: selectedFacets?.technologies || [],
      hub: selectedFacets?.hub || [],
      otherTags: selectedFacets?.otherTags || [],
    });
    dispatch(backendService.getAllIndustryVertical());
    dispatch(backendService.getAllUseCases());
    dispatch(backendService.getOtherTags());
  }, []);

  return (
    filterMode === TABS.PROJECT_BRIEFCASE && (
      <MarketingFilterPanelContainer>
        <MarketingFilterPanelWrapper>
          <div style={{ position: 'fixed', width: 'inherit', backgroundColor: 'white', paddingBottom: '1rem' }}>
            <MarketingFilterPanelHeader>
              <h1>Filters</h1>
              <CustomButton
                buttonStyle={BUTTON_STYLE.END_ICON_BUTTON}
                icon={BUTTON_ICON.CANCEL}
                buttonText="x"
                type="button"
                padding="2px 0 0 0"
                customMinWidth="50px"
                customMinHeight="50px"
                onClickFunc={handleClearSelection}
              />
            </MarketingFilterPanelHeader>
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
          </div>
          <div style={{ marginTop: '7rem', paddingBottom: '2rem', overflowX: 'hidden' }}>
            <MarketingFilterValues
              headerText="Filter by Type"
              filterBy={TYPE_OPTIONS}
              option="types"
              handleAddOrRemoveFilterValues={handleAddOrRemoveFilterValues}
              showMore={showMoreFilterByType}
              setShowMore={setShowMoreFilterByType}
              getCheckedState={getCheckedState}
            />
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
            <MarketingFilterValues
              headerText="Filter by Vertical"
              filterBy={industryVerticals}
              option="industryVertical"
              handleAddOrRemoveFilterValues={handleAddOrRemoveFilterValues}
              showMore={showMoreFilterByVertical}
              setShowMore={setShowMoreFilterByVertical}
              getCheckedState={getCheckedState}
            />
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
            <MarketingFilterValues
              headerText="Filter by Usecase"
              filterBy={useCases}
              option="useCase"
              handleAddOrRemoveFilterValues={handleAddOrRemoveFilterValues}
              showMore={showMoreFilterByUsecase}
              setShowMore={setShowMoreFilterByUsecase}
              getCheckedState={getCheckedState}
            />
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
            <MarketingFilterValues
              headerText="Filter by Partners"
              filterBy={PARTNER_OPTIONS}
              option="partners"
              handleAddOrRemoveFilterValues={handleAddOrRemoveFilterValues}
              showMore={showMoreFilterByPartners}
              setShowMore={setShowMoreFilterByPartners}
              getCheckedState={getCheckedState}
            />
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
            <MarketingFilterValues
              headerText="Filter by Technologies"
              filterBy={TECHNOLOGY_OPTIONS}
              option="technologies"
              handleAddOrRemoveFilterValues={handleAddOrRemoveFilterValues}
              showMore={showMoreFilterByTechnologies}
              setShowMore={setShowMoreFilterByTechnologies}
              getCheckedState={getCheckedState}
            />
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
            <MarketingFilterValues
              headerText="Filter by Hub"
              filterBy={HUB_OPTIONS}
              option="hub"
              handleAddOrRemoveFilterValues={handleAddOrRemoveFilterValues}
              showMore={showMoreFilterByHub}
              setShowMore={setShowMoreFilterByHub}
              getCheckedState={getCheckedState}
            />
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
            <MarketingFilterValues
              headerText="Filter by Other Tags"
              filterBy={otherTags}
              option="otherTags"
              handleAddOrRemoveFilterValues={handleAddOrRemoveFilterValues}
              showMore={showMoreFilterByOther}
              setShowMore={setShowMoreFilterByOther}
              getCheckedState={getCheckedState}
            />
            <DRDivider style={{ width: '100%', paddingTop: '1rem' }} />
            <div style={{ display: 'grid', gridAutoFlow: 'column', width: '100%', paddingTop: '2rem' }}>
              <CustomButton
                useColor="red"
                buttonText="Clear selection"
                buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                type="button"
                onClickFunc={handleResetValues}
              />
              <div style={{ justifySelf: 'right' }}>
                <CustomButton
                  buttonText="Show Documents"
                  buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                  type="button"
                  bgColor="var(--color-homeworld)"
                  onClickFunc={handleSetFacets}
                  customMinHeight="55px"
                  customMinWidth="280px"
                />
              </div>
            </div>
          </div>
        </MarketingFilterPanelWrapper>
      </MarketingFilterPanelContainer>
    )
  );
}

MarketingFilterPanel.prototype = {};

MarketingFilterPanel.defaultProps = {};

export default MarketingFilterPanel;

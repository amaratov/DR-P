import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import {
  FilterActionSection,
  FilterFacetSection,
  FilterMainWrapper,
  FilterPanelCloseBtn,
  FilterPanelContainer,
  FilterPanelHeaderSection,
  FilterPanelHeaderText,
  FilterPanelWrapper,
} from '../filter-styled';
import { backendService } from '../../../services/backend';
import { getAllActiveIndustryVerticals } from '../../../features/selectors/industryVertical';
import { getAllActiveUseCases } from '../../../features/selectors/useCase';
import {
  BUTTON_STYLE,
  FILTER_FACET_CATEGORY,
  FILTER_FACET_INITIAL_NUMBER,
  HUB_OPTIONS,
  ICON_DISCOVER_MODEL_VALUES,
  PARTNER_OPTIONS,
  TABS,
  TECHNOLOGY_OPTIONS,
  TYPE_OPTIONS,
} from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { getGridColumnCount, isEmpty } from '../../../utils/utils';
import ArtifactLibFilterFacet from './artifact-lib-filter-facet';
import { resetFilterMode, setFilterMode, setSelectedFilterFacets } from '../../../features/slices/uiSlice';
import { getSelectedFilterFacets } from '../../../features/selectors/ui';
import { getOtherTags } from '../../../features/selectors/common';

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

function ArtifactLibFilter({ activeTab, open, setOpenFilter }) {
  // dispatch
  const dispatch = useDispatch();

  // ref
  const facetRef = useRef(null);

  // state
  const [gridColumnCount, setGridColumnCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(facetTemplate);

  // selector
  const industryVerticals = useSelector(getAllActiveIndustryVerticals);
  const useCases = useSelector(getAllActiveUseCases);
  const otherTags = useSelector(getOtherTags);
  const selectedFacets = useSelector(getSelectedFilterFacets);

  // const
  const submitButtonText = `Show ${activeTab}`;
  const isIconPage = activeTab === TABS.ICONS;

  // func
  const hasMoreToShow = useCallback(
    (optionCount, renderedOptions) => {
      if (optionCount <= FILTER_FACET_INITIAL_NUMBER) {
        return false;
      }
      const cc = gridColumnCount || 0;
      const roughRowNum = Math.ceil(optionCount / cc);
      return renderedOptions?.length < optionCount || roughRowNum > 2;
    },
    [gridColumnCount]
  );

  const getCheckedState = useCallback(
    (header, opId) => {
      return selectedOptions?.[header]?.some(op => op.id === opId);
    },
    [selectedOptions]
  );

  const handleSelectedOptions = useCallback(
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
    [selectedOptions, setSelectedOptions]
  );

  const handleClearSelection = useCallback(() => {
    setSelectedOptions({ tag: [], types: [], industryVertical: [], useCase: [], partners: [], technologies: [], hub: [], otherTags: [] });
    dispatch(resetFilterMode());
  }, [setSelectedOptions]);

  const updateColumnCount = useCallback(() => {
    const containerWidth = facetRef?.current?.offsetWidth || 0;
    const n = getGridColumnCount(containerWidth, 20, 350);
    setGridColumnCount(n);
  }, [facetRef]);

  const handleSetFacets = useCallback(() => {
    const hasFacet = Object.keys(selectedOptions)?.some(key => !isEmpty(selectedOptions[key]));
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
    if (hasFacet) {
      dispatch(setFilterMode(activeTab));
    } else {
      dispatch(resetFilterMode());
    }
    setOpenFilter(false);
  }, [dispatch, selectedOptions, setOpenFilter]);

  // effect
  // init options
  useEffect(() => {
    setSelectedOptions({
      tag: selectedFacets?.tag || [],
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
    window.addEventListener('resize', updateColumnCount, true);
    return () => window.removeEventListener('resize', updateColumnCount, true);
  }, []);

  return (
    <FilterMainWrapper open={open}>
      <FilterPanelWrapper>
        <FilterPanelContainer>
          <FilterPanelHeaderSection>
            <FilterPanelHeaderText>Filters</FilterPanelHeaderText>
            <FilterPanelCloseBtn onClick={() => setOpenFilter(false)} onKeyDown={() => setOpenFilter(false)}>
              <CloseIcon />
            </FilterPanelCloseBtn>
          </FilterPanelHeaderSection>
          <FilterFacetSection ref={facetRef}>
            {isIconPage && (
              <ArtifactLibFilterFacet
                header={FILTER_FACET_CATEGORY.TAG}
                param="tag"
                options={ICON_DISCOVER_MODEL_VALUES}
                setSelectedOptions={setSelectedOptions}
                hasMoreToShow={hasMoreToShow}
                selectedOptions={selectedOptions}
                getCheckedState={getCheckedState}
                handleSelectedOptions={handleSelectedOptions}
              />
            )}
            {!isIconPage && (
              <ArtifactLibFilterFacet
                header={FILTER_FACET_CATEGORY.TYPE}
                options={TYPE_OPTIONS}
                param="types"
                setSelectedOptions={setSelectedOptions}
                hasMoreToShow={hasMoreToShow}
                selectedOptions={selectedOptions}
                getCheckedState={getCheckedState}
                handleSelectedOptions={handleSelectedOptions}
              />
            )}
            <ArtifactLibFilterFacet
              header={FILTER_FACET_CATEGORY.INDUSTRY_VERTICAL}
              options={industryVerticals}
              param="industryVertical"
              setSelectedOptions={setSelectedOptions}
              hasMoreToShow={hasMoreToShow}
              selectedOptions={selectedOptions}
              getCheckedState={getCheckedState}
              handleSelectedOptions={handleSelectedOptions}
            />
            <ArtifactLibFilterFacet
              header={FILTER_FACET_CATEGORY.USE_CASE}
              options={useCases || []}
              param="useCase"
              setSelectedOptions={setSelectedOptions}
              hasMoreToShow={hasMoreToShow}
              selectedOptions={selectedOptions}
              getCheckedState={getCheckedState}
              handleSelectedOptions={handleSelectedOptions}
            />
            <ArtifactLibFilterFacet
              header={FILTER_FACET_CATEGORY.PARTNER}
              options={PARTNER_OPTIONS}
              param="partners"
              setSelectedOptions={setSelectedOptions}
              hasMoreToShow={hasMoreToShow}
              selectedOptions={selectedOptions}
              getCheckedState={getCheckedState}
              handleSelectedOptions={handleSelectedOptions}
            />
            <ArtifactLibFilterFacet
              header={FILTER_FACET_CATEGORY.TECHNOLOGY}
              options={TECHNOLOGY_OPTIONS}
              param="technologies"
              setSelectedOptions={setSelectedOptions}
              hasMoreToShow={hasMoreToShow}
              selectedOptions={selectedOptions}
              getCheckedState={getCheckedState}
              handleSelectedOptions={handleSelectedOptions}
            />
            <ArtifactLibFilterFacet
              header={FILTER_FACET_CATEGORY.HUB}
              options={HUB_OPTIONS}
              param="hub"
              setSelectedOptions={setSelectedOptions}
              hasMoreToShow={hasMoreToShow}
              selectedOptions={selectedOptions}
              getCheckedState={getCheckedState}
              handleSelectedOptions={handleSelectedOptions}
            />
            <ArtifactLibFilterFacet
              header={FILTER_FACET_CATEGORY.OTHER_TAGS}
              options={otherTags}
              param="otherTags"
              setSelectedOptions={setSelectedOptions}
              hasMoreToShow={hasMoreToShow}
              selectedOptions={selectedOptions}
              getCheckedState={getCheckedState}
              handleSelectedOptions={handleSelectedOptions}
            />
            <FilterActionSection>
              <CustomButton
                buttonStyle={BUTTON_STYLE.DIV_STYLE_TEXT_BUTTON}
                buttonText="Clear selection"
                useColor="#dc4b4a"
                bgColor="var(--color-la-luna)"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => handleClearSelection()}
              />
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText={submitButtonText}
                bgColor="var(--color-homeworld)"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => handleSetFacets()}
              />
            </FilterActionSection>
          </FilterFacetSection>
        </FilterPanelContainer>
      </FilterPanelWrapper>
    </FilterMainWrapper>
  );
}

ArtifactLibFilter.propTypes = {
  activeTab: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpenFilter: PropTypes.func.isRequired,
};

ArtifactLibFilter.defaultProps = {};

export default ArtifactLibFilter;

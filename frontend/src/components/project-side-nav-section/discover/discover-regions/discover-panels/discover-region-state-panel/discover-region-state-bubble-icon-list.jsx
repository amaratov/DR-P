import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { getAllIcons, getSelectedDetailsFromProject, getSelectedDiscoverRegionActiveState } from '../../../../../../features/selectors/ui';
import { getAllActiveIcons } from '../../../../../../features/selectors/artifactIcon';
import {
  DiscoverRegionStateBubbleContainer,
  DiscoverRegionStateBubbleContainerIcon,
  DiscoverRegionStateBubbleContainerImage,
  DiscoverRegionStateBubblePartnershipAndSuppliersList,
} from '../../discover-region-section-styled';
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  DISCOVER_REGION_FIELDS,
  DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS,
  EDIT_MODE,
  OFFICE_TYPE,
  PROJECT_DETAIL_NOTE_TYPE,
} from '../../../../../../utils/constants/constants';
import MoreMenuButton from '../../../../../more-menu-button/more-menu-button';
import DiscoverRegionStateBubbleIconPartnershipSuppliersLayout from './discover-region-state-bubble-icon-partnership-suppliers-layout';
import {
  ArtifactLibraryIcon,
  ArtifactLibraryIconContainer,
} from '../../../../../my-accout/admin-panel/artifact-library/artifact-library-icons/artifact-library-icon-styled';
import { backendService } from '../../../../../../services/backend';
import { getEditValue, getFieldValue } from '../../../../../../utils/utils';
import CustomButton from '../../../../../form-elements/custom-button';
import { resetAllIcons, setAllIcons } from '../../../../../../features/slices/uiSlice';

// For querying the tags set on the icons, if there's a miss-match, eg. in Discovery there
// is 'customerlocations' set for project details, but for the icons that need to be
// available are tagged with 'offices', so this object holds the values for getting the
// right tag values that are needed for `workingIcons`
const alternativeFieldValue = {
  [DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS]: OFFICE_TYPE,
};

function DiscoverRegionStateBubbleIconList({ future, activeTab, region, iconNames, iconIds }) {
  // dispatch
  const dispatch = useDispatch();

  // state
  const [discoverListDisplayValues, setDiscoverListDisplayValues] = useState([]);

  // selector
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const activeIcons = useSelector(getAllActiveIcons);
  const allIcons = useSelector(getAllIcons);

  // const
  const GENERAL_TABS = [
    DISCOVER_REGION_FIELDS.COMPLIANCE,
    DISCOVER_REGION_FIELDS.DATA_CENTRES,
    DISCOVER_REGION_FIELDS.CLOUDS,
    DISCOVER_REGION_FIELDS.APPLICATIONS,
    DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS,
  ];
  const field = getFieldValue(activeTab);
  const editValue = getEditValue(activeTab);
  const workingValues = useMemo(() => {
    return discoverListDisplayValues
      ?.filter(value => value.region === region)
      ?.slice()
      .sort((a, b) => a?.named?.localeCompare(b?.named));
  }, [discoverListDisplayValues, region]);

  const workingIcons = allIcons?.filter(value => {
    return value.discoveryModel && (value.tag === alternativeFieldValue[field] || value.tag === field);
  });

  // function
  const handleTabSelect = useCallback(value => {
    // console.log('Selected', value);
  }, []);

  const handleDirectRemove = useCallback(
    value => {
      const { projectId } = value;
      const deleteBody = {
        projectId,
        detailId: value.id,
      };
      dispatch(backendService.deleteProjectDetail(deleteBody));
      setTimeout(() => dispatch(backendService.getProjectDetails(projectId)), 600);
    },
    [dispatch, editValue]
  );

  const getMatchField = function (d, forcedCheck) {
    if (d?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
      return d?.extras?.hosting;
    }
    if (d?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS) {
      return d?.extras?.officeType;
    }
    if (
      d?.type === DISCOVER_REGION_FIELDS.CLOUDS ||
      d?.type === DISCOVER_REGION_FIELDS.COMPLIANCE ||
      d?.type === DISCOVER_REGION_FIELDS.APPLICATIONS ||
      d?.type === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS
    ) {
      if (forcedCheck === 'id') {
        return d?.extras?.iconId;
      }
    }
    return d?.named;
  };

  const getAllIconsForList = useCallback(async () => {
    await dispatch(resetAllIcons());
    const results1 = await dispatch(backendService.searchPreviewIcons({ iconNames }));
    let iconsFinal = [];
    if (results1?.payload?.icons) {
      iconsFinal = [...results1.payload.icons];
    }
    if (results1?.payload?.numPages > 1) {
      for (let i = 1; i < results1.payload.numPages; i += 1) {
        /* eslint-disable no-await-in-loop */
        const resultsA = await dispatch(backendService.searchPreviewIcons({ iconNames, page: i }));
        if (resultsA?.payload?.icons) {
          iconsFinal = [...iconsFinal, ...resultsA.payload.icons];
        }
      }
    }
    const results2 = await dispatch(backendService.searchPreviewIcons({ iconIds }));
    if (results2?.payload?.icons) {
      iconsFinal = [...iconsFinal, ...results2.payload.icons];
    }
    if (results2?.payload?.numPages > 1) {
      for (let j = 1; j < results2.payload.numPages; j += 1) {
        /* eslint-disable no-await-in-loop */
        const resultsB = await dispatch(backendService.searchPreviewIcons({ iconIds, page: j }));
        if (resultsB?.payload?.icons) {
          iconsFinal = [...iconsFinal, ...resultsB.payload.icons];
        }
      }
    }
    await dispatch(setAllIcons(iconsFinal));
  }, [dispatch, iconNames, iconIds]);

  // effect
  useEffect(async () => {
    await getAllIconsForList();
  }, [getAllIconsForList]);

  useEffect(() => {
    const displayValues = detailsFromSelectedProject.filter(details => {
      return details?.type === field && details?.isFuture === future && details?.region === activeRegionAndState?.region;
    });
    setDiscoverListDisplayValues(displayValues);
  }, [setDiscoverListDisplayValues, detailsFromSelectedProject, field, future]);

  if (GENERAL_TABS.includes(field)) {
    if (workingValues === undefined) {
      return <div />;
    }

    return workingValues
      ?.filter(wv => wv.type === field)
      ?.map(value => {
        const workingIcon = workingIcons?.find(v => v?.id === getMatchField(value, 'id') || v?.iconName === getMatchField(value, 'iconName'));
        const previewUrl = workingIcon?.storageLocation || '';
        let iconName = workingIcon?.iconName || value?.named;
        if (value.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS) {
          iconName = value?.named || iconName;
        }
        if (value.type === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
          iconName = value?.named || iconName;
        }
        return (
          <DiscoverRegionStateBubbleContainer key={`${field}-${value?.id}`} onClick={() => handleTabSelect(field)} onKeyDown={() => handleTabSelect(field)}>
            <DiscoverRegionStateBubbleContainerIcon>
              <DiscoverRegionStateBubbleContainerImage>
                <ArtifactLibraryIconContainer>
                  <ArtifactLibraryIcon imgUrl={previewUrl}>{previewUrl ? '' : <QuestionMarkIcon />}</ArtifactLibraryIcon>
                </ArtifactLibraryIconContainer>
              </DiscoverRegionStateBubbleContainerImage>
              <div style={{ position: 'absolute', justifySelf: 'right' }}>
                {field === DISCOVER_REGION_FIELDS.COMPLIANCE && (
                  <CustomButton
                    buttonStyle={BUTTON_STYLE.DISCOVER_REGION_REMOVE_STYLE}
                    icon={BUTTON_ICON.CANCEL}
                    bgColor="var(--color-homeworld)"
                    useColor="var(--color-la-luna)"
                    borderRadius="20px"
                    type="button"
                    customMinWidth="25px"
                    customMinHeight="25px"
                    customMarginLeft="-20px"
                    onClickFunc={() => handleDirectRemove(value)}
                  />
                )}
                {field !== DISCOVER_REGION_FIELDS.COMPLIANCE && (
                  <MoreMenuButton panelForEdit={editValue} rowDetails={value} detailsFromSelectedProject={detailsFromSelectedProject} />
                )}
              </div>
            </DiscoverRegionStateBubbleContainerIcon>
            <div>{iconName}</div>
          </DiscoverRegionStateBubbleContainer>
        );
      });
  }
  if (field === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS) {
    const partnershipValues = workingValues.filter(wv => wv.type === field);
    return (
      <DiscoverRegionStateBubblePartnershipAndSuppliersList>
        <DiscoverRegionStateBubbleIconPartnershipSuppliersLayout
          title={DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.NSP}
          fieldName={DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.NSP}
          activeIcons={allIcons}
          stateValues={partnershipValues}
          handleTabSelect={handleTabSelect}
          handleDirectRemove={handleDirectRemove}
        />
        <DiscoverRegionStateBubbleIconPartnershipSuppliersLayout
          title={DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.VAR}
          fieldName={DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.VAR}
          activeIcons={allIcons}
          stateValues={partnershipValues}
          handleTabSelect={handleTabSelect}
          handleDirectRemove={handleDirectRemove}
        />
        <DiscoverRegionStateBubbleIconPartnershipSuppliersLayout
          title={DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.SW}
          fieldName={DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.SW}
          activeIcons={allIcons}
          stateValues={partnershipValues}
          handleTabSelect={handleTabSelect}
          handleDirectRemove={handleDirectRemove}
        />
        <DiscoverRegionStateBubbleIconPartnershipSuppliersLayout
          title={DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.MIGRATION}
          fieldName={DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.MIGRATION}
          activeIcons={allIcons}
          stateValues={partnershipValues}
          handleTabSelect={handleTabSelect}
          handleDirectRemove={handleDirectRemove}
        />
        <DiscoverRegionStateBubbleIconPartnershipSuppliersLayout
          title={DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.HW}
          fieldName={DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.HW}
          activeIcons={allIcons}
          stateValues={partnershipValues}
          handleTabSelect={handleTabSelect}
          handleDirectRemove={handleDirectRemove}
        />
      </DiscoverRegionStateBubblePartnershipAndSuppliersList>
    );
  }

  return <div>Invalid Active Tab</div>;
}

DiscoverRegionStateBubbleIconList.prototype = {
  future: PropTypes.bool,
  activeTab: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  iconNames: PropTypes.shape([]),
  iconIds: PropTypes.shape([]),
};

DiscoverRegionStateBubbleIconList.defaultProps = {
  iconNames: [],
  iconIds: [],
};

export default DiscoverRegionStateBubbleIconList;

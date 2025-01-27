import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useForm } from 'react-hook-form';
import { backendService } from '../../../../../../services/backend';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelContentWrapper,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
  DiscoverRegionsCloudsListWrapper,
  DiscoverApplicationsSelectionValue,
  DiscoverRegionAddApplicationsContainerImage,
  DiscoverApplicationsSelectionValueContainer,
} from '../discover-regions-set-requirements-styled';
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES,
  CLOUD_TYPE,
  DISCOVER_REGION_FIELDS,
  REGIONS_INNER_TABS,
} from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import { refreshProjectDetailRegionTabs, resetAddRegionCloudsMode, setSelectedDiscoverRegionActiveState } from '../../../../../../features/slices/uiSlice';
import { getSelectedDetailsFromProject, getSelectedDiscoverRegionActiveState } from '../../../../../../features/selectors/ui';
import AddCloudsSidePanel from './add-clouds-side-panel';
import { getAllClouds } from '../../../../../../features/selectors/mvt';
import { isEmpty } from '../../../../../../utils/utils';

function DiscoverRegionsAddClouds({ selectedProject }) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  //List of cloud providers, pulled from material icons with the correct label.
  const cloudProviderIcons = useSelector(getAllClouds);

  // memo
  //Use this to set and keep track of full cloud values already added.
  //Pull from this for update/delete clouds, and use to delete any null 'named'
  const alreadyAddedValues = useMemo(() => {
    return (
      detailsFromSelectedProject?.filter(
        value =>
          value?.type === DISCOVER_REGION_FIELDS.CLOUDS && selectedProject[0]?.named === value?.region && value?.isFuture === activeRegionAndState?.isFuture
      ) || []
    );
  }, [detailsFromSelectedProject, activeRegionAndState]);

  const availableClouds = useMemo(() => {
    return cloudProviderIcons?.filter(
      cloud =>
        !detailsFromSelectedProject?.some(
          detail =>
            detail?.type === DISCOVER_REGION_FIELDS.CLOUDS &&
            detail?.named === cloud.iconName &&
            detail?.region === activeRegionAndState?.region &&
            detail?.isFuture === activeRegionAndState?.isFuture
        )
    );
  }, [cloudProviderIcons, detailsFromSelectedProject, activeRegionAndState]);

  // const
  //Use this to set any cloud values already added, and to compare against for update/delete clouds on submit
  const initialClouds = alreadyAddedValues?.map(value => value?.named) || [];

  // state
  const [fullSelectedCloudData, setFullSelectedCloudData] = useState(alreadyAddedValues?.map(value => value?.extras) || []);
  const [selectedClouds, setSelectedClouds] = useState(initialClouds);
  const [sidePanel, setSidePanel] = useState(false);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState('');
  const [isAddDisabled, setIsAddDisabled] = useState(true);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // func
  const submitForm = () => {
    const projectId = selectedProject[0].projectId || routeParams?.id || window.location.pathname.split('/')[2];
    const keepTrackOfCloudAdded = [];
    fullSelectedCloudData.forEach(cloudProvider => {
      try {
        if (cloudProvider.cloudProviderName !== null) {
          const data = {
            projectId,
            named: cloudProvider.cloudProviderName,
            type: CLOUD_TYPE,
            isFuture: activeRegionAndState.isFuture,
            stateInfo: activeRegionAndState.isFuture ? REGIONS_INNER_TABS.FUTURE_STATE : REGIONS_INNER_TABS.CURRENT_STATE,
            region: activeRegionAndState.region,
            extras: cloudProvider,
          };
          if (initialClouds.includes(cloudProvider?.cloudProviderName)) {
            const valueParams = alreadyAddedValues.filter(value => value?.named === cloudProvider?.cloudProviderName);
            const finalData = {
              project_id: projectId,
              detailId: valueParams[0].id,
              ...data,
            };
            dispatch(backendService.updateProjectDetails(finalData));
          } else {
            const finalData = {
              project_id: projectId,
              ...data,
            };
            dispatch(backendService.newProjectDetail(finalData));
          }
          keepTrackOfCloudAdded.push(cloudProvider.cloudProviderName);
        }
      } catch (e) {
        console.error(e);
      }
    });

    initialClouds.forEach(initialCloudProvider => {
      if (!keepTrackOfCloudAdded.includes(initialCloudProvider)) {
        const valueParams = alreadyAddedValues.filter(value => value?.named === initialCloudProvider);
        const deleteBody = {
          projectId,
          project_id: projectId,
          detailId: valueParams[0].id,
        };
        dispatch(backendService.deleteProjectDetail(deleteBody));
      }
    });

    dispatch(
      setSelectedDiscoverRegionActiveState({
        regionName: activeRegionAndState.regionName,
        region: activeRegionAndState.region,
        view: activeRegionAndState.view,
        state: activeRegionAndState.state,
        isFuture: activeRegionAndState.isFuture,
        isSaveChangesActive: true,
      })
    );
    setTimeout(() => {
      dispatch(backendService.getProjectDetails(projectId));
      dispatch(refreshProjectDetailRegionTabs());
      dispatch(resetAddRegionCloudsMode());
      reset();
    }, 600);
  };

  const excludeCloud = useCallback(
    cloud => {
      if (selectedClouds.length > 0) {
        const index = selectedClouds.indexOf(cloud);
        if (index > -1) {
          selectedClouds.splice(index, 1);
          setSelectedClouds([...selectedClouds]);
        }
        const temp = [...fullSelectedCloudData];
        const filterFullCloudData = temp.map(value => value?.[`${REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.CLOUD_PROVIDER_NAME}`]);
        const indexFullCloudData = filterFullCloudData.indexOf(cloud);
        if (indexFullCloudData > -1) {
          temp.splice(indexFullCloudData, 1);
          setFullSelectedCloudData([...temp]);
        }
      }
    },
    [selectedClouds, setSelectedClouds, fullSelectedCloudData, setFullSelectedCloudData]
  );

  const includeCloud = useCallback(
    (cloud, fullData) => {
      if (selectedClouds.length === 0) {
        setSelectedClouds([...selectedClouds, cloud]);
        setFullSelectedCloudData([...fullSelectedCloudData, fullData]);
      } else {
        const index = selectedClouds.indexOf(cloud);
        if (index < 0) {
          setSelectedClouds([...selectedClouds, cloud]);
          setFullSelectedCloudData([...fullSelectedCloudData, fullData]);
        }
      }
      setSidePanel(false);
    },
    [selectedClouds, setSelectedClouds, setSidePanel, fullSelectedCloudData, setFullSelectedCloudData]
  );

  useEffect(() => {
    dispatch(backendService.getActiveCloud());
  }, []);

  useEffect(() => {
    // Clear any null values if applicable
    alreadyAddedValues.forEach(initialCloudProvider => {
      if (initialCloudProvider?.named === null) {
        const deleteBody = {
          projectId: selectedProject[0].projectId || routeParams?.id || window.location.pathname.split('/')[2],
          project_id: selectedProject[0].projectId || routeParams?.id || window.location.pathname.split('/')[2],
          detailId: initialCloudProvider.id,
        };
        dispatch(backendService.deleteProjectDetail(deleteBody));
      }
    });
  }, []);

  return (
    <DiscoverRegionsSetRequirementsPanelMain>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <DiscoverRegionsSetRequirementsPanelForm customWidth="600" customHeight="450" customPadding="40">
            <DiscoverRegionsSetRequirementsPanelContentWrapper style={{ display: 'flex' }}>
              <DiscoverRegionsSetRequirementsPanelHeaderText>Choose Cloud Provider</DiscoverRegionsSetRequirementsPanelHeaderText>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelContentWrapper maxHeight="22rem" overflow="scroll">
              <DiscoverRegionsCloudsListWrapper customPadding="0px 10px">
                {availableClouds?.map(value => {
                  if (selectedClouds.length > 0 && selectedClouds.includes(value.iconName)) {
                    return (
                      <DiscoverApplicationsSelectionValueContainer key={value.iconName}>
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.DISCOVER_REGION_REMOVE_STYLE}
                          icon={BUTTON_ICON.CANCEL}
                          bgColor="var(--color-homeworld)"
                          useColor="var(--color-la-luna)"
                          borderRadius="20px"
                          type="button"
                          customMinWidth="25px"
                          customMinHeight="25px"
                          onClickFunc={() => {
                            excludeCloud(value.iconName);
                            setIsAddDisabled(false);
                          }}
                        />
                        <DiscoverApplicationsSelectionValue
                          isSelected
                          key={value.iconName}
                          customMinWidth="128px"
                          customMinHeight="96px"
                          customMaxWidth="128px"
                          customMaxHeight="96px">
                          <DiscoverRegionAddApplicationsContainerImage>
                            {value?.storageLocation ? <img src={value?.storageLocation} alt="logo" /> : <QuestionMarkIcon />}
                          </DiscoverRegionAddApplicationsContainerImage>
                        </DiscoverApplicationsSelectionValue>
                        {value.iconName}
                      </DiscoverApplicationsSelectionValueContainer>
                    );
                  }
                  return (
                    <DiscoverApplicationsSelectionValueContainer key={value.iconName}>
                      <DiscoverApplicationsSelectionValue
                        key={value.iconName}
                        customMinWidth="128px"
                        customMinHeight="96px"
                        customMaxWidth="128px"
                        customMaxHeight="96px"
                        onClick={() => {
                          setSelectedCloudProvider(value.iconName);
                          setSidePanel(true);
                          setIsAddDisabled(false);
                        }}>
                        <DiscoverRegionAddApplicationsContainerImage>
                          {value?.storageLocation ? <img src={value?.storageLocation} alt="logo" /> : <QuestionMarkIcon />}
                        </DiscoverRegionAddApplicationsContainerImage>
                      </DiscoverApplicationsSelectionValue>
                      {value.iconName}
                    </DiscoverApplicationsSelectionValueContainer>
                  );
                })}
              </DiscoverRegionsCloudsListWrapper>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="290px"
                customMinHeight="60px"
                onClickFunc={() => {
                  dispatch(resetAddRegionCloudsMode());
                  setIsAddDisabled(true);
                  reset();
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Add Cloud"
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="290px"
                customMinHeight="60px"
                disableButton={isAddDisabled || isEmpty(selectedClouds)}
              />
            </DiscoverRegionsSetRequirementsPanelActionWrapper>
          </DiscoverRegionsSetRequirementsPanelForm>
        </Box>
      </form>
      {sidePanel && (
        <AddCloudsSidePanel
          cloudProviderName={selectedCloudProvider}
          shutOffPanel={setSidePanel}
          excludeCloudProvider={excludeCloud}
          includeCloud={includeCloud}
        />
      )}
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

DiscoverRegionsAddClouds.prototype = {
  selectedProject: PropTypes.shape(PropTypes.arrayOf({})).isRequired,
};

DiscoverRegionsAddClouds.defaultProps = {};

export default DiscoverRegionsAddClouds;

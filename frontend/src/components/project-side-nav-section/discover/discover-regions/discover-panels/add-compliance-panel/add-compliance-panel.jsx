import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelContentWrapper,
  DiscoverRegionsSetRequirementsPanelSubHeaderText,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
  DiscoverRegionsSetRequirementsListWrapper,
  DiscoverRegionsSetRequirementsListAddButton,
  DiscoverRegionsSetRequirementsListValue,
} from '../discover-regions-set-requirements-styled';
import { BUTTON_STYLE, DISCOVER_REGION_FIELDS } from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import { openAddIconMode, resetAddComplianceMode, resetRefetchCompliance } from '../../../../../../features/slices/uiSlice';
import { getAllCompliance } from '../../../../../../features/selectors/mvt';
import { backendService } from '../../../../../../services/backend';
import {
  getSelectedDetailsFromProject,
  getSelectedDiscoverRegionActiveState,
  getSelectedProjectDetails,
  refetchCompliance,
  getAddIconMode,
} from '../../../../../../features/selectors/ui';
import AddArtifactLibraryIconPanel from '../../../../../my-accout/admin-panel/artifact-library/artifact-library-icons/add-artifact-library-icon/add-artifact-library-icon-panel';

function DiscoverRegionsAddCompliance() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // state
  const [selectedCompliances, setSelectedCompliances] = useState([]);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // selectors
  const complianceInfo = useSelector(getAllCompliance);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const refreshComplianceOption = useSelector(refetchCompliance);
  const addingIconMode = useSelector(getAddIconMode);

  // const
  const availableCompliance = useMemo(() => {
    return complianceInfo?.filter(
      com =>
        !detailsFromSelectedProject?.some(
          detail =>
            detail?.type === DISCOVER_REGION_FIELDS.COMPLIANCE &&
            detail?.named === com.iconName &&
            detail?.region === activeRegionAndState?.region &&
            detail?.isFuture === activeRegionAndState?.isFuture
        )
    );
  }, [complianceInfo, detailsFromSelectedProject, activeRegionAndState]);

  // func
  const submitForm = async () => {
    const projectId = currentProjectInfo?.id || routeParams?.id || window.location.pathname.split('/')[2];
    const region = activeRegionAndState?.region;
    const isFuture = activeRegionAndState?.isFuture;
    const findalData = selectedCompliances?.reduce((acc, com) => {
      const obj = {
        projectId,
        region,
        isFuture,
        named: com?.iconName,
        type: DISCOVER_REGION_FIELDS.COMPLIANCE,
        extras: {
          iconId: com?.id, // keep id here in case the iconName is edited from artifact lib which will not be reflected here
        },
      };
      acc.push(obj);
      return acc;
    }, []);
    await findalData.forEach(fd => {
      try {
        dispatch(backendService.newProjectDetail(fd));
      } catch (e) {
        console.log(e);
      }
    });

    reset();
    dispatch(resetAddComplianceMode());
    setTimeout(() => {
      dispatch(backendService.getProjectDetails(projectId));
    }, 1000);
  };

  const onComplianceClick = useCallback(
    val => {
      const selectedCompliance = selectedCompliances?.find(com => com.id === val.id);
      if (selectedCompliance) {
        const filteredCompliance = selectedCompliances?.filter(com => com?.id !== val?.id);
        setSelectedCompliances(filteredCompliance);
      } else {
        setSelectedCompliances([...selectedCompliances, val]);
      }
    },
    [selectedCompliances, setSelectedCompliances]
  );

  const handleAddComplianceClick = useCallback(() => {
    dispatch(openAddIconMode());
  }, [dispatch]);

  // effect
  useEffect(() => {
    dispatch(resetRefetchCompliance());
    dispatch(backendService.getActiveCompliance());
  }, [dispatch]);

  useEffect(() => {
    if (refreshComplianceOption) {
      dispatch(resetRefetchCompliance());
      setTimeout(() => dispatch(backendService.getActiveCompliance()), 1000);
    }
  }, [refreshComplianceOption, dispatch]);

  useEffect(() => {
    if (!addingIconMode) {
      dispatch(resetRefetchCompliance());
      dispatch(backendService.getActiveCompliance());
    }
  }, [addingIconMode, dispatch]);

  return (
    <DiscoverRegionsSetRequirementsPanelMain>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <DiscoverRegionsSetRequirementsPanelForm customWidth="600" customHeight="400" customPadding="40">
            <DiscoverRegionsSetRequirementsPanelHeaderText>Add Compliance</DiscoverRegionsSetRequirementsPanelHeaderText>
            <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
              <DiscoverRegionsSetRequirementsPanelSubHeaderText>Set compliance requirements for this region</DiscoverRegionsSetRequirementsPanelSubHeaderText>
              <DiscoverRegionsSetRequirementsListWrapper>
                {availableCompliance?.map(value => {
                  return (
                    <DiscoverRegionsSetRequirementsListValue
                      key={value.id}
                      onClick={() => onComplianceClick(value)}
                      isActive={selectedCompliances?.find(com => com.id === value.id) !== undefined}>
                      {value.iconName}
                    </DiscoverRegionsSetRequirementsListValue>
                  );
                })}
                <DiscoverRegionsSetRequirementsListAddButton onClick={() => handleAddComplianceClick()}>
                  + Add Compliance
                </DiscoverRegionsSetRequirementsListAddButton>
              </DiscoverRegionsSetRequirementsListWrapper>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="240px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetAddComplianceMode());
                  reset();
                }}
              />
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Add Compliance"
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="240px"
                customMinHeight="56px"
              />
            </DiscoverRegionsSetRequirementsPanelActionWrapper>
          </DiscoverRegionsSetRequirementsPanelForm>
        </Box>
      </form>
      <AddArtifactLibraryIconPanel />
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

DiscoverRegionsAddCompliance.prototype = {
  selectedRegion: PropTypes.string.isRequired,
};

DiscoverRegionsAddCompliance.defaultProps = {};

export default DiscoverRegionsAddCompliance;

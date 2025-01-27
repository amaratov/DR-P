import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelContentWrapper,
  DiscoverRegionsSetRequirementsPanelContentContainer,
  DiscoverRegionsSetRequirementsPanelSubHeaderText,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
  DiscoverRegionsSetRequirementsListValueActive,
  DiscoverRegionsSetRequirementsListValueInactive,
  DiscoverRegionsSetRequirementsStartRow,
} from '../discover-regions-set-requirements-styled';
import TextInput from '../../../../../form-elements/text-input';
import { BUTTON_STYLE, TABS, SUB_TABS, REGIONS_INNER_TABS, PATH_NAME } from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import {
  resetDiscoverRegionsSetRequirementsMode,
  setSelectedDiscoverRegionActiveState,
  refreshProjectDetailRegionTabs,
  resetDiscoverRegionsEditNameMode,
  setStartWithFutureState,
} from '../../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../../services/backend';
import { getSelectedDetailsFromProject, getSelectedDiscoverRegionActiveState } from '../../../../../../features/selectors/ui';
import { isEmpty } from '../../../../../../utils/utils';
import { getCurrentProjectBriefcase } from '../../../../../../features/selectors/projectBriefcase';

function DiscoverRegionsSetRequirements({ activeId, subTabs, setSubTabs, setActiveSection, editRegionNameModeInfo, setShowAddRegionTab }) {
  // dispatch
  const dispatch = useDispatch();

  // navigate
  const navigate = useNavigate();

  // params
  const routeParams = useParams();

  // useForm
  const {
    register,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  // selectors
  const selectedRegionValues = useSelector(getSelectedDiscoverRegionActiveState);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const selectedProjectBrief = useSelector(getCurrentProjectBriefcase);

  // memo
  const tabNames = useMemo(() => {
    return detailsFromSelectedProject.length === 0
      ? [TABS.REGIONS]
      : detailsFromSelectedProject
          ?.filter(detail => detail?.type === 'regions')
          ?.map(x => {
            return x.named;
          });
  }, [detailsFromSelectedProject]);

  // constants
  const selectedRegion = selectedRegionValues.region;
  const startStrings = ['Enter Current State Information', 'Enter Future State Information'];
  const editNameMode = !isEmpty(editRegionNameModeInfo);

  // state
  const [selectStart, setSelectStart] = useState('');
  const [tabName, setTabName] = useState(selectedRegion);

  // func
  const updateRegionTabName = useCallback(
    event => {
      setTabName(event.target.value);
    },
    [setTabName]
  );

  const handleEditName = useCallback(() => {
    const finalData = {
      ...editRegionNameModeInfo,
      detailId: editRegionNameModeInfo.id,
      named: tabName,
    };
    dispatch(backendService.updateProjectDetails(finalData));
    dispatch(
      setSelectedDiscoverRegionActiveState({
        regionName: tabName,
        region: editRegionNameModeInfo?.region,
        view: SUB_TABS.STATE_VIEW,
        state: editRegionNameModeInfo?.stateInfo,
        isFuture: editRegionNameModeInfo?.isFuture,
      })
    );

    const copy = [...subTabs];
    const index = copy?.indexOf(editRegionNameModeInfo?.named);
    if (index !== -1) {
      setSubTabs(copy);
      copy[index] = tabName;
    }

    setTimeout(() => {
      setActiveSection(tabName);
      dispatch(backendService.getProjectDetails(editRegionNameModeInfo?.projectId));
      dispatch(refreshProjectDetailRegionTabs());
      dispatch(resetDiscoverRegionsEditNameMode());
    }, 1000);
  }, [editRegionNameModeInfo, tabName, dispatch]);

  const handleApply = async () => {
    if (tabNames[0] !== TABS.REGIONS && tabNames.indexOf(tabName) >= 0) {
      setError('name', { type: 'custom', message: 'Names cannot be duplicates!' });
    } else {
      if (selectStart === startStrings[0]) {
        dispatch(
          setSelectedDiscoverRegionActiveState({
            regionName: selectedRegionValues.regionName,
            region: selectedRegion,
            view: SUB_TABS.STATE_VIEW,
            state: REGIONS_INNER_TABS.CURRENT_STATE,
            isFuture: false,
          })
        );
      } else if (selectStart === startStrings[1]) {
        // use it to set the default state to future
        dispatch(setStartWithFutureState(true));
        dispatch(
          setSelectedDiscoverRegionActiveState({
            regionName: selectedRegionValues.regionName,
            region: selectedRegion,
            view: SUB_TABS.STATE_VIEW,
            state: REGIONS_INNER_TABS.FUTURE_STATE,
            isFuture: true,
          })
        );
      }
      const projectId = isEmpty(selectedProjectBrief) ? window.location.pathname.split('/')[2] : selectedProjectBrief.projectId;
      const postBody = {
        projectId,
        projectNotes: '',
        named: tabName,
        region: selectedRegion,
        type: 'regions',
        stateInfo: REGIONS_INNER_TABS.CURRENT_STATE, // region is stateless keep it consistent
        isFuture: false, // region is stateless keep it consistent
      };

      const results = await dispatch(backendService.newProjectDetail(postBody));
      if (subTabs.length <= 1) {
        setSubTabs([tabName]);
      } else {
        const newSubTabs = subTabs.slice(0, subTabs.length - 1);
        setSubTabs([...newSubTabs, tabName]);
      }

      setShowAddRegionTab(false);
      setActiveSection(tabName);
      dispatch(refreshProjectDetailRegionTabs());
      dispatch(resetDiscoverRegionsSetRequirementsMode());

      const firstHalf = `${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.PROJECT_MODELER_REGION}/${results?.payload?.id}`;
      const secondHalf = routeParams?.regionStateTab ? `/${routeParams?.regionStateTab}` : PATH_NAME.REGION_STATE_TABS.COMPLIANCE;
      navigate(firstHalf + secondHalf);
    }
  };

  const renderEditRegionName = () => {
    return (
      <DiscoverRegionsSetRequirementsPanelMain>
        <Box role="presentation">
          <DiscoverRegionsSetRequirementsPanelForm customWidth="650" customHeight="350">
            <DiscoverRegionsSetRequirementsPanelHeaderText>Set Region Name</DiscoverRegionsSetRequirementsPanelHeaderText>
            <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
              <DiscoverRegionsSetRequirementsPanelContentContainer>
                <DiscoverRegionsSetRequirementsPanelSubHeaderText>Region Name</DiscoverRegionsSetRequirementsPanelSubHeaderText>
                <TextInput
                  id="name"
                  type="text"
                  defaultValue={editRegionNameModeInfo?.named}
                  variant="standard"
                  register={register}
                  error={errors?.name}
                  longScreen
                  onChange={updateRegionTabName}
                />
              </DiscoverRegionsSetRequirementsPanelContentContainer>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                marginTop="60px"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetDiscoverRegionsSetRequirementsMode());
                  dispatch(resetDiscoverRegionsEditNameMode());
                  reset();
                }}
              />
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="Apply"
                bgColor="var(--color-homeworld)"
                type="button"
                marginTop="60px"
                customMinWidth="300px"
                customMinHeight="56px"
                disableButton={isEmpty(tabName) || tabNames.indexOf(tabName) >= 0}
                onClickFunc={handleEditName}
              />
            </DiscoverRegionsSetRequirementsPanelActionWrapper>
          </DiscoverRegionsSetRequirementsPanelForm>
        </Box>
      </DiscoverRegionsSetRequirementsPanelMain>
    );
  };

  // hook mount/unmount
  useEffect(() => {
    if (isEmpty(selectedProjectBrief)) {
      const projectId = window.location.pathname.split('/')[2];
      const params = {
        projectId,
      };
      dispatch(backendService.getProjectBriefcaseByProjectId(params));
    }
  }, []);

  return editNameMode ? (
    renderEditRegionName()
  ) : (
    <DiscoverRegionsSetRequirementsPanelMain>
      <Box role="presentation">
        <DiscoverRegionsSetRequirementsPanelForm customWidth="650" customHeight="350">
          <DiscoverRegionsSetRequirementsPanelHeaderText>Set Name & Compliance Requirements</DiscoverRegionsSetRequirementsPanelHeaderText>
          <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
            <DiscoverRegionsSetRequirementsPanelContentContainer>
              <DiscoverRegionsSetRequirementsPanelSubHeaderText>Region Name</DiscoverRegionsSetRequirementsPanelSubHeaderText>
              <TextInput
                id="name"
                type="text"
                defaultValue={selectedRegion}
                variant="standard"
                register={register}
                error={errors?.name}
                longScreen
                onChange={updateRegionTabName}
              />
            </DiscoverRegionsSetRequirementsPanelContentContainer>
          </DiscoverRegionsSetRequirementsPanelContentWrapper>
          <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
            <DiscoverRegionsSetRequirementsPanelContentContainer>
              <DiscoverRegionsSetRequirementsPanelSubHeaderText>How do you want to start?</DiscoverRegionsSetRequirementsPanelSubHeaderText>
              <DiscoverRegionsSetRequirementsStartRow>
                {startStrings.map(value => {
                  if (selectStart === value) {
                    return (
                      <DiscoverRegionsSetRequirementsListValueActive
                        borderradius="20"
                        texttransform="capitalize"
                        onClick={() => setSelectStart(value)}
                        key={value}>
                        {value}
                      </DiscoverRegionsSetRequirementsListValueActive>
                    );
                  }
                  return (
                    <DiscoverRegionsSetRequirementsListValueInactive
                      borderradius="20"
                      texttransform="capitalize"
                      key={value}
                      onClick={() => setSelectStart(value)}>
                      {value}
                    </DiscoverRegionsSetRequirementsListValueInactive>
                  );
                })}
              </DiscoverRegionsSetRequirementsStartRow>
            </DiscoverRegionsSetRequirementsPanelContentContainer>
          </DiscoverRegionsSetRequirementsPanelContentWrapper>
          <DiscoverRegionsSetRequirementsPanelActionWrapper>
            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
              buttonText="cancel"
              marginTop="60px"
              type="button"
              customMinWidth="300px"
              customMinHeight="56px"
              onClickFunc={() => {
                dispatch(resetDiscoverRegionsSetRequirementsMode());
                dispatch(resetDiscoverRegionsEditNameMode());
                reset();
              }}
            />

            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
              buttonText="Apply"
              bgColor="var(--color-homeworld)"
              type="button"
              marginTop="60px"
              customMinWidth="300px"
              customMinHeight="56px"
              disableButton={isEmpty(selectStart)}
              onClickFunc={handleApply}
            />
          </DiscoverRegionsSetRequirementsPanelActionWrapper>
        </DiscoverRegionsSetRequirementsPanelForm>
      </Box>
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

DiscoverRegionsSetRequirements.prototype = {
  subTabs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setSubTabs: PropTypes.func,
  setActiveSection: PropTypes.func,
  activeId: PropTypes.string,
  editRegionNameModeInfo: PropTypes.shape({}),
  setShowAddRegionTab: PropTypes.func,
};

DiscoverRegionsSetRequirements.defaultProps = {
  setSubTabs: () => {},
  setActiveSection: () => {},
  activeId: '',
  editRegionNameModeInfo: {},
};

export default DiscoverRegionsSetRequirements;

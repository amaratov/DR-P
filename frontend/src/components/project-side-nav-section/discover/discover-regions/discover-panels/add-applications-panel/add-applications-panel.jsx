import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelContentWrapper,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
  DiscoverRegionsApplicationsListWrapper,
  DiscoverRegionAddApplicationsContainerImage,
  DiscoverApplicationsSelectionValueContainer,
  DiscoverApplicationsSelectionValue,
} from '../discover-regions-set-requirements-styled';
import { BUTTON_ICON, BUTTON_STYLE, DISCOVER_REGION_FIELDS } from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import { openAddIconMode, resetAddRegionApplicationsMode } from '../../../../../../features/slices/uiSlice';
import {
  getSelectedDetailsFromProject,
  getSelectedDiscoverRegionActiveState,
  getSelectedProjectDetails,
  getAddIconMode,
} from '../../../../../../features/selectors/ui';
import AddApplicationsSidePanel from './add-applications-side-panel';
import { getAllApplication } from '../../../../../../features/selectors/mvt';
import { backendService } from '../../../../../../services/backend';
import { isEmpty } from '../../../../../../utils/utils';
import {
  DiscoverRegionStateBubbleAddContainer,
  DiscoverRegionStateBubbleContainerIcon,
  DiscoverRegionStateBubbleContainerIconCircle,
} from '../../discover-region-section-styled';
import AddArtifactLibraryIconPanel from '../../../../../my-accout/admin-panel/artifact-library/artifact-library-icons/add-artifact-library-icon/add-artifact-library-icon-panel';

function DiscoverRegionsAddApplications() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const activeApplications = useSelector(getAllApplication);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const addingIconMode = useSelector(getAddIconMode);

  // state
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState({});
  const [sidePanel, setSidePanel] = useState(false);
  const [applicationConfigs, setApplicationConfigs] = useState([]);

  // const
  const availableApplications = useMemo(() => {
    return activeApplications?.filter(
      app =>
        !detailsFromSelectedProject?.some(
          detail =>
            detail?.type === DISCOVER_REGION_FIELDS.APPLICATIONS &&
            detail?.named === app.iconName &&
            detail?.region === activeRegionAndState?.region &&
            detail?.isFuture === activeRegionAndState?.isFuture
        )
    );
  }, [activeApplications, detailsFromSelectedProject, activeRegionAndState]);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // func
  const submitForm = async data => {
    const projectId = currentProjectInfo?.id || routeParams?.id || window.location.pathname.split('/')[2];
    const region = activeRegionAndState?.region;
    const isFuture = activeRegionAndState?.isFuture;
    const type = DISCOVER_REGION_FIELDS.APPLICATIONS;
    const finalData = applicationConfigs?.reduce((acc, config) => {
      const obj = {
        projectId,
        region,
        type,
        isFuture,
        extras: {
          iconId: config?.id, // keep id here in case the iconName is edited from artifact lib which will not be reflected here
        },
        ...config,
      };
      acc.push(obj);
      return acc;
    }, []);
    await finalData.forEach(fd => {
      try {
        dispatch(backendService.newProjectDetail(fd));
      } catch (e) {
        console.log(e);
      }
    });
    reset();
    dispatch(resetAddRegionApplicationsMode());
    setTimeout(() => dispatch(backendService.getProjectDetails(projectId)), 1000);
  };

  const onApplicationClick = useCallback(
    val => {
      const containsVal = selectedApplications?.find(el => el?.iconName === val?.iconName);
      if (containsVal) {
        const filteredAppArr = selectedApplications.filter(el => el.iconName !== val.iconName);
        const filteredConfigArr = applicationConfigs?.filter(el => el?.named !== val?.iconName);
        setCurrentApplication({});
        setSelectedApplications(filteredAppArr);
        setApplicationConfigs(filteredConfigArr);
      } else {
        setCurrentApplication(val);
        setSelectedApplications([...selectedApplications, val]);
        setTimeout(() => setSidePanel(true), 500);
      }
    },
    [selectedApplications, setSelectedApplications, applicationConfigs, setApplicationConfigs]
  );

  const setSelectedApplicationConfig = useCallback(
    config => {
      const inSelectedApp = selectedApplications?.find(el => el?.iconName === config?.named);
      if (inSelectedApp) {
        setApplicationConfigs([...applicationConfigs, config]);
      } else {
        const filteredConfigArr = applicationConfigs?.filter(el => el?.named !== config?.named);
        setApplicationConfigs(filteredConfigArr);
      }
    },
    [selectedApplications, applicationConfigs, setApplicationConfigs]
  );

  const onCancelClick = useCallback(() => {
    dispatch(resetAddRegionApplicationsMode());
    reset();
  }, [dispatch, reset]);

  const handleAddApplicationClick = useCallback(() => {
    dispatch(openAddIconMode());
  }, [dispatch]);

  // effect
  useEffect(() => {
    dispatch(backendService.getActiveApplication());
  }, [dispatch]);

  // effect
  useEffect(() => {
    if (!addingIconMode) {
      dispatch(backendService.getActiveApplication());
    }
  }, [dispatch, addingIconMode]);

  return (
    <DiscoverRegionsSetRequirementsPanelMain>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <DiscoverRegionsSetRequirementsPanelForm customWidth="600" customHeight="575" customPadding="40">
            <DiscoverRegionsSetRequirementsPanelContentWrapper style={{ display: 'flex' }}>
              <DiscoverRegionsSetRequirementsPanelHeaderText>Choose Application</DiscoverRegionsSetRequirementsPanelHeaderText>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
              <DiscoverRegionsApplicationsListWrapper>
                {availableApplications?.map(application => {
                  const aKey = `${application.id?.split('-')?.[0] || ''}app`;
                  const isSelected = selectedApplications?.find(el => el?.iconName === application?.iconName);
                  return (
                    <DiscoverApplicationsSelectionValueContainer key={aKey}>
                      {isSelected && (
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
                            onApplicationClick(application);
                          }}
                        />
                      )}
                      <DiscoverApplicationsSelectionValue
                        isSelected={isSelected}
                        onClick={() => onApplicationClick(application)}
                        customMinWidth="128px"
                        customMaxWidth="128px"
                        customMinHeight="83.5px"
                        customMaxHeight="83.5px">
                        <DiscoverRegionAddApplicationsContainerImage>
                          {application?.storageLocation ? <img src={application?.storageLocation} alt="logo" /> : <QuestionMarkIcon />}
                        </DiscoverRegionAddApplicationsContainerImage>
                      </DiscoverApplicationsSelectionValue>
                      {application.iconName}
                    </DiscoverApplicationsSelectionValueContainer>
                  );
                })}
                <div>
                  <DiscoverRegionStateBubbleAddContainer
                    style={{ padding: '0px' }}
                    onClick={() => handleAddApplicationClick()}
                    onKeyDown={() => handleAddApplicationClick()}>
                    <DiscoverRegionStateBubbleContainerIcon style={{ width: '8rem', height: '6.25rem' }}>
                      <DiscoverRegionStateBubbleContainerIconCircle style={{ padding: '0.7rem' }}>
                        <DiscoverRegionStateBubbleContainerIconCircle style={{ padding: '0.2rem' }}>
                          <AddIcon />
                        </DiscoverRegionStateBubbleContainerIconCircle>
                      </DiscoverRegionStateBubbleContainerIconCircle>
                    </DiscoverRegionStateBubbleContainerIcon>
                    <div>Add Application</div>
                  </DiscoverRegionStateBubbleAddContainer>
                </div>
              </DiscoverRegionsApplicationsListWrapper>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelActionWrapper
              background="linear-gradient(0deg, rgba(255,255,255,1) 50%, rgba(2,0,36,0) 100%)"
              customBottom="2rem"
              position="absolute"
              padding="5rem 0 0 0">
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="290px"
                customMinHeight="60px"
                onClickFunc={onCancelClick}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Add Application"
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="290px"
                customMinHeight="60px"
                disableButton={isEmpty(selectedApplications)}
              />
            </DiscoverRegionsSetRequirementsPanelActionWrapper>
          </DiscoverRegionsSetRequirementsPanelForm>
        </Box>
      </form>
      <AddApplicationsSidePanel
        sidePanel={sidePanel}
        currentApplication={currentApplication}
        shutOffPanel={setSidePanel}
        onApplicationClick={onApplicationClick}
        setCurrentApplication={setCurrentApplication}
        setSelectedApplicationConfig={setSelectedApplicationConfig}
        handleCloseAddMainPanel={onCancelClick}
      />
      <AddArtifactLibraryIconPanel />
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

DiscoverRegionsAddApplications.prototype = {};

DiscoverRegionsAddApplications.defaultProps = {};

export default DiscoverRegionsAddApplications;

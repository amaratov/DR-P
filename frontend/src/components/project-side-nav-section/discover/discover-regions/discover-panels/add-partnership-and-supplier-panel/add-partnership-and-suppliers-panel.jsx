import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelContentWrapper,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
  DiscoverRegionsPartnershipAndSuppliersListValue,
  DiscoverRegionsPartnershipAndSuppliersListWrapper,
  DiscoverApplicationsSelectionValueContainer,
  DiscoverApplicationsSelectionValue,
  DiscoverRegionAddApplicationsContainerImage,
} from '../discover-regions-set-requirements-styled';
import { BUTTON_ICON, BUTTON_STYLE, DISCOVER_REGION_FIELDS } from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import { openAddIconMode, resetAddRegionPartnershipAndSuppliersMode, resetRefetchPartners } from '../../../../../../features/slices/uiSlice';
import {
  getAddRegionPartnershipAndSuppliersMode,
  getRefetchPartners,
  getSelectedDetailsFromProject,
  getSelectedDiscoverRegionActiveState,
  getSelectedProjectDetails,
  getAddIconMode,
} from '../../../../../../features/selectors/ui';
import {
  DiscoverRegionStateBubbleAddContainer,
  DiscoverRegionStateBubbleContainerIcon,
  DiscoverRegionStateBubbleContainerIconCircle,
} from '../../discover-region-section-styled';
import { getAllPartnerships } from '../../../../../../features/selectors/mvt';
import { backendService } from '../../../../../../services/backend';
import { getPartnerShipsButtonText, getPartnerShipsType } from '../../../../../../utils/utils';
import AddArtifactLibraryIconPanel from '../../../../../my-accout/admin-panel/artifact-library/artifact-library-icons/add-artifact-library-icon/add-artifact-library-icon-panel';

function DiscoverRegionsAddPartnershipAndSuppliers() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const selectedRow = useSelector(getAddRegionPartnershipAndSuppliersMode);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const allPartnerships = useSelector(getAllPartnerships);
  const refetchPartners = useSelector(getRefetchPartners);
  const addingIconMode = useSelector(getAddIconMode);

  // state
  const [selectedPartnerships, setSelectedPartnerships] = useState([]);

  // const
  const buttonText = getPartnerShipsButtonText(selectedRow);
  const partnerType = getPartnerShipsType(selectedRow);
  const availablePartnerships = useMemo(() => {
    return Object.keys(allPartnerships).reduce((acc, key) => {
      acc[key] = allPartnerships?.[key]?.filter(
        ps =>
          !detailsFromSelectedProject?.some(
            detail =>
              detail?.type === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS &&
              detail?.extras?.partnerType === partnerType &&
              detail?.named === ps.iconName &&
              detail?.region === activeRegionAndState?.region &&
              detail?.isFuture === activeRegionAndState.isFuture
          )
      );
      return acc;
    }, {});
  }, [allPartnerships, detailsFromSelectedProject]);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // func
  const submitForm = async () => {
    const projectId = currentProjectInfo?.id || routeParams?.id || window.location.pathname.split('/')[2];
    const region = activeRegionAndState?.region;
    const stateInfo = activeRegionAndState?.state;
    const isFuture = activeRegionAndState?.isFuture;
    const finalData = selectedPartnerships?.reduce((acc, ps) => {
      const obj = {
        projectId,
        region,
        isFuture,
        named: ps?.iconName,
        type: DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS,
        stateInfo,
        extras: {
          iconId: ps?.id, // keep id here in case the iconName is edited from artifact lib which will not be reflected here
          partnerType,
        },
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
    dispatch(resetAddRegionPartnershipAndSuppliersMode());
    setTimeout(() => {
      dispatch(backendService.getProjectDetails(projectId));
    }, 1000);
  };

  const onPartnershipClick = useCallback(
    val => {
      const containsVal = selectedPartnerships?.find(el => el?.iconName === val?.iconName);
      if (containsVal) {
        const filteredPartnershipArr = selectedPartnerships?.filter(el => el.iconName !== val.iconName);
        setSelectedPartnerships(filteredPartnershipArr);
      } else {
        setSelectedPartnerships([...selectedPartnerships, val]);
      }
    },
    [selectedPartnerships, setSelectedPartnerships]
  );

  const handleAddParnershipClick = useCallback(() => {
    dispatch(openAddIconMode());
  }, [dispatch]);

  // effect
  useEffect(() => {
    dispatch(resetRefetchPartners());

    dispatch(backendService.getActivePartnernsp());
    dispatch(backendService.getActivePartnervar());
    dispatch(backendService.getActivePartnersw());
    dispatch(backendService.getActivePartnermig());
    dispatch(backendService.getActivePartnerhw());
  }, [dispatch]);

  useEffect(() => {
    if (refetchPartners) {
      dispatch(resetRefetchPartners());
      setTimeout(() => {
        dispatch(backendService.getActivePartnernsp());
        dispatch(backendService.getActivePartnervar());
        dispatch(backendService.getActivePartnersw());
        dispatch(backendService.getActivePartnermig());
        dispatch(backendService.getActivePartnerhw());
      }, 1000);
    }
  }, [refetchPartners, dispatch]);

  useEffect(() => {
    if (!addingIconMode) {
      dispatch(backendService.getActivePartnernsp());
      dispatch(backendService.getActivePartnervar());
      dispatch(backendService.getActivePartnersw());
      dispatch(backendService.getActivePartnermig());
      dispatch(backendService.getActivePartnerhw());
    }
  }, [addingIconMode]);

  return (
    <DiscoverRegionsSetRequirementsPanelMain>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <DiscoverRegionsSetRequirementsPanelForm customWidth="590" customHeight="600" customPadding="40">
            <DiscoverRegionsSetRequirementsPanelContentWrapper style={{ display: 'flex' }}>
              <DiscoverRegionsSetRequirementsPanelHeaderText>Choose {selectedRow}</DiscoverRegionsSetRequirementsPanelHeaderText>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
              <DiscoverRegionsPartnershipAndSuppliersListWrapper>
                {availablePartnerships?.[partnerType]?.map(value => {
                  const aKey = `${value.id?.split('-')?.[0] || ''}app`;
                  const isSelected = selectedPartnerships?.find(el => el?.iconName === value?.iconName);
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
                            onPartnershipClick(value);
                          }}
                        />
                      )}
                      <DiscoverApplicationsSelectionValue isSelected={isSelected} onClick={() => onPartnershipClick(value)}>
                        <DiscoverRegionAddApplicationsContainerImage>
                          {value?.storageLocation ? (
                            <img style={{ width: '5rem', objectFit: 'scale-down' }} src={value?.storageLocation} alt="logo" />
                          ) : (
                            <QuestionMarkIcon />
                          )}
                        </DiscoverRegionAddApplicationsContainerImage>
                      </DiscoverApplicationsSelectionValue>
                      {value.iconName}
                    </DiscoverApplicationsSelectionValueContainer>
                  );
                })}
                <DiscoverRegionsPartnershipAndSuppliersListValue>
                  <DiscoverRegionStateBubbleAddContainer style={{ padding: '0px' }} onClick={handleAddParnershipClick} onKeyDown={handleAddParnershipClick}>
                    <DiscoverRegionStateBubbleContainerIcon style={{ width: '8rem', height: '6.25rem' }}>
                      <DiscoverRegionStateBubbleContainerIconCircle style={{ padding: '0.7rem' }}>
                        <DiscoverRegionStateBubbleContainerIconCircle style={{ padding: '0.2rem' }}>
                          <AddIcon />
                        </DiscoverRegionStateBubbleContainerIconCircle>
                      </DiscoverRegionStateBubbleContainerIconCircle>
                    </DiscoverRegionStateBubbleContainerIcon>
                    <div>Add {buttonText}</div>
                  </DiscoverRegionStateBubbleAddContainer>
                </DiscoverRegionsPartnershipAndSuppliersListValue>
              </DiscoverRegionsPartnershipAndSuppliersListWrapper>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="270px"
                customMinHeight="60px"
                onClickFunc={() => {
                  dispatch(resetAddRegionPartnershipAndSuppliersMode());
                  reset();
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText={`Add ${buttonText}`}
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="270px"
                customMinHeight="60px"
              />
            </DiscoverRegionsSetRequirementsPanelActionWrapper>
          </DiscoverRegionsSetRequirementsPanelForm>
        </Box>
      </form>
      <AddArtifactLibraryIconPanel />
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

DiscoverRegionsAddPartnershipAndSuppliers.prototype = {};

DiscoverRegionsAddPartnershipAndSuppliers.defaultProps = {};

export default DiscoverRegionsAddPartnershipAndSuppliers;

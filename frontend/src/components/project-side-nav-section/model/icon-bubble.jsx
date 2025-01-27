import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionMark } from '@mui/icons-material';
import {
  DiscoverRegionStateBubbleContainer,
  DiscoverRegionStateBubbleContainerIcon,
  DiscoverRegionStateBubbleContainerImage,
} from '../discover/discover-regions/discover-region-section-styled';
import {
  ArtifactLibraryIconContainer,
  ArtifactLibraryIcon,
} from '../../my-accout/admin-panel/artifact-library/artifact-library-icons/artifact-library-icon-styled';
import { getTrueAllActiveIcons } from '../../../features/selectors/artifactIcon';
import { DISCOVER_REGION_FIELDS, MODEL_DETAIL_TYPE, HOSTING_PREFERNCES, BUTTON_STYLE, BUTTON_ICON } from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import { IconBubbleImageContainer, IconBubbleMainWrapper, IconBubbleText, SpecialClusterIconBubbleMainWrapper } from './model-styled';
import CustomButton from '../../form-elements/custom-button';
import { getActiveDetail, getSelectedDetailsFromProject } from '../../../features/selectors/ui';
import { mergeRegions } from '../../../utils/utils';

function IconBubble({ detail, addMargin, selected, onClick, icon, small, highlightThis, specialClusterIcon }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const activeDetail = useSelector(getActiveDetail);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);

  // const
  const currentColor = 'var(--color-imperial)';
  const futureColor = 'var(--color-future)';
  const selectedCurrentColor = '#f3edfd';
  const selectedFutureColor = '#fcf1f1';
  const useFutureColor = detail.isFuture?.[0] && detail.isFuture?.length === 1;
  const hasFuture = detail.isFuture?.length === 2;
  const hideBorder =
    !activeDetail?.companionId ||
    !detail?.extras?.[activeDetail.type] ||
    !Object.values(detail?.extras?.[activeDetail.type])?.includes(activeDetail?.companionId);
  const selectedColor = useFutureColor ? selectedFutureColor : selectedCurrentColor;
  const defaultColor = useFutureColor ? futureColor : currentColor;
  let xColor = detail?.isFuture?.length >= 2 ? '#000000' : false;
  if (!xColor) {
    xColor = detail?.isFuture?.[0] ? futureColor : currentColor;
  }
  const BLC = hasFuture ? currentColor : defaultColor;
  const BTC = hasFuture ? currentColor : defaultColor;
  const BRC = hasFuture ? futureColor : defaultColor;
  const BBC = hasFuture ? futureColor : defaultColor;

  const handleClick = function () {
    if (onClick) {
      onClick();
    }
  };

  const activeIcons = useSelector(getTrueAllActiveIcons);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!activeIcons || activeIcons.length === 0) {
      dispatch(backendService.getTrueAllActiveIcon({}));
    }
  }, [activeIcons]);

  useEffect(() => {
    setPreviewUrl(
      icon
        ? icon.storageLocation
        : activeIcons.find(e => {
            if (detail?.onRamp) {
              const foundOnRampParent = mergeRegions(detailsFromSelectedProject)?.find(
                d =>
                  detail?.onRamp &&
                  d?.extras?.active &&
                  d?.extras?.onRamps?.find(
                    r => r.name === detail?.name && r?.centroid_latitude === detail?.centroid_latitude && r?.centroid_longitude === detail?.centroid_longitude
                  ) &&
                  d?.named === detail?.cloud_region
              );
              const cloudName = foundOnRampParent?.extras?.cloud || '';
              const onRampIconName = `${cloudName} onramp`;
              return e?.tag === 'onramps' && e?.iconName?.toLowerCase() === onRampIconName?.toLowerCase();
            }
            if (detail.type === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
              return e.iconName === detail.extras?.hosting;
            }
            if (detail.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS) {
              return e.iconName === detail.extras?.officeType;
            }
            if (detail.type === MODEL_DETAIL_TYPE) {
              if (detail?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS) {
                return e.iconName === detail?.extras?.cloud;
              }
              return e.iconName === HOSTING_PREFERNCES[0];
            }
            return e.iconName === detail.named;
          })?.storageLocation
    );
  }, [activeIcons, detail, setPreviewUrl]);

  if (specialClusterIcon) {
    return (
      <SpecialClusterIconBubbleMainWrapper>
        <ArtifactLibraryIconContainer>
          <ArtifactLibraryIcon style={{ width: '40px', height: '40px' }} imgUrl={previewUrl}>
            {previewUrl ? '' : <QuestionMark />}
          </ArtifactLibraryIcon>
        </ArtifactLibraryIconContainer>
      </SpecialClusterIconBubbleMainWrapper>
    );
  }

  if (small) {
    return (
      <IconBubbleMainWrapper
        key={`${icon ? icon.id : detail?.id}`}
        addMargin={addMargin}
        highlightThis={highlightThis}
        onClick={() => {
          handleClick();
        }}>
        <IconBubbleImageContainer
          borderLeftColor={hasFuture ? currentColor : BLC}
          borderTopColor={hasFuture ? currentColor : BTC}
          borderRightColor={hasFuture ? futureColor : BRC}
          borderBottomColor={hasFuture ? futureColor : BBC}>
          <ArtifactLibraryIconContainer>
            <ArtifactLibraryIcon style={{ width: '40px', height: '40px' }} imgUrl={previewUrl}>
              {previewUrl ? '' : <QuestionMark />}
            </ArtifactLibraryIcon>
          </ArtifactLibraryIconContainer>
        </IconBubbleImageContainer>
      </IconBubbleMainWrapper>
    );
  }

  return (
    <DiscoverRegionStateBubbleContainer
      key={`${icon ? icon.id : detail?.id}`}
      onClick={() => {
        handleClick();
      }}
      style={{
        cursor: 'pointer',
        height: '140px',
        marginLeft: addMargin ? '5px' : '0',
        marginRight: addMargin ? '5px' : '0',
      }}>
      <DiscoverRegionStateBubbleContainerIcon
        style={{
          background: selected ? selectedColor : 'var(--color-la-luna)',
          border: hideBorder ? 'unset' : '1px solid',
          borderLeftColor: !hideBorder && BLC,
          borderTopColor: !hideBorder && BTC,
          borderRightColor: !hideBorder && BRC,
          borderBottomColor: !hideBorder && BBC,
          borderRadius: '12px',
        }}>
        <DiscoverRegionStateBubbleContainerImage>
          <ArtifactLibraryIconContainer>
            {selected && (
              <CustomButton
                buttonStyle={BUTTON_STYLE.DISCOVER_REGION_REMOVE_STYLE}
                icon={BUTTON_ICON.CANCEL}
                bgColor={xColor}
                useColor="var(--color-la-luna)"
                borderRadius="20px"
                type="button"
                customMinWidth="25px"
                customMinHeight="25px"
                customMarginLeft="60px"
                customMarginTop="-5px"
                onClickFunc={() => handleClick()}
              />
            )}
            <ArtifactLibraryIcon imgUrl={previewUrl}>{previewUrl ? '' : <QuestionMark />}</ArtifactLibraryIcon>
          </ArtifactLibraryIconContainer>
        </DiscoverRegionStateBubbleContainerImage>
      </DiscoverRegionStateBubbleContainerIcon>
      <IconBubbleText textColor={useFutureColor ? futureColor : currentColor}>{icon ? icon.iconName : detail?.named}</IconBubbleText>
    </DiscoverRegionStateBubbleContainer>
  );
}

IconBubble.prototype = {};

IconBubble.defaultProps = {
  detail: {
    isFuture: [],
  },
  addMargin: false,
  icon: false,
  small: false,
};

export default IconBubble;

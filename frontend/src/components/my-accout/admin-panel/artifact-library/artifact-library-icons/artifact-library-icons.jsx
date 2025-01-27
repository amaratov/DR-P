import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Fade from '@mui/material/Fade';
import { CircularProgress } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  ArtifactLibraryIcon,
  ArtifactLibraryIconContainer,
  ArtifactLibraryIconDisplayClick,
  ArtifactLibraryIconsItem,
  ArtifactLibraryIconsItemMoreMenu,
  ArtifactLibraryIconsItemTags,
  ArtifactLibraryIconsItemThumbnail,
  ArtifactLibraryIconsItemTitle,
  ArtifactLibraryIconsWrapper,
} from './artifact-library-icon-styled';
import MoreMenuButton from '../../../../more-menu-button/more-menu-button';
import NoResultsPage from '../../../../../Pages/no-results-page/no-results-page';
import { getFilterParams, isEmpty } from '../../../../../utils/utils';
import { getRecentlyAdded, getSelectedFilterFacets, getRecentlyEdited, getPageNum, getSortOrder } from '../../../../../features/selectors/ui';
import { setPage, setRecentlyAdded, setRecentlyEdited } from '../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../services/backend';
import {
  getAllActiveIcons,
  getAllArchivedIcons,
  getIconSearchResults,
  getIsLoadingIcons,
  getNumPagesForIcons,
  getUpdateIconData,
} from '../../../../../features/selectors/artifactIcon';
import { resetIconSearch, resetUpdateIconData } from '../../../../../features/slices/artifactIconSlice';
import { CircularProgressContainer } from '../../../../app/app-styled';
import CustomTablePagination from '../../../../table-pagination/custom-table-pagination';
import { TABS } from '../../../../../utils/constants/constants';

function ArtifactLibraryIcons({ activeTab, ignoreNoResults, showArchived, searchText, resetSearchBar, resetFilters }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const allActiveIcons = useSelector(getAllActiveIcons);
  const allArchivedIcons = useSelector(getAllArchivedIcons);
  const iconSearchResults = useSelector(getIconSearchResults);
  const recentlyAdded = useSelector(getRecentlyAdded);
  const recentlyEdited = useSelector(getRecentlyEdited);
  const isLoadingIcons = useSelector(getIsLoadingIcons);
  const filterFacets = useSelector(getSelectedFilterFacets);
  const updateIconData = useSelector(getUpdateIconData);
  const numPages = useSelector(getNumPagesForIcons);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);

  // const
  const DEFAULT_ORDER_BY = 'iconName';
  const iconResults = showArchived ? allArchivedIcons : allActiveIcons;
  const availableArtifactIcons = !isEmpty(searchText) ? iconSearchResults : iconResults;
  const hasRecentlyAddedItem = availableArtifactIcons?.some(artifactIcon => !isEmpty(recentlyAdded) && artifactIcon?.id === recentlyAdded);
  const hasRecentlyEditedItem = availableArtifactIcons?.some(artifactIcon => !isEmpty(recentlyEdited) && artifactIcon?.id === recentlyEdited);

  // func
  const sortByIconName = (a, b) => {
    const aName = a?.iconName.toLowerCase() || '';
    const bName = b?.iconName.toLowerCase() || '';
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  };

  const handleDownload = useCallback(
    iconDetails => {
      dispatch(backendService.downloadIcon(iconDetails));
    },
    [dispatch]
  );

  const handleSetPage = useCallback(
    val => {
      const archived = activeTab === TABS.ARCHIVED_ARTIFACT;
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      const params = getFilterParams(filterFacets, archived, pageNum);
      params.order = [[DEFAULT_ORDER_BY, order]];
      dispatch(backendService.getAllActiveIcon(params));
      dispatch(setPage(val - 1));
    },
    [dispatch, filterFacets, activeTab, order]
  );

  // effect
  // clear search on component init and unmount
  useEffect(() => {
    resetSearchBar();
    resetFilters();
    return () => {
      resetSearchBar();
      resetFilters();
      dispatch(resetIconSearch());
    };
  }, [resetSearchBar, resetFilters, dispatch]);

  useEffect(() => {
    const archived = activeTab === TABS.ARCHIVED_ARTIFACT;
    const params = getFilterParams(filterFacets, archived);
    params.order = [[DEFAULT_ORDER_BY, order]];
    if (showArchived) dispatch(backendService.getAllArchivedIcon(params));
    else dispatch(backendService.getAllActiveIcon(params));
  }, [dispatch, showArchived, filterFacets, activeTab, order]);

  useEffect(() => {
    if (hasRecentlyAddedItem) {
      setTimeout(() => {
        dispatch(setRecentlyAdded(''));
      }, 30000);
    }
  }, [dispatch, availableArtifactIcons, hasRecentlyAddedItem]);

  useEffect(() => {
    if (hasRecentlyEditedItem) {
      setTimeout(() => {
        dispatch(setRecentlyEdited(''));
      }, 30000);
    }
  }, [dispatch, availableArtifactIcons, hasRecentlyEditedItem]);

  useEffect(() => {
    // timeout for storageLocation updates
    if (updateIconData) {
      setTimeout(() => {
        dispatch(backendService.getIconById(updateIconData));
      }, 5000);
    }
  }, [dispatch, updateIconData]);

  if (isLoadingIcons || availableArtifactIcons === null) {
    return (
      <CircularProgressContainer customPaddingTop="250px">
        <CircularProgress />
      </CircularProgressContainer>
    );
  }
  if (!ignoreNoResults && isEmpty(availableArtifactIcons) && !isLoadingIcons) {
    return <NoResultsPage activeTab={activeTab} />;
  }
  return (
    <>
      <ArtifactLibraryIconsWrapper>
        {!isEmpty(availableArtifactIcons) &&
          [...availableArtifactIcons]?.sort(sortByIconName).map(artifactIcon => {
            return (
              <ArtifactLibraryIconsItem>
                <ArtifactLibraryIconsItemThumbnail>
                  <ArtifactLibraryIconsItemMoreMenu>
                    <MoreMenuButton isArtifactIcon rowDetails={artifactIcon} />
                  </ArtifactLibraryIconsItemMoreMenu>
                  {!isEmpty(recentlyAdded) && recentlyAdded === artifactIcon?.id && (
                    <Fade in={recentlyAdded === artifactIcon?.id} mountOnEnter unmountOnExit timeout={500}>
                      <ArtifactLibraryIconsItemTags>New</ArtifactLibraryIconsItemTags>
                    </Fade>
                  )}
                  {!isEmpty(recentlyEdited) && recentlyEdited === artifactIcon?.id && (
                    <Fade in={recentlyEdited === artifactIcon?.id} mountOnEnter unmountOnExit timeout={500}>
                      <ArtifactLibraryIconsItemTags isEdited>Edited</ArtifactLibraryIconsItemTags>
                    </Fade>
                  )}
                  <ArtifactLibraryIconContainer>
                    <ArtifactLibraryIcon imgUrl={artifactIcon?.storageLocation}>{!artifactIcon?.storageLocation && <QuestionMarkIcon />}</ArtifactLibraryIcon>
                    <ArtifactLibraryIconDisplayClick onClick={() => handleDownload(artifactIcon)} onKeyDown={() => handleDownload(artifactIcon)} />
                  </ArtifactLibraryIconContainer>
                </ArtifactLibraryIconsItemThumbnail>
                <ArtifactLibraryIconsItemTitle>{artifactIcon?.iconName || 'unknown'}</ArtifactLibraryIconsItemTitle>
              </ArtifactLibraryIconsItem>
            );
          })}
      </ArtifactLibraryIconsWrapper>
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page + 1} />}
    </>
  );
}

ArtifactLibraryIcons.prototype = {
  ignoreNoResults: PropTypes.bool,
  showArchived: PropTypes.bool,
  activeTab: PropTypes.string,
  searchText: PropTypes.string,
  resetSearchBar: PropTypes.func,
  resetFilters: PropTypes.func,
};

ArtifactLibraryIcons.defaultProps = {
  ignoreNoResults: false,
  showArchived: false,
  activeTab: '',
  searchText: '',
  resetSearchBar: () => {},
  resetFilters: () => {},
};

export default ArtifactLibraryIcons;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../../../utils/utils';
import NoResultsPage from '../../../../Pages/no-results-page/no-results-page';
import { getAllArchivedIcons } from '../../../../features/selectors/artifactIcon';
import { backendService } from '../../../../services/backend';
import ArtifactLibraryIcons from '../artifact-library/artifact-library-icons/artifact-library-icons';
import { ArtifactLibraryArchivesMainWrapper, ArtifactLibraryArchivesSectionHeader } from './artifact-library-archives-styled';
import { getAllArchivedMarketings } from '../../../../features/selectors/marketing';
import { getAllArchivedReferenceDoc } from '../../../../features/selectors/referenceArchitecture';
import MarketingList from '../artifact-library/marketing/marketing-list';
import ReferenceArchitectureList from '../artifact-library/reference-architecture/reference-architecture-list';

function ArtifactLibraryArchives({ activeTab, resetSearchBar, resetFilters }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const archivedMarketings = useSelector(getAllArchivedMarketings);
  const archivedReferences = useSelector(getAllArchivedReferenceDoc);
  const archivedIcons = useSelector(getAllArchivedIcons);

  // effect
  useEffect(() => {
    dispatch(backendService.getAllArchivedMarketings({}));
    dispatch(backendService.getAllArchivedReferenceArchitecture({}));
    dispatch(backendService.getAllArchivedIcon());
  }, [dispatch]);

  useEffect(() => {
    resetSearchBar();
    resetFilters();
    return () => {
      resetSearchBar();
      resetFilters();
    };
  }, [resetSearchBar, resetFilters]);

  if (isEmpty(archivedMarketings) && isEmpty(archivedReferences) && isEmpty(archivedIcons)) {
    return <NoResultsPage activeTab={activeTab} />;
  }
  return (
    <ArtifactLibraryArchivesMainWrapper>
      {!isEmpty(archivedMarketings) && (
        <>
          <ArtifactLibraryArchivesSectionHeader>Marketing</ArtifactLibraryArchivesSectionHeader>
          <MarketingList ignoreNoResults showArchived isArchived searchText="" />
          <div style={{ marginBottom: '40px', width: '100%' }} />
        </>
      )}
      {!isEmpty(archivedReferences) && (
        <>
          <ArtifactLibraryArchivesSectionHeader>Reference Architecture</ArtifactLibraryArchivesSectionHeader>
          <ReferenceArchitectureList ignoreNoResults isArchived showArchived searchText="" />
          <div style={{ marginBottom: '40px', width: '100%' }} />
        </>
      )}
      {!isEmpty(archivedIcons) && (
        <>
          <ArtifactLibraryArchivesSectionHeader>Icons</ArtifactLibraryArchivesSectionHeader>
          <ArtifactLibraryIcons ignoreNoResults showArchived />
        </>
      )}
    </ArtifactLibraryArchivesMainWrapper>
  );
}

ArtifactLibraryArchives.prototype = {
  activeTab: PropTypes.string,
  resetSearchBar: PropTypes.func,
  resetFilters: PropTypes.func,
};

ArtifactLibraryArchives.defaultProps = {
  activeTab: '',
  resetSearchBar: () => {},
  resetFilters: () => {},
};

export default ArtifactLibraryArchives;

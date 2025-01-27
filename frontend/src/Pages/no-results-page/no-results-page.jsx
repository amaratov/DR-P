import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getUserInformation } from '../../features/selectors';
import { NoResultBodySubText, NoResultBodyText, NoResultHeader, NoResultIconContainer, NoResultWrapper } from './no-results-page-styled';
import { TABS } from '../../utils/constants/constants';
import FileFolderIcon from '../../images/file_folder_icon.svg';

function NoResultsPage({ showSearch, activeTab }) {
  const userInfo = useSelector(getUserInformation);

  const emailAddress = activeTab === TABS.PROJECT_BRIEFCASE ? 'administrator@drmodeler.com' : 'pdxmodeler-admin@digitalrealty.com';

  if (showSearch) {
    return <NoResultBodyText>No Matching Results</NoResultBodyText>;
  }
  const renderBodyText = () => {
    switch (activeTab) {
      case TABS.MY_COMPANIES:
        return 'Looks like there are no active projects and companies that you are associated with.';
      case TABS.ALL_COMPANIES:
        return 'Looks like there are no companies listed in your account.';
      case TABS.ARCHIVED_COMPANIES:
        return 'Looks like there are no archived projects and companies, everything is still active!';
      case TABS.ACTIVE_USER:
        return 'Looks like there are no active users in your contact book. Add a user to get started!';
      case TABS.ARCHIVED_USER:
        return 'Looks like there are no archived users here, check back later!';
      case `${TABS.ACTIVE_INDUSTRY_VERTICAL} Industry Vertical`:
        return 'Looks like there are no active industry verticals here. Add an industry vertical to get started!';
      case `${TABS.ACTIVE_USE_CASE} Use Case`:
        return 'Looks like there are no active use cases here. Add a use case to get started!';
      case TABS.ICONS:
        return 'Looks like there are no active icons here. Add an icon to get started!';
      case TABS.REFERENCE_ARCHITECTURE:
        return 'Looks like there are no active reference architectures here. Add one to get started!';
      case TABS.ARCHIVED_ARTIFACT:
        return 'Looks like there are no archived artifacts here, check back later!';
      case TABS.BRIEFS:
        return 'Looks like there are no marketing materials added to the briefcase yet, add one to get started!';
      case TABS.PROJECT_BRIEFCASE:
        return 'Looks like nothing has been posted to the project briefcase yet, add one to get started!';
      case TABS.SOLUTION_BRIEF:
        return 'Looks like no brief has been generated yet, generate one to get started!';
      case TABS.REGIONS:
        return 'Looks like there are no regions created yet for this project.';
      default:
        return 'Looks like there are no results found.';
    }
  };

  return (  
    <NoResultWrapper>
      <NoResultIconContainer>
        <img src={FileFolderIcon} alt="logo" />
      </NoResultIconContainer>
      <NoResultHeader>Hi {userInfo.firstName}!</NoResultHeader>
      <NoResultBodyText>{renderBodyText()}</NoResultBodyText>
      <NoResultBodySubText>
        If you feel this is an error contact{' '}
        <a style={{ textDecoration: 'none' }} href={`mailto:${emailAddress}`}>
          {emailAddress}
        </a>
      </NoResultBodySubText>
    </NoResultWrapper>
  );
}

NoResultsPage.propTypes = {
  showSearch: PropTypes.bool,
  activeTab: PropTypes.string,
};

NoResultsPage.defaultProps = {
  showSearch: false,
  activeTab: '',
};

export default NoResultsPage;

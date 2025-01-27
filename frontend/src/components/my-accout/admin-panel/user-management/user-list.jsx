import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import { Box, Button, CircularProgress, Pagination } from '@mui/material';
import {
  UserListInitialText,
  UserListItemMainContainer,
  UserListItemTextInner,
  UserListPrimaryText,
  UserListRoleContainer,
  UserListSecondaryText,
  UserListWrapper,
} from './user-list-styled';
import { isEmpty, wrapTextWithTags } from '../../../../utils/utils';
import MoreMenuButton from '../../../more-menu-button/more-menu-button';
import CustomChip from '../../../chip/custom-chip';
import CustomButton from '../../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../../utils/constants/constants';
import { backendService } from '../../../../services/backend';
import NoResultsPage from '../../../../Pages/no-results-page/no-results-page';
import { SidePanelAddOrRemoveIcon } from '../../../side-panel/side-panel-styled';
import { getIsLoadingUser } from '../../../../features/selectors';
import { CircularProgressContainer } from '../../../app/app-styled';

function UserList({ usersObj, searchText, additionalValues, handleClick, isAssociatedUserPanel, activeTab, page, pageOnChange, numOfPages }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const isLoadingUser = useSelector(getIsLoadingUser);

  // func
  const handleUserClick = useCallback(
    usr => {
      if (!isAssociatedUserPanel) dispatch(backendService.getUserById(usr?.id));
    },
    [dispatch, isAssociatedUserPanel]
  );

  const renderSecondaryAction = usr => {
    if (isAssociatedUserPanel) {
      const hasVal = additionalValues?.associatedUsers?.find(el => el?.id === usr?.id);
      return (
        <SidePanelAddOrRemoveIcon>
          <CustomButton
            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
            icon={hasVal ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
            type="button"
            onClickFunc={() => handleClick(usr, 'associatedUsers')}
          />
        </SidePanelAddOrRemoveIcon>
      );
    }
    return <MoreMenuButton rowDetails={usr} isUserDetails />;
  };

  if (isLoadingUser || usersObj === null) {
    return (
      <CircularProgressContainer customPaddingTop="250px">
        <CircularProgress />
      </CircularProgressContainer>
    );
  }

  return isEmpty(usersObj) && !isLoadingUser ? (
    <NoResultsPage showSearch={!isEmpty(searchText)} activeTab={activeTab} />
  ) : (
    <>
      <UserListWrapper subheader={<li />} isAssociatedUserPanel={isAssociatedUserPanel}>
        {Object.keys(usersObj).map(sectionId => (
          <li key={`section-${sectionId}`} style={{ marginBottom: '24px' }}>
            <ul>
              <UserListInitialText disableGutters disableSticky>
                {sectionId}
              </UserListInitialText>
              {usersObj[sectionId].map(usr => (
                <ListItem disableGutters key={`list-item-${sectionId}-${usr?.id.split('-')[0]}`} divider secondaryAction={renderSecondaryAction(usr)}>
                  <UserListItemMainContainer>
                    <Tooltip title={`${usr?.firstName} ${usr?.lastName}`} placement="bottom-start">
                      <UserListItemTextInner isAssociatedUserPanel={isAssociatedUserPanel} onClick={() => handleUserClick(usr)}>
                        <UserListSecondaryText isAssociatedUserPanel={isAssociatedUserPanel}>
                          {wrapTextWithTags(usr?.firstName, searchText)}
                        </UserListSecondaryText>{' '}
                        <UserListPrimaryText>{wrapTextWithTags(usr?.lastName, searchText)}</UserListPrimaryText>
                      </UserListItemTextInner>
                    </Tooltip>
                    <UserListRoleContainer>
                      <CustomChip label={usr?.role.toLowerCase()} />
                    </UserListRoleContainer>
                  </UserListItemMainContainer>
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </UserListWrapper>
      <Box backgroundColor="rgb(240, 236, 252)" display="flex" justifyContent="center" width="100%">
        <Pagination boundaryCount={2} color="primary" count={numOfPages} onChange={pageOnChange} page={page} />
      </Box>
    </>
  );
}

UserList.propTypes = {
  usersObj: PropTypes.shape({}).isRequired,
  searchText: PropTypes.string,
  activeTab: PropTypes.string,
  isAssociatedUserPanel: PropTypes.bool,
  additionalValues: PropTypes.shape({ associatedUsers: PropTypes.shape([]) }),
  handleClick: PropTypes.func,
};

UserList.defaultProps = {
  searchText: '',
  activeTab: '',
  isAssociatedUserPanel: false,
  additionalValues: { associatedUsers: [] },
  handleClick: () => {},
};

export default UserList;

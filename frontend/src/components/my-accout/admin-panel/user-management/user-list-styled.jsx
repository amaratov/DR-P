import styled from '@emotion/styled';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';

export const UserListWrapper = styled(List)`
  background-color: ${({ isAssociatedUserPanel }) => (isAssociatedUserPanel ? '#f0ecfc' : '#ffffff')};

  position: relative;
  ul {
    padding: 0;
  }
  li:nth-of-type(2) {
    padding-top: 0;
  }
  ${({ isAssociatedUserPanel }) =>
    !isAssociatedUserPanel &&
    `
      width: 100%;
      border: 8px solid #f1f1f8;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
      border-radius: 30px;
      padding: 24px;
  `};
`;

export const UserListItemMainContainer = styled(ListItemText)`
  span {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
`;

export const UserListItemTextInner = styled.div`
  min-width: 100px;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  cursor: ${({ isAssociatedUserPanel }) => (isAssociatedUserPanel ? 'default' : 'pointer')};
`;

export const UserListSecondaryText = styled.div`
  display: flex;
  flex-wrap: nowrap;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-cathedral);
  margin-right: 6px;
`;

export const UserListPrimaryText = styled.div`
  display: flex;
  flex-wrap: nowrap;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const UserListInitialText = styled(ListSubheader)`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  padding-top: 15px;
  color: var(--color-batman);
`;

export const UserListRoleContainer = styled.div`
  display: flex;
  align-items: start;
  min-width: 150px;
`;

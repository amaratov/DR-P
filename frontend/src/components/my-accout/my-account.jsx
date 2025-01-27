import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sticky from '../sticky/sticky';
import { MyAccountWrapper } from './my-account-styled';
import AccountInfo from './account-info/account-info';
import { backendService } from '../../services/backend';
import { getAllRoles, getUserInformation } from '../../features/selectors';
import { isEmpty } from '../../utils/utils';

function MyAccount() {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInformation);
  const allRoles = useSelector(getAllRoles);

  useEffect(() => {
    if (isEmpty(userInfo)) dispatch(backendService.whoami());
    if (isEmpty(allRoles)) dispatch(backendService.getRoles());
  }, [userInfo, allRoles, dispatch]);

  return (
    <MyAccountWrapper>
      <Sticky />
      <AccountInfo userInfo={userInfo} allRoles={allRoles} />
    </MyAccountWrapper>
  );
}

export default MyAccount;

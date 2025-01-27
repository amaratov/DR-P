import { createDraftSafeSelector } from '@reduxjs/toolkit';
import { isEmpty } from '../../utils/utils';
import { FEATURE_CONFIG } from '../../utils/constants/constants';

export const getIsUserLoggedIn = state => state?.user?.isLoggedIn;
export const getLoginError = state => state?.user?.loginError;
export const getAllUsers = state => state?.user?.allUsers;
export const getSearchedUsers = state => state?.user?.searchedUsers;
export const getAllRoles = state => state?.user?.allRoles;
export const getWhoAmI = state => state?.user?.whoami;
export const getHasRolesLoaded = state => state?.user?.hasRolesLoaded;
export const getResetPasswordSuccess = state => state?.user?.resetPasswordSuccess;
export const getIsLoadingUser = state => state?.user?.isLoadingUser;

export const getUserInformation = createDraftSafeSelector(getWhoAmI, whoami => {
  if (isEmpty(whoami)) return {};
  return {
    firstName: whoami.firstName,
    lastName: whoami.lastName,
    email: whoami.email,
    phone: whoami.phone,
    role: whoami.role?.name,
  };
});

export const getAllUsersSorted = createDraftSafeSelector(getAllUsers, getAllRoles, (allUsers, allRoles) => {
  return allUsers?.users?.reduce((acc, usr) => {
    const lastNameInitial = usr?.lastName?.charAt(0).toUpperCase() || '';
    const userRole = usr?.fullRole ? usr?.fullRole?.name : allRoles.find(role => role?.id === usr?.role)?.name;
    const usrWithReadableRole = {
      ...usr,
      role: userRole || '',
    };

    acc[lastNameInitial] = acc[lastNameInitial] || [];
    acc[lastNameInitial].push(usrWithReadableRole);

    return acc;
  }, {});
});

export const getSearchedUsersSorted = createDraftSafeSelector(
  getAllUsers,
  getAllRoles,
  getSearchedUsers,
  (_, searchObj) => searchObj,
  (allUsers, allRoles, searchedUsers, searchObj) => {
    const keywords = searchObj?.searchText || '';
    let users = !isEmpty(keywords) ? searchedUsers : allUsers?.users;
    if (allUsers?.users?.length < 1) return {};
    if (!isEmpty(searchObj?.filterTerms)) {
      users = allUsers?.users.filter(usr => searchObj?.filterTerms?.includes(usr?.fullRole?.name?.toLowerCase()));
    }

    return users?.reduce((acc, usr) => {
      const lastNameInitial = usr?.lastName?.charAt(0).toUpperCase() || '';
      const userRole = usr?.fullRole ? usr?.fullRole?.name : allRoles.find(role => role?.id === usr?.role)?.name;
      const usrWithReadableRole = {
        ...usr,
        role: userRole || '',
      };
      acc[lastNameInitial] = acc[lastNameInitial] || [];
      acc[lastNameInitial].push(usrWithReadableRole);

      return acc;
    }, {});
  }
);

export const getAssociatedUsers = createDraftSafeSelector(getAllUsers, allUsers => {
  return (allUsers?.users || []).reduce((acc, usr) => {
    const lastNameInitial = usr?.lastName?.charAt(0).toUpperCase() || '';
    const isArchived = usr?.archived;
    const isCustomer = usr?.fullRole?.name.toLowerCase() === 'customer';
    const usrWithReadableRole = {
      ...usr,
      role: usr?.fullRole?.name || '',
    };

    acc.drTeam = acc.drTeam || {};
    acc.customers = acc.customers || {};

    if (!isArchived) {
      if (!isCustomer) {
        acc.drTeam[lastNameInitial] = acc.drTeam[lastNameInitial] || [];
        acc.drTeam[lastNameInitial].push(usrWithReadableRole);
      } else {
        acc.customers[lastNameInitial] = acc.customers[lastNameInitial] || [];
        acc.customers[lastNameInitial].push(usrWithReadableRole);
      }
    }

    return acc;
  }, {});
});

export const getSearchedAssociatedUsers = createDraftSafeSelector(
  getAllUsers,
  getSearchedUsers,
  (_, searchObj) => searchObj,
  (allUsers, searchedUsers, searchObj) => {
    const keywords = searchObj?.searchText || '';
    let users = !isEmpty(keywords) ? searchedUsers : allUsers?.users;
    if ((allUsers?.users || []).length < 1) return {};
    if (!isEmpty(searchObj?.filterTerms)) {
      users = allUsers?.users.filter(usr => searchObj?.filterTerms?.includes(usr?.fullRole?.name?.toLowerCase()));
    }
    return users.reduce((acc, usr) => {
      const lastNameInitial = usr?.lastName?.charAt(0).toUpperCase() || '';
      const isArchived = usr?.archived;
      const isCustomer = usr?.fullRole?.name.toLowerCase() === 'customer';
      const usrWithReadableRole = {
        ...usr,
        role: usr?.fullRole?.name || '',
      };

      acc.drTeam = acc.drTeam || {};
      acc.customers = acc.customers || {};

      if (!isArchived) {
        if (!isCustomer) {
          acc.drTeam[lastNameInitial] = acc.drTeam[lastNameInitial] || [];
          acc.drTeam[lastNameInitial].push(usrWithReadableRole);
        } else {
          acc.customers[lastNameInitial] = acc.customers[lastNameInitial] || [];
          acc.customers[lastNameInitial].push(usrWithReadableRole);
        }
      }

      return acc;
    }, {});
  }
);

export const canAccessAddFeature = createDraftSafeSelector(getWhoAmI, whoami => {
  if (isEmpty(whoami)) return false;
  const userRole = whoami?.role?.name;
  return !['customer', 'solutions engineer', 'marketing', 'sales'].includes(userRole?.toLowerCase());
});

// will refine for better structure
export const canAccessFeature = createDraftSafeSelector(
  getWhoAmI,
  (_, feature) => feature,
  (whoami, feature) => {
    const userRole = whoami?.role?.name;
    // admin should have access to everything, solutions architect has admin-like permissions in version 1
    if (userRole?.toLowerCase() === 'admin' || userRole?.toLowerCase() === 'solutions architect') {
      return true;
    }
    // check if role is in the access group
    const accessGroup = FEATURE_CONFIG?.[feature]?.access_group || [];
    return accessGroup.includes(userRole?.toLowerCase());
  }
);

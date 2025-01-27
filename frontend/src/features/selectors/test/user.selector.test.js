import * as UserSelectors from '../user';

describe('User Selector Tests', () => {
  const UserState = {
    isLoggedIn: false,
    loginError: false,
    whoami: {},
    allUsers: [],
    allRoles: [],
  };

  describe('getIsUserLoggedIn', () => {
    it('should return initial login state', () => {
      const initial = {
        user: UserState,
      };
      expect(UserSelectors.getIsUserLoggedIn(initial)).toBeFalsy();
    });
    it('should return login state', () => {
      const initial = {
        user: { ...UserState, isLoggedIn: true },
      };
      expect(UserSelectors.getIsUserLoggedIn(initial)).toBeTruthy();
    });
  });

  describe('getLoginError', () => {
    it('should return initial login error', () => {
      const initial = {
        user: UserState,
      };
      expect(UserSelectors.getLoginError(initial)).toBeFalsy();
    });
    it('should return login error', () => {
      const initial = {
        user: { ...UserState, loginError: true },
      };
      expect(UserSelectors.getLoginError(initial)).toBeTruthy();
    });
  });

  describe('getAllUsers', () => {
    it('should return initial allUsers', () => {
      const initial = {
        user: UserState,
      };
      expect(UserSelectors.getAllUsers(initial)).toEqual([]);
    });
    it('should return allUsers', () => {
      const initial = {
        user: { ...UserState, allUsers: [{ username: 'test01' }, { username: 'test02' }] },
      };
      const expected = [{ username: 'test01' }, { username: 'test02' }];
      expect(UserSelectors.getAllUsers(initial)).toEqual(expected);
    });
  });

  describe('getAllRoles', () => {
    it('should return initial allRoles', () => {
      const initial = {
        user: UserState,
      };
      expect(UserSelectors.getAllRoles(initial)).toEqual([]);
    });
    it('should return allRoles', () => {
      const initial = {
        user: { ...UserState, allRoles: [{ name: 'test01' }, { name: 'test02' }] },
      };
      const expected = [{ name: 'test01' }, { name: 'test02' }];
      expect(UserSelectors.getAllRoles(initial)).toEqual(expected);
    });
  });

  describe('getWhoAmI', () => {
    it('should return initial whoami', () => {
      const initial = {
        user: UserState,
      };
      expect(UserSelectors.getWhoAmI(initial)).toEqual({});
    });
    it('should return whoami', () => {
      const initial = {
        user: { ...UserState, whoami: { username: 'test01' } },
      };
      const expected = { username: 'test01' };
      expect(UserSelectors.getWhoAmI(initial)).toEqual(expected);
    });
  });

  describe('getUserInformation', () => {
    it('should return whoami', () => {
      const initial = {
        user: {
          ...UserState,
          whoami: {
            firstName: 'whoami.firstName',
            lastName: 'whoami.lastName',
            email: 'whoami.email',
            phone: 'whoami.phone',
            role: { name: 'whoami.role?.name' },
          },
        },
      };
      const expected = {
        firstName: 'whoami.firstName',
        lastName: 'whoami.lastName',
        email: 'whoami.email',
        phone: 'whoami.phone',
        role: 'whoami.role?.name',
      };
      expect(UserSelectors.getUserInformation(initial)).toEqual(expected);
    });
  });

  describe('getAllUsersSorted', () => {
    it('should return whoami', () => {
      const initial = {
        user: {
          ...UserState,
          allUsers: {
            users: [
              { firstName: 'test02', lastName: 'test', role: '', archived: false },
              { firstName: 'test01', lastName: 'test', role: '', archived: false },
            ],
          },
          allRoles: [{ id: 1, name: 'testRole', archived: false }],
        },
      };
      const expected = {
        T: [
          { firstName: 'test02', lastName: 'test', role: '', archived: false },
          { firstName: 'test01', lastName: 'test', role: '', archived: false },
        ],
      };
      expect(UserSelectors.getAllUsersSorted(initial)).toEqual(expected);
    });
  });
});

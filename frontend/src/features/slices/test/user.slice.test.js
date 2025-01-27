import reducer, { setUserInfo } from '../userSlice';

describe('User Slice Tests', () => {
  describe('setUserInfo', () => {
    it('should set user info', () => {
      const expected = {
        whoami: {
          username: 'test',
          email: 'test@test.com',
        },
      };
      expect(reducer({}, setUserInfo({ username: 'test', email: 'test@test.com' }))).toEqual(expected);
    });
  });
});

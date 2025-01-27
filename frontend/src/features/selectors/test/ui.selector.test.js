import * as UISelectors from '../ui';

describe('UI Selector Tests', () => {
  const UIState = {
    selectedUserDetails: {},
    editMode: '',
    addUserMode: false,
  };

  describe('getSelectedUserDetails', () => {
    it('should return initial user details', () => {
      const initial = {
        ui: UIState,
      };
      const expected = {};
      expect(UISelectors.getSelectedUserDetails(initial)).toEqual(expected);
    });
    it('should return user details', () => {
      const initial = {
        ui: { ...UIState, selectedUserDetails: { firstName: 'test01', lastName: 'test01' } },
      };
      const expected = { firstName: 'test01', lastName: 'test01' };
      expect(UISelectors.getSelectedUserDetails(initial)).toEqual(expected);
    });
  });

  describe('getEditMode', () => {
    it('should return initial editMode', () => {
      const initial = {
        ui: UIState,
      };
      expect(UISelectors.getEditMode(initial)).toEqual('');
    });
    it('should return editMode', () => {
      const initial = {
        ui: { ...UIState, editMode: 'test' },
      };
      expect(UISelectors.getEditMode(initial)).toEqual('test');
    });
  });

  describe('getAddUserMode', () => {
    it('should return initial addUserMode', () => {
      const initial = {
        ui: UIState,
      };
      expect(UISelectors.getAddUserMode(initial)).toBeFalsy();
    });
    it('should return addUserMode', () => {
      const initial = {
        ui: { ...UIState, addUserMode: true },
      };
      expect(UISelectors.getAddUserMode(initial)).toBeTruthy();
    });
  });
});

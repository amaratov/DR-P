import reducer, {
  setSelectedUserDetails,
  setEditMode,
  resetEditMode,
  openAddUserMode,
  resetAddUserMode,
  setSelectedCompanyDetails,
  setSelectedProjectDetails,
  openAddCompanyMode,
  resetAddCompanyMode,
  resetAddProjectMode,
  openAddProjectMode,
} from '../uiSlice';

describe('UI Slice Tests', () => {
  describe('setSelectedUserDetails', () => {
    it('should set selected user details', () => {
      const expected = {
        selectedUserDetails: {
          username: 'test',
          email: 'test@test.com',
        },
      };
      expect(reducer({}, setSelectedUserDetails({ username: 'test', email: 'test@test.com' }))).toEqual(expected);
    });
  });

  describe('setSelectedCompanyDetails', () => {
    it('should set selected company details', () => {
      const expected = {
        selectedCompanyDetails: {
          id: 'test',
          name: 'test',
        },
      };
      expect(reducer({}, setSelectedCompanyDetails({ id: 'test', name: 'test' }))).toEqual(expected);
    });
  });

  describe('setSelectedProjectDetails', () => {
    it('should set selected project details', () => {
      const expected = {
        selectedProjectDetails: {
          id: 'test',
          title: 'test',
        },
      };
      expect(reducer({}, setSelectedProjectDetails({ id: 'test', title: 'test' }))).toEqual(expected);
    });
  });

  describe('setEditMode', () => {
    it('should set edit mode', () => {
      const expected = {
        editMode: 'test',
      };
      expect(reducer({}, setEditMode('test'))).toEqual(expected);
    });
  });

  describe('resetEditMode', () => {
    it('should reset edit mode', () => {
      const expected = {
        editMode: '',
      };
      expect(reducer({}, resetEditMode())).toEqual(expected);
    });
  });

  describe('openAddUserMode', () => {
    it('should open add user mode', () => {
      const expected = {
        addUserMode: true,
      };
      expect(reducer({}, openAddUserMode())).toEqual(expected);
    });
  });

  describe('resetAddUserMode', () => {
    it('should reset add user mode', () => {
      const expected = {
        addUserMode: false,
      };
      expect(reducer({}, resetAddUserMode())).toEqual(expected);
    });
  });

  describe('openAddCompanyMode', () => {
    it('should open add company mode', () => {
      const expected = {
        addCompanyMode: true,
      };
      expect(reducer({}, openAddCompanyMode())).toEqual(expected);
    });
  });

  describe('resetAddCompanyMode', () => {
    it('should reset add user mode', () => {
      const expected = {
        addCompanyMode: false,
      };
      expect(reducer({}, resetAddCompanyMode())).toEqual(expected);
    });
  });

  describe('openAddProjectMode', () => {
    it('should open add project mode', () => {
      const expected = {
        addProjectMode: { open: true, companyDetails: {} },
      };
      expect(reducer({}, openAddProjectMode({}))).toEqual(expected);
    });
  });

  describe('resetAddProjectMode', () => {
    it('should reset add project mode', () => {
      const expected = {
        addProjectMode: { open: false, companyDetails: {} },
      };
      expect(reducer({}, resetAddProjectMode())).toEqual(expected);
    });
  });
});

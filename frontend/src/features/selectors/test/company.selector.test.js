import * as CompanySelectors from '../company';

describe('Company Selector Tests', () => {
  const initialState = {
    companies: [],
    searchedCompanies: [],
    myCompanies: { companies: [] },
    allCompanies: { companies: [] },
    archivedCompanies: { companies: [] },
  };

  describe('getCompanies', () => {
    it('should return initial state of companies', () => {
      const initial = {
        company: initialState,
      };
      const expected = [];
      expect(CompanySelectors.getCompanies(initial)).toEqual(expected);
    });
    it('should return companies', () => {
      const initial = {
        company: { ...initialState, companies: [{ id: '123' }] },
      };
      const expected = [{ id: '123' }];
      expect(CompanySelectors.getCompanies(initial)).toEqual(expected);
    });
  });

  describe('getSearchedCompanies', () => {
    it('should return initial state of searched companies', () => {
      const initial = {
        company: initialState,
      };
      const expected = [];
      expect(CompanySelectors.getSearchedCompanies(initial)).toEqual(expected);
    });
    it('should return searched companies', () => {
      const initial = {
        company: { ...initialState, searchedCompanies: [{ id: '123' }] },
      };
      const expected = [{ id: '123' }];
      expect(CompanySelectors.getSearchedCompanies(initial)).toEqual(expected);
    });
  });

  describe('getAllCompanies', () => {
    it('should return initial state of all companies', () => {
      const initial = {
        company: initialState,
      };
      const expected = [];
      expect(CompanySelectors.getAllCompanies(initial)).toEqual(expected);
    });
    it('should return all companies', () => {
      const initial = {
        company: { ...initialState, allCompanies: { companies: [{ id: '123' }] } },
      };
      const expected = [{ id: '123' }];
      expect(CompanySelectors.getAllCompanies(initial)).toEqual(expected);
    });
  });

  describe('getAllMyCompaniesRaw', () => {
    it('should return initial state of my companies', () => {
      const initial = {
        company: initialState,
      };
      const expected = [];
      expect(CompanySelectors.getAllMyCompaniesRaw(initial)).toEqual(expected);
    });
    it('should return my companies', () => {
      const initial = {
        company: { ...initialState, myCompanies: { companies: [{ id: '123' }] } },
      };
      const expected = [{ id: '123' }];
      expect(CompanySelectors.getAllMyCompaniesRaw(initial)).toEqual(expected);
    });
  });

  describe('getAllActiveCompanies', () => {
    it('should return initial state of all active companies', () => {
      const initial = {
        company: initialState,
      };
      const expected = [];
      expect(CompanySelectors.getAllActiveCompanies(initial)).toEqual(expected);
    });
    it('should return all active companies', () => {
      const initial = {
        company: {
          ...initialState,
          allCompanies: {
            companies: [
              {
                id: '123',
                archived: false,
                name: 'test',
                projects: [],
                createdAt: '',
                updatedAt: '',
                fullCreatedBy: { firstName: 'abc', lastName: 'def' },
                industryVertical: [],
                salesforceId: [],
                associatedUsers: [],
              },
            ],
          },
        },
      };
      const expected = [
        {
          id: '123',
          archived: false,
          name: 'test',
          projects: [],
          createdAt: '',
          updatedAt: '',
          creator: 'abc def',
          industryVertical: [],
          salesforceId: [],
          associatedUsers: [],
        },
      ];
      expect(CompanySelectors.getAllActiveCompanies(initial)).toEqual(expected);
    });
  });

  describe('getAllMyCompanies', () => {
    it('should return initial state of all my companies', () => {
      const initial = {
        company: initialState,
      };
      const expected = [];
      expect(CompanySelectors.getAllMyCompanies(initial)).toEqual(expected);
    });
    it('should return all my companies', () => {
      const initial = {
        company: {
          ...initialState,
          myCompanies: {
            companies: [
              {
                id: '123',
                archived: false,
                name: 'test',
                projects: [],
                createdAt: '',
                updatedAt: '',
                fullCreatedBy: { firstName: 'abc', lastName: 'def' },
                industryVertical: [],
                salesforceId: [],
                associatedUsers: [],
              },
            ],
          },
        },
      };
      const expected = [
        {
          id: '123',
          archived: false,
          name: 'test',
          projects: [],
          createdAt: '',
          updatedAt: '',
          creator: 'abc def',
          industryVertical: [],
          salesforceId: [],
          associatedUsers: [],
        },
      ];
      expect(CompanySelectors.getAllMyCompanies(initial)).toEqual(expected);
    });
  });

  describe('getAllArchivedCompanies', () => {
    it('should return initial state of all archived companies', () => {
      const initial = {
        company: initialState,
      };
      const expected = [];
      expect(CompanySelectors.getAllArchivedCompanies(initial)).toEqual(expected);
    });
    it('should return all archived companies', () => {
      const initial = {
        company: {
          ...initialState,
          allCompanies: {
            companies: [
              {
                id: '123',
                archived: true,
                name: 'test',
                projects: [],
                createdAt: '',
                updatedAt: '',
                fullCreatedBy: { firstName: 'abc', lastName: 'def' },
                industryVertical: [],
                salesforceId: [],
                associatedUsers: [],
              },
            ],
          },
        },
      };
      const expected = [
        {
          id: '123',
          archived: true,
          name: 'test',
          projects: [],
          createdAt: '',
          updatedAt: '',
          creator: 'abc def',
          industryVertical: [],
          salesforceId: [],
          associatedUsers: [],
        },
      ];
      expect(CompanySelectors.getAllArchivedCompanies(initial)).toEqual(expected);
    });
  });
});

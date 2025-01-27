import reducer, { setAllCompanies, setCompanies, setMyCompanies, setSearchedCompanies } from '../companySlice';

describe('Company Slice Tests', () => {
  describe('setCompanies', () => {
    it('should set companies', () => {
      const expected = {
        companies: {},
      };
      expect(reducer({}, setCompanies({}))).toEqual(expected);
    });
  });

  describe('setSearchedCompanies', () => {
    it('should set searched companies', () => {
      const expected = {
        searchedCompanies: {},
      };
      expect(reducer({}, setSearchedCompanies({}))).toEqual(expected);
    });
  });

  describe('setMyCompanies', () => {
    it('should set my companies', () => {
      const expected = {
        myCompanies: {},
      };
      expect(reducer({}, setMyCompanies({}))).toEqual(expected);
    });
  });

  describe('setAllCompanies', () => {
    it('should set all companies', () => {
      const expected = {
        allCompanies: {},
      };
      expect(reducer({}, setAllCompanies({}))).toEqual(expected);
    });
  });
});

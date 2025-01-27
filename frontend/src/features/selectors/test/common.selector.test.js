import * as CommonSelectors from '../common';

describe('Common Selector Tests', () => {
  const initialState = {
    industryVerticals: [],
    hasIndustryVerticalLoaded: false,
  };

  describe('getIndustryVerticals', () => {
    it('should return initial state of industry verticals', () => {
      const initial = {
        common: initialState,
      };
      const expected = [];
      expect(CommonSelectors.getIndustryVerticals(initial)).toEqual(expected);
    });
    it('should return industry verticals', () => {
      const initial = {
        common: { ...initialState, industryVerticals: [{ id: '123' }] },
      };
      const expected = [{ id: '123' }];
      expect(CommonSelectors.getIndustryVerticals(initial)).toEqual(expected);
    });
  });
});

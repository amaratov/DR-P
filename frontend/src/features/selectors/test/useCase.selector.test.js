import * as UseCaseSelectors from '../useCase';

describe('UseCase Selector Tests', () => {
  const initialState = {
    allUseCases: [],
  };

  describe('getAllUseCases', () => {
    it('should return initial state of use cases', () => {
      const initial = {
        useCase: initialState,
      };
      const expected = [];
      expect(UseCaseSelectors.getAllUseCases(initial)).toEqual(expected);
    });
    it('should return use cases', () => {
      const initial = {
        useCase: { ...initialState, allUseCases: [{ id: '123' }] },
      };
      const expected = [{ id: '123' }];
      expect(UseCaseSelectors.getAllUseCases(initial)).toEqual(expected);
    });
  });
});

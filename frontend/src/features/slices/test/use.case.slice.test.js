import reducer, { setAllUseCases, setArchivedUseCases } from '../useCaseSlice';

describe('Use Case Slice Tests', () => {
  describe('setAllUseCases', () => {
    it('should set all unarchived use cases', () => {
      const expected = {
        allUseCases: [],
        hasLoadedUseCases: true,
      };
      expect(reducer({}, setAllUseCases([]))).toEqual(expected);
    });
  });

  describe('setArchivedUseCases', () => {
    it('should set all archived use cases', () => {
      const expected = {
        archivedUseCases: [],
      };
      expect(reducer({}, setArchivedUseCases([]))).toEqual(expected);
    });
  });
});

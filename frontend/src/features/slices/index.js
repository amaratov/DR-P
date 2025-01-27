import { combineReducers } from 'redux';
import commonReducer from './commonSlice';
import configReducer from './configSlice';
import userReducer from './userSlice';
import uiReducer from './uiSlice';
import companyReducer from './companySlice';
import useCaseReducer from './useCaseSlice';
import industryVerticalReducer from './industryVerticalSlice';
import marketingReducer from './marketingSlice';
import projectReducer from './projectSlice';
import artifactIconReducer from './artifactIconSlice';
import referenceArchitectureReducer from './referenceArchitectureSlice';
import mvtReducer from './mvtSlice';
import customerDocumentReducer from './customerDocumentSlice';
import projectBriefcaseReducer from './projectBriefcaseSlice';
import solutionBriefReducer from './solutionBriefSlice';
import connectionReducer from './connectionSlice';
import mapReducer from './mapSlice';

export const rootReducers = combineReducers({
  common: commonReducer,
  config: configReducer,
  user: userReducer,
  ui: uiReducer,
  company: companyReducer,
  useCase: useCaseReducer,
  industryVertical: industryVerticalReducer,
  marketing: marketingReducer,
  project: projectReducer,
  artifactIcon: artifactIconReducer,
  referenceArchitecture: referenceArchitectureReducer,
  mvt: mvtReducer,
  customerDocument: customerDocumentReducer,
  projectBriefcase: projectBriefcaseReducer,
  solutionBrief: solutionBriefReducer,
  connections: connectionReducer,
  mapState: mapReducer,
});

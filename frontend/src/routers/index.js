import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from '../components/login/login';
import App from '../components/app/App';
import RequireAuth from './require-auth';
import MyAccount from '../components/my-accout/my-account';
import Reset from '../components/reset/reset';
import ClientPortfolio from '../components/my-accout/client-portfolio/client-portfolio';
import YourProjects from '../components/my-accout/your-projects/your-projects';
import UserManagement from '../components/my-accout/admin-panel/user-management/user-management';
import UseCases from '../components/my-accout/admin-panel/use-cases/use-cases';
import IndustryVerticals from '../components/my-accout/admin-panel/industry-verticals/industry-verticals';
import ArtifactLibrary from '../components/my-accout/admin-panel/artifact-library/artifact-library';
import ProjectSideNavSectionMain from '../components/project-side-nav-section/project-side-nav-section-main';
import PdfPageView from '../components/pdf-page-view';
import ModelPDF from '../components/project-side-nav-section/model-pdf';
import { TABS } from '../utils/constants/constants';

function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/reset" element={<Reset />} />
        <Route exact path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/client-portfolio" />} />
        <Route
          path="/your-project"
          element={
            <RequireAuth>
              <YourProjects />
            </RequireAuth>
          }
        />
        <Route
          path="/user-profile"
          element={
            <RequireAuth>
              <MyAccount />
            </RequireAuth>
          }
        />
        <Route
          path="/client-portfolio"
          element={
            <RequireAuth>
              <ClientPortfolio />
            </RequireAuth>
          }
        />
        <Route
          path="/client-portfolio/my-companies"
          element={
            <RequireAuth>
              <ClientPortfolio isMyCompanies />
            </RequireAuth>
          }
        />
        <Route
          path="/client-portfolio/archives"
          element={
            <RequireAuth>
              <ClientPortfolio isArchives />
            </RequireAuth>
          }
        />
        <Route
          path="/industry-verticals"
          element={
            <RequireAuth>
              <IndustryVerticals />
            </RequireAuth>
          }
        />
        <Route
          path="/industry-verticals/archives"
          element={
            <RequireAuth>
              <IndustryVerticals isArchives />
            </RequireAuth>
          }
        />
        <Route
          path="/use-cases"
          element={
            <RequireAuth>
              <UseCases />
            </RequireAuth>
          }
        />
        <Route
          path="/use-cases/archives"
          element={
            <RequireAuth>
              <UseCases isArchives />
            </RequireAuth>
          }
        />
        <Route
          path="/user-management"
          element={
            <RequireAuth>
              <UserManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/user-management/archives"
          element={
            <RequireAuth>
              <UserManagement isArchives />
            </RequireAuth>
          }
        />
        <Route
          path="/artifact-library"
          element={
            <RequireAuth>
              <ArtifactLibrary />
            </RequireAuth>
          }
        />
        <Route
          path="/artifact-library/:libraryTab"
          element={
            <RequireAuth>
              <ArtifactLibrary />
            </RequireAuth>
          }
        />
        <Route
          path="/map"
          element={
            <RequireAuth>
              <App />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.DISCOVER} />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/region"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.DISCOVER} isRegion />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/region/:regionId/:regionStateTab"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.DISCOVER} isRegion />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/model/:regionId"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.MODEL} />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/model/:regionId/:detailId"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.MODEL} />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/model"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.MODEL} />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/model/connect"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.MODEL} isConnect />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/project-briefcase"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.PROJECT_BRIEFCASE} />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/solution-briefcase"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.SOLUTION_BRIEF} />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/library"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.LIBRARY} />
            </RequireAuth>
          }
        />
        <Route
          path="/project-modeler/:id/library/:libraryTab"
          element={
            <RequireAuth>
              <ProjectSideNavSectionMain onLoadTab={TABS.LIBRARY} />
            </RequireAuth>
          }
        />
        <Route
          path="/pdf/:view"
          element={
            <RequireAuth>
              <PdfPageView />
            </RequireAuth>
          }
        />
        <Route
          path="/model-pdf/:detail_id/:id"
          element={
            <RequireAuth>
              <ModelPDF />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;

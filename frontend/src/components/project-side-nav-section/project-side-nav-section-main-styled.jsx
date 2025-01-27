import styled from '@emotion/styled';
import { GeneralContentContainer } from '../app/app-styled';

export const ProjectSideNavMainWrapper = styled(GeneralContentContainer)`
  display: grid;
  grid-template-columns: 1fr 10fr;
  grid-gap: 30px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 60px;
`;

export const ProjectSideNavPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 120px;
  margin: 0 8px;
  background: #3c55c2;
  border: 7px solid white;
  border-top-left-radius: 30px;
  border-top-right-radius: ${({ noBorderRadius }) => (noBorderRadius ? '0' : '30px')};
  border-bottom-right-radius: ${({ noBorderRadius }) => (noBorderRadius ? '0' : '30px')};
  border-bottom-left-radius: 30px;
  //border-radius: 30px;
  position: relative;
  height: calc(97vh - 10px);
  z-index: 1;
`;

export const ProjectSideNavLogoIcon = styled.img`
  background: #5569c2;
  padding: 34px;
  margin: 8px 8px 30px 8px;
  border-radius: 16px;
`;

export const ProjectSideNavIcon = styled.div`
  padding: 0 20px 15px 20px;
  color: white;
  text-align: center;
  ${({ disabled }) => disabled && 'pointer-events: none'};
  ${({ isGridDisplay }) => !isGridDisplay && 'display: grid'};
  ${({ isGridDisplay }) => !isGridDisplay && 'justify-items: center'};
  &:hover {
    cursor: pointer;
  }
  img {
    max-width: 50px;
    max-height: 50px;
    ${({ isActive }) => !isActive && 'opacity: 80%'};
  }
`;

export const ProjectSideNavTinyActiveIcon = styled.div`
  padding: 0 20px 40px 20px;
  color: white;
  text-align: center;
  ${({ isActive }) => !isActive && 'filter: grayscale(100%)'};
  &:hover {
    cursor: pointer;
  }
`;

export const ProjectSideNavTinyInactiveIcon = styled.div`
  padding: 0 20px 40px 20px;
  color: white;
  text-align: center;
  ${({ isActive }) => !isActive && 'filter: grayscale(100%)'};
  &:hover {
    cursor: pointer;
  }
`;

export const ProjectSideNavExitIcon = styled.img`
  padding: 30px 38px;
  position: absolute;
  bottom: 0;
  max-width: 50px;
  max-height: 50px;
  &:hover {
    cursor: pointer;
  }
`;

export const ProjectSideNavContentMain = styled.div`
  width: 100%;
  height: calc(100% - 35px);
  padding-top: 45px;
  margin-bottom: 30px;
`;

export const ProjectSideNavContentHeader = styled.div`
  padding-bottom: 20px;
`;

export const ProjectSideNavContentHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 32px;
  line-height: 44px;
  letter-spacing: 0.5px;
  color: var(--color-batman);
`;

export const ProjectSideNavContentHeaderButtonContainer = styled.div`
  justify-self: right;
  align-self: center;
  display: grid;
  grid-auto-flow: column;
`;

export const ProjectSideNavContentSection = styled.div``;

export const ProjectSideNavContentSectionTabs = styled.div``;

export const ProjectSideNavContentSectionTabPanel = styled.div``;

export const ProjectBriefCaseTableTitle = styled.div`
  font-family: 'Manrope', sans-serif;
  margin-bottom: 20px;
  padding-left: 5px;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: var(--color-batman);
`;

export const ProjectBriefcaseSubHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  color: var(--color-batman);
  margin-top: 25px;
`;

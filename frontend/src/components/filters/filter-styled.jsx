import styled from '@emotion/styled';

export const FilterMainWrapper = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 9999;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  mix-blend-mode: normal;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
`;

export const FilterPanelWrapper = styled.div`
  display: flex;
  position: relative;
  overflow-y: hidden;
  width: calc(100% - 400px);
  height: calc(100% - 200px);
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  padding: 24px;
`;

export const FilterPanelContainer = styled.div`
  width: 90%;
  height: calc(100% - 32px);
  padding: 32px 40px;
`;

export const FilterPanelHeaderSection = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-aluminium);
`;

export const FilterPanelHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
  padding-bottom: 32px;
`;

export const FilterPanelCloseBtn = styled.div`
  padding-bottom: 32px;
  svg {
    color: var(--color-cathedral);
  }
  &:hover {
    cursor: pointer;
  }
`;

export const FilterFacetSection = styled.div`
  width: 100%;
  min-height: 400px;
  max-height: calc(100% - 120px);
  overflow-y: auto;
  margin-bottom: 32px;
`;

export const FilterFacetCategory = styled.div`
  padding: 32px 5px;
  border-bottom: 1px solid var(--color-aluminium);
`;
export const FilterFacetHeader = styled.div`
  margin-bottom: 24px;
`;
export const FilterFacetHeaderText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
`;
export const FilterFacetOptionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  padding: 0 5px 10px 5px;
`;
export const FilterFacetOption = styled.div`
  display: flex;
`;
export const FilterFacetOptionCheckBox = styled.div`
  display: flex;
  align-items: center;
  span.MuiFormControlLabel-label {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--color-batman);
  }
`;

export const FilterFacetToggleBtn = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  color: var(--color-homeworld);
`;

export const FilterFacetToggleBtnText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-homeworld);
`;

export const FilterActionSection = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  margin-bottom: 20px;
`;
export const FilterActionBtn = styled.div``;

export const UserManagementFilterContainer = styled.div`
  display: flex;
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  height: ${({ open }) => (open ? '56px' : '0')};
  width: ${({ open }) => (open ? '100%' : '0')};
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-top: 10px;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  transition: all 0.5s ease-in-out;
`;

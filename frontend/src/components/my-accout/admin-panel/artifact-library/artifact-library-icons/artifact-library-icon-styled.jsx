import styled from '@emotion/styled';

export const ArtifactLibraryIconsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  grid-gap: 22px;
`;

export const ArtifactLibraryDefaultIconsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  grid-gap: 22px;
`;

export const ArtifactLibraryIconsItem = styled.div`
  display: flex;
  flex-direction: column;
  height: 140px;
`;

export const ArtifactLibraryIconsItemThumbnail = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 118px;
  height: 118px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  svg {
    &:hover {
      cursor: pointer;
    }
  }
`;

export const ArtifactLibraryIconsItemTitle = styled.div`
  width: 118px;
  height: 18px;
  padding: 0 3px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-batman);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ArtifactLibraryIconsItemMoreMenu = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export const ArtifactLibraryIconsItemTags = styled.div`
  position: absolute;
  width: 40px;
  height: 20px;
  top: 3px;
  left: 5px;
  background: ${({ isEdited }) => (isEdited ? '#62d989' : '#3e7df4')};
  border-radius: 20px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-la-luna);
`;

export const ArtifactLibraryIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 55px;
  ${({ imgUrl }) =>
    imgUrl &&
    `
  background-image:    url(${imgUrl});
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
  `}
`;

export const ArtifactLibraryIconContainer = styled.div`
  display: inline-block;
  position: relative;
`;

export const ArtifactLibraryIconDisplayClick = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  cursor: pointer;
`;

export const ArtifactLibraryIconNameFieldContainer = styled.div`
  position: relative;
  margin-bottom: ${({ adjustMarginBottom }) => (adjustMarginBottom ? '-3rem' : '0')};
`;

export const ArtifactLibraryIconRemoveButtonContainer = styled.div`
  position: absolute;
  top: 17px;
  right: 0;
`;

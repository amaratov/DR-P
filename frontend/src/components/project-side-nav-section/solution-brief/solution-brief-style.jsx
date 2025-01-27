import styled from '@emotion/styled';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

export const SolutionBriefListItemOuter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const SolutionBriefListItemBranchDiagram = styled.div`
  margin-right: 25px;
`;

export const SolutionBriefListItemPublishIndicator = styled.div`
  background-color: ${({ isPublished }) => (isPublished ? 'var(--color-homeworld)' : 'var(--color-la-luna)')};
  border: ${({ isPublished }) => (isPublished ? '1px solid var(--color-homeworld)' : '1px solid rgba(62, 83, 193, 0.3)')};
  height: 1rem;
  width: 1rem;
`;

export const SolutionBriefListItem = styled(ListItem)`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  background-color: var(--color-la-luna);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  border-radius: 24px;
`;

export const SolutionBriefItemContent = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 20px;
  padding-bottom: 2rem;
`;

export const SolutionBriefItemVersion = styled(ListItemAvatar)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  min-height: 100px;
  margin-right: 30px;
  background-color: ${({ isPublished }) => (isPublished ? 'var(--color-homeworld)' : '#f2f4fb')};
  border-radius: 16px;
`;

export const SolutionBriefItemVersionTopText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: ${({ isPublished }) => (isPublished ? 'var(--color-la-luna)' : 'var(--color-cathedral)')};
  opacity: 0.6;
  padding-bottom: 4px;
`;
export const SolutionBriefItemVersionMidText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${({ isPublished }) => (isPublished ? 'var(--color-la-luna)' : 'var(--color-batman)')};
  padding-bottom: 4px;
`;
export const SolutionBriefItemVersionBottomText = styled(SolutionBriefItemVersionTopText)`
  color: var(--color-la-luna);
`;

export const SolutionBriefItemAuthor = styled.div``;
export const SolutionBriefItemAuthorHeader = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-cathedral);
`;
export const SolutionBriefItemAuthorFullName = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
`;

export const SolutionBriefItemFileName = styled.div``;
export const SolutionBriefItemFileNameHeader = styled(SolutionBriefItemAuthorHeader)``;
export const SolutionBriefItemFileNameText = styled(SolutionBriefItemAuthorFullName)``;

export const SolutionBriefItemNotes = styled.div``;
export const SolutionBriefItemNotesHeader = styled(SolutionBriefItemAuthorHeader)``;
export const SolutionBriefItemNotesText = styled(SolutionBriefItemAuthorFullName)``;

export const UploadSolutionBriefBackground = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  mix-blend-mode: normal;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  top: 0;
  left: 0;
  z-index: 1400;
  justify-content: center;
  align-items: center;
`;

export const UploadSolutionBriefBox = styled.div`
  position: relative;
  width: 680px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  padding: 36px;
`;

export const UploadSolutionBriefText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
  padding-bottom: 35px;
`;

export const UploadSolutionBriefContentWrapper = styled.div`
  display: block;
  justify-content: space-between;
  padding-top: 25px;
`;

export const UploadSolutionBriefContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UploadSolutionBriefSubHeaderText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.005em;
  color: #646464;
  padding-bottom: 15px;
`;

export const DownloadSolutionBriefBackground = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  mix-blend-mode: normal;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  top: 0;
  left: 0;
  z-index: 1401;
  justify-content: center;
  align-items: center;
`;

export const DownloadSolutionBriefBox = styled.div`
  position: relative;
  width: 620px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  padding: 36px;
`;

export const DownloadSolutionBriefHeader = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
  padding-bottom: 35px;
`;

export const DownloadSolutionBriefText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-size: 16px;
  line-height: 28px;
  color: var(--color-batman);
  padding-bottom: 35px;
`;

export const DownloadSolutionBriefEmail = styled.div`
  color: var(--color-homeworld);
  font-weight: 600;
`;

export const DownloadSolutionBriefBarValues = styled.div`
  display: grid;
  grid-auto-flow: column;
  padding-top: 1.5rem;
`;

export const DownloadSolutionBriefBarValueLeft = styled.div`
  color: var(--color-aluminium);
`;

export const DownloadSolutionBriefBarValueRight = styled.div`
  justify-self: right;
  color: var(--color-homeworld);
  font-weight: 600;
`;

export const PublishSolutionBriefBackground = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  mix-blend-mode: normal;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  top: 0;
  left: 0;
  z-index: 1402;
  justify-content: center;
  align-items: center;
`;

export const PublishSolutionBriefBox = styled.div`
  position: relative;
  width: 680px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  padding: 36px;
`;

export const PublishSolutionBriefText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
  padding-bottom: 10px;
`;

export const PublishSolutionBriefContentWrapper = styled.div`
  display: block;
  justify-content: space-between;
  padding-top: 25px;
`;

export const PublishSolutionBriefContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PublishSolutionBriefSubHeaderText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.005em;
  color: var(--color-cathedral);
  padding-bottom: 15px;
`;

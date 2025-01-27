import styled from '@emotion/styled';

export const PublishProjectBriefcaseBackground = styled.div`
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

export const PublishProjectBriefcaseBox = styled.div`
  position: relative;
  width: 620px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  padding: 36px;
`;

export const PublishProjectBriefcaseHeader = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
  padding-bottom: 35px;
`;

export const PublishProjectBriefcaseText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-size: 16px;
  line-height: 28px;
  color: var(--color-batman);
  padding-bottom: 35px;
`;

export const PublishProjectBriefcaseBarValues = styled.div`
  display: grid;
  grid-auto-flow: column;
  padding-top: 1.5rem;
`;

export const PublishProjectBriefcaseBarValueLeft = styled.div`
  color: var(--color-aluminium);
`;

export const PublishProjectBriefcaseBarValueRight = styled.div`
  justify-self: right;
  color: var(--color-homeworld);
  font-weight: 600;
`;

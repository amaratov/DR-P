import styled from '@emotion/styled';

export const NoResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding-top: 70px;
  padding-bottom: 64px;
`;

export const NoResultIconContainer = styled.div`
  margin-bottom: 30px;
`;

export const NoResultHeader = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 16px;
  color: var(--color-carbon);
`;

export const NoResultBodyText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;
  color: var(--color-cathedral);
`;

export const NoResultBodySubText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-cathedral);
`;

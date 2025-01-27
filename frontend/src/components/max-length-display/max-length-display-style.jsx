import styled from '@emotion/styled';

export const MaxLengthDisplayWrapper = styled.div`
  color: ${({ isPublishSolutionBrief }) => (isPublishSolutionBrief ? 'var(--color-aluminium)' : 'var(--color-batman)')};
  ${({ isJustifiedRight }) => isJustifiedRight && 'justify-self: right'};
`;

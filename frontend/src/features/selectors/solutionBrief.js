import { createDraftSafeSelector } from '@reduxjs/toolkit';
import { isEmpty, sortArrayOfObjByVal } from '../../utils/utils';

export const getAllSolutionBriefs = state => state?.solutionBrief?.allSolutionBriefs || [];
export const getCurrentSolutionBriefs = state => state?.solutionBrief?.currentSolutionBriefs || [];
export const getTriggerDownloadBriefState = state => state?.solutionBrief?.triggerDownload;
export const getRecentlyCreatedSolutionBrief = state => state?.solutionBrief?.createdSolutionBrief || {};

export const getCurrentPublishedSolutionBrief = createDraftSafeSelector(getCurrentSolutionBriefs, currBriefs => {
  if (isEmpty(currBriefs)) return [];
  const sortedBriefs = [...currBriefs]
    .sort(sortArrayOfObjByVal('publishedDate', false))
    ?.filter(brief => brief.publishedDate !== null && !isEmpty(brief.publishedDate));
  return sortedBriefs?.[0];
});

export const getAllPublishedSolutionBriefs = createDraftSafeSelector(getCurrentSolutionBriefs, currBriefs => {
  if (isEmpty(currBriefs)) return [];
  const sortedBriefs = [...currBriefs]
    .sort(sortArrayOfObjByVal('publishedDate', false))
    ?.filter(brief => brief.publishedDate !== null && !isEmpty(brief.publishedDate));
  return sortedBriefs;
});

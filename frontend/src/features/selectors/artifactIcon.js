import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const getAllActiveIcons = state => state?.artifactIcon?.activeIcons || [];
export const getTrueAllActiveIcons = state => state?.artifactIcon?.allActiveIcons || [];
export const getAllArchivedIcons = state => state?.artifactIcon?.archivedIcons || [];
export const getIconSearchResults = state => state?.artifactIcon?.searchedIcons || [];
export const getIsLoadingIcons = state => state?.artifactIcon?.isLoadingIcons;

export const getUpdateIconData = state => state?.artifactIcon?.updateIconData;
export const getDefaultIcons = state => state?.artifactIcon?.defaultIcons;

export const getNumPagesForIcons = state => state?.artifactIcon?.numPages;
export const getCurrentPageForIcon = state => state?.artifactIcon?.page;

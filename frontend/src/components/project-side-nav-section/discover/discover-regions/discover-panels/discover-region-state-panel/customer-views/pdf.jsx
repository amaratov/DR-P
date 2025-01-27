import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { backendService } from '../../../../../../../services/backend';
import DiscoverCustomerView from '.';
import { getSelectedProjectDetails, getSelectedCompanyDetails } from '../../../../../../../features/selectors/ui';
import { getCurrentSolutionBriefs } from '../../../../../../../features/selectors/solutionBrief';
import { formatSolutionBriefVersion, isEmpty } from '../../../../../../../utils/utils';
import logo from '../../../../../../../images/Digital_Realty_TM_Brandmark_RGB_White 1.png';
import backgroundMask from '../../../../../../../images/solution_briefcase_cover_background.png';

const pdfStyles = css`
  @page {
    size: letter;
    margin: 0;
  }
  @page body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

function CoverPage({ cover }) {
  return !isEmpty(cover) ? (
    // position="sitcky" is a hack for making sure the footer doesn't display on the cover page when using z-index, since z-index requires
    // position to be something other than static.
    <Box
      boxSizing="border-box"
      display="flex"
      flexDirection="column"
      height="100vh"
      justifyContent="space-between"
      padding="80px"
      position="sticky"
      sx={{
        background: `url(${backgroundMask})`,
        backgroundSize: 'cover',
        breakAfter: 'always',
      }}
      zIndex="2">
      <img style={{ width: '152px', height: '72px' }} src={logo} alt="logo" />
      <Box color="white" display="flex" flexDirection="column" fontStyle="normal" justifyContent="center">
        <div style={{ fontFamily: 'Manrope', fontWeight: '400', fontSize: '12px', lineHeight: '26px', opacity: '0.5' }}>Solution Brief prepared for</div>
        <div style={{ fontFamily: 'Manrope', fontWeight: '800', fontSize: '48px', lineHeight: '66px', letterSpacing: '0.5px' }}>{cover.companyName}</div>
        <div style={{ fontFamily: 'Manrope', fontWeight: '800', fontSize: '18px', lineHeight: '26px' }}>{cover.projectTitle}</div>
        <div style={{ marginTop: '32px', fontFamily: 'Inter', fontWeight: '400', fontSize: '16px', lineHeight: '24px' }}>Version: {cover.version}</div>
      </Box>
      <Box height="1px" />
    </Box>
  ) : null;
}

function PdfDiscoverProjectCustomerView() {
  const dispatch = useDispatch();
  const [searchParams, _] = useSearchParams();

  const companyInfo = useSelector(getSelectedCompanyDetails);
  const projectInfo = useSelector(getSelectedProjectDetails);
  const briefs = useSelector(getCurrentSolutionBriefs);

  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      // fetching data necessary for DiscoverCustomerView
      dispatch(backendService.getProjectDetails(projectId));
      // fetching data necessary for CoverPage
      dispatch(backendService.getSolutionBriefcaseByProjectId({ projectId }));
      dispatch(backendService.getProjectById(projectId));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (projectInfo?.companyId) {
      dispatch(backendService.getCompanyById(projectInfo.companyId));
    }
  }, [dispatch, projectInfo?.companyId]);

  const cover = useMemo(() => {
    const solutionBriefId = searchParams.get('solutionBriefId');
    const brief = (briefs || []).find(({ id }) => id === solutionBriefId);
    if (!isEmpty(brief) && !isEmpty(companyInfo) && !isEmpty(projectInfo)) {
      return {
        companyName: companyInfo?.name,
        projectTitle: projectInfo?.title,
        version: formatSolutionBriefVersion(brief?.briefcaseVersionCode, brief?.briefcaseMajorVersion, brief?.briefcaseMinorVersion),
      };
    }
    return null;
  }, [briefs, companyInfo, projectInfo, searchParams]);

  return (
    <>
      <Global styles={pdfStyles} />
      <CoverPage cover={cover} />
      <Box id="content" boxSizing="border-box" padding="0 0.75in calc(0.75in + 68px + 32px)" position="relative">
        <DiscoverCustomerView />
      </Box>
      <Box
        alignItems="center"
        borderTop="1px solid #ccc"
        bottom="0.75in"
        color="#ccc"
        display="flex"
        gridColumn="-1/1"
        justifyContent="space-between"
        left="0.75in"
        paddingTop="12px"
        position="fixed"
        right="0.75in"
        zIndex="1">
        {!isEmpty(cover) ? (
          <p style={{ margin: 0 }}>
            {cover.companyName} | {cover.projectTitle}
          </p>
        ) : null}
        <img style={{ filter: 'invert(20%)', width: '112px' }} src={logo} alt="logo" />
      </Box>
    </>
  );
}

PdfDiscoverProjectCustomerView.prototype = {};

PdfDiscoverProjectCustomerView.defaultProps = {};

export default PdfDiscoverProjectCustomerView;

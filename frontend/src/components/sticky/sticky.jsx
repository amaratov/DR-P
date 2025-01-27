import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { backendService } from '../../services/backend';
import { SiteLogoWrapper, StickyWrapper } from './sticky-styled';
import SiteLogoIcon from '../../images/Digital_Realty_TM_Brandmark.svg';
import { isEmpty } from '../../utils/utils';
import { LinkItem, LinkWrapper, PopoverContainer, PopoverLinkItem, PopoverLinkWrapper, TabDivider } from '../tabs/tab-styled';
import { getWhoAmI } from '../../features/selectors';
import { AllRoles, FEATURE_CONFIG, PATH_NAME, TABS } from '../../utils/constants/constants';

function Sticky() {
  // location
  const location = useLocation();

  // dispatch
  const dispatch = useDispatch();

  // selectors
  const whoami = useSelector(getWhoAmI);

  // state
  const [anchorEl, setAnchorEl] = useState(null);

  // const
  const open = Boolean(anchorEl);
  const isAdmin = whoami?.role?.name?.toLowerCase() === 'admin';
  const isSA = whoami?.role?.name?.toLowerCase() === 'solutions architect';
  const isSE = whoami?.role?.name?.toLowerCase() === AllRoles.SOLUTIONS_ENGINEER;
  const isMarketing = whoami?.role?.name?.toLowerCase() === AllRoles.MARKETING;
  const isSales = whoami?.role?.name?.toLowerCase() === AllRoles.SALES;
  const isCustomer = whoami?.role?.name?.toLowerCase() === 'customer';
  const id = 'admin-check';
  const roleName = whoami?.role?.name?.toLowerCase();
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(roleName);

  // func
  const handleLogOut = useCallback(() => {
    dispatch(backendService.logOut());
  }, [dispatch]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // useEffect
  useEffect(() => {
    if (isEmpty(whoami)) dispatch(backendService.whoami());
  }, [whoami, dispatch]);

  return (
    <StickyWrapper>
      <SiteLogoWrapper>
        <img src={SiteLogoIcon} alt="logo" />
      </SiteLogoWrapper>
      <LinkWrapper>
        {isAdminOrSA && (
          <>
            <LinkItem component="button" aria-describedby={id} underline="none" onClick={handleClick}>
              {TABS.ADMIN_PANEL}
            </LinkItem>
            <PopoverContainer
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}>
              <PopoverLinkWrapper>
                <PopoverLinkItem
                  hasBorderBottom
                  href="/industry-verticals"
                  underline="none"
                  isActive={
                    location?.pathname === PATH_NAME.INDUSTRY_VERTICALS ||
                    location?.pathname === PATH_NAME.INDUSTRY_VERTICALS + PATH_NAME.INDUSTRY_VERTICALS_ARCHIVES
                  }>
                  Industry Verticals
                </PopoverLinkItem>
                <PopoverLinkItem
                  hasBorderBottom
                  href="/use-cases"
                  underline="none"
                  isActive={location?.pathname === PATH_NAME.USE_CASES || location?.pathname === PATH_NAME.USE_CASES + PATH_NAME.USE_CASES_ARCHIVES}>
                  Use Cases
                </PopoverLinkItem>
                <PopoverLinkItem
                  hasBorderBottom
                  href="/user-management"
                  underline="none"
                  isActive={
                    location?.pathname === PATH_NAME.USER_MANAGEMENT || location?.pathname === PATH_NAME.USER_MANAGEMENT + PATH_NAME.USER_MANAGEMENT_ARCHIVES
                  }>
                  User Management
                </PopoverLinkItem>
                <PopoverLinkItem
                  href="/artifact-library"
                  underline="none"
                  isActive={
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.MARKETING ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.REFERENCE_ARCHITECTURE ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.BRIEFS ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.ICONS ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.ARCHIVES
                  }>
                  Manage Library
                </PopoverLinkItem>
              </PopoverLinkWrapper>
            </PopoverContainer>
            <TabDivider orientation="vertical" variant="middle" flexItem />
          </>
        )}
        {isMarketing && (
          <>
            <LinkItem component="button" aria-describedby={id} underline="none" onClick={handleClick}>
              {TABS.ADMIN_PANEL}
            </LinkItem>
            <PopoverContainer
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}>
              <PopoverLinkWrapper>
                <PopoverLinkItem
                  hasBorderBottom
                  href="/industry-verticals"
                  underline="none"
                  isActive={
                    location?.pathname === PATH_NAME.INDUSTRY_VERTICALS ||
                    location?.pathname === PATH_NAME.INDUSTRY_VERTICALS + PATH_NAME.INDUSTRY_VERTICALS_ARCHIVES
                  }>
                  Industry Verticals
                </PopoverLinkItem>
                <PopoverLinkItem
                  hasBorderBottom
                  href="/use-cases"
                  underline="none"
                  isActive={location?.pathname === PATH_NAME.USE_CASES || location?.pathname === PATH_NAME.USE_CASES + PATH_NAME.USE_CASES_ARCHIVES}>
                  Use Cases
                </PopoverLinkItem>
                <PopoverLinkItem
                  href="/artifact-library"
                  underline="none"
                  isActive={
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.MARKETING ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.REFERENCE_ARCHITECTURE ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.BRIEFS ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.ICONS ||
                    location?.pathname === PATH_NAME.ARTIFACT_LIBRARY + PATH_NAME.LIBRARY_TABS.ARCHIVES
                  }>
                  Manage Library
                </PopoverLinkItem>
              </PopoverLinkWrapper>
            </PopoverContainer>
            <TabDivider orientation="vertical" variant="middle" flexItem />
          </>
        )}
        {isAdminOrSA && (
          <>
            <LinkItem
              href="/client-portfolio"
              underline="none"
              isActive={
                location?.pathname === PATH_NAME.CLIENT_PORTFOLIO ||
                location?.pathname === PATH_NAME.CLIENT_PORTFOLIO + PATH_NAME.MY_COMPANIES ||
                location?.pathname === PATH_NAME.CLIENT_PORTFOLIO + PATH_NAME.COMPANY_ARCHIVES
              }>
              Client Portfolio
            </LinkItem>
            <TabDivider orientation="vertical" variant="middle" flexItem />
          </>
        )}
        {!isAdminOrSA && !isMarketing && (
          <>
            <LinkItem href="/client-portfolio" underline="none" isActive={location?.pathname === PATH_NAME.CLIENT_PORTFOLIO}>
              My Company
            </LinkItem>
            <TabDivider orientation="vertical" variant="middle" flexItem />
          </>
        )}
        <LinkItem href="/user-profile" underline="none" isActive={location?.pathname === PATH_NAME.USER_PROFILE}>
          User Profile
        </LinkItem>
        <TabDivider orientation="vertical" variant="middle" flexItem />
        <LinkItem component="button" underline="none" onClick={() => handleLogOut()}>
          Logout
        </LinkItem>
      </LinkWrapper>
    </StickyWrapper>
  );
}

export default Sticky;

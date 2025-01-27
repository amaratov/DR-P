import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';

import { BriefCaseContainer, MainContentContainer, SideMenuContainer } from './briefcase-main-styled';

function BriefcaseMain() {
  return (
    <BriefCaseContainer>
      <SideMenuContainer>
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{index % 2 === 0 ? <MenuIcon /> : <MailIcon />}</ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SideMenuContainer>
      <MainContentContainer>right content</MainContentContainer>
    </BriefCaseContainer>
  );
}

export default BriefcaseMain;

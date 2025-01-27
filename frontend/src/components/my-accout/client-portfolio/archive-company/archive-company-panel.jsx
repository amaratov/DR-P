import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getArchiveMode, getPageNum, getSelectedCompany, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';
import {
  ArchiveCompanyPanelActionWrapper,
  ArchiveCompanyPanelContentContainer,
  ArchiveCompanyPanelContentWrapper,
  ArchiveCompanyPanelForm,
  ArchiveCompanyPanelHeaderText,
  ArchiveCompanyPanelMain,
  ArchiveCompanyPanelSubHeaderText,
} from './archive-company-panel-styled';
import { BUTTON_STYLE, TABS } from '../../../../utils/constants/constants';
import CustomButton from '../../../form-elements/custom-button';
import { resetArchiveMode, setRecentlyArchived, setToggleFunctionId } from '../../../../features/slices/uiSlice';
import { backendService } from '../../../../services/backend';

function ArchiveCompanyPanel({ activeTab }) {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const { register, handleSubmit, reset } = useForm();

  // selectors
  const isArchiveMode = useSelector(getArchiveMode);
  const selectedCompanyDetails = useSelector(getSelectedCompany);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // func
  const submitForm = data => {
    const finalData = {
      ...data,
      id: selectedCompanyDetails.id,
    };
    dispatch(setRecentlyArchived());
    dispatch(resetArchiveMode());
    dispatch(setToggleFunctionId(selectedCompanyDetails.id));
    setTimeout(() => {
      const sortOrderBy =
        orderBy === 'projectCount'
          ? [
              ['name', order],
              ['id', order],
              ['industryVertical', order],
            ]
          : [[orderBy, order]];
      dispatch(backendService.deleteCompany(finalData.id));
      setTimeout(() => {
        if (activeTab === TABS.MY_COMPANIES) {
          dispatch(backendService.getMyCompaniesByParams({ archived: false, page, order: sortOrderBy }));
        } else if (activeTab === TABS.ALL_COMPANIES) {
          dispatch(backendService.getCompaniesByParams({ archived: false, page, order: sortOrderBy }));
        } else if (activeTab === TABS.ARCHIVED_COMPANIES) {
          dispatch(backendService.getCompaniesByParams({ archived: true, page, order: sortOrderBy }));
        }
      }, 500);
    }, 500);
    reset();
  };

  return (
    <ArchiveCompanyPanelMain open={isArchiveMode}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Box role="presentation">
          <ArchiveCompanyPanelForm>
            <ArchiveCompanyPanelHeaderText>Are you sure?</ArchiveCompanyPanelHeaderText>
            <ArchiveCompanyPanelContentWrapper>
              <ArchiveCompanyPanelContentContainer>
                <ArchiveCompanyPanelSubHeaderText register={register}>
                  <p>Archiving the Company will archive all projects under that company as well</p>
                </ArchiveCompanyPanelSubHeaderText>
              </ArchiveCompanyPanelContentContainer>
            </ArchiveCompanyPanelContentWrapper>
            <div style={{ display: 'grid', gridRowGap: '1rem' }}>
              <ArchiveCompanyPanelActionWrapper>
                <CustomButton
                  buttonStyle={BUTTON_STYLE.COMPANY_STYLE}
                  buttonText="Cancel"
                  type="button"
                  customMinWidth="300px"
                  customMinHeight="50px"
                  onClickFunc={() => {
                    dispatch(resetArchiveMode());
                    reset();
                  }}
                />
              </ArchiveCompanyPanelActionWrapper>
              <ArchiveCompanyPanelActionWrapper>
                <CustomButton
                  buttonStyle={BUTTON_STYLE.COMPANY_STYLE}
                  buttonText="Continue"
                  marginTop="20px"
                  type="submit"
                  customMinWidth="300px"
                  customMinHeight="50px"
                  bgColor="var(--color-homeworld)"
                />
              </ArchiveCompanyPanelActionWrapper>
            </div>
          </ArchiveCompanyPanelForm>
        </Box>
      </form>
    </ArchiveCompanyPanelMain>
  );
}

ArchiveCompanyPanel.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default ArchiveCompanyPanel;

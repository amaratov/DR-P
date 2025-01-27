import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  myCompanies: {},
  allCompanies: {},
  archivedCompanies: {},
  companies: null,
  searchedCompanies: null,
  total: 0,
  page: 0,
  numPages: 0,
  isLoadingCompanies: false,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setSearchedCompanies: (state, action) => {
      state.searchedCompanies = action.payload;
    },
    setMyCompanies: (state, action) => {
      state.myCompanies = action.payload;
    },
    setAllCompanies: (state, action) => {
      state.allCompanies = action.payload;
    },
    setArchivedCompanies: (state, action) => {
      state.archivedCompanies = action.payload;
    },
    setCurrentPageForCompany: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.getCompaniesByArchived.pending, state => {
        state.isLoadingCompanies = true;
      })
      .addCase(backendService.searchCompaniesAndProjects.pending, state => {
        state.isLoadingCompanies = true;
      })
      .addCase(backendService.getMyCompanies.pending, state => {
        state.isLoadingCompanies = true;
      })
      .addCase(backendService.getCompaniesByParams.pending, state => {
        state.isLoadingCompanies = true;
      })
      .addCase(backendService.getMyCompaniesByParams.pending, state => {
        state.isLoadingCompanies = true;
      })
      .addCase(backendService.createProject.fulfilled, (state, action) => {
        const companyId = action.payload?.project?.companyId;
        const index1 = state.companies?.findIndex(comp => comp.id === companyId);
        const index2 = state.searchedCompanies?.findIndex(comp => comp.id === companyId);
        const { project } = action.payload;
        project.new = true;
        if (index1 !== -1) {
          state.companies?.[index1]?.projects?.push(project);
        }
        if (index2 !== -1) {
          state.searchedCompanies?.[index2]?.projects?.push(project);
        }
      })
      .addCase(backendService.updateProject.fulfilled, (state, action) => {
        const companyId = action.payload?.project?.companyId;
        const index1 = state.companies?.findIndex(comp => comp.id === companyId);
        const index2 = state.searchedCompanies?.findIndex(comp => comp.id === companyId);
        const { project } = action.payload;
        project.edited = true;
        if (index1 !== -1) {
          const pind = state.companies?.[index1].projects?.findIndex(p => {
            return p.id === project.id;
          });
          if (pind || pind === 0) {
            state.companies[index1].projects[pind] = project;
          }
        }
        if (index2 !== -1) {
          const pind = state.searchedCompanies?.[index2].projects?.findIndex(p => {
            return p.id === project.id;
          });
          if (pind || pind === 0) {
            state.searchedCompanies[index2].projects[pind] = project;
          }
        }
      })
      .addCase(backendService.getCompaniesByArchived.fulfilled, (state, action) => {
        state.companies = action.payload?.companies;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingCompanies = false;
      })
      .addCase(backendService.getMyCompanies.fulfilled, (state, action) => {
        state.companies = action.payload?.companies;
        state.searchedCompanies = action.payload?.companies;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingCompanies = false;
      })
      .addCase(backendService.searchCompaniesAndProjects.fulfilled, (state, action) => {
        state.searchedCompanies = action.payload?.companies;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = action.payload?.page;
        state.isLoadingCompanies = false;
      })
      .addCase(backendService.getCompaniesByParams.fulfilled, (state, action) => {
        state.companies = action.payload?.companies;
        state.searchedCompanies = action.payload?.companies;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = parseInt(action.payload?.page, 10);
        state.isLoadingCompanies = false;
      })
      .addCase(backendService.getMyCompaniesByParams.fulfilled, (state, action) => {
        state.companies = action.payload?.companies;
        state.searchedCompanies = action.payload?.companies;
        state.numPages = action.payload?.numPages;
        state.total = action.payload?.total;
        state.page = parseInt(action.payload?.page, 10);
        state.isLoadingCompanies = false;
      })
      .addCase(backendService.updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(comp => comp.id === action.payload?.company?.id);
        const creatorInfo = state.companies?.[index]?.fullCreatedBy;
        let projects = [];
        if (state.companies?.[index]?.projects) {
          projects = JSON.parse(JSON.stringify(state.companies[index].projects));
        }
        state.companies[index] = { fullCreatedBy: creatorInfo, ...action.payload?.company, projects };
      })
      .addCase(backendService.deleteCompany.fulfilled, (state, action) => {
        const id = action.payload?.company?.id;
        state.companies = state.companies?.filter(comp => comp.id !== id);
        state.searchedCompanies = state.searchedCompanies?.filter(comp => comp.id !== id);
      })
      .addCase(backendService.activateCompany.fulfilled, (state, action) => {
        const id = action.payload?.company?.id;
        state.companies = state.companies?.filter(comp => comp.id !== id);
        state.searchedCompanies = state.searchedCompanies?.filter(comp => comp.id !== id);
      });
  },
});

export const { setCompanies, setSearchedCompanies, setMyCompanies, setArchivedCompanies, setAllCompanies, setCurrentPageForCompany } = companySlice.actions;

export default companySlice.reducer;

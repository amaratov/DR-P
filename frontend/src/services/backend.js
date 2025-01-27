import { createAsyncThunk } from '@reduxjs/toolkit';
import BaseService from './base.service';
import { isEmpty } from '../utils/utils';

class BackendService extends BaseService {
  // login
  loginUser = createAsyncThunk('login', async (userInfo, thunkAPI) => {
    const options = {
      path: '/api/v1/login',
      method: 'POST',
      body: {
        username: userInfo?.email,
        password: userInfo?.password,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  logOut = createAsyncThunk('logout', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/logout',
      method: 'POST',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  });

  // role
  getRoles = createAsyncThunk('getRoles', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/role',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getRoleById = createAsyncThunk('getRoleById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/role/${id}`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteRoleById = createAsyncThunk('deleteRoleById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/role/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // user
  getUsers = createAsyncThunk('getUsers', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/user',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActiveUsers = createAsyncThunk('getActiveUsers', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/user',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    if (params?.page !== undefined) {
      options.params.page = params.page - 1;
    }
    if (!isEmpty(params?.roles)) {
      options.params.roles = params.roles;
    }
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getArchivedUsers = createAsyncThunk('getArchivedUsers', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/user',
      method: 'GET',
      params: {
        archived: true,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  searchUserByName = createAsyncThunk('searchUserByName', async (params, thunkAPI) => {
    const name = params?.name || '';
    const options = {
      path: '/api/v1/user',
      method: 'GET',
      params: {
        name,
        archived: params?.archived,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getUserById = createAsyncThunk('getUserById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/user/${id}`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createUser = createAsyncThunk('createUser', async (userInfo, thunkAPI) => {
    const options = {
      path: '/api/v1/user',
      method: 'POST',
      body: {
        ...userInfo,
        email: userInfo?.email,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  updateUser = createAsyncThunk('updateUser', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/user/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  activateUser = createAsyncThunk('activateUser', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/user/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteUser = createAsyncThunk('archiveUser', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/user/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // password
  resetPassword = createAsyncThunk('user/resetPassword', async (userInfo, thunkAPI) => {
    const options = {
      path: '/api/v1/user/resetpassword',
      method: 'POST',
      body: {
        email: userInfo.email,
        password: userInfo.password,
        token: userInfo.token,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  forgotPassword = createAsyncThunk('user/forgotPassword', async (userInfo, thunkAPI) => {
    const options = {
      path: '/api/v1/user/forgotpassword',
      method: 'POST',
      body: {
        email: userInfo,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // whoami
  whoami = createAsyncThunk('whoami', async (_, thunkAPI) => {
    const jwt = localStorage.getItem('userDrJWT');
    const options = {
      path: '/api/v1/user/whoami',
      method: 'GET',
      headers: { Authorization: `Bearer ${jwt}` },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response);
    }
  });

  // company
  getAllCompanies = createAsyncThunk('getAllCompanies', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/company',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getCompaniesByArchived = createAsyncThunk('getCompaniesByArchived', async (isArchived = false, thunkAPI) => {
    const options = {
      path: '/api/v1/company',
      method: 'GET',
      params: {
        archived: isArchived,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getCompaniesByParams = createAsyncThunk('getCompaniesByParams', async (params = { archived: false, page: 0 }, thunkAPI) => {
    const options = {
      path: '/api/v1/company',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getMyCompaniesByParams = createAsyncThunk('getMyCompaniesByParams', async (params = { archived: false, page: 0 }, thunkAPI) => {
    const options = {
      path: '/api/v1/company/my',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getMyCompanies = createAsyncThunk('getMyCompanies', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/company/my',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  searchCompaniesAndProjects = createAsyncThunk('searchCompanyAndProjects', async (params, thunkAPI) => {
    const name = params?.name || '';
    const options = {
      path: '/api/v1/company',
      method: 'GET',
      params: {
        name,
        includeProject: params?.includeProject,
        archived: params?.archived,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getCompanyById = createAsyncThunk('getCompanyById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/company/${id}`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createCompany = createAsyncThunk('createCompany', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/company',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateCompany = createAsyncThunk('updateCompany', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/company/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateCompany = createAsyncThunk('activateCompany', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/company/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteCompany = createAsyncThunk('archiveCompany', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/company/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // document
  getDocuments = createAsyncThunk('getDocuments', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/documents',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateDocuments = createAsyncThunk('updateDocuments', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/documents/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // project
  getProjects = createAsyncThunk('getProjects', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/project',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getProjectsByParams = createAsyncThunk('getProjectsByParams', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/project',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getMyProjects = createAsyncThunk('getMyProjects', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/project/my',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getProjectById = createAsyncThunk('getProjectById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${id}`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createProject = createAsyncThunk('createProject', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/project',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateProject = createAsyncThunk('updateProject', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateProject = createAsyncThunk('activateProject', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteProject = createAsyncThunk('archiveProject', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getProjectDetails = createAsyncThunk('getProjectDetails', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${id}/details`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createProjectDetails = createAsyncThunk('postProjectDetails', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body.id}/details`,
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateProjectDetails = createAsyncThunk('updateProjectDetails', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/details/${body?.detailId}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });

  newProjectDetail = createAsyncThunk('newProjectDetail', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/details/new`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      const errorMessage = !isEmpty(error?.message) ? `${error?.message} - Please try again later` : '';
      return thunkAPI.rejectWithValue(error?.response?.data || errorMessage);
    }
  });

  deleteProjectDetail = createAsyncThunk('deleteProjectDetail', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/details/${body?.detailId}`,
      method: 'DELETE',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteRegionFromProjectDetail = createAsyncThunk('deleteRegionFromProjectDetail', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/details/${body?.detailId}/detach`,
      method: 'DELETE',
      body: {
        region: body.region,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // connections
  getProjectConnections = createAsyncThunk('getProjectConnections', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${id}/connections`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createProjectConnections = createAsyncThunk('createProjectConnections', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/connections`,
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  newProjectConnections = createAsyncThunk('newProjectConnections', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/connections/new`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateProjectConnections = createAsyncThunk('updateProjectConnections', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/connections/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteProjectConnections = createAsyncThunk('deleteProjectConnections', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project/${body?.projectId}/connections/${body?.id}`,
      method: 'DELETE',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // industry vertical
  getAllIndustryVertical = createAsyncThunk('getAllIndustryVertical', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/industry_vertical',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getIndustryVerticalByParams = createAsyncThunk('getIndustryVerticalByParams', async (params = { archived: false, page: 0 }, thunkAPI) => {
    const options = {
      path: '/api/v1/industry_vertical',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createIndustryVertical = createAsyncThunk('createIndustryVertical', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/industry_vertical',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateIndustryVertical = createAsyncThunk('updateIndustryVertical', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/industry_vertical/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteIndustryVertical = createAsyncThunk('archiveIndustryVertical', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/industry_vertical/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateIndustryVertical = createAsyncThunk('activateIndustryVertical', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/industry_vertical/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // use cases
  getAllUseCases = createAsyncThunk('getAllUseCases', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/use_case',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getUseCasesByParams = createAsyncThunk('getUseCasesByParams', async (params = { archived: false, page: 0 }, thunkAPI) => {
    const options = {
      path: '/api/v1/use_case',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createUseCase = createAsyncThunk('createUseCase', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/use_case',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateUseCase = createAsyncThunk('updateUseCase', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/use_case/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteUseCase = createAsyncThunk('archiveUseCase', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/use_case/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateUseCase = createAsyncThunk('activateUseCase', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/use_case/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // marketing doc
  getAllMarketing = createAsyncThunk('getAllMarketing', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/marketingdocument',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllActiveMarketings = createAsyncThunk('getAllActiveMarketings', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/marketingdocument',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllArchivedMarketings = createAsyncThunk('getAllArchivedMarketings', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/marketingdocument',
      method: 'GET',
      params: {
        ...params,
        archived: true,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  searchMarketings = createAsyncThunk('searchMarketings', async (params, thunkAPI) => {
    const docName = params?.docName || '';
    const order = params?.order || [['docName', 'asc']];
    const options = {
      path: '/api/v1/marketingdocument',
      method: 'GET',
      params: {
        docName,
        archived: params?.archived,
        order,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  findMarketingsByIds = createAsyncThunk('findMarketingsByIds', async (marketingIds, thunkAPI) => {
    const options = {
      path: '/api/v1/marketingdocument/find',
      method: 'PUT',
      body: {
        marketingIds,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  findMarketingsByIdsAndParams = createAsyncThunk('findMarketingsByIdsAndParams', async (marketingIds, params, thunkAPI) => {
    const options = {
      path: '/api/v1/marketingdocument/find',
      method: 'PUT',
      params,
      body: {
        marketingIds,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createMarketing = createAsyncThunk('createMarketing', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/marketingdocument',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteMarketing = createAsyncThunk('deleteMarketing', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/marketingdocument/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateMarketing = createAsyncThunk('updateMarketing', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/marketingdocument/${body.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  downloadMarketing = createAsyncThunk('downloadMarketing', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/marketingdocument/${body?.id}/download`,
      method: 'GET',
      responseType: 'blob',
    };
    try {
      const res = await this.axiosCall(options);
      const href = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', body?.originalFilename || 'unknown.txt'); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateMarketing = createAsyncThunk('activateMarketing', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/marketingdocument/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // icon api
  getAllIcon = createAsyncThunk('getAllIcon', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/icon',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllActiveIcon = createAsyncThunk('getAllActiveIcon', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/icon',
      method: 'GET',
      params: { ...params, archived: false },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getTrueAllActiveIcon = createAsyncThunk('getTrueAllActiveIcon', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/icon',
      method: 'GET',
      params: { ...params, archived: false, limit: 0, page: 0 },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllArchivedIcon = createAsyncThunk('getAllArchivedIcon', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/icon',
      method: 'GET',
      params: { ...params, archived: true },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  searchIcons = createAsyncThunk('searchIcons', async (params, thunkAPI) => {
    const iconName = params?.iconName || '';
    const options = {
      path: '/api/v1/icon',
      method: 'GET',
      params: {
        iconName,
        archived: params?.archived,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  searchDefaultIcons = createAsyncThunk('searchDefaultIcons', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/icon',
      method: 'GET',
      params: {
        tags: ['generic'],
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  searchPreviewIcons = createAsyncThunk('searchPreviewIcons', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/icon/previews',
      method: 'PUT',
      params: {
        archived: false,
        page: body?.page || 0,
      },
      body: body?.page ? body.body : body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createIcon = createAsyncThunk('createIcon', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/icon',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  deleteIcon = createAsyncThunk('deleteIcon', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/icon/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateIcon = createAsyncThunk('updateIcon', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/icon/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  downloadIcon = createAsyncThunk('downloadIcon', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/icon/${body?.id}/download`,
      method: 'GET',
      responseType: 'blob',
    };
    try {
      const res = await this.axiosCall(options);
      const href = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', body?.originalFilename || 'unknown.png'); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateIcon = createAsyncThunk('activateIcon', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/icon/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  detachIcon = createAsyncThunk('detachIcon', async (params, thunkAPI) => {
    const id = params?.id;
    const options = {
      path: `/api/v1/icon/${id}/detach`,
      method: 'DELETE',
      params: {
        isUsingDefault: params.isUsingDefault || false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getIconById = createAsyncThunk('getIconById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/icon/${id}`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // reference architecture
  getAllReferenceArchitecture = createAsyncThunk('getAllReferenceArchitecture', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/referencedocument',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllActiveReferenceArchitecture = createAsyncThunk('getAllActiveReferenceArchitecture', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/referencedocument',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllArchivedReferenceArchitecture = createAsyncThunk('getAllArchivedReferenceArchitecture', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/referencedocument',
      method: 'GET',
      params: {
        ...params,
        archived: true,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  searchReferenceArchitecture = createAsyncThunk('searchReferenceArchitecture', async (params, thunkAPI) => {
    const docName = params?.docName || '';
    const options = {
      path: '/api/v1/referencedocument',
      method: 'GET',
      params: {
        docName,
        archived: params?.archived,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getReferenceArchitectureByParams = createAsyncThunk('getReferenceArchitectureByParams', async (params = { archived: false, page: 0 }, thunkAPI) => {
    const options = {
      path: '/api/v1/referencedocument',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createReferenceArchitecture = createAsyncThunk('createReferenceArchitecture', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/referencedocument',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteReferenceArchitecture = createAsyncThunk('deleteReferenceArchitecture', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/referencedocument/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateReferenceArchitecture = createAsyncThunk('updateReferenceArchitecture', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/referencedocument/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  downloadReferenceArchitecture = createAsyncThunk('downloadReferenceArchitecture', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/referencedocument/${body?.id}/download`,
      method: 'GET',
      responseType: 'blob',
    };
    try {
      const res = await this.axiosCall(options);
      const href = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', body?.originalFilename || 'unknown.txt'); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateReferenceArchitecture = createAsyncThunk('activateReferenceArchitecture', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/referencedocument/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // customer document
  getAllCustomerDocument = createAsyncThunk('getAllCustomerDocument', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/customerdocument',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllActiveCustomerDocument = createAsyncThunk('getAllActiveCustomerDocument', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/customerdocument?archived=false',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getAllArchivedCustomerDocument = createAsyncThunk('getAllArchivedCustomerDocument', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/customerdocument?archived=true',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createCustomerDocument = createAsyncThunk('createCustomerDocument', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/customerdocument',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  deleteCustomerDocument = createAsyncThunk('deleteCustomerDocument', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/customerdocument/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  updateCustomerDocument = createAsyncThunk('updateCustomerDocument', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/customerdocument/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getCustomerDocumentByProjectId = createAsyncThunk('getCustomerDocumentByProjectId', async (params, thunkAPI) => {
    const projectId = params?.projectId || '';
    const options = {
      path: '/api/v1/customerdocument',
      method: 'GET',
      params: {
        projectId,
        archived: params?.archived,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getCustomerDocumentByProjectIdAndParams = createAsyncThunk('getCustomerDocumentByProjectIdAndParams', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/customerdocument',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  downloadCustomerDocument = createAsyncThunk('downloadCustomerDocument', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/customerdocument/${body?.id}/download`,
      method: 'GET',
      responseType: 'blob',
    };
    try {
      const res = await this.axiosCall(options);
      const href = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', body?.originalFilename || body?.docName || 'unknown.txt'); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  activateCustomerDocument = createAsyncThunk('activateCustomerDocument', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/customerdocument/${id}/activate`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // mvt
  getRegions = createAsyncThunk('getRegions', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/poi/regions',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActiveCompliance = createAsyncThunk('getCompliance', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/compliance',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActiveCloud = createAsyncThunk('getCloud', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/cloud',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getComplianceByName = createAsyncThunk('getComplianceByName', async (name, thunkAPI) => {
    const options = {
      path: '/api/v1/compliance',
      method: 'GET',
      params: {
        archived: false,
        iconName: name,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActiveApplication = createAsyncThunk('getActiveApplication', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/application',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActivePartnernsp = createAsyncThunk('getActivePartnernsp', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/partnernsp',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActivePartnervar = createAsyncThunk('getActivePartnervar', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/partnervar',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActivePartnersw = createAsyncThunk('getActivePartnerNSP', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/partnersw',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActivePartnermig = createAsyncThunk('getActivePartnermig', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/partnermig',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getActivePartnerhw = createAsyncThunk('getActivePartnerhw', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/partnerhw',
      method: 'GET',
      params: {
        archived: false,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getIconByName = createAsyncThunk('getIconByName', async (name, thunkAPI) => {
    const options = {
      path: '/api/v1/icon',
      method: 'GET',
      params: {
        archived: false,
        iconName: name,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // project briefcase
  getAllProjectBriefcase = createAsyncThunk('getAllProjectBriefcase', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/project_briefcase',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getProjectBriefcaseByParams = createAsyncThunk('getProjectBriefcaseByParams', async (params = { archived: false, page: 0 }, thunkAPI) => {
    const options = {
      path: '/api/v1/project_briefcase',
      method: 'GET',
      params,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getProjectBriefcaseByProjectId = createAsyncThunk('getProjectBriefcaseByProjectId', async (params, thunkAPI) => {
    const projectId = params?.projectId || '';
    const options = {
      path: '/api/v1/project_briefcase',
      method: 'GET',
      params: {
        projectId,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getProjectBriefcaseById = createAsyncThunk('getProjectBriefcaseById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project_briefcase/${id}`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createProjectBriefcase = createAsyncThunk('createProjectBriefcase', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/project_briefcase',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  publishProjectBriefcase = createAsyncThunk('publishProjectBriefcase', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project_briefcase/${id}/publish`,
      method: 'PUT',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  updateProjectBriefcase = createAsyncThunk('updateProjectBriefcase', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/project_briefcase/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteProjectBriefcase = createAsyncThunk('deleteProjectBriefcase', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/project_briefcase/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  // solution brief
  getAllSolutionBriefcase = createAsyncThunk('getAllSolutionBriefcase', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/solution_briefcase',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getSolutionBriefcaseByProjectId = createAsyncThunk('getSolutionBriefcaseByProjectId', async (params, thunkAPI) => {
    const projectId = params?.projectId || '';
    const page = params?.page || 0;
    const options = {
      path: '/api/v1/solution_briefcase',
      method: 'GET',
      params: {
        projectId,
        page,
      },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getSolutionBriefcaseById = createAsyncThunk('getSolutionBriefcaseById', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/solution_briefcase/${id}`,
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  createSolutionBriefcase = createAsyncThunk('createSolutionBriefcase', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/solution_briefcase',
      method: 'POST',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  generateSolutionBriefcase = createAsyncThunk('generateSolutionBriefcase', async (body, thunkAPI) => {
    const options = {
      path: '/api/v1/solution_briefcase/generate_pdf',
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  publishSolutionBriefcase = createAsyncThunk('publishSolutionBriefcase', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/solution_briefcase/${body?.id}/publish`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  });

  updateSolutionBriefcase = createAsyncThunk('updateSolutionBriefcase', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/solution_briefcase/${body?.id}`,
      method: 'PUT',
      body,
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  downloadSolutionBriefcase = createAsyncThunk('downloadSolutionBriefcase', async (body, thunkAPI) => {
    const options = {
      path: `/api/v1/solution_briefcase/${body?.id}/download`,
      method: 'GET',
      responseType: 'blob',
    };
    try {
      const res = await this.axiosCall(options);
      const href = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', body?.originalFilename || 'solution_brief.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  deleteSolutionBriefcase = createAsyncThunk('deleteSolutionBriefcase', async (id, thunkAPI) => {
    const options = {
      path: `/api/v1/solution_briefcase/${id}`,
      method: 'DELETE',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

  getOtherTags = createAsyncThunk('getOtherTags', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/tag',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });

  createOtherTag = createAsyncThunk('createOtherTag', async (name, thunkAPI) => {
    const options = {
      path: '/api/v1/tag',
      method: 'POST',
      body: { name },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });

  getMapToken = createAsyncThunk('getMapToken', async (_, thunkAPI) => {
    const options = {
      path: '/api/v1/config/mapToken',
      method: 'GET',
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });

  getDRLocations = createAsyncThunk('getDRLocations', async (region, thunkAPI) => {
    const options = {
      path: '/api/v1/poi/datacenters',
      method: 'GET',
      params: { region },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });

  getCloudOnRamps = createAsyncThunk('getCloudOnRamps', async (cloud, thunkAPI) => {
    const options = {
      path: '/api/v1/poi/cloud_on_ramps',
      method: 'GET',
      params: { region: cloud.region },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });

  getLocationLatency = createAsyncThunk('getLocationLatency', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/poi/latency',
      method: 'GET',
      params: { ...params },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });

  getLocationDGx = createAsyncThunk('getLocationDGx', async (params, thunkAPI) => {
    const options = {
      path: '/api/v1/poi/dgx',
      method: 'GET',
      params: { ...params },
    };
    try {
      const res = await this.axiosCall(options);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });
}

export const backendService = new BackendService();

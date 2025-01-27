import { createSlice } from '@reduxjs/toolkit';
import { backendService } from '../../services/backend';

const initialState = {
  isLoggedIn: false,
  loginError: false,
  whoami: {},
  allUsers: {
    numPages: null,
    page: null,
    users: [],
  },
  allRoles: [],
  searchedUsers: [],
  resetPasswordSuccess: false,
  hasRolesLoaded: false,
  refreshUsers: false,
  isLoadingUser: false,
  refreshUserById: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetAllUsers: (state, action) => {
      state.allUsers = {
        numPages: null,
        page: null,
        users: [],
      };
    },
    setUserInfo: (state, action) => {
      state.whoami = {
        username: action.payload.username,
        email: action.payload.email,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(backendService.loginUser.fulfilled, (state, action) => {
        localStorage.setItem('userLoginStatus', action.payload?.status);
        state.loginError = false;
        state.isLoggedIn = true;
      })
      .addCase(backendService.loginUser.rejected, state => {
        state.loginError = true;
        localStorage.clear();
      })
      .addCase(backendService.logOut.fulfilled, state => {
        state.isLoggedIn = false;
        localStorage.clear();
        window.location.reload();
      })
      .addCase(backendService.logOut.rejected, (state, action) => {
        if (action?.payload?.status === 401) {
          state.isLoggedIn = false;
          localStorage.clear();
          window.location.reload();
        }
      })
      .addCase(backendService.whoami.fulfilled, (state, action) => {
        state.whoami = action.payload?.user;
        if (state.whoami && state.whoami.jwt) {
          localStorage.setItem('userDrJWT', state.whoami.jwt);
        }
      })
      .addCase(backendService.whoami.rejected, (state, action) => {
        if (action?.payload?.status === 401) {
          state.isLoggedIn = false;
          localStorage.clear();
          window.location.reload();
        }
      })
      .addCase(backendService.getUsers.fulfilled, (state, action) => {
        state.allUsers = {
          ...action.payload,
        };
        state.isLoadingUser = false;
      })
      .addCase(backendService.getActiveUsers.fulfilled, (state, action) => {
        state.allUsers = {
          ...action.payload,
        };
        state.isLoadingUser = false;
      })
      .addCase(backendService.getArchivedUsers.fulfilled, (state, action) => {
        state.allUsers = {
          ...action.payload,
        };
        state.isLoadingUser = false;
      })
      .addCase(backendService.getUsers.pending, state => {
        state.isLoadingUser = true;
      })
      .addCase(backendService.getActiveUsers.pending, state => {
        state.isLoadingUser = true;
      })
      .addCase(backendService.getArchivedUsers.pending, state => {
        state.isLoadingUser = true;
      })
      .addCase(backendService.searchUserByName.pending, state => {
        state.isLoadingUser = true;
      })
      .addCase(backendService.searchUserByName.fulfilled, (state, action) => {
        state.searchedUsers = action.payload?.users;
        state.isLoadingUser = false;
      })
      .addCase(backendService.getRoles.fulfilled, (state, action) => {
        state.allRoles = action.payload?.roles;
        state.hasRolesLoaded = true;
      })
      .addCase(backendService.createUser.fulfilled, (state, action) => {
        state.allUsers.users.push(action.payload?.user);
      })
      .addCase(backendService.updateUser.fulfilled, (state, action) => {
        const index = state.allUsers.users.findIndex(usr => usr.id === action.payload?.user?.id);
        state.allUsers.users[index] = action.payload?.user;
      })
      .addCase(backendService.deleteUser.fulfilled, (state, action) => {
        state.allUsers.users = state.allUsers?.users.filter(usr => usr.id !== action.payload?.user?.id);
      })
      .addCase(backendService.activateUser.fulfilled, (state, action) => {
        state.allUsers.users = state.allUsers?.users.filter(usr => usr.id !== action.payload?.user?.id);
      })
      .addCase(backendService.resetPassword.fulfilled, state => {
        state.resetPasswordSuccess = true;
      });
  },
});

export const { resetAllUsers, setUserInfo } = userSlice.actions;

export default userSlice.reducer;

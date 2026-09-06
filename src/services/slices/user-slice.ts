import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUserThunk = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (registerData) => {
    const response = await registerUserApi(registerData);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUserThunk = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (loginData) => {
    const response = await loginUserApi(loginData);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const getUserThunk = createAsyncThunk<TUser, void>(
  'user/getUser',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

export const checkUserAuthThunk = createAsyncThunk<TUser | null, void>(
  'user/checkAuth',
  async () => {
    if (!getCookie('accessToken')) {
      return null;
    }

    const response = await getUserApi();
    return response.user;
  }
);

export const updateUserThunk = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (userData) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUserThunk = createAsyncThunk<void, void>(
  'user/logout',
  async () => {
    await logoutApi();
    clearTokens();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.isLoading,
    selectUserError: (state) => state.error,
    selectIsAuthenticated: (state) => Boolean(state.user)
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message ?? 'Не удалось войти';
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
        state.error =
          action.error.message ?? 'Не удалось получить пользователя';
      })
      .addCase(checkUserAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuthThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
        state.error =
          action.error.message ?? 'Не удалось проверить авторизацию';
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось обновить данные пользователя';
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось выйти';
      });
  }
});

export const userReducer = userSlice.reducer;
export const { clearUserError } = userSlice.actions;

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserLoading,
  selectUserError,
  selectIsAuthenticated
} = userSlice.selectors;

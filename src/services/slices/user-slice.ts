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

type TThunkConfig = {
  rejectValue: string;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return fallback;
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUserThunk = createAsyncThunk<
  TUser,
  TRegisterData,
  TThunkConfig
>('user/register', async (registerData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(registerData);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, 'Не удалось зарегистрироваться')
    );
  }
});

export const loginUserThunk = createAsyncThunk<TUser, TLoginData, TThunkConfig>(
  'user/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      saveTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось войти'));
    }
  }
);

export const getUserThunk = createAsyncThunk<TUser, void, TThunkConfig>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Не удалось получить пользователя')
      );
    }
  }
);

export const checkUserAuthThunk = createAsyncThunk<
  TUser | null,
  void,
  TThunkConfig
>('user/checkAuth', async (_, { rejectWithValue }) => {
  if (!getCookie('accessToken')) {
    return null;
  }

  try {
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, 'Не удалось проверить авторизацию')
    );
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  TThunkConfig
>('user/update', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, 'Не удалось обновить данные пользователя')
    );
  }
});

export const logoutUserThunk = createAsyncThunk<void, void, TThunkConfig>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearTokens();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось выйти'));
    }
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
        state.error = action.payload ?? action.error.message ?? null;
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
        state.error = action.payload ?? action.error.message ?? null;
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
        state.error = action.payload ?? action.error.message ?? null;
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
        state.error = action.payload ?? action.error.message ?? null;
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
        state.error = action.payload ?? action.error.message ?? null;
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
        state.error = action.payload ?? action.error.message ?? null;
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

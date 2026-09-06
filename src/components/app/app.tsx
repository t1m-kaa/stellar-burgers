import { useCallback, useEffect } from 'react';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  IngredientDetailsPage,
  Login,
  NotFound404,
  OrderInfoPage,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfoModal
} from '@components';
import { Preloader } from '@ui';
import { checkUserAuthThunk } from '@slices';
import { ProtectedRoute } from '../protected-route/protected-route';
import {
  getIngredientsThunk,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredients-slice';
import { useDispatch, useSelector } from '../../services/store';

import '../../index.css';
import styles from './app.module.css';

type TModalLocationState = {
  background?: Location;
};

const App = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = (location.state as TModalLocationState | null)
    ?.background;

  const closeRouteModal = useCallback(() => navigate(-1), [navigate]);

  const homeElement = isIngredientsLoading ? (
    <Preloader />
  ) : error ? (
    <div className={`${styles.error} text text_type_main-medium pt-4`}>
      {error}
    </div>
  ) : ingredients.length > 0 ? (
    <ConstructorPage />
  ) : (
    <div className={`${styles.title} text text_type_main-medium pt-4`}>
      Нет ингредиентов
    </div>
  );

  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(checkUserAuthThunk());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={homeElement} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfoPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetailsPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfoPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={<OrderInfoModal onClose={closeRouteModal} />}
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeRouteModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfoModal onClose={closeRouteModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

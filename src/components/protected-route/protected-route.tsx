import type { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { selectIsAuthChecked, selectUser } from '@slices';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

const onlyUnAuthPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  const isOnlyUnAuth =
    onlyUnAuth ?? onlyUnAuthPaths.includes(location.pathname);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isOnlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (isOnlyUnAuth && user) {
    const from = location.state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

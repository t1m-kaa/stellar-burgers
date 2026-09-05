import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearUserError,
  selectUser,
  selectUserError,
  updateUserThunk
} from '../../services/slices/user-slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData = formValue.password
      ? formValue
      : { name: formValue.name, email: formValue.email };
    dispatch(updateUserThunk(userData));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearUserError());
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

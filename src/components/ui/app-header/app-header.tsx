import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();
  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients/');
  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const isProfileActive =
    pathname === '/profile' || pathname.startsWith('/profile/');

  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={clsx(styles.link, {
              [styles.link_active]: isConstructorActive
            })}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={clsx(styles.link, {
              [styles.link_active]: isFeedActive
            })}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <Link to='/' className={styles.logo} aria-label='На главную'>
          <Logo className='' />
        </Link>
        <Link
          to='/profile'
          className={clsx(styles.link, styles.link_position_last, {
            [styles.link_active]: isProfileActive
          })}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};

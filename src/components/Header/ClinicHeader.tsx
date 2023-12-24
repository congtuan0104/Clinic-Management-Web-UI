import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector, listClinicSelector, setCurrentClinic, setUserInfo, userInfoSelector } from '@/store';
import { Box, Group, Button, Image, Divider, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ClinusLogo from '@/assets/images/logo.png';
import { IClinic } from '@/types';

const ClinicHeader = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const currentClinic = useAppSelector(currentClinicSelector);
  const listClinic = useAppSelector(listClinicSelector);
  const dispatch = useAppDispatch();

  const handleChangeClinic = (clinic: IClinic) => {
    dispatch(setCurrentClinic(clinic));
  }

  return (
    <Box h={60} bg='white' className="border-solid border-0 border-b border-gray-300 fixed top-0 right-0 left-0">
      <header className="h-full max-w-screen-xxl flex justify-between items-center">
        <Link className='flex-1 flex justify-start py-[4px] pl-3' to={PATHS.CLINIC_DASHBOARD}>
          <Image src={ClinusLogo} alt='logo' h={51} fit='contain' />
        </Link>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant='white'>{currentClinic?.name}</Button>
          </Menu.Target>

          <Menu.Dropdown>
            {listClinic?.map((clinic) => (
              <Menu.Item key={clinic.id} onClick={() => handleChangeClinic(clinic)}>
                {clinic.name}
              </Menu.Item>
            ))}

          </Menu.Dropdown>
        </Menu>
      </header>
    </Box>
  );
};

export default ClinicHeader;

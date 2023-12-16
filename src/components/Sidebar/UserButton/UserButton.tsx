import { UnstyledButton, Group, Flex, Text, rem, ThemeIcon, Menu } from '@mantine/core';
import { IoIosArrowForward } from "react-icons/io";
import classes from './UserButton.module.css';
import { useAuth } from '@/hooks';
import { FaUser } from 'react-icons/fa';
import { CgLogOut, CgProfile } from 'react-icons/cg';

export function UserButton() {
  const { userInfo, logout } = useAuth();

  return (
    <Menu shadow="md" width={200} position="right-end" withArrow>
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>

            <ThemeIcon c='teal.7' variant='white' radius='xl' size='lg'>
              <FaUser size={22} />
            </ThemeIcon>


            <Flex direction='column' className='flex-1'>
              <Text size="sm" fw={500}>
                {userInfo?.firstName} {userInfo?.lastName}
              </Text>
              <Text size="sm" fw={500} c='gray.5'>
                Quản lý phòng khám
              </Text>
            </Flex>

            <IoIosArrowForward style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Tài khoản</Menu.Label>
        <Menu.Item
          leftSection={<CgProfile size={15} />}
        >
          Thông tin cá nhân
        </Menu.Item>
        <Menu.Item
          onClick={() => logout()}
          color="red.8"
          leftSection={<CgLogOut size={15} />}
        >
          Đăng xuất
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
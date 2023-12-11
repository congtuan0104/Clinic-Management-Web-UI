import { UnstyledButton, Group, Avatar, Text, rem, ThemeIcon } from '@mantine/core';
import { IoIosArrowForward } from "react-icons/io";
import classes from './UserButton.module.css';
import { useAuth } from '@/hooks';
import { FaUser } from 'react-icons/fa';

export function UserButton() {
  const { userInfo } = useAuth();

  return (
    <UnstyledButton className={classes.user}>
      <Group>

        <ThemeIcon c='teal.7' variant='white' radius='xl' size='lg'>
          <FaUser size={22} />
        </ThemeIcon>


        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>

          <Text tt='capitalize' lineClamp={1} c="dimmed" size="xs">
            {userInfo?.role}
          </Text>
        </div>

        <IoIosArrowForward style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
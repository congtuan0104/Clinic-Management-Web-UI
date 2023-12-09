import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core';
import { IoIosArrowForward } from "react-icons/io";
import classes from './UserButton.module.css';

export function UserButton() {
  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            Vo Hoai An
          </Text>

          <Text c="dimmed" size="xs">
            vohoaian@gmail.com
          </Text>
        </div>

        <IoIosArrowForward style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
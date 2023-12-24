import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IoIosArrowForward } from "react-icons/io";
import classes from './LinksGroup.module.css';
import { Link, useNavigate } from 'react-router-dom';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  href?: string;
  children?: { label: string; href: string }[];
  isActive?: boolean;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, children, href }: LinksGroupProps) {
  const navigate = useNavigate();
  const hasLinks = Array.isArray(children);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? children : []).map((item) => (
    <Text
      component={Link}
      className={classes.link}
      to={item.href}
      key={item.label}
    >
      {item.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => href ? navigate(href) : setOpened((o) => !o)}
        className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon c='teal.7' variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IoIosArrowForward
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

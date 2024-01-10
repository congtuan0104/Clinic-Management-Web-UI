import { useEffect, useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IoIosArrowForward } from "react-icons/io";
import classes from './LinksGroup.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAppSelector } from '@/hooks';
import { openSidebarClinicSelector } from '@/store';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  href?: string;
  children?: { label: string; href: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, children, href }: LinksGroupProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hasLinks = Array.isArray(children);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const isOpenSidebar = useAppSelector(openSidebarClinicSelector);

  useEffect(() => {
    setOpened(false);
  }, [isOpenSidebar])

  return (
    <>
      <Box
        onClick={() => href ? navigate(href) : setOpened((o) => !o)}
        className={classNames(
          'w-full font-medium text-14 block px-4 py-2.5  cursor-pointer',
          href === pathname ? 'bg-primary-0' : 'hover:bg-primary-100'
        )}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon c='teal.7' variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            {isOpenSidebar && <Box ml="md" className='line-clamp-1'>{label}</Box>}
          </Box>
          {hasLinks && isOpenSidebar && (
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
      </Box>
      {hasLinks && isOpenSidebar ? <Collapse in={opened}>{
        children.map((item) => (
          <Link
            className={classNames(
              'block font-medium text-14 border-0 border-l border-solid border-gray-300 ml-8 pl-4 py-2.5',
              item.href === pathname ? 'bg-primary-0' : 'hover:bg-primary-100'
            )}
            to={item.href}
            key={item.label}
          >
            {item.label}
          </Link>
        ))
      }</Collapse> : null}
    </>
  );
}

import { useEffect, useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Tooltip, rem, Menu } from '@mantine/core';
import { IoIosArrowForward } from "react-icons/io";
import classes from './LinksGroup.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAppSelector } from '@/hooks';
import { openSidebarClinicSelector, userInfoSelector } from '@/store';
import { AuthModule } from '@/enums';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  href?: string;
  children?: { label: string; href: string, hidden?: boolean }[];
  hidden?: boolean;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, children, href, hidden }: LinksGroupProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hasLinks = Array.isArray(children);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const isOpenSidebar = useAppSelector(openSidebarClinicSelector);
  const userInfo = useAppSelector(userInfoSelector);

  useEffect(() => {
    setOpened(false);
  }, [isOpenSidebar])

  if (hidden && userInfo?.moduleId === AuthModule.ClinicStaff) return null;

  return (
    <>
      <Menu trigger="hover" position='right-start' openDelay={100} closeDelay={200} arrowOffset={20} withArrow arrowSize={15}>
        <Menu.Target>
          <Box
            onClick={() => href ? navigate(href) : setOpened((o) => !o)}
            className={classNames(
              'w-full text-14 block px-4 py-2.5 cursor-pointer',
              href === pathname ? 'bg-primary-0 text-teal-600' : 'hover:bg-primary-100 text-gray-700'
            )}>
            <Group justify="space-between" gap={0}>
              <Tooltip color='white' c='gray.9' label={label} disabled={isOpenSidebar || hasLinks} withArrow position='right'>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <ThemeIcon c={href === pathname ? 'white' : 'teal.7'} bg={href === pathname ? 'teal.7' : 'white'} variant="light" size={30}>
                    <Icon size={22} />
                  </ThemeIcon>
                  {isOpenSidebar && <Box ml="md" className='line-clamp-1'>{label}</Box>}
                </Box>
              </Tooltip>

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
        </Menu.Target>
        {hasLinks && !isOpenSidebar && (
          <Menu.Dropdown>
            {children.map((item) => (!item.hidden || userInfo?.moduleId === AuthModule.ClinicOwner) && (
              <Menu.Item component={Link} to={item.href}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        )}
      </Menu>
      {hasLinks && isOpenSidebar ? <Collapse in={opened}>{
        children.map((item) => (!item.hidden || userInfo?.moduleId === AuthModule.ClinicOwner) && (
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

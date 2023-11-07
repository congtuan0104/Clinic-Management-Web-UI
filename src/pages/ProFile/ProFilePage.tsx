import React from 'react';
import { Paper, Text, Container, Group, Avatar, Input, Divider, Button, Flex } from '@mantine/core';
import classes from './UserInfoIcons.module.css';

const isGoogleLink = true;
const isFacebookLink = false;


const ProFilePage = () => {
  return (
    <div style={{display:'flex'}}>
      <Container style={{ flex: 3, height: '100%'}} my={40} >
        <Paper style={{height: '100%'}} withBorder shadow="md" p={30} mt={30} radius="md">
          <div>
            <Group wrap="nowrap">
              <Avatar
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
                size={94}
                radius="md"
              />
              <div>
                <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                  Bệnh nhân
                </Text>
                <Text fz="lg" fw={500} className={classes.name}>
                  Vo Hoai An
                </Text>
              </div>
            </Group>

            <div style={{ margin: '1rem 0' }}>
              <Text fz="lg" fw={700} className={classes.name}>
                Thông tin liên hệ
              </Text>
              <Divider />
            </div>

            <Input.Wrapper label="Email" style={{ margin: '1rem 0' }}>
              <Input placeholder="example@gmail.com" readOnly />
            </Input.Wrapper>

            <Input.Wrapper label="SĐT" style={{ margin: '1rem 0' }}>
              <Input placeholder="098938696" readOnly />
            </Input.Wrapper>
            <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
              <Button mt="xl" radius="sm" size="md" type="submit">
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </Paper>
      </Container>

      <Container style={{ flex: 2, height: '100%'}} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Text fz="xl" fw={700} className={classes.name}>
            Đăng nhập
          </Text>
          <div>
            <Text pt={30} fz="md" fw={700} className={classes.name}>
              Mật khẩu
            </Text>
            <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
              Cập nhật lần cuối 19 phút trước
            </Text>
            <Divider />
          </div>
          <Text pt={30} fz="xl" fw={700} className={classes.name}>
            Tài khoản xã hội
          </Text>
          <div>
            <Text pt={30} fz="md" fw={700} className={classes.name}>
              Facebook
            </Text>
            <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
              {isFacebookLink ? ('Đã kết nối') : ('Chưa kết nối')}
            </Text>
            <Divider />
          </div>
          <div>
            <Text pt={30} fz="md" fw={700} className={classes.name}>
              Google
            </Text>
            <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
              {isGoogleLink ? ('Đã kết nối') : ('Chưa kết nối')}
            </Text>
            <Divider />
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default ProFilePage;

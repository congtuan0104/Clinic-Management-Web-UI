import { Paper, Text, Group, Avatar, Input, Divider, Button, Flex, Badge, Box, Modal, Anchor, ColorSchemeScript, Container } from '@mantine/core';
import { PasswordInput } from 'react-hook-form-mantine';
import { useDisclosure } from '@mantine/hooks';

import { FaCheck } from "react-icons/fa";

import {
    theme
} from '@/config';
import classes from './style.module.css';



const data = [
    {
        name: 'BASIC',
        price: '100.000',
        numberOfUsers: '50',
        feature1: {
            description: 'Tính năng 1',
            isActive: true
        },
        feature2: {
            description: 'Tính năng 2',
            isActive: false
        },
        feature3: {
            description: 'Tính năng 3',
            isActive: false
        },
    },
    {
        name: 'MEDIUM',
        price: '200.000',
        numberOfUsers: '100',
        feature1: {
            description: 'Tính năng 1',
            isActive: true
        },
        feature2: {
            description: 'Tính năng 2',
            isActive: true
        },
        feature3: {
            description: 'Tính năng 3',
            isActive: false
        },
    },
    {
        name: 'HIGH',
        price: '500.000',
        numberOfUsers: '200',
        feature1: {
            description: 'Tính năng 1',
            isActive: true
        },
        feature2: {
            description: 'Tính năng 2',
            isActive: true
        },
        feature3: {
            description: 'Tính năng 3',
            isActive: true
        },
    },

];

const _buildFeature = (text: string) => {
    return (
        <Group>
            <FaCheck size="1rem" stroke={1.5} color='primary' />
            <Text>{text}</Text>
        </Group>
    );
};


const PricingPlanPage = () => {
    return (
        <div>
            <Text ta="center" pt={30} size="xl" fw={600}>
                Bảng giá dịch vụ
            </Text>
            <Flex my={30} mx={{ base: 15, md: 0 }} gap={20} direction={{ base: 'column', md: 'row' }}>
                {data.map((item, index) => (
                    <Paper key={index} w="100%" withBorder shadow="md" p={30} radius="md" className={classes.PaperWithButton}>
                        <Text ta="center" c={'primary'} fw={700} fz="lg">{item.name}</Text>
                        <Divider pb={10} color='primary'></Divider>

                            <Text ta="center" size='lg'>{item.price}</Text>
                            <Text ta="center" c={'grey'} size='sm'>/ tháng</Text>

                        <Group>
                            <FaCheck size="1rem" color='#6964ff' stroke={1.5} />
                            <Text>{item.numberOfUsers} người dùng</Text>
                        </Group>
                        {item.feature1.isActive ? _buildFeature(item.feature1.description) : null}
                        {item.feature2.isActive ? _buildFeature(item.feature2.description) : null}
                        {item.feature3.isActive ? _buildFeature(item.feature3.description) : null}

                        <div style={{ marginBottom: '4rem' }} />
                        <Button mt="xl" radius="sm" size="md" type="submit">
                            Mua gói
                        </Button>

                    </Paper>
                ))}
            </Flex>
        </div>
    );
}

export default PricingPlanPage;

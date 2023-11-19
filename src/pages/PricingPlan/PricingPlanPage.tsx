import { Paper, Text, Group, Avatar, Input, Divider, Button, Flex, Badge, Box, Modal, Anchor, ColorSchemeScript, Container } from '@mantine/core';
import { PasswordInput } from 'react-hook-form-mantine';
import { useDisclosure } from '@mantine/hooks';

import { FaCheck } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";

import {
    theme
} from '@/config';
import classes from './style.module.css';


const data = [
    {
        name: 'BASIC',
        price: '100.000',
        numberOfUsers: '50',
        features: [
            {
                description: 'Tính năng 1',
                isActive: true
            },
            {
                description: 'Tính năng 2',
                isActive: false
            },
            {
                description: 'Tính năng 3',
                isActive: false
            },
        ],
    },
    {
        name: 'MEDIUM',
        price: '200.000',
        numberOfUsers: '100',
        features: [
            {
                description: 'Tính năng 1',
                isActive: true
            },
            {
                description: 'Tính năng 2',
                isActive: true
            },
            {
                description: 'Tính năng 3',
                isActive: false
            },
        ],
    },
    {
        name: 'HIGH',
        price: '500.000',
        numberOfUsers: '200',
        features: [
            {
                description: 'Tính năng 1',
                isActive: true
            },
            {
                description: 'Tính năng 2',
                isActive: true
            },
            {
                description: 'Tính năng 3',
                isActive: true
            },
        ],
    },

];


const _buildFeature = (text: string) => {
    return (
        <Group>
            <FaCheck size="1rem" stroke={1.5} color="var(--mantine-color-primary-3)" />
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
                            <FaCheck size="1rem" color="var(--mantine-color-primary-3)" stroke={1.5} />
                            <Text>{item.numberOfUsers} người dùng</Text>
                        </Group>
                        {item.features.map((feature) => (
                            feature.isActive ? _buildFeature(feature.description) : null
                        ))}

                        <div style={{ margin: '4rem' }} />
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

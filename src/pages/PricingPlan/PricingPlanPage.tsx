import {Text, Flex} from '@mantine/core';

import PlanCard from '@/components/Card/PlanCard';

const plans = [
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

const PricingPlanPage = () => {
    return (
        <div>
            <Text ta="center" pt={30} size="xl" fw={600}>
                Bảng giá dịch vụ
            </Text>
            <Flex my={30} mx={{ base: 15, md: 0 }} gap={20} direction={{ base: 'column', md: 'row' }}>
                {plans.map((plan, index) => (
                    <PlanCard key={index} plan={plan} />
                ))}
            </Flex>
        </div>
    );
}

export default PricingPlanPage;

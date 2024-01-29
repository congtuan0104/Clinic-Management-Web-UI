import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Container, Badge, Center, Divider, Grid, TextInput, Paper, GridCol } from '@mantine/core';
import { PATHS } from '@/config';
import { CiSearch } from "react-icons/ci";
import { ClinicCard } from '@/components';
import { clinicApi } from '@/services';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { IClinic } from '@/types';
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';
import { useDebouncedState } from '@mantine/hooks';



const ClinicsPage = () => {
    const { data: clinics, isLoading, refetch } = useQuery('clinics', () => getAllClinics(value));
    const [clinicDetail, setClinicDetail] = useState<IClinic | undefined>(undefined);
    const [value, setValue] = useDebouncedState('', 500);

    const getAllClinics = async (searchValue?: string) => {
        try {
            const response = await clinicApi.getClinics({name: searchValue});
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {      
            refetch();
        };

        fetchData();
    }, [value, refetch]);

    return (
        <Center>
            <div>
                <Center>
                    <Text fw={700} size='30px' m={20} c={'primary.3'}>Phòng khám</Text>
                    
                </Center>
                <Center>
                <Text size='15px' mb={20}>Với những phòng khám hàng đầu sẽ giúp trải nghiệm khám, chữa bệnh của bạn tốt hơn</Text>
                </Center>
                <Center>
                    <TextInput
                        w={'30%'}
                        radius={'md'}
                        leftSection={<CiSearch />}
                        placeholder='Tìm kiếm phòng khám'
                        onChange={(event) => setValue(event.currentTarget.value)}
                    />
                </Center>

                <Flex pt={30} pb={30} wrap="wrap" gap={'md'}>
                    {clinics && clinics.map((clinic) => (
                        <div key={clinic.id} style={{ flex: '0 0 auto', width: clinics.length === 1 ? '100%' : clinics.length === 2 ? '100%': '48%' }}>
                            <ClinicCard clinic={clinic} actionText='Chi tiết' action={() => setClinicDetail(clinic)} />
                        </div>
                    ))}
                    
                </Flex>
            </div>

        </Center>

    );
};

export default ClinicsPage;

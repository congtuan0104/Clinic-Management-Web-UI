import { useEffect, useMemo, useState } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
  Text,
  Image,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  Grid,
  TextInput as MantineTextInput,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector, staffInfoSelector } from '@/store';
import { useQuery } from 'react-query';
import { IMedicalRecord } from '@/types';

import { Link, useParams } from 'react-router-dom';
import { medicalRecordApi } from '@/services';


const VisitPatientPage = () => {
  const { id: recordId } = useParams();

  const currentClinic = useAppSelector(currentClinicSelector);
  const staffInfo = useAppSelector(staffInfoSelector);

  const { data: record, isLoading, refetch } = useQuery(
    'medicalRecord',
    () => medicalRecordApi
      .getMedicalRecordDetail(Number(recordId))
      .then((res) => res.data),
    {
      enabled: !!recordId,
      refetchOnWindowFocus: false,
    });


  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Khám bệnh</Title>
        </Flex>

        <Paper p='md' radius='md'>
          <Text>Thông tin bệnh nhân</Text>
          <Grid mt='md'>
            <Grid.Col span={3}>
              <Avatar
                src={record?.patient?.avatar}
                size={200}
                radius='50%'
                alt={record?.patient?.lastName}

              />
            </Grid.Col>
            <Grid.Col span={4}>
              <MantineTextInput
                label="Tên bệnh nhân"
                value={`${record?.patient?.firstName} ${record?.patient?.lastName}`}
                readOnly
                size='md'
              />
            </Grid.Col>
          </Grid>
        </Paper>


      </Flex>
    </>
  );
};

export default VisitPatientPage;

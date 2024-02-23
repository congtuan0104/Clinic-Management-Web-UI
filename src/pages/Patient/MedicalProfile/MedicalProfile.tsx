import { useEffect, useMemo, useRef, useState } from 'react';
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
  TextInput,
  Textarea,
  Select,
  Table,
  NumberInput
} from '@mantine/core';
import { useQuery } from 'react-query';
import { IMedicalRecord, IUpdateMedicalRecordPayload } from '@/types';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { medicalRecordApi } from '@/services';
import { Gender, MEDICO_RECORD_STATUS } from '@/enums';
import dayjs from 'dayjs';
import { Form, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { BiArrowBack, BiSave } from 'react-icons/bi';
import { GiBodyHeight, GiWeight } from 'react-icons/gi';
import { MdBloodtype, MdOutlineDownloadDone } from 'react-icons/md';
import { FaPlus, FaTemperatureLow } from 'react-icons/fa6';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import Prescription from './Prescription';
import { PATHS } from '@/config';
import MedicalService from './MedicalService';


const VisitPatientPage = () => {
  const { id: recordId } = useParams();
  const navigate = useNavigate();

  const recordRef = useRef<HTMLDivElement>(null);

  const { data: record, isLoading, refetch } = useQuery(
    'medicalRecord',
    () => medicalRecordApi
      .getMedicalRecordDetail(Number(recordId))
      .then((res) => res.data),
    {
      enabled: !!recordId,
      refetchOnWindowFocus: false,
    });

  const { patient, doctor, medicalRecordServices: services, prescriptionDetail, clinic } = record || {};

  return (
    <div className='max-w-screen-xl mx-auto'>

      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Flex gap={8}>
            <ActionIcon
              color="black.8"
              radius="xl"
              mt={2}
              variant='subtle'
              onClick={() => navigate(-1)}
            >
              <BiArrowBack size={24} />
            </ActionIcon>
            <Title order={3}>Hồ sơ khám bệnh</Title>
          </Flex>

        </Flex>


        <Paper p='md' radius='md' shadow="xs">
          <div className="flex items-center">
            {clinic?.logo && (
              <img src={clinic?.logo} alt="logo" className="w-[120px] h-[120px] mr-5" />
            )}
            <div className="flex flex-col flex-1">
              <p className="uppercase font-semibold">{clinic?.name}</p>
              <p>Địa chỉ: {clinic?.address}</p>
              <p>Số điện thoại: {clinic?.phone}</p>
              <p>Email: {clinic?.email}</p>
            </div>
          </div>

        </Paper>

        <Paper p='md' radius='md' shadow="xs">
          <Text fw={600}>Thông tin bệnh nhân</Text>
          <Flex gap={30} mt='md' align='center'>
            <Image
              src={record?.patient?.avatar}
              h={220}
              w={220}
              radius='50%'
              alt={record?.patient?.lastName}
              fallbackSrc='/assets/images/patient-placeholder.png'
            />
            <Grid>
              <Grid.Col span={5}>
                <TextInput
                  label="Tên bệnh nhân"
                  value={`${record?.patient?.firstName} ${record?.patient?.lastName}`}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <TextInput
                  label="Giới tính"
                  value={record?.patient.gender === Gender.Male ? 'Nam'
                    : record?.patient.gender === Gender.Female ? 'Nữ' : 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <TextInput
                  label="Tuổi"
                  value={patient?.birthday
                    ? dayjs().diff(patient?.birthday, 'year')
                    : 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>

              <Grid.Col span={5}>
                <TextInput
                  label="Địa chỉ"
                  value={patient?.address || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <TextInput
                  label="Email"
                  value={patient?.email}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <TextInput
                  label="Số điện thoại"
                  value={patient?.phone || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>

              <Grid.Col span={5}>
                <TextInput
                  label="Tiền sử bệnh"
                  value={patient?.anamnesis || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <TextInput
                  label="Số thẻ BHYT"
                  value={patient?.healthInsuranceCode || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <TextInput
                  label="Nhóm máu"
                  value={patient?.bloodGroup}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
            </Grid>
          </Flex>

        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <Flex align='flex-end' gap={20}>
            <Text fw={600} w={200}>Thông tin khám bệnh</Text>
            <Grid w='100%'>
              <Grid.Col span={4}>
                <TextInput
                  label="Ngày khám"
                  value={dayjs(record?.dateCreated).format('DD/MM/YYYY')}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Bác sĩ thực hiện khám"
                  value={doctor?.firstName + ' ' + doctor?.lastName}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Chuyên khoa"
                  value={doctor?.specialize || 'Không có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
            </Grid>
          </Flex>
        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <Flex align='flex-end' gap={20}>
            <Text fw={600} w={120}>Thông tin sinh hiệu</Text>

            <Grid>
              <Grid.Col span={3}>
                <NumberInput
                  label="Chiều cao (cm)"
                  name='height'
                  value={record?.height}
                  leftSection={<GiBodyHeight size={18} />}
                  size='md'
                  readOnly={true}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Cân nặng (kg)"
                  name='weight'
                  leftSection={<GiWeight size={18} />}
                  value={record?.weight}
                  size='md'
                  readOnly={true}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Huyết áp (mmHg)"
                  name='bloodPressure'
                  leftSection={<MdBloodtype size={18} />}
                  value={record?.bloodPressure}
                  readOnly={true}
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Nhiệt độ (°C)"
                  name='temperature'
                  value={record?.temperature}
                  leftSection={<FaTemperatureLow size={18} />}
                  size='md'
                  readOnly={true}
                />
              </Grid.Col>
            </Grid>
          </Flex>
        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <MedicalService
            medicalServices={services || []}
          />
        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <Flex align='center'>
            <Text fw={600}>Kết quả khám bệnh</Text>
            <Grid w={'100%'}>
              <Grid.Col span={4}>
                <Textarea
                  label="Lý do khám"
                  name='note'
                  readOnly
                  value={record?.note}
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Textarea
                  label="Chẩn đoán"
                  name='diagnose'
                  value={record?.diagnose}
                  required
                  size='md'
                  readOnly={true}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Textarea
                  label="Kết luận"
                  name='result'
                  value={record?.result}
                  required
                  size='md'
                  readOnly={true}
                />
              </Grid.Col>

            </Grid>
          </Flex>
        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <Prescription
            prescriptions={prescriptionDetail || []}
          />
        </Paper>
      </Flex>

    </div>
  );
};

export default VisitPatientPage;

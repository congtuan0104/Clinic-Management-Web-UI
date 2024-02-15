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
  Textarea as MantineTextarea,
  Select as MantineSelect,
  Table,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector, staffInfoSelector } from '@/store';
import { useQuery } from 'react-query';
import { IMedicalRecord, IUpdateMedicalRecordPayload } from '@/types';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { medicalRecordApi } from '@/services';
import { Gender, MEDICO_RECORD_STATUS } from '@/enums';
import dayjs from 'dayjs';
import { Form, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { NumberInput, TextInput, Textarea } from 'react-hook-form-mantine';
import { BiArrowBack, BiSave } from 'react-icons/bi';
import { GiBodyHeight, GiWeight } from 'react-icons/gi';
import { MdBloodtype, MdOutlineDownloadDone } from 'react-icons/md';
import { FaPlus, FaTemperatureLow } from 'react-icons/fa6';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import MedicalPrescription from './Prescription';
import { PATHS } from '@/config';

interface IFormData {
  height?: number;
  weight?: number;
  bloodPressure?: number;
  temperature?: number;
  diagnose: string;
  result: string;
  // examinationStatus?: number;
  // paymentStatus?: number;
  // note?: string;
}

const validateSchema = yup.object().shape({
  height: yup.number(),
  weight: yup.number(),
  bloodPressure: yup.number(),
  temperature: yup.number(),
  diagnose: yup.string().required('Vui lòng nhập chuẩn đoán'),
  result: yup.string().required('Vui lòng nhập kết quả'),
  // note: yup.string(),
});



const VisitPatientPage = () => {
  const { id: recordId } = useParams();
  const navigate = useNavigate();

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

  const { patient, doctor, medicalRecordServices: services, prescriptionDetail } = record || {};

  const { control, reset, setValue } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      height: record?.height,
      weight: record?.weight,
      bloodPressure: record?.bloodPressure,
      temperature: record?.temperature,
      diagnose: record?.diagnose || '',
      result: record?.result || '',
      // note: record?.note || '',
    },
  });

  const handleSaveRecord = async (data: IFormData) => {
    const payload: IUpdateMedicalRecordPayload = {
      height: data.height,
      weight: data.weight,
      bloodPressure: data.bloodPressure,
      temperature: data.temperature,
      diagnose: data.diagnose,
      result: data.result,
      examinationStatus: record?.examinationStatus,
      paymentStatus: record?.paymentStatus,
      note: record?.note,
      patientId: record?.patientId,
      clinicId: record?.clinicId,
      doctorId: record?.doctorId,
    }

    const res = await medicalRecordApi.updateMedicalRecord(Number(recordId), payload);

    if (res.status) {
      refetch();
      notifications.show({
        title: 'Thành công',
        message: 'Hồ sơ khám bệnh đã được cập nhật thành công!',
        color: 'teal.5',
      });
    }
    else {
      notifications.show({
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!',
        color: 'red.5',
      });
    }
  }

  const confirmCompleteExam = async () => {
    modals.openConfirmModal({
      title: <Text size='md' fw={700}>Xác nhận</Text>,
      children: (
        <Text size="sm" lh={1.6}>
          Xác nhận quá trình khám bệnh đã hoàn tất?
          Hồ sơ khám bệnh sau khi hoàn tất sẽ không thể chỉnh sửa.
        </Text>
      ),
      confirmProps: { color: 'primary.3' },
      onCancel: () => console.log('Cancel'),
      onConfirm: handleCompleteExamination,
    });

  }

  const handleCompleteExamination = async () => {
    const payload: IUpdateMedicalRecordPayload = {
      height: record?.height,
      weight: record?.weight,
      bloodPressure: record?.bloodPressure,
      temperature: record?.temperature,
      diagnose: record?.diagnose,
      result: record?.result,
      examinationStatus: MEDICO_RECORD_STATUS.DONE,
      paymentStatus: record?.paymentStatus,
      note: record?.note,
      patientId: record?.patientId,
      clinicId: record?.clinicId,
      doctorId: record?.doctorId,
    }

    const res = await medicalRecordApi.updateMedicalRecord(Number(recordId), payload);

    if (res.status) {
      refetch();
      notifications.show({
        title: 'Thành công',
        message: 'Hồ sơ khám bệnh đã được hoàn thành!',
        color: 'teal.5',
      });
    }
    else {
      notifications.show({
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!',
        color: 'red.5',
      });
    }
  }

  useEffect(() => {
    setValue('height', record?.height);
    setValue('weight', record?.weight);
    setValue('bloodPressure', record?.bloodPressure);
    setValue('temperature', record?.temperature);
    setValue('diagnose', record?.diagnose || '');
    setValue('result', record?.result || '');
    // setValue('note', record?.note);
  }, [record]);

  return (
    <Form
      control={control}
      onSubmit={(e) => handleSaveRecord(e.data)}
      onError={(e) => console.log(e)}>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Flex gap={8}>
            <ActionIcon
              color="black.8"
              radius="xl"
              mt={2}
              variant='subtle'
              onClick={() => navigate(PATHS.CLINIC_EXAMINATION)}
            >
              <BiArrowBack size={24} />
            </ActionIcon>
            <Title order={3}>Khám bệnh</Title>
          </Flex>
          {record?.examinationStatus === MEDICO_RECORD_STATUS.WAITING && (
            <Flex gap={10}>
              <Button color='secondary.3' leftSection={<BiSave size={18} />} type='submit'>
                Lưu hồ sơ
              </Button>
              {record?.result && record?.result !== '' && (
                <Button
                  color='teal.7'
                  leftSection={<MdOutlineDownloadDone size={18} />}
                  type='button'
                  onClick={confirmCompleteExam}
                >
                  Hoàn thành
                </Button>
              )}
            </Flex>
          )}
        </Flex>

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
                <MantineTextInput
                  label="Tên bệnh nhân"
                  value={`${record?.patient?.firstName} ${record?.patient?.lastName}`}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <MantineTextInput
                  label="Giới tính"
                  value={record?.patient.gender === Gender.Male ? 'Nam'
                    : record?.patient.gender === Gender.Female ? 'Nữ' : 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <MantineTextInput
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
                <MantineTextInput
                  label="Địa chỉ"
                  value={patient?.address || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <MantineTextInput
                  label="Email"
                  value={patient?.email}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <MantineTextInput
                  label="Số điện thoại"
                  value={patient?.phone || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>

              <Grid.Col span={5}>
                <MantineTextInput
                  label="Tiền sử bệnh"
                  value={patient?.anamnesis || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <MantineTextInput
                  label="Số thẻ BHYT"
                  value={patient?.healthInsuranceCode || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3.5}>
                <MantineTextInput
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
                <MantineTextInput
                  label="Ngày khám"
                  value={dayjs(record?.dateCreated).format('DD/MM/YYYY')}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <MantineTextInput
                  label="Bác sĩ thực hiện khám"
                  value={doctor?.firstName + ' ' + doctor?.lastName}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <MantineTextInput
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
                  control={control}
                  leftSection={<GiBodyHeight size={18} />}
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Cân nặng (kg)"
                  name='weight'
                  leftSection={<GiWeight size={18} />}
                  control={control}
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Huyết áp (mmHg)"
                  name='bloodPressure'
                  leftSection={<MdBloodtype size={18} />}
                  control={control}
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Nhiệt độ (°C)"
                  name='temperature'
                  control={control}
                  leftSection={<FaTemperatureLow size={18} />}
                  size='md'
                />
              </Grid.Col>
            </Grid>
          </Flex>
        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <Text fw={600}>Chỉ định dịch vụ</Text>
          <Table mt='sm' bg='gray.0'
            styles={{
              table: { borderRadius: 10 },
            }}
          >
            <Table.Thead bg='secondary.3' c='white' style={{
              borderRadius: '10px 10px 0 0'
            }}>
              <Table.Tr>
                <Table.Th style={{ borderRadius: '10px 0 0 0' }}>Dịch vụ</Table.Th>
                <Table.Th>Bác sĩ thực hiện</Table.Th>
                <Table.Th>Kết quả dịch vụ</Table.Th>
                <Table.Th w={50} style={{ borderRadius: '0 10px 0 0' }}>
                  <Tooltip label='Yêu cầu thêm dịch vụ'>
                    <ActionIcon
                      color="primary.3"
                      radius="xl"
                      variant='white'
                    // onClick={handleAddService}
                    // disabled={!patientInfo}
                    >
                      <FaPlus size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(!services || services.length === 0) && (
                <Table.Tr>
                  <Table.Td colSpan={4} className="text-center leading-9">Chưa có dịch vụ nào được chỉ định</Table.Td>
                </Table.Tr>
              )}
              {services?.map((service, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{service.serviceName}</Table.Td>
                  <Table.Td>{service.doctorId}</Table.Td>
                  <Table.Td>{service.serviceResult}</Table.Td>
                  <Table.Td>
                    <Tooltip label='Xem chi tiết'>
                      <ActionIcon
                        color="primary.3"
                        radius="xl"
                        variant='white'
                      // onClick={() => handleViewServiceDetail(service)}
                      >
                        <BiArrowBack size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <Flex align='center'>
            <Text fw={600}>Kết quả khám bệnh</Text>
            <Grid w={'100%'}>
              <Grid.Col span={4}>
                <MantineTextarea
                  label="Lý do khám"
                  name='note'
                  readOnly
                  value={record?.note}
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Textarea
                  label="Chuẩn đoán"
                  name='diagnose'
                  control={control}
                  required
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Textarea
                  label="Kết luận"
                  name='result'
                  control={control}
                  required
                  size='md'
                />
              </Grid.Col>

            </Grid>
          </Flex>
        </Paper>

        <Paper p='md' radius='md' mt='sm' shadow="xs">
          <MedicalPrescription
            recordId={Number(recordId)}
            prescriptions={prescriptionDetail || []}
            onUpdateSuccess={() => refetch()}
          />
        </Paper>



      </Flex>
    </Form>
  );
};

export default VisitPatientPage;

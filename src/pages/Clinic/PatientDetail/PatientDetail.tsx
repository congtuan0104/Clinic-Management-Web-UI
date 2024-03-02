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
  TextInput as MantineTextInput,
  Textarea as MantineTextarea,
  Select as MantineSelect,
  Table,
  Group,
  Divider,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector, staffInfoSelector } from '@/store';
import { useQuery } from 'react-query';
import { IMedicalRecord, IUpdateMedicalRecordPayload, IUpdatePatientPayload } from '@/types';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { medicalRecordApi, patientApi } from '@/services';
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
import { PATHS } from '@/config';
import { CurrencyFormatter, MedicalRecordPrintContext } from '@/components';
import { useReactToPrint } from 'react-to-print';
import { IoPrintSharp } from 'react-icons/io5';

interface IFormData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  // gender?: Gender;
  // birthday?: Date;
  avatar?: string;
  bloodGroup?: string;
  anamnesis?: string;
  idCard?: string;
  healthInsuranceCode?: string;
}

const validateSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  phone: yup.string(),
  email: yup.string(),
  address: yup.string(),
  avatar: yup.string(),
  bloodGroup: yup.string(),
  anamnesis: yup.string(),
  idCard: yup.string(),
  healthInsuranceCode: yup.string(),
});



const PatientDetail = () => {
  const { id: patientId } = useParams();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const navigate = useNavigate();

  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: patient, isLoading, refetch } = useQuery([
    'patient', patientId, currentClinic],
    () => patientApi
      .getPatientDetail(Number(patientId))
      .then((res) => res.data),
    {
      enabled: !!patientId,
      refetchOnWindowFocus: false,
    });

  const { data: medicalRecord } = useQuery([
    'medicalrecord', patientId, currentClinic],
    () => medicalRecordApi
      .getMedicalRecords({ clinicId: currentClinic?.id, patientId: Number(patientId) })
      .then((res) => res.data),
    {
      enabled: !!currentClinic,
      refetchOnWindowFocus: false,
    });


  const { control, reset, setValue } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      firstName: patient?.firstName ?? '',
      lastName: patient?.lastName ?? '',
      phone: patient?.phone ?? '',
      email: patient?.email ?? '',
      address: patient?.address ?? '',
      avatar: patient?.avatar ?? '',
      bloodGroup: patient?.bloodGroup ?? '',
      anamnesis: patient?.anamnesis ?? '',
      idCard: patient?.idCard ?? '',
      healthInsuranceCode: patient?.healthInsuranceCode ?? '',
    },
  });

  const onSubmit = async (data: IUpdatePatientPayload) => {
    const updateInfo: IUpdatePatientPayload = {
      bloodGroup: data.bloodGroup,
      anamnesis: data.anamnesis,
      idCard: data.idCard,
      healthInsuranceCode: data.healthInsuranceCode,
    }
    const res = await patientApi.updatePatient(patient?.id ?? -1, updateInfo)

    if (res.status) {
      notifications.show({
        title: 'Thông báo',
        message: 'Cập nhật thông tin bệnh nhân thành công',
        color: 'green',
      });
      setIsUpdate(false);
    }

  }


  useEffect(() => {
    setValue('firstName', patient?.firstName);
    setValue('lastName', patient?.lastName);
    setValue('phone', patient?.phone);
    setValue('email', patient?.email);
    setValue('address', patient?.address);
    setValue('avatar', patient?.avatar);
    setValue('idCard', patient?.idCard);
    setValue('bloodGroup', patient?.bloodGroup);
    setValue('anamnesis', patient?.anamnesis);
    setValue('healthInsuranceCode', patient?.healthInsuranceCode);
    // setValue('note', record?.note);
  }, [patient]);

  return (
    <>

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
            <Title order={3}>Hồ sơ bệnh nhân</Title>
          </Flex>

        </Flex>

        <Paper p='md' radius='md' shadow="xs">
          <Text fw={600}>Thông tin bệnh nhân</Text>
          <Flex gap={30} mt='md' align='center'>
            <Image
              src={patient?.avatar}
              h={220}
              w={220}
              radius='50%'
              alt={patient?.lastName}
              fallbackSrc='/assets/images/patient-placeholder.png'
            />
            <Grid>
              <Grid.Col span={4}>
                <MantineTextInput
                  label="Tên bệnh nhân"
                  value={`${patient?.firstName} ${patient?.lastName}`}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <MantineTextInput
                  label="Giới tính"
                  value={patient?.gender === Gender.Male ? 'Nam'
                    : patient?.gender === Gender.Female ? 'Nữ' : 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
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
              <Grid.Col span={4}>
                <MantineTextInput
                  label="Ngày sinh"
                  value={dayjs(patient?.birthday).format('DD/MM/YYYY') || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>


              <Grid.Col span={4}>
                <MantineTextInput
                  label="Email"
                  value={patient?.email}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <MantineTextInput
                  label="Số điện thoại"
                  value={patient?.phone || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <MantineTextInput
                  label="Địa chỉ"
                  value={patient?.address || 'Chưa có thông tin'}
                  readOnly
                  variant='filled'
                  size='md'
                />
              </Grid.Col>
            </Grid>
          </Flex>
          <Divider my={20} />
          <Form
            control={control}
            onSubmit={(e) => onSubmit(e.data)}>
            <Text fw={600} mb={10}>Thông tin y tế</Text>

            <Grid>
              <Grid.Col span={3}>
                <TextInput
                  label="CMND/CCCD"
                  name='idCard'
                  readOnly={!isUpdate}
                  variant='filled'
                  size='md'
                  control={control}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Số thẻ BHYT"
                  name='healthInsuranceCode'
                  readOnly={!isUpdate}
                  variant='filled'
                  size='md'
                  control={control}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Tiền sử bệnh"
                  name='anamnesis'
                  readOnly={!isUpdate}
                  variant='filled'
                  size='md'
                  control={control}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Nhóm máu"
                  name='bloodGroup'
                  readOnly={!isUpdate}
                  variant='filled'
                  size='md'
                  control={control}
                />
              </Grid.Col>
            </Grid>
            <Group justify='flex-end' align='flex-end' pt={20}>
              {!isUpdate ? (
                <Button onClick={() => setIsUpdate(!isUpdate)}>
                  Chỉnh sửa
                </Button>
              )
                :
                (
                  <>
                    <Button type="submit">Lưu thay đổi</Button>
                    <Button variant="outline" onClick={() => setIsUpdate(!isUpdate)} color='gray.6'>Hủy thay đổi</Button>
                  </>
                )}
            </Group>
          </Form>
        </Paper>
      </Flex>
      <Flex direction="column" gap="md" px="md">

        <Paper p='md' radius='md' shadow="xs">
          <Text fw={600}>Lịch sử khám bệnh</Text>
          <Flex gap={30} mt='md' align='center'>
            <Table striped withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Bác sĩ</Table.Th>
                  <Table.Th>Dịch vụ</Table.Th>
                  <Table.Th>Giá dịch vụ</Table.Th>
                  <Table.Th>Thuốc</Table.Th>
                  <Table.Th>Ngày tạo</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {medicalRecord && medicalRecord.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.doctor.firstName} {item.doctor.lastName}</Table.Td>
                    <Table.Td>{item.medicalRecordServices.map((service) => (
                      <Text>{service.serviceName}</Text>
                    ))}</Table.Td>
                    <Table.Td>{item.medicalRecordServices.map((service) => (
                      <Text><CurrencyFormatter value={service.amount} /></Text>
                    ))}</Table.Td>
                    <Table.Td>{item.prescriptionDetail.map((medicine) => (
                      <Text>{`${medicine.medicineName} : ${medicine.dosage} ${medicine.unit} (${medicine.duration} - ${medicine.usingTime} - ${medicine.doseInterval})`}</Text>
                    ))}</Table.Td>
                    <Table.Td>{dayjs(item.dateCreated).format('DD/MM/YYYY')}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Flex>
        </Paper>
      </Flex>
    </>
  );
};

export default PatientDetail;

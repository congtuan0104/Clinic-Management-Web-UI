import { AuthModule, Gender, PERMISSION } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, clinicServiceApi, medicalRecordApi, patientApi, staffApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { ICreatePatientPayload, INewMedicalRecordPayload, INewRecordService, IPatient } from "@/types";
import { phoneRegExp } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button, Flex, Grid, Modal, ModalBody, ModalCloseButton,
  ScrollArea, TextInput as MantineTextInput, Text, Table,
  Select as MantineSelect,
  ActionIcon,
  Tooltip,
  Divider
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import classNames from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { Autocomplete, DateInput, Select, TextInput, Textarea } from "react-hook-form-mantine";
import { SiMaildotru } from "react-icons/si";
import { useQuery } from "react-query";
import * as yup from "yup";
import { ModalNewPatient } from ".";
import { FiSearch } from "react-icons/fi";
import { FaPlus, FaUserDoctor, FaUserPlus } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { CurrencyFormatter } from "..";


interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IFormData {
  patientId: string;
  doctorId: string;
  dateCreated: Date;
  note: string;
}


const validateSchema = yup.object().shape({
  patientId: yup.string().required('Vui lòng chọn bệnh nhân'),
  doctorId: yup.string().required('Vui lòng chọn bác sĩ thực hiện khám'),
  dateCreated: yup.date().required('Vui lòng chọn ngày khám'),
  note: yup.string().required('Vui lòng nhập lý do khám'),
});


const ModalNewMedicalRecord = ({
  isOpen,
  onClose,
  onSuccess
}: IModalProps) => {

  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: patients, refetch, isLoading } = useQuery(
    ['clinic_patients', currentClinic?.id],
    () => patientApi.getPatients({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { data: staffs } = useQuery(
    ['doctors'],
    () => staffApi.getStaffs({
      clinicId: currentClinic?.id,
      isDisabled: false,
    }).then(
      res => res.data?.
        filter(staff => staff.role.permissions.map(p => p.id).includes(PERMISSION.PERFORM_SERVICE))
    ),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { data: services } = useQuery(
    ['clinic_service', currentClinic?.id],
    () => clinicServiceApi.getClinicServices
      (currentClinic!.id, false)
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset, watch, setError, setValue, formState: { errors, isValid } } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      // patientId
      dateCreated: new Date(),
    }
  });

  const patientId = watch('patientId');
  const [patientInfo, setPatientInfo] = useState<IPatient | undefined>(undefined);
  const [isPatientNew, setIsPatientNew] = useState(false);
  const [requestServices, setRequestServices] = useState<INewRecordService[]>([]);


  useEffect(() => {
    if (patientId) {
      const selectedPatient = patients?.find(patient => patient.id === Number(patientId));
      setPatientInfo(selectedPatient);
    }
    else {
      setPatientInfo(undefined);
    }
  }, [patientId, patients]);

  const handleSubmitForm = async (data: IFormData) => {
    console.log('form data', data)

    const payload: INewMedicalRecordPayload = {
      clinicId: currentClinic!.id,
      patientId: Number(data.patientId),
      doctorId: Number(data.doctorId),
      note: data.note,
      services: requestServices,
    }

    const res = await medicalRecordApi.createMedicalRecord(payload);

    if (res.status) {
      onSuccess();
      handleClose();
      notifications.show({
        title: 'Thành công',
        message: 'Hồ sơ khám bệnh mới đã được tạo',
        color: 'teal.5'
      });
    }
    else {
      notifications.show({
        title: 'Thất bại',
        message: 'Đã xảy ra lỗi khi tạo hồ sơ khám bệnh',
        color: 'red.5'
      });
    }
  }

  const handleClose = () => {
    onClose();
    reset();
    setPatientInfo(undefined);
    setRequestServices([]);
  }

  const handleAddService = () => {
    setRequestServices(prev => [...prev, {
      clinicId: currentClinic!.id,
      clinicServiceId: undefined,
      doctorId: undefined,
      serviceName: '',
      amount: 0,
    }])
  }

  const renderPatientInfo = () => {
    if (!patientInfo) return null;
    return <>
      <Grid mt="sm">
        <Grid.Col span={8}>
          <MantineTextInput
            label="Tên bệnh nhân"
            name="name"
            size="md"
            autoComplete="off"
            radius="md"
            readOnly={true}
            value={`${patientInfo.firstName} ${patientInfo.lastName}`}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <MantineTextInput
            label="Giới tính"
            name="gender"
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.gender === Gender.Male ? 'Nam' : patientInfo.gender === Gender.Female ? 'Nữ' : 'Không rõ'}
            readOnly={true}
          />

        </Grid.Col>
      </Grid>

      <Grid mt="sm">

        <Grid.Col span={4}>
          <MantineTextInput
            label="Ngày sinh"
            name="birthday"
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.birthday && dayjs(patientInfo.birthday).format('DD/MM/YYYY')}
            readOnly={true}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MantineTextInput
            label="Tuổi"
            name="age"
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.birthday ? (dayjs().diff(patientInfo.birthday, 'year') < 1 ?
              `${dayjs().diff(patientInfo.birthday, 'month')} tháng` :
              `${dayjs().diff(patientInfo.birthday, 'year')} tuổi`) : 'Chưa có thông tin'
            }
            readOnly={true}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MantineTextInput
            label="Nhóm máu"
            name="bloodGroup"
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.bloodGroup || 'Chưa có thông tin'}
            readOnly={true}
          />
        </Grid.Col>
      </Grid>

      <Grid mt="sm">
        <Grid.Col span={4}>
          <MantineTextInput
            label="Email"
            name="email"
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.email}
            readOnly={true}
          />

        </Grid.Col>
        <Grid.Col span={4}>
          <MantineTextInput
            label="Số điện thoại"
            name="phone"
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.phone}
            readOnly={true}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MantineTextInput
            label="Địa chỉ"
            name="address"
            required
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.address}
            readOnly={true}
          />
        </Grid.Col>
      </Grid>

      <Grid mt="sm">
        <Grid.Col span={4}>
          <MantineTextInput
            label="CMND/CCCD"
            name="idCard"
            required
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.idCard}
            readOnly={true}
          />

        </Grid.Col>
        <Grid.Col span={4}>
          <MantineTextInput
            label="Số thẻ BHYT"
            name="healthInsuranceNumber"
            required
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.healthInsuranceCode}
            readOnly={true}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MantineTextInput
            label="Tiền sử bệnh lý"
            name="anamnesis"
            required
            autoComplete="off"
            size="md"
            radius="md"
            value={patientInfo.anamnesis}
            readOnly={true}
          />
        </Grid.Col>
      </Grid>
    </>
  }

  return <>
    <Modal.Root opened={isOpen} onClose={handleClose} centered size={'xl'} scrollAreaComponent={ScrollArea.Autosize}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>
            Hồ sơ khám bệnh mới
          </Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>
            <div className="flex mt-3 justify-center items-center">
              <Text size="lg" tt='uppercase' fw={600}>Thông tin bệnh nhân</Text>
              <Divider size={2} className="flex-1" ml={10} />
            </div>
            <Grid mt='sm' align="flex-end">
              <Grid.Col span={8}>
                <Select
                  label="Bệnh nhân"
                  w="100%"
                  name="patientId"
                  variant="filled"
                  searchable
                  leftSection={<FiSearch />}
                  control={control}
                  placeholder="Nhập tên, email hoặc SĐT để tìm kiếm bệnh nhân"
                  size="md"
                  data={
                    patients?.map(patient => ({
                      value: patient.id.toString(),
                      label: `${patient.firstName} ${patient.lastName} (${patient.email})`,
                    }))
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Button size="md" color="primary.3" radius="md" variant="light" fullWidth
                  onClick={() => setIsPatientNew(true)}
                  leftSection={<FaUserPlus size={18} />}
                >
                  Bệnh nhân mới
                </Button>
              </Grid.Col>
            </Grid>

            {renderPatientInfo()}

            <div className="flex mt-6 justify-center items-center">
              <Text size="lg" tt='uppercase' fw={600}>Thông tin khám bệnh</Text>
              <Divider size={2} className="flex-1" ml={10} />
            </div>


            <Grid mt='sm' align="flex-end">
              <Grid.Col span={8}>
                <Select
                  label="Bác sĩ tiếp nhận"
                  w="100%"
                  name="doctorId"
                  leftSection={<FaUserDoctor />}
                  disabled={!patientInfo}
                  control={control}
                  placeholder="Nhập tên bác sĩ để tìm kiếm"
                  size="md"
                  data={staffs?.map(staff => ({
                    value: staff.id.toString(),
                    label: `Bs. ${staff.users.firstName} ${staff.users.lastName}`,
                  }))}
                  required
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <DateInput
                  label="Ngày thực hiện khám"
                  name="dateCreated"
                  required
                  disabled={!patientInfo}
                  valueFormat="DD/MM/YYYY"
                  minDate={new Date()}
                  dateParser={(date) => dayjs(date, 'DD/MM/YYYY').toDate()}
                  leftSection={<FaCalendarAlt />}
                  control={control}
                  size="md"
                  radius="md"
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Lý do khám"
              name="note"
              disabled={!patientInfo}
              required
              mt='sm'
              control={control}
              size="md"
              radius="md"
              placeholder="Nhập lý do đến khám bệnh"
            />

            <Table mt='sm' bg='gray.0'
              styles={{
                table: { borderRadius: 10 },
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Dịch vụ</Table.Th>
                  <Table.Th>Bác sĩ thực hiện</Table.Th>
                  <Table.Th>Giá dịch vụ</Table.Th>
                  <Table.Th w={50}>
                    <Tooltip label='Thêm dịch vụ'>
                      <ActionIcon
                        color="teal.5"
                        radius="xl"
                        onClick={handleAddService}
                        disabled={!patientInfo}
                      >
                        <FaPlus size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {requestServices.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={4} className="text-center leading-9">Chưa có dịch vụ nào</Table.Td>
                  </Table.Tr>
                )}
                {requestServices.map((service, index) => (
                  <Table.Tr key={service.clinicServiceId}>
                    <Table.Td>
                      <MantineSelect
                        w="100%"
                        name={`services[${index}]-id`}
                        allowDeselect
                        variant="unstyled"
                        placeholder="Chọn dịch vụ"
                        data={services?.map(service => ({
                          value: service.id.toString(),
                          label: service.serviceName,
                          disabled: requestServices
                            .map(r => r.clinicServiceId)
                            .includes(service.id)
                            && service.id !== requestServices[index].clinicServiceId
                        }))}
                        radius='xs'
                        value={service?.clinicServiceId?.toString()}
                        onChange={value => {
                          setRequestServices(prev => {
                            const newServices = [...prev];
                            newServices[index].clinicServiceId = Number(value);
                            newServices[index].serviceName = services?.find(s => s.id === Number(value))?.serviceName || '';
                            newServices[index].amount = services?.find(s => s.id === Number(value))?.price || 0;
                            return newServices;
                          })
                        }}
                        required
                      />
                    </Table.Td>
                    <Table.Td>
                      <MantineSelect
                        w="100%"
                        name={`services[${index}]-id`}
                        // disabled={!patientInfo}
                        variant="unstyled"
                        placeholder="Chọn bác sĩ thực hiện"
                        data={staffs?.map(staff => ({
                          value: staff.id.toString(),
                          label: `Bs. ${staff.users.firstName} ${staff.users.lastName}`,
                        }))}
                        radius='xs'
                        value={service?.doctorId?.toString()}
                        onChange={value => {
                          setRequestServices(prev => {
                            const newServices = [...prev];
                            newServices[index].doctorId = Number(value);
                            return newServices;
                          })
                        }}
                        required
                      />
                    </Table.Td>
                    <Table.Td>
                      {service.amount &&
                        <CurrencyFormatter value={service.amount} />
                      }
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label='Xóa dịch vụ'>
                        <ActionIcon
                          color="red.5"
                          radius="xl"
                          onClick={() => setRequestServices(prev => prev.filter((_, i) => i !== index))}
                        >
                          <MdOutlineDelete size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Flex justify='end' gap={10} mt={10}>
              <Button mt="lg" radius="md" size="md" color='gray.5' onClick={handleClose}>
                Hủy
              </Button>
              <Button mt="lg" radius="md" size="md" type="submit" color="primary.3">
                Lưu hồ sơ
              </Button>
            </Flex>
          </Form>
        </ModalBody>
      </Modal.Content>
    </Modal.Root >

    <ModalNewPatient
      isOpen={isPatientNew}
      onClose={() => setIsPatientNew(false)}
      onSuccess={() => refetch()}
    />
  </>
}

export default ModalNewMedicalRecord;
import { APPOINTMENT_STATUS, Gender, PERMISSION } from "@/enums";
import { IAppointment, INewAppointmentPayload } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Modal, Text, Button, ScrollArea, Title, ActionIcon, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { DateInput, Select, TextInput, Textarea, Chip } from "react-hook-form-mantine";
import { FaRegClock } from "react-icons/fa";
import { FaCalendarDays, FaUserDoctor, FaUserPlus } from "react-icons/fa6";
import * as yup from 'yup';
import { ModalNewPatient } from "@/components";
import { useAppSelector } from "@/hooks";
import { currentClinicSelector } from "@/store";
import { useQuery } from "react-query";
import { clinicServiceApi, patientApi, staffApi } from "@/services";
import { BiPlus } from "react-icons/bi";
import { IoPrintSharp } from "react-icons/io5";
import ReactToPrint from "react-to-print";
import { appointmentApi } from "@/services/appointment.service";
import { notifications } from "@mantine/notifications";
import { MdMedicalServices } from "react-icons/md";
import { dateParser } from "@/utils";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  date?: Date;
  onSuccess: () => void;
}

interface IFormData {
  doctorId: string;
  patientId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime?: string;
  description?: string;
}

const schema = yup.object().shape({
  doctorId: yup.string().required('Bác sĩ không được để trống'),
  patientId: yup.string().required('Vui lòng chọn người hẹn khám hoặc thêm mới'),
  serviceId: yup.string().required('Vui lòng chọn dịch vụ khám'),
  date: yup.date().required('Chọn ngày hẹn khám'),
  startTime: yup.string().required('Chọn thời gian bắt đầu khám'),
  endTime: yup.string(),
  description: yup.string(),
});

const ModalAddAppointment = ({ isOpen, onClose, date, onSuccess }: IProps) => {
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);
  const currentClinic = useAppSelector(currentClinicSelector);

  const ref = useRef<HTMLDivElement>(null);

  const { control, reset, setValue, formState: { errors }, watch } = useForm<IFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: date || dayjs().add(1, 'day').toDate(),
      // doctorId: '',
      // patientId: '',
      // startTime: '',
      // endTime: '',
      description: '',
    },
  });

  const { data: patients, refetch, isLoading } = useQuery(
    ['clinic_patients', currentClinic?.id],
    () => patientApi.getPatients({ clinicId: currentClinic?.id })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { data: staffs } = useQuery(
    ['doctors'],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id })
      .then(
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
    () => clinicServiceApi.getClinicServices(currentClinic!.id, false)
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  // useEffect(() => {
  //   if (isOpen) {
  //     reset();
  //     setStep(Step.SelectTime);
  //   }
  // }, [isOpen]);

  const selectedService = useMemo(() => {
    const serviceId = watch('serviceId');
    return services?.find(service => service.id === Number(serviceId));
  }, [watch('serviceId')]);

  useEffect(() => {
    if (date) {
      const startTime = dayjs(date).format('HH:mm');
      // thời gian kết thức khám sau thời gian bắt đầu khám 15 phút
      const endTime = dayjs(date,).add(15, 'minute').format('HH:mm');

      setValue('date', date);
      setValue('startTime', startTime);
      setValue('endTime', endTime);
    }
  }, [date]);

  useEffect(() => {
    if (!selectedService || !selectedService.staffIds.includes(Number(watch('doctorId')))) {
      setValue('doctorId', '');
    }
  }, [selectedService]);

  const renderForm = () => {
    return (
      <>
        <div className="flex justify-between gap-4 items-end">

          <DateInput
            label="Chọn ngày hẹn khám"
            name="date"
            required
            size="md"
            radius="md"
            mt={20}
            w={'100%'}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
            minDate={dayjs().add(1, 'day').toDate()}
            control={control}
            leftSection={<FaCalendarDays size={18} />}
          />

          <Select
            label="Dịch vụ"
            placeholder="Chọn dịch vụ khám bệnh"
            required
            name='serviceId'
            size="md"
            radius='md'
            // disabled={!watch('doctorId')}
            allowDeselect
            data={services?.map((service) => ({
              value: service.id.toString(),
              label: service.serviceName,
            })) || []}
            searchable
            leftSection={<MdMedicalServices size={18} />}
            w={'100%'}
            control={control}
          />


        </div>

        <div className="flex justify-between gap-4 items-end mt-3">
          <Select
            label="Bác sĩ"
            placeholder="Chọn bác sĩ khám bệnh"
            required
            name='doctorId'
            size="md"
            radius='md'
            allowDeselect
            data={staffs?.map((staff) => ({
              value: staff.id.toString(),
              label: `${staff.users.firstName} ${staff.users.lastName}`,
              disabled: selectedService && !selectedService.staffIds.includes(staff.id)
            })) || []}
            searchable
            leftSection={<FaUserDoctor size={18} />}
            w={'100%'}
            control={control}
          />
          <Select
            label="Người đặt lịch hẹn"
            placeholder="Tìm kiếm tên bệnh nhân"
            required
            name='patientId'
            pr={0}
            size="md"
            radius='md'
            data={patients?.map((patient) => ({
              value: patient.id.toString(),
              label: `${patient.firstName} ${patient.lastName} (${patient.phone}) - ${patient.address}`
            })) || []}
            searchable
            w={'100%'}
            allowDeselect
            rightSectionWidth={128}
            rightSection={
              <Tooltip label='Bệnh nhân mới'>
                <Button
                  // variant='subtle'
                  color='gray.6'
                  size='md'
                  style={{
                    borderStartStartRadius: 0,
                    borderEndStartRadius: 0
                  }}
                  leftSection={<FaUserPlus size={20} />}
                  onClick={() => setOpenCreateModal(true)}>
                  BN mới
                </Button>
              </Tooltip>
            }
            rightSectionPointerEvents='auto'
            control={control}
          />

        </div>

        <Chip.Group name="startTime" control={control}>
          <Text mt={20} mb={5}>Chọn thời gian khám (Lịch hẹn bắt đầu lúc)</Text>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-x-3 gap-y-2 mt-1 p-3 border-solid border-[1px] border-gray-300 rounded-lg max-h-[200px] overflow-y-auto">
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="09:15">09:15</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="09:30">09:30</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="09:45">09:45</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="10:00">10:00</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="10:15">10:15</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="10:30">10:30</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="10:45">10:45</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="11:00">11:00</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="11:15">11:15</Chip.Item>
            <Chip.Item icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="11:30">11:30</Chip.Item>

          </div>
        </Chip.Group>

        <Textarea
          label="Mô tả"
          placeholder="Thêm ghi chú, nguyên nhân khám (nếu có)"
          name='description'
          size="md"
          radius='md'
          minRows={4}
          autosize
          mt={20}
          control={control}
        />

        <div className="mt-3 flex justify-end gap-4">
          <Button
            type="button"
            color="gray.6"
            onClick={onClose}
            size="md"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="md"
            color="primary.3"
          >
            Xác nhận
          </Button>
        </div>
      </>
    )
  }


  const handleSubmit = async (data: IFormData) => {
    if (!currentClinic?.id) return;
    const startTimeObj = dayjs(data.date).set('hour', Number(data.startTime.split(':')[0])).set('minute', Number(data.startTime.split(':')[1]));
    const endTime = dayjs(startTimeObj).add(15, 'minute').format('HH:mm');

    const payload: INewAppointmentPayload = {
      clinicId: currentClinic?.id,
      doctorId: Number(data.doctorId),
      patientId: Number(data.patientId),
      serviceId: Number(data.serviceId),
      date: dayjs(data.date).format('YYYY-MM-DD'),
      startTime: data.startTime,
      endTime: endTime,
      description: data.description,
      status: APPOINTMENT_STATUS.CONFIRM
    }

    console.log(payload);

    const res = await appointmentApi.createAppointment(payload);
    if (res.status) {
      notifications.show({
        title: 'Thành công',
        message: 'Tạo lịch hẹn thành công',
        color: 'teal.5',
      });
      onSuccess();
      onClose();
      reset();
    }
    else {
      notifications.show({
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại',
        color: 'red.5',
      });
    }
  }

  return (
    <>
      <Modal.Root
        opened={isOpen}
        onClose={onClose}
        size={'xl'}
        centered
        scrollAreaComponent={ScrollArea.Autosize}>
        <Modal.Overlay blur={7} />
        <Modal.Content radius='lg'>
          <Modal.Header bg='secondary.3'>
            <Modal.Title c='white' fz="lg" fw={600}>
              Đặt lịch hẹn khám
            </Modal.Title>
            <Modal.CloseButton variant="transparent" c="white" />
          </Modal.Header>
          <Modal.Body>
            <Form
              control={control}
              onSubmit={e => handleSubmit(e.data)}
              onError={e => console.log(e)}>
              {renderForm()}
            </Form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <ModalNewPatient
        isOpen={isOpenCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => refetch()}
      />
    </>
  )
}

export default ModalAddAppointment;
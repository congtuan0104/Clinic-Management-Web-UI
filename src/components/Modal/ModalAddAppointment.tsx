import { Gender } from "@/enums";
import { IAppointment, INewAppointmentPayload } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Modal, Text, Button, ScrollArea, Title } from "@mantine/core";
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
import { patientApi, staffApi } from "@/services";
import { BiPlus } from "react-icons/bi";
import { IoPrintSharp } from "react-icons/io5";
import ReactToPrint from "react-to-print";
import { watch } from "fs";
import { appointmentApi } from "@/services/appointment.service";
import { notifications } from "@mantine/notifications";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  date?: Date;
}

interface IFormData {
  doctorId: string;
  patientId: string;
  date: Date;
  startTime: string;
  endTime?: string;
  description?: string;
}

const schema = yup.object().shape({
  doctorId: yup.string().required('Bác sĩ không được để trống'),
  patientId: yup.string().required('Vui lòng chọn người hẹn khám hoặc thêm mới'),
  date: yup.date().required('Chọn ngày hẹn khám'),
  startTime: yup.string().required('Chọn thời gian bắt đầu khám'),
  endTime: yup.string(),
  description: yup.string(),
});

const ModalAddAppointment = ({ isOpen, onClose, date }: IProps) => {
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);
  const currentClinic = useAppSelector(currentClinicSelector);

  const ref = useRef<HTMLDivElement>(null);

  const { data: patients, refetch, isLoading } = useQuery(
    ['clinic_patients', currentClinic?.id],
    () => patientApi.getPatients({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { data: staffs } = useQuery(
    ['staffs'],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset, setValue, formState: { errors } } = useForm<IFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: date || new Date(),
      doctorId: '',
      patientId: '',
      startTime: '',
      endTime: '',
      description: '',
    },
  });

  // useEffect(() => {
  //   if (isOpen) {
  //     reset();
  //     setStep(Step.SelectTime);
  //   }
  // }, [isOpen]);

  useEffect(() => {
    if (date) {
      const startTime = dayjs(date).format('HH:mm');
      // thời gian kết thức khám sau thời gian bắt đầu khám 15 phút
      const endTime = dayjs(date).add(15, 'minute').format('HH:mm');

      setValue('date', date);
      setValue('startTime', startTime);
      setValue('endTime', endTime);
    }
  }, [date]);

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
            minDate={new Date()}
            control={control}
            rightSection={<FaCalendarDays size={18} />}
          />

          <Select
            label="Bác sĩ"
            placeholder="Chọn bác sĩ khám bệnh"
            required
            name='doctorId'
            size="md"
            radius='md'
            data={staffs?.map((staff) => ({
              value: staff.id.toString(),
              label: `${staff.users.firstName} ${staff.users.lastName}`
            })) || []}
            searchable
            leftSection={<FaUserDoctor size={18} />}
            w={'100%'}
            control={control}
          />
        </div>

        <div className="flex justify-between gap-4 items-end mt-3">

          <Select
            label="Người đặt lịch hẹn"
            placeholder="Tìm kiếm tên bệnh nhân"
            required
            name='patientId'
            size="md"
            radius='md'
            data={patients?.map((patient) => ({
              value: patient.id.toString(),
              label: `${patient.firstName} ${patient.lastName} (${patient.phone}) - ${patient.address}`
            })) || []}
            searchable
            w={'100%'}
            control={control}
          />

          <Button
            type="button"
            color="primary.3"
            size="md"
            variant="light"
            onClick={() => setOpenCreateModal(true)}
            w={250}
            leftSection={<FaUserPlus />}
          >
            Bệnh nhân mới
          </Button>

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

  // const renderConfirmStep = () => {
  //   return (
  //     <>
  //       <div className="flex flex-col p-3 border border-solid border-gray-500 rounded-md" ref={ref}>
  //         <Text fw={700} tt='uppercase'>{currentClinic?.name}</Text>
  //         <Text>Địa chỉ: {currentClinic?.address}</Text>
  //         <Text>SĐT liên hệ: {currentClinic?.phone}</Text>
  //         <Text>Email liên hệ: {currentClinic?.email}</Text>
  //         <Title tt='uppercase' ta='center' order={2}>Phiếu hẹn</Title>
  //         <Text>Thông tin bác sĩ: <b>Nguyễn Văn A</b></Text>
  //         <Text>Ngày hẹn khám: <b>12/12/2022</b></Text>
  //       </div>

  //       <div className="mt-3 flex justify-between gap-4">
  //         <ReactToPrint
  //           bodyClass="print-agreement"
  //           content={() => ref.current}
  //           trigger={() => (
  //             <Button
  //               type="button"
  //               color="secondary.3"
  //               size="md"
  //               leftSection={<IoPrintSharp />}>
  //               In phiếu hẹn
  //             </Button>
  //           )}
  //         />
  //         <div>
  //           <Button
  //             type="button"
  //             color="gray.6"
  //             onClick={onClose}
  //             size="md"
  //           >
  //             Hủy
  //           </Button>
  //           <Button
  //             type="submit"
  //             size="md"
  //             ml={8}
  //             color="primary"
  //           >
  //             Xác nhận
  //           </Button>
  //         </div>
  //       </div>
  //     </>
  //   )
  // }


  // const renderForm = () => {
  //   switch (step) {
  //     case Step.SelectTime:
  //       return renderSelectTimeStep();
  //     case Step.Confirm:
  //       return renderConfirmStep();
  //     default:
  //       return <></>
  //   }
  // }

  const handleSubmit = async (data: IFormData) => {
    console.log(data);
    if (!currentClinic?.id) return;

    const payload: INewAppointmentPayload = {
      clinicId: currentClinic?.id,
      doctorId: Number(data.doctorId),
      patientId: Number(data.patientId),
      date: dayjs(data.date).format('YYYY-MM-DD'),
      startTime: data.startTime,
      endTime: data.endTime || data.startTime,
      description: data.description,
    }

    console.log('payload', payload);
    const res = await appointmentApi.createAppointment(payload);

    if (res.status) {
      notifications.show({
        title: 'Thành công',
        message: 'Tạo lịch hẹn thành công',
        color: 'teal.5',
      });
    }

    // onSuccess();

  }

  return (
    <>
      <Modal.Root
        opened={isOpen}
        onClose={onClose}
        size={'xl'}
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
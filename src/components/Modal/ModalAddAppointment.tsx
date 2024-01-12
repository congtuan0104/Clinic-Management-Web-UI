import { IAppointment } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Modal, Text, Chip, Button } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DateInput, Select, TextInput, Textarea, } from "react-hook-form-mantine";
import { FaRegClock } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import * as yup from 'yup';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = yup.object().shape({
  doctor: yup.string().required('Bác sĩ không được để trống'),
  date: yup.date().required('Chọn ngày hẹn khám'),
  note: yup.string(),
  patientName: yup.string().required('Tên bệnh nhân không được để trống'),
});

enum Step {
  SelectTime,
  AddPatientInfo,
  Confirm
}


const ModalAddAppointment = ({ isOpen, onClose }: IProps) => {
  const [step, setStep] = useState(Step.SelectTime);


  const { control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      doctor: '',
      date: new Date(),
      note: '',
      patientName: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setStep(Step.SelectTime);
    }
  }, [isOpen]);


  const renderSelectTimeStep = () => {
    return (
      <>
        <div className="flex justify-between gap-4 items-end">
          <Select
            label="Bác sĩ"
            placeholder="Chọn bác sĩ khám bệnh"
            required
            name='doctor'
            size="md"
            radius='md'
            searchable
            w={'100%'}
            control={control}
          />

          <DateInput
            label="Chọn ngày hẹn khám"
            name="date"
            required
            size="md"
            radius="md"
            mt={20}
            w={'100%'}
            valueFormat="DD-MM-YYYY"
            control={control}
            rightSection={<FaCalendarDays size={18} />}
          />
        </div>

        <Chip.Group>
          <Text mt={20} mb={5}>Chọn thời gian khám</Text>
          <div className="grid grid-cols-3 gap-x-3 gap-y-2 mt-1 p-3 border-solid border-[1px] border-gray-300 rounded-lg max-h-[200px] overflow-y-auto">
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="1">09:15 AM - 09:25 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="2">09:30 AM - 09:40 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="3">09:45 AM - 09:55 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="4">10:00 AM - 10:10 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="5">10:15 AM - 10:25 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="6">10:30 AM - 10:40 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="7">10:45 AM - 10:55 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="8">11:00 AM - 11:10 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="9">11:15 AM - 11:25 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="10">11:30 AM - 11:40 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="11">11:45 AM - 11:55 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="12">12:00 AM - 12:10 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="13">12:15 AM - 12:25 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="14">12:30 AM - 12:40 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="15">12:45 AM - 12:55 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="16">13:00 AM - 13:10 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="17">13:15 AM - 13:25 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="18">13:30 AM - 13:40 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="19">13:45 AM - 13:55 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="20">14:00 AM - 14:10 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="21">14:15 AM - 14:25 AM</Chip>
            <Chip icon={<FaRegClock size={16} />} styles={{ label: { width: '100%' } }} size="md" value="22">14:30 AM - 14:40 AM</Chip>
          </div>
        </Chip.Group>

        <Textarea
          label="Ghi chú"
          placeholder="Thêm ghi chú (nếu có)"
          name='note'
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
            color="gray.5"
            onClick={onClose}
            size="md"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="md"
            color="primary"
            onClick={() => setStep(Step.AddPatientInfo)}
          >
            Tiếp tục
          </Button>
        </div>
      </>
    )
  }

  const renderAddPatientInfoStep = () => {
    return (
      <>
        <div className="flex justify-between gap-4 items-end">
          <TextInput
            label="Họ và tên"
            placeholder="Họ tên bệnh nhân"
            required
            name='patientName'
            size="md"
            radius='md'
            w={'100%'}
            control={control}
          />

          {/* <TextInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            required
            name='phone'
            size="md"
            radius='md'
            w={'100%'}
            control={control}
          /> */}
        </div>

        {/* <TextInput
          label="Email"
          placeholder="Nhập email"
          name='email'
          size="md"
          radius='md'
          mt={20}
          w={'100%'}
          control={control}
        />

        <TextInput
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          name='address'
          size="md"
          radius='md'
          mt={20}
          w={'100%'}
          control={control}
        /> */}

        <div className="mt-3 flex justify-end gap-4">
          <Button
            type="button"
            color="gray.5"
            onClick={() => setStep(Step.SelectTime)}
            size="md"
          >
            Quay lại
          </Button>
          <Button
            type="button"
            size="md"
            color="primary"
            onClick={() => setStep(Step.Confirm)}
          >
            Tiếp tục
          </Button>
        </div>
      </>
    )
  }

  const renderForm = () => {
    switch (step) {
      case Step.SelectTime:
        return renderSelectTimeStep();
      case Step.AddPatientInfo:
        return renderAddPatientInfoStep();
      case Step.Confirm:
        return <></>
      default:
        return <></>
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={onClose} size={step === Step.SelectTime ? 'auto' : 'lg'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>
            Đặt lịch hẹn khám
            {step === Step.SelectTime && ' - Chọn thời gian khám'}
            {step === Step.AddPatientInfo && ' - Thông tin bệnh nhân'}
          </Modal.Title>
          <Modal.CloseButton variant="transparent" c="white" />
        </Modal.Header>
        <Modal.Body>
          <form>
            {renderForm()}
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalAddAppointment;
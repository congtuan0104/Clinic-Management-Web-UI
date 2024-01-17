import { Gender } from "@/enums";
import { IAppointment } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Modal, Text, Chip, Button } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { DateInput, Select, TextInput, Textarea, } from "react-hook-form-mantine";
import { FaRegClock } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import * as yup from 'yup';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  date?: Date;
}

enum BLOOD_GROUP {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
}

const schema = yup.object().shape({
  doctor: yup.string().required('Bác sĩ không được để trống'),
  date: yup.date().required('Chọn ngày hẹn khám'),
  note: yup.string(),
  patientName: yup.string().required('Tên bệnh nhân không được để trống'),
  patientPhone: yup.string().required('Số điện thoại không được để trống'),
  patientEmail: yup.string().email('Email không hợp lệ'),
  reason: yup.string(),
  birthday: yup.date(),
  gender: yup.mixed<Gender>().oneOf(Object.values(Gender) as number[]).required('Giới tính không được để trống'),
  bloodGroup: yup.string().oneOf(Object.values(BLOOD_GROUP) as string[]),
});

enum Step {
  SelectTime,
  AddPatientInfo,
  Confirm
}


const ModalAddAppointment = ({ isOpen, onClose, date }: IProps) => {
  const [step, setStep] = useState(Step.SelectTime);


  const { control, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      doctor: '',
      date: new Date(),
      note: '',
      patientName: '',
      patientPhone: '',
      birthday: undefined,
      patientEmail: '',
      reason: '',
      gender: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setStep(Step.SelectTime);
    }
  }, [isOpen]);

  useEffect(() => {
    if (date) {
      setValue('date', date);
    }
  }, [date]);

  const renderSelectTimeStep = () => {
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
            valueFormat="DD-MM-YYYY"
            minDate={new Date()}
            control={control}
            rightSection={<FaCalendarDays size={18} />}
          />

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
        </div>

        <Chip.Group>
          <Text mt={20} mb={5}>Chọn thời gian khám (Lịch hẹn bắt đầu lúc)</Text>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-2 mt-1 p-3 border-solid border-[1px] border-gray-300 rounded-lg max-h-[200px] overflow-y-auto">
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="1">09:15 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="2">09:30 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="3">09:45 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="4">10:00 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="5">10:15 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="6">10:30 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="7">10:45 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="8">11:00 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="9">11:15 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="10">11:30 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="11">11:45 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="12">12:00 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="13">12:15 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="14">12:30 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="15">12:45 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="16">13:00 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="17">13:15 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="18">13:30 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="19">13:45 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="20">14:00 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="21">14:15 AM</Chip>
            <Chip icon={<FaRegClock size={14} />} styles={{ label: { width: '100%' } }} size="md" value="22">14:30 AM</Chip>
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
            color="gray.6"
            onClick={onClose}
            size="md"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="md"
            color="primary"
            //check validate before next step
            onClick={() => {
              // trigger().then((isValid) => {
              //   if (isValid)
              setStep(Step.AddPatientInfo);
              // })
            }}
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
        <TextInput
          label="Họ và tên"
          placeholder="Họ tên bệnh nhân"
          required
          name='patientName'
          size="md"
          radius='md'
          w={'100%'}
          control={control}
          mt={10}
        />
        <div className="flex justify-between gap-4 items-end">
          <TextInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            required
            name='patientPhone'
            type="tel"
            size="md"
            radius='md'
            w={'100%'}
            control={control}
          />

          <TextInput
            label="Email bệnh nhân"
            placeholder="Nhập email"
            name='patientEmail'
            size="md"
            type="email"
            radius='md'
            mt={20}
            w={'100%'}
            control={control}
          />

        </div>
        <div className="flex justify-between gap-4 items-end">
          <DateInput
            label="Ngày sinh"
            name="birthday"
            required
            size="md"
            radius="md"
            mt={20}
            w={'100%'}
            maxDate={new Date()}
            valueFormat="DD-MM-YYYY"
            control={control}
            rightSection={<FaCalendarDays size={18} />}
          />

          {/* Giới tính */}
          <Select
            label="Giới tính"
            placeholder="Chọn giới tính"
            name="gender"
            searchable
            data={[
              { value: Gender.Male.toString(), label: 'Nam' },
              { value: Gender.Female.toString(), label: 'Nữ' },
              { value: Gender.Undefined.toString(), label: 'Không rõ' },
            ]}
            control={control}
            size="md"
            radius="md"
            mt={20}
            w={'100%'}
          />
          {/* Chiều cao
          Cân nặng
          Huyết áp
          Dịch vụ */}

        </div>

        <div className="flex justify-between gap-4 items-end">

          <Select
            label="Nhóm máu"
            placeholder="Chưa chọn"
            name="bloodGroup"
            searchable
            data={Object.values(BLOOD_GROUP).map((bloodGroup) => ({
              value: bloodGroup,
              label: bloodGroup,
            }))}
            control={control}
            size="md"
            radius="md"
            mt={20}
            w={'100%'}
          />
        </div>

        <Textarea
          label="Lý do khám bệnh"
          placeholder="Thêm nguyên nhân khám bệnh"
          name='reason'
          size="md"
          radius='md'
          mt={20}
          minRows={3}
          w={'100%'}
          control={control}
        />

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
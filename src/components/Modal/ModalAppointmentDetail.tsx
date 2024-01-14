import { IAppointment } from "@/types";
import { Flex, Modal, Select, Text } from "@mantine/core";
import dayjs from "dayjs";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  data: IAppointment;
}

const ModalAppointmentDetail = ({ isOpen, onClose, data }: IProps) => {
  return (
    <Modal.Root opened={isOpen} onClose={onClose} size='md' centered>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Lịch hẹn khám #{data.id}</Modal.Title>
          <Modal.CloseButton variant="transparent" c="white" />
        </Modal.Header>
        <Modal.Body pt={10}>

          <Text>
            Tên bệnh nhân: {data.patientName}
          </Text>
          <Text mt={5}>
            Tên bác sĩ: {data.doctorName}
          </Text>
          <Text mt={5}>
            Thời gian: {dayjs(data.startTime).format('DD/MM/YYYY HH:mm')} - {dayjs(data.endTime).format('HH:mm')}
          </Text>
          <Text mt={5}>
            Ghi chú: {data.note}
          </Text>
          <Flex justify='space-between' align='center'>
            <Text mr={15}>
              Trạng thái:
            </Text>
            <Select
              defaultValue={data.status}
              data={['Chưa xác nhận', 'Đã xác nhận', 'Đã đến hẹn', 'Hủy hẹn']}
              flex={1}
            />
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalAppointmentDetail;
import { IAppointment } from "@/types";
import { Modal, Text } from "@mantine/core";
import dayjs from "dayjs";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  data: IAppointment;
}

const ModalAppointmentDetail = ({ isOpen, onClose, data }: IProps) => {
  return (
    <Modal.Root opened={isOpen} onClose={onClose} centered size='md'>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fz="lg" fw={600}>Thông tin lịch hẹn khám</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Text>
            ID: #{data.id}
          </Text>
          <Text>
            Tên bệnh nhân: {data.patientName}
          </Text>
          <Text>
            Tên bác sĩ: {data.doctorName}
          </Text>
          <Text>
            Thời gian: {dayjs(data.startTime).format('DD/MM/YYYY HH:mm')} - {dayjs(data.endTime).format('HH:mm')}
          </Text>
          <Text>
            Ghi chú: {data.note}
          </Text>
          <Text>
            Trạng thái: {data.status}
          </Text>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalAppointmentDetail;
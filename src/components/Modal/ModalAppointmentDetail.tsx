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
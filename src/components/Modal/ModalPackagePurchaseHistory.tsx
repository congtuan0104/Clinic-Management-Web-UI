import { Button, Card, Center, Modal, ModalBody, ModalCloseButton, ModalHeader, Text, Group } from "@mantine/core";
import { useAppSelector } from "@/hooks";
import { currentClinicSelector } from "@/store";
import dayjs from 'dayjs';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}


const ModalPackagePurchaseHistory = ({ isOpen, onClose }: IProps) => {
  const currentClinic = useAppSelector(currentClinicSelector);
  console.log(currentClinic?.subscriptions)
  const getStatusTextColor = (status: number) => {
    switch (status) {
      case 1: //Inpayment
        return 'blue';
      case 2: //Expired
        return 'red';
      case 3: //Active
        return 'green';
      case 4: //Cancel
        return 'red';
      case 5: //Pending
        return 'black';
      default:
        return 'black';
    }
  }
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return 'Đã Thanh Toán';
      case 2:
        return 'Hết hạn';
      case 3:
        return 'Kích hoạt';
      case 4:
        return 'Hủy bỏ';
      case 5:
        return 'Đang Chờ Thanh Toán'
      default:
        return '';
    }
  }
  return (
    <Modal.Root opened={isOpen} onClose={onClose} centered size={'md'}>
      <Modal.Overlay />
      <Modal.Content radius='lg'>
        <ModalHeader>
          <Modal.Title fz={16} fw={600}>Lịch sử đăng ký gói</Modal.Title>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {currentClinic && currentClinic.subscriptions && currentClinic.subscriptions.map((history) => (
            <Card withBorder radius="md" px="md" mr={27} w={'100%'} h={150}>
              <Card.Section bg={'#081692'} c={'white'} h={50}>
                <Center>
                  <Text fw={700} pt={12}>{history?.plans?.planName}</Text>
                </Center>

              </Card.Section>

              <Card.Section m={5}>
                <Text>Thời hạn: <strong>{history.plans?.duration} ngày </strong></Text>
                <Text>Ngày mua: <b>{dayjs(history.createdAt).format('DD/MM/YYYY')}</b></Text>
                <Text>Thời hạn đến: <b>{dayjs(history.expiredAt).format('DD/MM/YYYY')}</b></Text>
                <Group>
                <Text>Trạng thái:</Text>
                <Text c={getStatusTextColor(history.status)} fw={700}>
                  {getStatusText(history.status)}
                </Text>
                </Group>
                
                {/* <Divider/>
        
        <Text fz="sm" mt="md" >
            {advertise.content}
        </Text> */}
              </Card.Section>
            </Card>
          ))}

        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalPackagePurchaseHistory
  ;
import { IMedicalInvoice } from "@/types";
import { Badge, Button, Flex, Modal, ModalCloseButton, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import { CurrencyFormatter } from "..";
import { MEDICO_PAYMENT_STATUS } from "@/enums";
import { numberToWords } from "@/utils";
import { modals } from "@mantine/modals";
import { medicalRecordApi } from "@/services";
import { useAppSelector } from "@/hooks";
import { staffInfoSelector } from "@/store";
import { notifications } from "@mantine/notifications";


interface IProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: IMedicalInvoice;
  onPaymentSuccess: () => void;
}

const ModalMedicalInvoice = ({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}: IProps) => {

  const staffInfo = useAppSelector(staffInfoSelector);

  const handleConfirmPayment = () => {
    modals.openConfirmModal({
      title: `Xác nhận thanh toán`,
      centered: true,
      children: (
        <Text size="md">
          Xác nhận nhận tiền thanh toán từ khách hàng?
        </Text>
      ),
      labels: { confirm: 'Xác nhận', cancel: 'Hủy' },
      confirmProps: { color: 'teal.7' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        if (!invoice) return;
        // onClose();
        const res = await medicalRecordApi.confirmPayment(
          invoice.id,
          MEDICO_PAYMENT_STATUS.PAID,
          staffInfo?.id
        )

        if (res.status) {
          // onClose();
          notifications.show({
            title: 'Thành công',
            message: 'Xác nhận thanh toán thành công',
            color: 'green',
          });
          onPaymentSuccess();
        }
        else {
          notifications.show({
            title: 'Lỗi',
            message: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.',
            color: 'red.5',
          });
        }
      },
    });
  };


  return <Modal.Root opened={isOpen && !!invoice} onClose={onClose} centered size={'auto'}>
    <Modal.Overlay blur={7} />
    <Modal.Content radius='lg'>
      <Modal.Header bg='secondary.3'>
        <Modal.Title c='white' fz="lg" fw={600}>Hóa đơn</Modal.Title>
        <ModalCloseButton />
      </Modal.Header>
      <Modal.Body pt='sm'>
        <Table withRowBorders={false} fz='md' verticalSpacing={3}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Mã hóa đơn</Table.Td>
              <Table.Td>{invoice?.id}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Phòng khám</Table.Td>
              <Table.Td>{invoice?.clinic.name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Ngày xuất hóa đơn</Table.Td>
              <Table.Td>{dayjs(invoice?.invoiceDate).format('DD/MM/YYYY')}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Nội dung</Table.Td>
              <Table.Td>{invoice?.description}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Người đóng tiền</Table.Td>
              <Table.Td>{`${invoice?.patient.firstName} ${invoice?.patient.lastName}`}</Table.Td>
            </Table.Tr>
            {invoice?.cashierId && invoice.cashier && (<Table.Tr>
              <Table.Td>Nhân viên thu tiền</Table.Td>
              <Table.Td>
                {`${invoice?.cashier.firstName} ${invoice?.cashier.lastName}`}
              </Table.Td>
            </Table.Tr>)}
            <Table.Tr>
              <Table.Td>Số tiền</Table.Td>
              <Table.Td>
                <b>
                  <CurrencyFormatter value={invoice?.totalPayment || 0} />
                </b> ({numberToWords(invoice?.totalPayment || 0)} đồng)
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Trạng thái</Table.Td>
              <Table.Td>
                {invoice?.status === MEDICO_PAYMENT_STATUS.UNPAID
                  ? <Badge color='red' variant='filled'>Chưa thanh toán</Badge>
                  : <Badge color='green' variant='filled'>Đã thanh toán</Badge>
                }
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        {/* // chi tiết dịch vụ */}
        <Table mt={10} mx={10}>
          <Table.Thead bg='gray.3'>
            <Table.Tr>
              <Table.Th>STT</Table.Th>
              <Table.Th>Nội dung khoản thu</Table.Th>
              <Table.Th>Phí dịch vụ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invoice?.invoiceDetail?.map((service, index) => (
              <Table.Tr key={service.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{service.content}</Table.Td>
                <Table.Td>
                  <CurrencyFormatter value={service.amount} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Flex justify='flex-end' mt='lg' gap={10}>
          <Button
            onClick={onClose}
            color='gray.6'
            size="md"
          >
            Đóng
          </Button>
          {
            invoice?.status === MEDICO_PAYMENT_STATUS.UNPAID &&
            <Button
              onClick={handleConfirmPayment}
              color='teal.7'
              size="md"
            >
              Xác nhận thanh toán
            </Button>
          }

        </Flex>

      </Modal.Body>
    </Modal.Content>
  </Modal.Root>
}

export default ModalMedicalInvoice;
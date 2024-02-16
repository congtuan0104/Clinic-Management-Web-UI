import { IMedicalInvoice } from "@/types";
import { Badge, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import { CurrencyFormatter } from "..";
import { numberToWords } from "@/utils";
import { MEDICO_PAYMENT_STATUS } from "@/enums";
import { forwardRef } from "react";
import Barcode from 'react-jsbarcode';

interface IProps {
  invoice: IMedicalInvoice;
}

const InvoicePrintContext = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { invoice } = props;

  return <div ref={ref} className="border border-dash border-gray-400 rounded-md py-10 px-16">
    <div className="flex items-center">
      {invoice.clinic.logo && (
        <img src={invoice.clinic.logo} alt="logo" className="w-[120px] h-[120px] mr-5" />
      )}
      <div className="flex flex-col flex-1">
        <p className="uppercase font-semibold">{invoice.clinic.name}</p>
        <p>Địa chỉ: {invoice.clinic.address}</p>
        <p>Số điện thoại: {invoice.clinic.phone}</p>
        <p>Email: {invoice.clinic.email}</p>
      </div>
    </div>
    <Text ta='center' fz={34} fw={600} mt={10}>
      HÓA ĐƠN
    </Text>
    <Text ta='center' >
      <b>Số hóa đơn: </b>{invoice?.id}
    </Text>

    <Table withRowBorders={false} fz='md' verticalSpacing={3}>
      <Table.Tbody>
        {/* <Table.Tr>
          <Table.Td>Số hóa đơn</Table.Td>
          <Table.Td>{invoice?.id}</Table.Td>
        </Table.Tr> */}
        <Table.Tr>
          <Table.Td w={180}>Ngày xuất hóa đơn</Table.Td>
          <Table.Td>{dayjs(invoice?.invoiceDate).format('DD/MM/YYYY')}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Nội dung</Table.Td>
          <Table.Td>{invoice?.description}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Tên bệnh nhân</Table.Td>
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

      </Table.Tbody>
    </Table>

    {/* // chi tiết dịch vụ */}
    <Table mt={20} mx={10}>
      <Table.Thead bg='gray.3'>
        <Table.Tr>
          <Table.Th>STT</Table.Th>
          <Table.Th>Nội dung khoản thu</Table.Th>
          <Table.Th>Số tiền</Table.Th>
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

    <div className="flex justify-end mt-10">
      <div>
        <Text ta='center' fw={600} mt={10}>
          Người lập
        </Text>
        <Text ta='center' fw={400}>
          Ký, ghi rõ họ tên
        </Text>
      </div>
    </div>
  </div>
})

export default InvoicePrintContext;
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
  Text,
  Image,
  Avatar,
  Badge,
  Tooltip,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector, staffInfoSelector, userInfoSelector } from '@/store';
import { FaFileExport, FaRegEdit, FaTrash } from 'react-icons/fa';
import { authApi, medicalRecordApi } from '@/services';
import { AppointmentPrintContext, ClinusTable, CurrencyFormatter, InvoicePrintContext, ModalMedicalInvoice, ModalNewMedicalRecord } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IMedicalInvoice, IMedicalRecord } from '@/types';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';
import { MdEmail, MdOutlineStart } from 'react-icons/md';
import { AuthModule, Gender, MEDICO_PAYMENT_STATUS, MEDICO_RECORD_STATUS } from '@/enums';
import dayjs from 'dayjs';
import { FaEye } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import { IoPrintSharp } from 'react-icons/io5';

const PaymentInvoicePage = () => {
  const currentClinic = useAppSelector(currentClinicSelector);
  const userInfo = useAppSelector(userInfoSelector);
  const [invoice, setInvoice] = useState<IMedicalInvoice | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<MRT_ColumnDef<IMedicalRecord>[]>(
    () => [
      {
        header: 'Mã HSBA',
        id: 'id',
        accessorFn: (dataRow) => `#${dataRow.id}`,
        enableColumnFilter: false,
        size: 80,
      },
      {
        header: 'Bệnh nhân',
        id: 'patient',
        accessorFn: (dataRow) =>
          <div className='flex items-center'>
            <Avatar
              src={dataRow.patient.avatar}
              size={40}
              alt={dataRow.patient.lastName}
              radius="xl" >
              {dataRow.patient.lastName?.charAt(0)}
            </Avatar>
            <div className='flex flex-col flex-1 ml-2'>
              <p className='text-primary-300'>{dataRow.patient.firstName} {dataRow.patient.lastName}</p>
              <p className='text-gray-500'>{dataRow.patient.email}</p>
            </div>
          </div>,
      },
      {
        header: 'Dịch vụ',
        id: 'services',
        size: 250,
        enableColumnFilter: false,
        accessorFn: (dataRow) =>
          dataRow.medicalRecordServices
            .map(service =>
              <Badge mr={8}
                key={service.id}
                color='secondary.3'
                radius='md'
                variant='light'
                className='mr-2'
              >
                {service.serviceName}
              </Badge>),
      },
      {
        header: 'Phí dịch vụ',
        id: 'total',
        enableColumnFilter: false,
        accessorFn: (dataRow) =>
          <CurrencyFormatter value={dataRow.medicalRecordServices.reduce((acc, cur) => acc + cur.amount, 0)} />,
      },
      {
        header: 'Trạng thái',
        id: 'paymentStatus',
        filterVariant: 'select',
        enableColumnFilter: true,
        Cell: ({ cell }) =>
          cell.getValue() === MEDICO_PAYMENT_STATUS.UNPAID.toString()
            ? <Badge
              color='red'
              radius='md'
              variant='filled'
            >
              Chưa thanh toán
            </Badge>
            : <Badge
              color='green'
              radius='md'
              variant='filled'
            >
              Đã thanh toán
            </Badge>,
        mantineFilterSelectProps: {
          data: [{
            value: MEDICO_PAYMENT_STATUS.UNPAID.toString(),
            label: 'Chưa thanh toán',
          }, {
            value: MEDICO_PAYMENT_STATUS.PAID.toString(),
            label: 'Đã thanh toán',
          }],
          placeholder: 'Chọn trạng thái',
        },
        accessorFn: (dataRow) => dataRow.paymentStatus.toString(),
      },

    ],
    [],
  );

  // lấy dữ liệu từ api
  const { data, refetch, isLoading } = useQuery(
    ['medical_records', currentClinic?.id],
    () => medicalRecordApi.getMedicalRecords({
      clinicId: currentClinic?.id,
    })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const records = data?.
    filter(record => record.examinationStatus === MEDICO_RECORD_STATUS.DONE).
    sort((a, b) => dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix());

  const printInvoice = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const exportInvoice = async (recordId: number, openModal: boolean, print: boolean) => {
    const res = await medicalRecordApi.exportInvoice(recordId);
    setInvoice(res.data);

    if (res.status && res.data) {
      if (openModal)
        setIsOpen(true);
      if (print) {
        // waiting setInvoice done
        setTimeout(() => {
          printInvoice();
        }, 1000);
      }
    }
    else {
      notifications.show({
        title: 'Lấy thông tin hóa đơn thất bại',
        message: res.message,
        color: 'red.5',
      })
    }
  }


  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Thanh toán hóa đơn</Title>
        </Flex>

        <ClinusTable
          columns={columns}
          data={records || []}
          enableRowActions
          enableColumnFilters={true}
          enableRowNumbers={false}
          localization={{
            noRecordsToDisplay: 'Không có hóa đơn nào',
            noResultsFound: 'Không tìm thấy hóa đơn nào thỏa điều kiện tìm kiếm',
          }}
          // state={{
          //   isLoading: isLoading,
          // }}
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm hóa đơn bệnh nhân',
              styles: { wrapper: { width: '300px' } },
              radius: 'md',
            }
          }
          getRowId={(row) => row.id.toString()}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              mantineTableHeadCellProps: {
                align: 'right',
              },
            }
          }}
          renderRowActions={({ row }) => (
            <Flex align='center' justify='flex-end' gap={10}>
              <Tooltip label='In hóa đơn'>
                <ActionIcon
                  color='gray.7'
                  radius='md'
                  variant='outline'
                  onClick={() => exportInvoice(row.original.id, false, true)}
                >
                  <IoPrintSharp />
                </ActionIcon>
              </Tooltip>
              <Tooltip label='Xem hóa đơn'>
                <ActionIcon
                  color='primary.3'
                  radius='md'
                  variant='outline'
                  onClick={() => exportInvoice(row.original.id, true, false)}
                >
                  <FaEye />
                </ActionIcon>
              </Tooltip>
              {/* <ActionIcon
                variant='outline'
                color='red'
                radius='sm'
              // onClick={() => handleDeleteService(row.id)} // xử lý khi click button xóa dịch vụ
              >
                <FaTrash />
              </ActionIcon> */}
            </Flex>
          )}
        />
      </Flex>

      <ModalMedicalInvoice
        isOpen={isOpen}
        onClose={() => {
          setInvoice(undefined);
          setIsOpen(false);
        }}
        invoice={invoice}
        onPaymentSuccess={() => { }}
        printInvoice={printInvoice}
      />

      {invoice && (
        <div className='hidden'>
          <InvoicePrintContext ref={invoiceRef} invoice={invoice} />
        </div>
      )}
    </>
  );
};

export default PaymentInvoicePage;

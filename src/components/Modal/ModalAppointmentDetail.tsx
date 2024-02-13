import { PATHS } from "@/config";
import { IAppointment, IUpdateAppointmentPayload } from "@/types";
import { Badge, Button, Flex, Modal, Anchor, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { IoPrintSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AppointmentPrintContext } from "../PrintContext";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { APPOINTMENT_STATUS } from "@/enums";
import { TbCalendarCancel } from "react-icons/tb";
import { appointmentApi } from "@/services";
import { notifications } from "@mantine/notifications";
import { GiConfirmed } from "react-icons/gi";
import { RiUserReceived2Line } from "react-icons/ri";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  data: IAppointment;
  onUpdateSuccess: () => void
}

export const get_PDF_in_base64 = async (htmldoc: HTMLHtmlElement) => {
  if (htmldoc) {
    const canvas = await html2canvas(htmldoc);
    const pdf = new jsPDF({
      format: "a4",
      unit: "mm",
    });
    await pdf.addImage(
      canvas.toDataURL('image/jpeg'),
      'JPEG',
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight()
    );
    // const pdfBase64 = pdf.output('dataurlstring');
    pdf.save("download.pdf");
  }
}

const ModalAppointmentDetail = ({ isOpen, onClose, onUpdateSuccess, data }: IProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrintAppointment = useReactToPrint({
    content: () => contentRef.current,
    onAfterPrint() {
      onClose();
    },
  });

  const handleCancelAppointment = async () => {
    const payload: IUpdateAppointmentPayload = {
      clinicId: data.clinicId,
      doctorId: data.doctorId,
      serviceId: data.serviceId,
      date: data.date,
      patientId: data.patientId,
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      status: APPOINTMENT_STATUS.CANCEL
    }

    const res = await appointmentApi.updateAppointment(data.id, payload)
    if (res.status) {
      notifications.show({
        title: 'Thông báo',
        message: 'Hủy lịch hẹn thành công',
        color: 'teal.5'
      })
      data.status = APPOINTMENT_STATUS.CANCEL;
      onUpdateSuccess();
    }
    else {
      notifications.show({
        title: 'Thông báo',
        message: 'Hủy lịch hẹn không thành công. Vui lòng thử lại sau',
        color: 'red.5'
      })
    }

  }

  const handleConfirmAppointment = async () => {
    const payload: IUpdateAppointmentPayload = {
      clinicId: data.clinicId,
      doctorId: data.doctorId,
      serviceId: data.serviceId,
      date: data.date,
      patientId: data.patientId,
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      status: APPOINTMENT_STATUS.CONFIRM
    }

    const res = await appointmentApi.updateAppointment(data.id, payload)
    if (res.status) {
      notifications.show({
        title: 'Thông báo',
        message: 'Xác nhận lịch hẹn thành công',
        color: 'teal.5'
      })
      data.status = APPOINTMENT_STATUS.CONFIRM;
      onUpdateSuccess();
    }
    else {
      notifications.show({
        title: 'Thông báo',
        message: 'Xác nhận lịch hẹn không thành công. Vui lòng thử lại sau',
        color: 'red.5'
      })
    }

  }

  const handleDownloadAppointment = useReactToPrint({
    // onPrintError: (error) => console.log(error),
    content: () => contentRef.current,
    documentTitle: `Phiếu hẹn khám bệnh ${data.id}`,
    copyStyles: true,
    // removeAfterPrint: true,
    print: async (printIframe) => {
      const document = printIframe.contentDocument;
      if (document) {
        const html = document.getElementsByTagName("html")[0];
        // console.log(html);
        // const exporter = new Html2Pdf(html,{filename:"Nota Simple.pdf"});
        // await exporter.getPdf(true);
        get_PDF_in_base64(html);
      }
    },
  });



  return (
    <>
      <Modal.Root opened={isOpen} onClose={onClose} size='auto' centered miw={400}>
        <Modal.Overlay blur={7} />
        <Modal.Content radius='lg'>
          <Modal.Header bg='secondary.3'>
            <Modal.Title c='white' fz="lg" fw={600}>Lịch hẹn khám #{data.id}</Modal.Title>
            <Modal.CloseButton variant="transparent" c="white" />
          </Modal.Header>
          <Modal.Body pt={10} miw={400}>

            <Flex mt={8}>
              <Text>
                Người đặt lịch hẹn:
              </Text>
              <Tooltip label='Xem hồ sơ bệnh nhân'>
                <Anchor ml={4} href={`${PATHS.CLINIC_PATIENT_MANAGEMENT}/${data.patientId}`}>
                  {data.patient.firstName} {data.patient.lastName}
                </Anchor>
              </Tooltip>
            </Flex>

            <Flex mt={8}>
              <Text>
                Bác sĩ:
              </Text>
              <Tooltip label='Xem thông tin bác sĩ'>
                <Anchor ml={4} href={`${PATHS.CLINIC_STAFF_MANAGEMENT}/${data.doctorId}`}>
                  {data.doctor.firstName} {data.doctor.lastName}
                </Anchor>
              </Tooltip>
            </Flex>
            <Text mt={8}>
              Ngày hẹn: {dayjs(data.date).format('DD/MM/YYYY')}
            </Text>
            <Text mt={8}>
              Thời gian dự kiến: {data.startTime} - {data.endTime}
            </Text>
            <Text mt={8}>
              Dịch vụ: {data.clinicServices.serviceName}
            </Text>
            {data.description && (<Text mt={8}>
              Ghi chú: {data.description}
            </Text>)}
            <Flex align='center' mt={8}>
              <Text mr={15}>
                Trạng thái:
              </Text>
              <Badge
                color={data.status === APPOINTMENT_STATUS.PENDING ? 'yellow.5' :
                  data.status === APPOINTMENT_STATUS.CONFIRM ? 'green.5' :
                    data.status === APPOINTMENT_STATUS.CHECK_IN ? 'primary.3' : 'red.5'
                }
              >
                {data.status}
              </Badge>
              {/* <Select
                defaultValue={data.status}
                data={['Chưa xác nhận', 'Đã xác nhận', 'Đã đến hẹn', 'Hủy hẹn']}
                flex={1}
              /> */}
            </Flex>
            <Flex mt={12} gap={10} justify='flex-end'>
              {data.status === APPOINTMENT_STATUS.PENDING && (
                <Button
                  size="md"
                  radius='md'
                  color="teal.7"
                  onClick={handleConfirmAppointment}
                  leftSection={<GiConfirmed size={18} />}>
                  Xác nhận
                </Button>

              )}


              {data.status !== APPOINTMENT_STATUS.CANCEL && (
                <Button
                  size="md"
                  radius='md'
                  color="primary.3"
                  onClick={handlePrintAppointment}
                  leftSection={<IoPrintSharp size={18} />}>
                  In phiếu
                </Button>
              )}

              {data.status === APPOINTMENT_STATUS.CONFIRM && (
                <Button
                  size="md"
                  radius='md'
                  color="teal.7"
                  onClick={handlePrintAppointment}
                  leftSection={<RiUserReceived2Line size={18} />}>
                  Tiếp nhận
                </Button>
              )}

              {data.status !== APPOINTMENT_STATUS.CANCEL &&
                data.status !== APPOINTMENT_STATUS.CHECK_IN && (
                  <Button
                    size="md"
                    radius='md'
                    color="red.5"
                    onClick={handleCancelAppointment}
                    leftSection={<TbCalendarCancel size={18} />}>
                    Hủy hẹn
                  </Button>
                )}

            </Flex>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <div className="hidden">
        <AppointmentPrintContext ref={contentRef} data={data} />
      </div>
    </>
  )
}

export default ModalAppointmentDetail;
import { useAppSelector } from "@/hooks";
import { categoryApi, medicalRecordApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { IMedicalService, IUpdateServiceResultPayload } from "@/types";
import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, Textarea, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";


interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: IMedicalService;
  updateResult: () => void;
}

// const validateSchema = yup.object().shape({
//   name: yup.string().required('Vui lòng nhập tên danh mục'),
//   note: yup.string(),
//   description: yup.string(),
// });

const ModalUpdateServiceResult = ({
  isOpen,
  service,
  onClose,
  updateResult
}: IModalProps) => {
  const [result, setServiceResult] = useState<string>(service?.serviceResult || '');

  const handleCancel = () => {
    setServiceResult(service?.serviceResult || '')
    onClose();
  }

  useEffect(() => {
    setServiceResult(service?.serviceResult || '');
  }, [service])

  const handleUpdateResult = async () => {
    if (!service) return;

    const payload: IUpdateServiceResultPayload = {
      clinicServiceId: service.clinicServiceId,
      doctorId: service.doctorId,
      medicalRecordId: service.medicalRecordId,
      amount: service.amount,
      serviceName: service.serviceName,
      serviceResult: result,
      clinicId: service.clinicId
    }

    const res = await medicalRecordApi.updateService(service.medicalRecordId, service.clinicServiceId, payload);

    if (res.status) {
      notifications.show({
        title: 'Thành công',
        message: 'Cập nhật kết quả dịch vụ thành công',
        color: 'green.5'
      });
      updateResult();
      onClose();
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Cập nhật kết quả dịch vụ</Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <Box pt={10}>

            {/* <Text>Dịch vụ: {service?.serviceName}</Text> */}

            <Textarea
              label="Kết quả"
              name="description"
              placeholder={`Nhập kết quả của thực hiện dịch vụ ${service?.serviceName}`}
              size="md"
              mt='sm'
              autosize
              minRows={3}
              value={result}
              onChange={(e) => setServiceResult(e.currentTarget.value)}
            />

            <Flex justify='end' gap={10}>
              <Button mt="lg" size="md" color='gray.5' onClick={handleCancel}>
                Hủy
              </Button>
              <Button mt="lg" size="md" onClick={handleUpdateResult} disabled={result.trim().length === 0}>
                Lưu kết quả
              </Button>
            </Flex>
          </Box>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalUpdateServiceResult
import { PERMISSION } from "@/enums";
import { useAppSelector } from "@/hooks";
import { categoryApi, clinicServiceApi, medicalRecordApi, staffApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { IClinicService, IMedicalService, INewMedicalServicePayload, IUpdateServiceResultPayload } from "@/types";
import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, Textarea, Text, SegmentedControl, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MdMedicalServices } from "react-icons/md";
import { useQuery } from "react-query";


interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  recordId: number;
  medicalServices: IMedicalService[];
}

// const validateSchema = yup.object().shape({
//   name: yup.string().required('Vui lòng nhập tên danh mục'),
//   note: yup.string(),
//   description: yup.string(),
// });

enum RequestType {
  INNER = 'inner',
  OUTER = 'outer',
}

const ModalRequestService = ({
  isOpen,
  onClose,
  onSuccess,
  recordId,
  medicalServices,
}: IModalProps) => {
  const currentClinic = useAppSelector(currentClinicSelector);
  const [type, setType] = useState<string>(RequestType.INNER);
  const [serviceId, setServiceId] = useState<string | null>();
  const [doctorId, setDoctorId] = useState<string | null>();
  const [selectedService, setSelectedService] = useState<IClinicService | null>(null);


  const handleCancel = () => {
    onClose();
    setServiceId(null);
    setDoctorId(null);
    setSelectedService(null);
    setType(RequestType.INNER);
  }

  const { data } = useQuery(
    ['clinic_service', currentClinic?.id],
    () => clinicServiceApi.getClinicServices(currentClinic!.id, false)
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const services = data?.filter(service => !medicalServices.map(s => s.clinicServiceId).includes(service.id));

  const { data: staffs } = useQuery(
    ['doctors'],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id })
      .then(
        res => res.data?.
          filter(staff => staff.role.permissions.map(p => p.id).includes(PERMISSION.PERFORM_SERVICE))
      ),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (serviceId && services) {
      const selected = services.find(service => service.id.toString() === serviceId);
      if (selected)
        setSelectedService(selected);
    }
    setDoctorId(null);
  }, [serviceId]);

  const handleNewService = async () => {
    if (!serviceId || !doctorId) return;
    const payload: INewMedicalServicePayload = {
      clinicServiceId: parseInt(serviceId),
      doctorId: parseInt(doctorId),
      amount: selectedService?.price || 0,
      serviceName: selectedService?.serviceName || '',
      serviceResult: '',
      clinicId: currentClinic!.id,
    };

    console.log(payload);
    const res = await medicalRecordApi.newService(recordId, payload);

    if (res.status) {
      notifications.show({ title: 'Thành công', message: 'Chỉ định dịch vụ thành công', color: 'green.5' });
      onSuccess();
      handleCancel();
    }
    else {
      notifications.show({ title: 'Thất bại', message: 'Chỉ định dịch vụ thất bại. Vui lòng thử lại sau', color: 'red.5' });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Chỉ định dịch vụ</Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <Box pt={10}>

            {/* <SegmentedControl
              value={type}
              radius="xl"
              size="md"
              fullWidth
              onChange={setType}
              data={[
                { label: 'Dịch vụ do phòng khám hiện tại cung cấp', value: RequestType.INNER },
                { label: 'Dịch vụ do phòng khám khác cung cấp', value: RequestType.OUTER },
              ]}
            /> */}

            <Select
              label="Chọn dịch vụ"
              placeholder="Chọn dịch vụ chỉ định"
              leftSection={<MdMedicalServices size={18} />}
              data={services?.map((service) => ({
                value: service.id.toString(),
                label: service.serviceName,
              })) || []}
              required
              name='serviceId'
              size="md"
              radius='md'
              value={serviceId}
              onChange={setServiceId}
              w={'100%'} />

            <Select
              label="Bác sĩ"
              placeholder="Chọn bác sĩ khám bệnh"
              required
              name='doctorId'
              size="md"
              value={doctorId}
              onChange={setDoctorId}
              mt={10}
              radius='md'
              allowDeselect
              data={staffs?.map((staff) => ({
                value: staff.id.toString(),
                label: `${staff.users.firstName} ${staff.users.lastName}`,
                disabled: Boolean(selectedService && !selectedService.staffIds.includes(staff.id))
              })) || []}
              searchable
              leftSection={<FaUserDoctor size={18} />}
              w={'100%'}
            />

            <Flex justify='end' gap={10}>
              <Button mt="lg" size="md" color='gray.5' onClick={handleCancel}>
                Hủy
              </Button>
              <Button mt="lg" size="md" onClick={handleNewService} disabled={!serviceId || !doctorId}>
                Xác nhận
              </Button>
            </Flex>
          </Box>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalRequestService
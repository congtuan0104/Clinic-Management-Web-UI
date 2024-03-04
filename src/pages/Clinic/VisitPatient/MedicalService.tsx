import { ModalMedicalInvoice, ModalRequestService, ModalUpdateServiceResult } from "@/components";
import { AuthModule } from "@/enums";
import { useAppSelector } from "@/hooks";
import { medicalRecordApi, staffApi } from "@/services";
import { medicineApi } from "@/services/medicine.service";
import { currentClinicSelector, staffInfoSelector, userInfoSelector } from "@/store";
import { IMedicalInvoice, IMedicalService, INewPrescription, IPrescription } from "@/types";
import { ActionIcon, Autocomplete, Button, Flex, NumberInput, Table, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { GrUpdate } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import { useQuery } from "react-query";

interface IProps {
  recordId: number;
  medicalServices: IMedicalService[];
  onUpdateSuccess: () => void;
  allowUpdate?: boolean;
}

const MedicalService = ({ recordId, medicalServices, onUpdateSuccess, allowUpdate }: IProps) => {

  const staffInfo = useAppSelector(staffInfoSelector);
  const userInfo = useAppSelector(userInfoSelector);
  const currentClinic = useAppSelector(currentClinicSelector);
  const [selectedService, setSelectedService] = useState<IMedicalService | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  console.log(recordId, medicalServices)


  const { data: staffs } = useQuery(
    ['staffs'],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
    }
  );

  const findStaffName = (id: number) => {
    const staff = staffs?.find(staff => staff.id === id);
    if (staff)
      return staff?.users?.firstName + ' ' + staff?.users?.lastName;
    return 'Không chỉ định bác sĩ';
  }


  return (
    <>
      <Text fw={600}>Chỉ định dịch vụ</Text>
      <Table mt='sm' bg='gray.0'
        styles={{
          table: { borderRadius: 10 },
        }}
      >
        <Table.Thead bg='secondary.3' c='white' style={{
          borderRadius: '10px 10px 0 0'
        }}>
          <Table.Tr>
            <Table.Th style={{ borderRadius: '10px 0 0 0' }}>Dịch vụ</Table.Th>
            <Table.Th>Bác sĩ thực hiện</Table.Th>
            <Table.Th>Kết quả dịch vụ</Table.Th>
            <Table.Th w={50} style={{ borderRadius: '0 10px 0 0' }}>
              {(userInfo?.moduleId === AuthModule.ClinicStaff) && (
                <Tooltip label='Chỉ định dịch vụ'>
                  <ActionIcon
                    color="primary.3"
                    radius="xl"
                    variant='white'
                    onClick={() => setIsOpen(true)}
                    disabled={!allowUpdate}
                  >
                    <FaPlus size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {(!medicalServices || medicalServices.length === 0) && (
            <Table.Tr>
              <Table.Td colSpan={4} className="text-center leading-9">Chưa có dịch vụ nào được chỉ định</Table.Td>
            </Table.Tr>
          )}
          {medicalServices?.map((service, index) => (
            <Table.Tr key={index}>
              <Table.Td>{service.serviceName}</Table.Td>
              <Table.Td>{findStaffName(service.doctorId)}</Table.Td>
              <Table.Td>{service.serviceResult || 'Chưa có kết quả'}</Table.Td>
              <Table.Td>
                {(staffInfo?.id === service.doctorId) && (
                  <Tooltip label='Cập nhật kết quả dịch vụ'>
                    <ActionIcon
                      color="primary.3"
                      radius="xl"
                      variant='white'
                      onClick={() => setSelectedService(service)}
                      disabled={!allowUpdate}
                    >
                      <FaRegEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <ModalUpdateServiceResult
        isOpen={!!selectedService}
        onClose={() => setSelectedService(undefined)}
        service={selectedService}
        updateResult={onUpdateSuccess}
      />

      <ModalRequestService
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        recordId={recordId}
        medicalServices={medicalServices}
        onSuccess={onUpdateSuccess}
      />
    </>
  );
}

export default MedicalService;
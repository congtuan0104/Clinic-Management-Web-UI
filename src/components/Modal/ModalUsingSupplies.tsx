import { ActionIcon, Button, Divider, Modal, Group, ModalBody, ModalCloseButton, ModalHeader, NumberInput, Table, Text, Tooltip, Select } from "@mantine/core";
import { IDeclareUsingSuppliesPayload, INewUsingSupplies, IPrescription, IUsingSupplies } from "@/types";
import { useEffect, useState } from "react";
import { medicineApi } from "@/services/medicine.service";
import { FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { medicalRecordApi, suppliesApi } from "@/services";
import { useAppSelector } from "@/hooks";
import { currentClinicSelector } from "@/store";
import { useQuery } from "react-query";
import { notifications } from "@mantine/notifications";

interface IModalProps {
  isOpen: boolean;
  medicalRecordId: string;
  supplies: IUsingSupplies[];
  onClose: () => void;
  onSuccess: () => void;
}

interface SelectBox {
  value: string;
  label: string;
}

const ModalUsingSupplies = ({
  isOpen,
  medicalRecordId,
  supplies,
  onClose,
  onSuccess
}: IModalProps) => {
  const currentClinic = useAppSelector(currentClinicSelector)
  const [drugs, setDrugs] = useState<INewUsingSupplies[]>(supplies);
  const { data: clinicSupplies, isLoading } = useQuery(['clinicSupplies', currentClinic?.id], () => getListMedicalSupplies());
  const [comboboxData, setComboboxData] = useState<SelectBox[] | undefined>([]);

  const getListMedicalSupplies = async () => {
    const res = await suppliesApi.getSupplies({ isDisabled: false, clinicId: currentClinic?.id })
    return res.data
  }

  const handleAddPrescription = () => {
    setDrugs(prev => [...prev, {
      quantity: 0,
      medicalSupplyId: Number(medicalRecordId),
      medicalRecordId: 0,
    }]);
  }

  const handleRemovePrescription = (index: number) => {
    return () => {
      setDrugs(prev => prev.filter((_, i) => i !== index));
    }
  }

  useEffect(() => {
    setDrugs(supplies);
    if (clinicSupplies) {
      const convertedData = clinicSupplies.map(supply => ({
        value: supply.id.toString(),
        label: supply.medicineName,
      }));
      setComboboxData(convertedData);
    }
  }, [supplies, clinicSupplies, currentClinic]);
  console.log(supplies)

  const onSubmit = async () => {
    try {
      const updateInfo: IDeclareUsingSuppliesPayload = {
        supplies: []
      }

      drugs.map((item, index) => {
        updateInfo.supplies[index] = {
          medicalSupplyId: item.medicalRecordId,
          quantity: item.quantity,
        };
      });
      const res = await medicalRecordApi.declareUsingSupplies(medicalRecordId, updateInfo);

      if (res.status) {
        notifications.show({
          message: 'Khai báo thông tin sử dụng vật tư thành công',
          color: 'green',
        })
        onSuccess();
        onClose();
      } else {
        notifications.show({
          message: res.message || 'Khai báo thông tin sử dụng vật tư không thành công',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        message: 'Khai báo thông tin sử dụng vật tư không thành công',
        color: 'red',
      });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={() => {
      onClose()
      setDrugs(supplies)
    }} centered size={'md'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3' >
          <Modal.Title c='white' w={'100%'} style={{
            borderRadius: '10px 10px 0 0',
          }}>
            <Group justify="space-between">
              <Text style={{ borderRadius: '10px 0 0 0' }} fw={700} pl={10}>Tên vật tư</Text>
              <Text pl={160} fw={700}>Số lượng</Text>
              <Text w={45} style={{ borderRadius: '0 10px 0 0' }}>
                <Tooltip label='Thêm thuốc'>
                  <ActionIcon
                    variant="white"
                    color="primary.3"
                    radius="xl"
                    onClick={handleAddPrescription}
                  // disabled={!patientInfo}
                  >
                    <FaPlus size={18} />
                  </ActionIcon>
                </Tooltip>
              </Text>
            </Group>
          </Modal.Title>
        </Modal.Header>
        <ModalBody bg={'gray.0'} pt={10}>

          <Table
            styles={{
              table: { borderRadius: 10 },
            }}
          >
            <Table.Tbody>
              {drugs.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7} className="text-center leading-9">
                    Chưa có vật tư nào được khai báo
                  </Table.Td>
                </Table.Tr>
              )}
              {drugs.map((drug, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Select
                      searchable
                      data={comboboxData}
                      placeholder='Tên thuốc'
                      defaultValue={String(drug.medicalSupplyId)}
                      onChange={(value) => {
                        setDrugs(prev => {
                          const newDrugs = [...prev];
                          newDrugs[index].medicalRecordId = Number(value);
                          return newDrugs;
                        });
                      }}
                    />
                  </Table.Td>
                  <Table.Td w={100}>
                    <NumberInput
                      value={drug.quantity}
                      min={1}
                      max={clinicSupplies?.find(item => item.id === drug.medicalRecordId)?.stock}
                      onChange={(value) => {
                        setDrugs(prev => {
                          const newDrugs = [...prev];
                          newDrugs[index].quantity = Number(value);
                          return newDrugs;
                        });
                      }}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label='Loại bỏ thuốc'>
                      <ActionIcon
                        color="red.5"
                        variant="white"
                        radius="xl"
                        onClick={handleRemovePrescription(index)}
                      >
                        <IoCloseSharp size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>

              ))}
            </Table.Tbody>
          </Table>
          {drugs.length > 0 ? (<Divider />) : null}
          <Group justify="flex-end" align="flex-end" pt={10}>
            <Button type="button" onClick={onSubmit}>
              Khai báo
            </Button>
            <Button type="button" variant="light" color="gray.8" onClick={() => {
              onClose()
              setDrugs(supplies)
            }}>
              Hủy
            </Button>
          </Group>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalUsingSupplies
import { ActionIcon, Button, Divider, Modal, Group, ModalBody, ModalCloseButton, ModalHeader, NumberInput, Table, Text, Tooltip, Select, LoadingOverlay } from "@mantine/core";
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
  // const [comboboxData, setComboboxData] = useState<SelectBox[] | undefined>([]);

  const getListMedicalSupplies = async () => {
    const res = await suppliesApi.getSupplies({ isDisabled: false, clinicId: currentClinic?.id })
    return res.data
  }

  const handleAddPrescription = () => {
    setDrugs(prev => [...prev, {
      quantity: 1,
      medicalSupplyId: Number(medicalRecordId),
      medicalRecordId: 0,
    }]);
  }

  const handleRemovePrescription = (index: number) => {
    return () => {
      setDrugs(prev => prev.filter((_, i) => i !== index));
    }
  }

  // useEffect(() => {
  //   setDrugs(supplies);
  //   if (clinicSupplies) {
  //     const convertedData = clinicSupplies.map(supply => ({
  //       value: supply.id.toString(),
  //       label: supply.medicineName,
  //     }));
  //     setComboboxData(convertedData);
  //   }
  // }, [supplies, clinicSupplies, currentClinic]);
  // console.log(supplies)

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
          message: 'Khai báo thành công',
          color: 'green.5',
        })
        onSuccess();
        onClose();
      } else {
        notifications.show({
          message: res.message || 'Có lỗi xảy ra.Vui lòng thử lại sau.',
          color: 'red.5',
        });
      }
    } catch (error) {
      notifications.show({
        message: 'Có lỗi xảy ra.Vui lòng thử lại sau.',
        color: 'red.5',
      });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={() => {
      onClose()
      setDrugs(supplies)
    }} centered size={'lg'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3' >
          <Modal.Title c='white' fw={600}>
            Khai báo sử dụng vật tư khám bệnh
          </Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody pt={10}>
          <LoadingOverlay visible={isLoading} loaderProps={{ size: 'xl' }} />

          {
            !isLoading && clinicSupplies && (
              <>
                <Table
                  styles={{
                    table: { borderRadius: 10 },
                  }}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        <Text>Tên vật tư</Text>
                      </Table.Th>
                      {/* <Table.Th ta='center'>
                        <Text>Đơn vị tính</Text>
                      </Table.Th> */}
                      <Table.Th>
                        <Text>Số lượng</Text>
                      </Table.Th>
                      {supplies.length === 0 ? (
                        <Table.Th w={30}>
                          <Tooltip label='Khai báo thêm vật tư được sử dụng'>
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
                        </Table.Th>
                      ) : null}
                    </Table.Tr>
                  </Table.Thead>
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
                            data={clinicSupplies?.map((supply) => ({
                              value: supply.id.toString(),
                              label: supply.medicineName,
                              disabled: supply.stock === 0 || drugs.some(
                                item => item.medicalRecordId === supply.id && item.medicalRecordId !== drug.medicalRecordId)
                            })) || []}
                            variant="unstyled"
                            placeholder='Chon vật tư'
                            defaultValue={String(drug.medicalSupplyId)}
                            readOnly={supplies.length !== 0}
                            onChange={(value) => {
                              setDrugs(prev => {
                                const newDrugs = [...prev];
                                newDrugs[index].medicalRecordId = Number(value);
                                return newDrugs;
                              });
                            }}
                          />
                        </Table.Td>
                        {/* <Table.Td ta='center'>
                          <Text>{clinicSupplies?.find(item => item.id === drug.medicalRecordId)?.unit}</Text>
                        </Table.Td> */}
                        <Table.Td w={100}>
                          <NumberInput
                            value={drug.quantity}
                            min={1}
                            max={clinicSupplies?.find(item => item.id === drug.medicalRecordId)?.stock}
                            readOnly={supplies.length !== 0}
                            onChange={(value) => {
                              setDrugs(prev => {
                                const newDrugs = [...prev];
                                newDrugs[index].quantity = Number(value);
                                return newDrugs;
                              });
                            }}
                          />
                        </Table.Td>
                        {supplies.length === 0 ? (
                          <Table.Td>
                            <Tooltip label='Loại bỏ'>
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
                        ) : null}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {drugs.length > 0 ? (<Divider />) : null}
                {supplies.length === 0 ?
                  (
                    <Group justify="flex-end" align="flex-end" pt={10}>
                      <Button type="button" size="md" color="gray.6" onClick={() => {
                        onClose()
                        setDrugs(supplies)
                      }}>
                        Hủy
                      </Button>
                      <Button type="button" size="md" onClick={onSubmit}>
                        Lưu
                      </Button>
                    </Group>
                  ) : null}
              </>
            )
          }
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalUsingSupplies
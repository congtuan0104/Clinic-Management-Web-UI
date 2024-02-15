// import { medicalRecordApi } from "@/services";
// import { medicineApi } from "@/services/medicine.service";
// import { INewPrescription, IPrescription } from "@/types";
// import { ActionIcon, Autocomplete, Button, Flex, NumberInput, Table, Text, Tooltip } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import { useEffect, useState } from "react";
// import { FaPlus } from "react-icons/fa6";
// import { GrUpdate } from "react-icons/gr";
// import { MdOutlineDelete } from "react-icons/md";

// interface IProps {
//   recordId: number;
//   medicalServices: IPrescription[];
//   onUpdateSuccess: () => void;
// }

// const MedicalService = ({ recordId, medicalServices, onUpdateSuccess }: IProps) => {

//   const [drugs, setDrugs] = useState<INewPrescription[]>(prescriptions);
//   const [suggestMedicine, setSuggestMedicine] = useState<string[]>([]);

//   const getSuggestMedicine = async (keyword: string) => {
//     const res = await medicineApi.suggestMedicine(keyword)
//     console.log('res', res)
//     if (res.data) {
//       setSuggestMedicine(res.data[1]);
//     }

//   }

//   const handleUpdatePrescription = async () => {
//     const res = await medicalRecordApi.updatePrescription(recordId, drugs);
//     if (res.status) {
//       onUpdateSuccess();
//       notifications.show({
//         title: 'Thành công',
//         message: 'Cập nhật đơn thuốc thành công',
//         color: 'teal.5',
//       })
//     }
//     else {
//       notifications.show({
//         title: 'Thất bại',
//         message: 'Cập nhật đơn thuốc thất bại. Vui lòng thử lại sau',
//         color: 'red.5',
//       })
//     }
//   }

//   const handleAddPrescription = () => {
//     setDrugs(prev => [...prev, {
//       medicineName: '',
//       dosage: 1,
//       unit: '',
//       duration: '',
//       usingTime: '',
//       doseInterval: '',
//       note: '',
//     }]);
//   }

//   const handleRemovePrescription = (index: number) => {
//     return () => {
//       setDrugs(prev => prev.filter((_, i) => i !== index));
//     }
//   }

//   useEffect(() => {
//     setDrugs(prescriptions);
//   }, [prescriptions]);

//   return (
//     <>
//       <Flex justify='space-between' align='center'>
//         <Text fw={600}>Đơn thuốc</Text>
//         {prescriptions.length > 0 && (
//           <Tooltip label='Cập nhật đơn thuốc'>
//             <Button
//               color="primary.3"
//               onClick={handleUpdatePrescription}
//               rightSection={<GrUpdate size={18} />}
//             >
//               Lưu thay đổi
//             </Button>
//           </Tooltip>
//         )}
//       </Flex>

//       <Table mt='md' bg='gray.0'
//         styles={{
//           table: { borderRadius: 10 },
//         }}
//       >
//         <Table.Thead bg='secondary.3' c='white' style={{
//           borderRadius: '10px 10px 0 0'
//         }}>
//           <Table.Tr>
//             <Table.Th style={{ borderRadius: '10px 0 0 0' }}>Tên thuốc</Table.Th>
//             <Table.Th w={120}>Liều dùng</Table.Th>
//             <Table.Th w={120}>Đơn vị</Table.Th>
//             <Table.Th>Số lần</Table.Th>
//             <Table.Th>Uống trong</Table.Th>
//             <Table.Th>Thời điểm</Table.Th>
//             <Table.Th w={180}>Cách dùng</Table.Th>
//             <Table.Th w={50} style={{ borderRadius: '0 10px 0 0' }}>
//               <Tooltip label='Thêm thuốc'>
//                 <ActionIcon
//                   variant="white"
//                   color="primary.3"
//                   radius="xl"
//                   onClick={handleAddPrescription}
//                 // disabled={!patientInfo}
//                 >
//                   <FaPlus size={18} />
//                 </ActionIcon>
//               </Tooltip>
//             </Table.Th>
//           </Table.Tr>
//         </Table.Thead>
//         <Table.Tbody>
//           {drugs.length === 0 && (
//             <Table.Tr>
//               <Table.Td colSpan={6} className="text-center leading-9">
//                 Chưa có đơn thuốc nào được chỉ định
//               </Table.Td>
//             </Table.Tr>
//           )}
//           {drugs.map((drug, index) => (
//             <Table.Tr key={index}>
//               <Table.Td>
//                 <Autocomplete
//                   data={suggestMedicine}
//                   placeholder='Tên thuốc'
//                   value={drug.medicineName}
//                   onChange={(value) => {
//                     setDrugs(prev => {
//                       const newDrugs = [...prev];
//                       newDrugs[index].medicineName = value;
//                       return newDrugs;
//                     });
//                     getSuggestMedicine(value);
//                   }}
//                 />
//               </Table.Td>
//               <Table.Td w={120}>
//                 <NumberInput
//                   value={drug.dosage}
//                   min={1}
//                   onChange={(value) => {
//                     setDrugs(prev => {
//                       const newDrugs = [...prev];
//                       newDrugs[index].dosage = Number(value);
//                       return newDrugs;
//                     });
//                   }}
//                 />
//               </Table.Td>
//               <Table.Td w={120}>
//                 <Autocomplete
//                   data={['Viên', 'Gói', 'Chai', 'Ống', 'Vỉ', 'Hộp', 'Bình']}
//                   placeholder='Đơn vị'
//                   value={drug.unit}
//                   onChange={(value) => {
//                     setDrugs(prev => {
//                       const newDrugs = [...prev];
//                       newDrugs[index].unit = value;
//                       return newDrugs;
//                     });
//                   }}
//                 />
//               </Table.Td>
//               <Table.Th>
//                 <Autocomplete
//                   data={['Mỗi ngày 1 lần', '2 ngày 1 lần', '3 ngày 1 lần', '1 tuần 1 lần', 'Mỗi ngày 2 lần']}
//                   placeholder='Số lần'
//                   value={drug.doseInterval}
//                   onChange={(value) => {
//                     setDrugs(prev => {
//                       const newDrugs = [...prev];
//                       newDrugs[index].doseInterval = value;
//                       return newDrugs;
//                     });
//                   }}
//                 />
//               </Table.Th>
//               <Table.Th>
//                 <Autocomplete
//                   data={['1 ngày', '2 ngày', '3 ngày', '10 ngày', '1 tuần', '21 ngày', '14 ngày']}
//                   placeholder='Kéo dài'
//                   value={drug.duration}
//                   onChange={(value) => {
//                     setDrugs(prev => {
//                       const newDrugs = [...prev];
//                       newDrugs[index].duration = value;
//                       return newDrugs;
//                     });
//                   }}
//                 />
//               </Table.Th>
//               <Table.Th>
//                 <Autocomplete
//                   data={['Sáng', 'Trưa', 'Chiều', 'Tối', 'Sáng - Chiều', 'Sáng - Tối', 'Trưa - Tối', 'Sáng - Trưa - Tối']}
//                   placeholder='Thời điểm'
//                   value={drug.usingTime}
//                   onChange={(value) => {
//                     setDrugs(prev => {
//                       const newDrugs = [...prev];
//                       newDrugs[index].usingTime = value;
//                       return newDrugs;
//                     });
//                   }}
//                 />
//               </Table.Th>
//               <Table.Th w={180}>
//                 <Autocomplete
//                   data={['Uống trước ăn', 'Uống sau ăn', 'Uống trước khi ngủ', 'Uống sau khi ngủ']}
//                   placeholder='Cách dùng'
//                   value={drug.note}
//                   onChange={(value) => {
//                     setDrugs(prev => {
//                       const newDrugs = [...prev];
//                       newDrugs[index].note = value;
//                       return newDrugs;
//                     });
//                   }}
//                 />
//               </Table.Th>
//               <Table.Td>
//                 <Tooltip label='Loại bỏ thuốc'>
//                   <ActionIcon
//                     color="red.5"
//                     radius="xl"
//                     onClick={handleRemovePrescription(index)}
//                   >
//                     <MdOutlineDelete size={18} />
//                   </ActionIcon>
//                 </Tooltip>
//               </Table.Td>
//             </Table.Tr>

//           ))}
//         </Table.Tbody>
//       </Table>
//     </>
//   );
// }

// export default MedicalService;
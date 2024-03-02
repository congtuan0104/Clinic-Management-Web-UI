import { IMedicalRecord } from "@/types";
import { forwardRef } from "react";
import { Center, Divider, Grid, GridCol, Group, Stack, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import { Gender } from "@/enums";

interface IProps {
  record: IMedicalRecord;
}

const MedicalRecordPrintContext = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { record } = props;

  return <div ref={ref} className="border border-dash border-gray-400 rounded-md py-10 px-16">
    <div className="flex items-center">
      {record.clinic.logo && (
        <img src={record.clinic.logo} alt="logo" className="w-[120px] h-[120px] mr-5" />
      )}
      <div className="flex flex-col flex-1">
        <p className="uppercase font-semibold">{record.clinic.name}</p>
        <p>Địa chỉ: {record.clinic.address}</p>
        <p>Số điện thoại: {record.clinic.phone}</p>
        <p>Email: {record.clinic.email}</p>
      </div>
    </div>
    <Text ta='center' fz={34} fw={600} mt={10}>
      HỒ SƠ BỆNH ÁN
    </Text>
    <Text ta='center' >
      <b>Số hồ sơ: </b>{record?.id}
    </Text>

    <Grid py={10}>
      <GridCol span={6}>
          <Group>
          <Text>Họ tên:</Text>
          <Text fw={700}>{`${record.patient.firstName} ${record.patient.lastName}`}</Text>
          </Group>
      </GridCol>
      <GridCol span={6} >
      <Text ta='center'>Tuổi: {record.patient?.birthday
                      ? dayjs().diff(record.patient?.birthday, 'year')
                      : 'Chưa có thông tin'}</Text>
      </GridCol>
      <GridCol span={6}>
      <Text>Giới tính: {record?.patient.gender === Gender.Male ? 'Nam'
                      : record?.patient.gender === Gender.Female ? 'Nữ' : 'Chưa có thông tin'}</Text>
      </GridCol>
      <GridCol span={6}>
      <Text>Ngày sinh: {record.patient.birthday ? dayjs(record.patient.birthday).format('DD/MM/YYYY') : 'Chưa có thông tin'}</Text>
      </GridCol>
      <GridCol span={6}>
      <Text>CMND/CCCD: {record.patient.idCard ? record.patient.idCard : 'Chưa có thông tin'}</Text>
      </GridCol>
      <GridCol span={6}>
      <Text>Số thẻ bảo hiểm y tế: {record.patient.healthInsuranceCode ? record.patient.healthInsuranceCode : 'Chưa có thông tin'}</Text>
      </GridCol>
      <GridCol span={12}>
      <Text>Địa chỉ: {record.patient.address ? record.patient.address : 'Chưa có thông tin'}</Text>
      </GridCol>
      <GridCol span={12}>
      <Text>Số điện thoại: {record.patient.phone ? record.patient.phone : 'Chưa có thông tin'}</Text>
      </GridCol>    
      <GridCol span={12}>
      <Text>Email: {record.patient.email ? record.patient.email : 'Chưa có thông tin'}</Text>
      </GridCol> 
      <GridCol span={12}>
      <Group justify="space-between">
        <Text>Chiều cao: {record.height} cm</Text>
        <Text>Cân nặng: {record.weight} kg</Text>
        <Text>Huyết áp: {record.bloodPressure} mmHg</Text>
        <Text>Nhiệt độ: {record.temperature} °C</Text>
      </Group>
    {/* <Table withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Chiều cao (cm)</Table.Th>
          <Table.Th>Cân nặng (kg)</Table.Th>
          <Table.Th>Huyết áp (mmHg)</Table.Th>
          <Table.Th>Nhiệt độ (°C)</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
      <Table.Tr>
      <Table.Td>{record.height}</Table.Td>
      <Table.Td>{record.weight}</Table.Td>
      <Table.Td>{record.bloodPressure}</Table.Td>
      <Table.Td>{record.temperature}</Table.Td>
    </Table.Tr>
      </Table.Tbody>
    </Table> */}
    </GridCol>
    <GridCol span={12}>
      <Group>
      <Text fw={700}>Dịch vụ:</Text>
      {record.medicalRecordServices.map((service) => (
        <Text>{service.serviceName},</Text>
      ))}
      </Group>
      
    </GridCol>
    <GridCol span={12}>
      <Group>
      <Text fw={700}>Chẩn đoán:</Text>
      <Text>{record.diagnose}</Text>
      </Group>

    </GridCol>
    <GridCol span={12}>
    <Group>
      <Text fw={700}>Kết luận:</Text>
      <Text>{record.result}</Text>
      </Group>
    </GridCol>
    <GridCol span={12}>
    <Text fw={700}>Toa thuốc: </Text>
<Table withTableBorder withColumnBorders>
      <Table.Tbody>
        {record.prescriptionDetail.map((medicine, index) => (
          <Table.Tr>
      <Table.Td>
        <Text>{index + 1}. {medicine.medicineName}</Text>
        <Text fs={'italic'}>{medicine.duration} - {medicine.doseInterval} - {medicine.usingTime}</Text>
      </Table.Td>
      <Table.Td>{medicine.dosage} {medicine.unit}</Table.Td>
    </Table.Tr>
        ))}  
      </Table.Tbody>
    </Table>
    </GridCol>
    <GridCol span={12}>
      <Stack align="flex-end">
        <Stack align="flex-start">
        <Text>Ngày khám: {dayjs(record.dateCreated).format('DD/MM/YYYY')}</Text>
      <Text>Bác sĩ: {record.doctor.firstName} {record.doctor.lastName}</Text>
        </Stack>
      
      </Stack>

    </GridCol>
    
    </Grid>

    

          
       
    

  </div>
})

export default MedicalRecordPrintContext;
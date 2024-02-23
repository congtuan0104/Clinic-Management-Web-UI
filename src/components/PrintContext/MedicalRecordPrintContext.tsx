import { IMedicalRecord } from "@/types";
import { forwardRef } from "react";
import { Text } from "@mantine/core";

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


  </div>
})

export default MedicalRecordPrintContext;
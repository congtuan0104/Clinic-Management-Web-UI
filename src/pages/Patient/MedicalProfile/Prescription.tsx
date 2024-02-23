import { medicalRecordApi } from "@/services";
import { medicineApi } from "@/services/medicine.service";
import { INewPrescription, IPrescription } from "@/types";
import { ActionIcon, Autocomplete, Button, Flex, NumberInput, Table, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { GrUpdate } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";

interface IProps {
  prescriptions: IPrescription[];
}

const Prescription = ({ prescriptions }: IProps) => {

  return (
    <>
      <Text fw={600}>Đơn thuốc</Text>

      <Table mt='md' bg='gray.0'
        verticalSpacing='sm'
        styles={{
          table: { borderRadius: 10 },
        }}
      >
        <Table.Thead bg='secondary.3' c='white' style={{
          borderRadius: '10px 10px 0 0'
        }}>
          <Table.Tr>
            <Table.Th style={{ borderRadius: '10px 0 0 0' }}>Tên thuốc</Table.Th>
            <Table.Th w={100}>Liều dùng</Table.Th>
            <Table.Th w={100}>Đơn vị</Table.Th>
            <Table.Th w={180}>Số lần</Table.Th>
            <Table.Th w={120}>Uống trong</Table.Th>
            <Table.Th w={150}>Thời điểm</Table.Th>
            <Table.Th w={180} style={{ borderRadius: '0 10px 0 0' }}>Cách dùng</Table.Th>

          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {prescriptions.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={7} className="text-center leading-9">
                Chưa có đơn thuốc nào được chỉ định
              </Table.Td>
            </Table.Tr>
          )}
          {prescriptions.map((drug, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Text>{drug.medicineName}</Text>
              </Table.Td>
              <Table.Td w={100}>
                <Text>{drug.dosage}</Text>
              </Table.Td>
              <Table.Td w={100}>
                <Text>{drug.unit}</Text>

              </Table.Td>
              <Table.Th>
                <Text>{drug.doseInterval}</Text>
              </Table.Th>
              <Table.Th>
                <Text>{drug.duration}</Text>
              </Table.Th>
              <Table.Th>
                <Text>{drug.usingTime}</Text>
              </Table.Th>
              <Table.Th w={180}>
                <Text>{drug.note}</Text>
              </Table.Th>
            </Table.Tr>

          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}

export default Prescription;
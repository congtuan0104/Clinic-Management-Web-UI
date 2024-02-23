import { CurrencyFormatter, ModalMedicalInvoice } from "@/components";
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
  medicalServices: IMedicalService[];
}

const MedicalService = ({ medicalServices }: IProps) => {
  if (medicalServices.length === 0) return <></>
  return (
    <>
      <Text fw={600}>Các dịch vụ được chỉ định</Text>
      <Table mt='sm' bg='gray.0'
        verticalSpacing='sm'
        styles={{
          table: { borderRadius: 10 },
        }}
      >
        <Table.Thead bg='secondary.3' c='white' style={{
          borderRadius: '10px 10px 0 0'
        }}>
          <Table.Tr>
            <Table.Th style={{ borderRadius: '10px 0 0 0' }}>Dịch vụ</Table.Th>
            <Table.Th>Giá dịch vụ</Table.Th>
            <Table.Th style={{ borderRadius: '0 10px 0 0' }}>Kết quả dịch vụ</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {medicalServices?.map((service, index) => (
            <Table.Tr key={index}>
              <Table.Td>{service.serviceName}</Table.Td>
              <Table.Td><CurrencyFormatter value={service.amount} /></Table.Td>
              <Table.Td>{service.serviceResult}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}

export default MedicalService;
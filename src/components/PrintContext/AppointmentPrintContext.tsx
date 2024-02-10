import { Flex, Text } from "@mantine/core";
import { forwardRef } from "react";

const AppointmentPrintContext = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <Flex justify='center' align='center' direction='column'>
        <Text fz='2xl' fw={600}>
          PHIẾU HẸN KHÁM BỆNH
        </Text>
        <Text mt={8}>
          Phòng khám: Phòng khám đa khoa Hà Nội
        </Text>
        <Text mt={8}>
          Địa chỉ: 123 Phố Vọng, Hai Bà Trưng, Hà Nội
        </Text>
        <Text mt={8}>
          Số điện thoại: 0987654321
        </Text>
      </Flex>
    </div>
  );
});

export default AppointmentPrintContext;

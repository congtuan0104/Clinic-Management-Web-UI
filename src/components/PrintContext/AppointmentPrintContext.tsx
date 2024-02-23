import { Gender } from "@/enums";
import { IAppointment } from "@/types";
import { Checkbox, Flex, Text } from "@mantine/core";
import dayjs from "dayjs";
import { forwardRef } from "react";
import { CurrencyFormatter } from "..";
import Barcode from 'react-jsbarcode';
import uuid from 'uuid';

interface IProps {
  data: IAppointment;
}

const AppointmentPrintContext = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { data } = props;
  return (
    <div ref={ref} className="border border-dash border-gray-400 rounded-md py-10 px-16">
      <div className="flex items-center">
        {data.clinics.logo && (
          <img src={data.clinics.logo} alt="logo" className="w-[120px] h-[120px] mr-5" />
        )}
        <div className="flex flex-col flex-1">
          <p className="uppercase font-semibold">{data.clinics.name}</p>
          <p>Địa chỉ: {data.clinics.address}</p>
          <p>Số điện thoại: {data.clinics.phone}</p>
          <p>Email: {data.clinics.email}</p>
        </div>
      </div>
      <Text ta='center' fz={34} fw={600} mt={10}>
        PHIẾU HẸN KHÁM
      </Text>
      <div className="flex justify-center mb-2">
        <Barcode
          options={{
            height: 80,
            displayValue: false
          }}
          value={(Math.random() + 1).toString(36).substring(3).toUpperCase()} />
      </div>
      <table className="w-full">
        <tbody>
          <tr>
            <td colSpan={2}>
              <b>Thông tin người hẹn khám</b>
            </td>
          </tr>
          <tr>
            <td className="w-1/3">Họ và tên:</td>
            <td className="uppercase w-2/3">{data.patient.firstName} {data.patient.lastName}</td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>{data.patient.gender === Gender.Male ? 'Nam' : 'Nữ'}</td>
          </tr>
          {data.patient.birthday && (
            <tr>
              <td>Tuổi:</td>
              <td>
                {dayjs().diff(data.patient.birthday, 'month') < 12 ? dayjs().diff(data.patient.birthday, 'month') + ' tháng' : dayjs().diff(data.patient.birthday, 'year')}
              </td>
            </tr>
          )}
          <tr>
            <td>Địa chỉ:</td>
            <td>{data.patient.address}</td>
          </tr>
          <tr>
            <td>Điện thoại:</td>
            <td>{data.patient.phone}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{data.patient.email}</td>
          </tr>
          <tr>
            <td>Số thẻ bảo hiểm y tế:</td>
            <td>{data.patient.healthInsuranceCode}</td>
          </tr>

          <tr>
            <td colSpan={2} className="pt-3">
              <b>Thông tin lịch hẹn</b>
            </td>
          </tr>
          <tr>
            <td>Ngày hẹn:</td>
            <td>{dayjs(data.date).format('DD/MM/YYYY')}</td>
          </tr>

          <tr>
            <td>Giờ khám dự kiến</td>
            <td>{data.startTime} - {data.endTime}</td>
          </tr>

          <tr>
            <td>Dịch vụ:</td>
            <td> {data.clinicServices.serviceName}</td>
          </tr>
          <tr>
            <td>Phí dịch vụ</td>
            <td><CurrencyFormatter value={data.clinicServices.price} /></td>
          </tr>

          <tr>
            <td>Bác sĩ:</td>
            <td>{data.doctor.firstName} {data.doctor.lastName}</td>
          </tr>

          <tr>
            <td>Mô tả:</td>
            <td>{data.description}</td>
          </tr>

        </tbody>
      </table>

    </div>
  );
});

export default AppointmentPrintContext;

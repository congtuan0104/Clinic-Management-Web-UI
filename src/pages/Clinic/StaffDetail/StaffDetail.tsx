import { useAppSelector } from "@/hooks";
import { currentClinicSelector } from "@/store";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";


const StaffDetail = () => {
  const { id: staffId } = useParams() // id nhân viên lấy từ url
  const currentClinic = useAppSelector(currentClinicSelector);

  // gọi api lấy thông tin nhân viên theo id (sử dụng react-query)
  // const { data: staffInfo, isLoading } = useQuery(
  //   ['staffInfo', staffId],
  //   () => clinicApi.getStaffInfo(clinicId, staffId).then(res => res.data)
  // );

  return (
    <div>
      <h1>Thông tin nhân viên</h1>
      <h4>Staff ID: {staffId}</h4>
      <h4>Clinic ID: {currentClinic?.id}</h4>
    </div>
  );
};

export default StaffDetail;
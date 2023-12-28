import { clinicApi, planApi } from "@/services";
import { IClinicWithSubscription, IServicePlan } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal } from "@mantine/core";
import { Form, useForm } from "react-hook-form";
import { NativeSelect, Select, TextInput } from "react-hook-form-mantine";
import { useQuery } from "react-query";
import * as yup from 'yup';
import { CurrencyFormatter } from "..";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";



interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (clinic: IClinicWithSubscription) => void;
  selectedPlanId?: number;
}

interface IAddClinicFormData {
  clinicName: string;
  email: string;
  phone: string;
  address: string;
  planId: number;
}

const schema = yup.object().shape({
  clinicName: yup.string().required('Bạn chưa nhập tên phòng khám'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  phone: yup.string().required('Thông tin số điện thoại là bắt buộc'),
  address: yup.string().required('Thông tin địa chỉ phòng khám là bắt buộc'),
  planId: yup.number().required('Bạn chưa chọn gói dịch vụ'),
});

const ModalCreateNewClinic = ({ isOpen, onClose, onSuccess, selectedPlanId }: IProps) => {

  const { data: plans, isLoading: isLoadingPlan } = useQuery(
    'plans',
    () => planApi.getAllPlans().then(res => res.data)
  );

  const { control, setValue } = useForm<IAddClinicFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      clinicName: '',
      email: '',
      phone: '',
      address: '',
      planId: selectedPlanId,
    },
  });

  useEffect(() => {
    if (selectedPlanId) {
      setValue('planId', selectedPlanId);
    }
  }, [selectedPlanId, setValue]);

  const handleAddClinic = async (data: IAddClinicFormData) => {
    console.log('data: ', data);
    const newClinicData = {
      name: data.clinicName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      planId: data.planId.toString()
    };

    const response = await clinicApi.createClinic(newClinicData);

    if (response.status && response.data) {
      onSuccess(response.data);
    }
    else {
      notifications.show({
        message: 'Tạo phòng khám thất bại',
        color: 'red',
      });
    }
  }

  return (
    <Modal size='lg' opened={isOpen} onClose={onClose} title="Tạo phòng khám mới" centered>
      <Form
        control={control}
        onSubmit={e => handleAddClinic(e.data)}
        onError={e => console.log(e)}>
        <TextInput
          label="Tên phòng khám"
          name="clinicName"
          required
          size="md"
          radius="sm"
          control={control}
        />
        <Flex justify="space-between" gap={20}>
          <TextInput
            label="Email liên hệ"
            name="email"
            required
            mt="md"
            size="md"
            radius="sm"
            className="flex-1"
            control={control}
          />
          <TextInput
            label="Số điện thoại liên hệ"
            name="phone"
            required
            mt="md"
            size="md"
            radius="sm"
            className="flex-1"
            width='100%'
            control={control}
          />
        </Flex>

        <TextInput
          label="Địa chỉ phòng khám"
          name="address"
          required
          mt="md"
          size="md"
          radius="sm"
          control={control}
        />
        <Select
          name="planId"
          control={control}
          label="Chọn gói quản lý phòng khám"
          placeholder={isLoadingPlan ? 'Đang lấy danh sách gói' : ''}
          withAsterisk
          mt="md"
          size="md"
          radius="sm"
          required
          disabled={isLoadingPlan}
          comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
          checkIconPosition="right"
          data={plans?.map((plan) => ({
            value: plan.id.toString(),
            label: `${plan.planName} - ${plan.duration} ngày - ${plan.currentPrice} VNĐ`,
          }))
          }
        />

        {/* <NativeSelect
          name="planId"
          control={control}
          label="Chọn gói quản lý phòng khám"
          placeholder={isLoadingPlan ? 'Đang lấy danh sách gói' : ''}
          withAsterisk
          mt="md"
          size="md"
          radius="sm"
          required
          disabled={isLoadingPlan}
        >
          {plans && plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.planName} - <CurrencyFormatter value={plan.currentPrice} /> - {plan.duration} ngày
            </option>
          ))}
        </NativeSelect> */}
        <Flex justify='end' mt='xl' gap={8}>
          <Button variant="default" radius="sm" size="md" onClick={onClose}>
            Đóng
          </Button>
          <Button radius="sm" size="md" type="submit">
            Đăng ký
          </Button>
        </Flex>
      </Form>
    </Modal>
  )
}

export default ModalCreateNewClinic;
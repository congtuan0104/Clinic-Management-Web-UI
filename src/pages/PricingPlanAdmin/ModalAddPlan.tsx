import { planApi } from "@/services";
import { IAddPlanRequest } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Modal, Text, Checkbox, LoadingOverlay, Box } from "@mantine/core";
import { useForm, Form, Controller } from 'react-hook-form';
import { NumberInput, TextInput, Textarea } from "react-hook-form-mantine";
import { useMutation, useQuery } from "react-query";
import { notifications } from '@mantine/notifications';


import * as yup from 'yup';


interface IModalAddPlanProps {
  open: boolean;
  onClose: () => void;
}


const schema = yup.object().shape({
  planName: yup.string().required('Tên gói dịch vụ là thông tin bắt buộc'),
  currentPrice: yup.number().required('Giá gói dịch vụ là thông tin bắt buộc'),
  duration: yup.number().required('Thời hạn gói dịch vụ là thông tin bắt buộc'),
  description: yup.string(),
  optionIds: yup.array()
});

const ModalAddPlan = ({ open, onClose }: IModalAddPlanProps) => {

  const { data: features } = useQuery('options', async () => getAllOptionFeatures());


  const getAllOptionFeatures = async () => {
    try {
      const response = await planApi.getAllOptionFeatures();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const postNewPlan = async (data: IAddPlanRequest) => {
    try {
      const response = await planApi.createNewPlan(data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  // useMutation để thực hiện hành động thêm gói dịch vụ
  const { mutate, isLoading } = useMutation(postNewPlan, {
    onSuccess: () => {
      notifications.show({
        message: 'Thêm gói dịch vụ thành công',
        color: 'green.5',
      });
      handleClose();
    },
    onError: () => {
      notifications.show({
        message: 'Thêm gói dịch vụ thất bại',
        color: 'red.5',
      });
    }
  });

  const { control, reset } = useForm<IAddPlanRequest>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      planName: '',
      currentPrice: 0,
      duration: 30,
      description: '',
      optionIds: [],
    },
  });

  const handleAddPlan = (data: IAddPlanRequest) => {
    // chuyển đổi optionIds từ dạng string sang dạng number
    data.optionIds = data.optionIds ? data.optionIds.map((optionId) => Number(optionId)) : [];
    console.log(data);
    mutate(data);
  }

  const handleClose = () => {
    onClose();
    reset();
  }

  return (
    <Modal.Root opened={open} onClose={handleClose} centered size='lg'>
      <Modal.Overlay />
      <LoadingOverlay visible={isLoading} zIndex={1000} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fz="lg" fw={600} c='primary'>Thêm gói dịch vụ</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Form
            control={control} onSubmit={e => handleAddPlan(e.data)}>
            <TextInput
              label="Tên gói"
              name="planName"
              required
              size="md"
              radius="sm"
              control={control}
            />
            <NumberInput
              label="Giá gói"
              name="currentPrice"
              required
              size="md"
              mt='sm'
              radius="sm"
              control={control}
              suffix="₫"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              rightSection={<></>}
            />
            <NumberInput
              label="Thời hạn gói (ngày)"
              name="duration"
              required
              size="md"
              mt='sm'
              radius="sm"
              control={control}
              min={1}
            />
            <Textarea
              label="Mô tả gói"
              name="description"
              required
              size="md"
              radius="sm"
              mt='sm'
              control={control}
            />

            <Controller
              name="optionIds"
              control={control}
              render={({ field }) => (
                <Checkbox.Group
                  {...field}
                  label="Chọn các chức năng"
                  mt='sm'
                  required
                  value={field.value ? field.value.map(String) : undefined}
                >
                  {features && features.map((feature) => (
                    <Checkbox
                      label={feature.optionName}
                      value={String(feature.id)}
                      mt='sm'
                    />
                  ))}
                </Checkbox.Group>
              )}
            />

            {/* <CheckboxGroup label="Chọn chức năng" control={control} name="optionIds" mt='sm'>
                {features && features.map((feature) => (
                  <Checkbox
                    label={feature.optionName}
                    value={feature.id}
                    mt='sm'
                  />
                ))}
  
              </CheckboxGroup> */}


            {/* {features && features.map((feature) => (
                <Checkbox
                  label={feature.optionName}
                  value={feature.id}
                  mt='sm'
                />
              ))} */}
            <Flex justify='flex-end'>
              <Button mt="xl" radius="sm" size="md" type="submit">
                Xác nhận
              </Button>
              <Button mt="xl" ml="sm" radius="sm" size="md" variant='outline' color='red.5'
                onClick={handleClose}>
                Hủy
              </Button>
            </Flex>
          </Form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>

  )
}

export default ModalAddPlan;
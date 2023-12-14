import { planApi } from "@/services";
import { IAddPlanRequest, IServicePlan } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Modal, Text, Checkbox, LoadingOverlay, Box } from "@mantine/core";
import { useForm, Form, Controller } from 'react-hook-form';
import { NumberInput, TextInput, Textarea } from "react-hook-form-mantine";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { notifications } from '@mantine/notifications';


import * as yup from 'yup';
import { useState } from "react";


interface IModalPlanDetailProps {
  open: boolean;
  onClose: () => void;
  planInfo: IServicePlan;
}


const schema = yup.object().shape({
  planName: yup.string().required('Tên gói dịch vụ là thông tin bắt buộc'),
  currentPrice: yup.number().required('Giá gói dịch vụ là thông tin bắt buộc'),
  duration: yup.number().required('Thời hạn gói dịch vụ là thông tin bắt buộc'),
  description: yup.string(),
  optionIds: yup.array().min(1, 'Chọn ít nhất 1 chức năng'),
});

const ModalPlanDetail = ({ open, onClose, planInfo }: IModalPlanDetailProps) => {
  const { data: features } = useQuery('options', async () => getAllOptionFeatures());
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);

  const getAllOptionFeatures = async () => {
    try {
      const response = await planApi.getAllOptionFeatures();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const updatePlan = async (data: IAddPlanRequest) => {
    try {
      const response = await planApi.updatePlan(planInfo.id, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  // useMutation để thực hiện hành động thêm gói dịch vụ
  const { mutate, isLoading } = useMutation(updatePlan, {
    onSuccess: () => {
      notifications.show({
        message: 'Cập nhật thông tin gói thành công',
        color: 'green.5',
      });
      setEditMode(false);
      queryClient.invalidateQueries('plans');
    },
    onError: () => {
      notifications.show({
        message: 'Cập nhật thông tin gói thất bại',
        color: 'red.5',
      });
    }
  });

  const { control, reset } = useForm<IAddPlanRequest>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      planName: planInfo.planName,
      currentPrice: planInfo.currentPrice,
      duration: planInfo.duration,
      description: planInfo.description,
      optionIds: planInfo.planOptions.map((option) => option.id)
    },
  });

  const handleUpdatePlanInfo = (data: IAddPlanRequest) => {
    // chuyển đổi optionIds từ dạng string sang dạng number
    data.optionIds = data.optionIds ? data.optionIds.map((optionId) => Number(optionId)) : [];
    console.log(data);
    mutate(data);
  }

  const handleClose = () => {
    onClose();
    reset();
    setEditMode(false);
  }

  return (
    <Modal.Root opened={open} onClose={handleClose} centered size='lg'>
      <Modal.Overlay />
      <LoadingOverlay visible={isLoading} zIndex={1000} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fz="lg" fw={600} c='primary'>Chi tiết gói dịch vụ</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Form
            control={control} onSubmit={e => handleUpdatePlanInfo(e.data)}>
            <TextInput
              label="Tên gói"
              name="planName"
              variant={editMode ? 'default' : 'filled'}
              required
              size="md"
              radius="sm"
              control={control}
              readOnly={!editMode}
            />
            <NumberInput
              label="Giá gói"
              name="currentPrice"
              variant={editMode ? 'default' : 'filled'}
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
              readOnly={!editMode}
            />
            <NumberInput
              label="Thời hạn gói (ngày)"
              name="duration"
              required
              size="md"
              variant={editMode ? 'default' : 'filled'}
              mt='sm'
              radius="sm"
              control={control}
              min={1}
              readOnly={!editMode}
            />
            <Textarea
              label="Mô tả gói"
              name="description"
              required
              size="md"
              variant={editMode ? 'default' : 'filled'}
              radius="sm"
              mt='sm'
              control={control}
              readOnly={!editMode}
            />

            <Controller
              name="optionIds"
              control={control}
              render={({ field }) => (
                <Checkbox.Group
                  {...field}
                  label={editMode ? <Text component="span">Chọn các chức năng</Text> : <Text component="span">Các chức năng trong gói</Text>}
                  mt='sm'
                  required
                  value={field.value ? field.value.map(String) : undefined}
                >
                  {features && features.map((feature) => (
                    <Checkbox
                      disabled={!editMode}
                      label={feature.optionName}
                      value={String(feature.id)}
                      mt='sm'
                    />
                  ))}
                </Checkbox.Group>
              )}
            />

            <Flex justify='flex-end'>
              {editMode ? (
                <>
                  <Button mt="xl" radius="sm" size="md" type="submit">
                    Lưu
                  </Button>
                  <Button mt="xl" ml="sm" radius="sm" size="md" variant='outline' color='red.5'
                    onClick={(e) => {
                      e.preventDefault();
                      setEditMode(false);
                    }}>
                    Hủy
                  </Button></>
              ) : (
                <Button mt="xl" radius="sm" size="md" onClick={(e) => {
                  e.preventDefault();
                  setEditMode(true);
                }}>
                  Chỉnh sửa
                </Button>
              )}
            </Flex>
          </Form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>

  )
}

export default ModalPlanDetail;
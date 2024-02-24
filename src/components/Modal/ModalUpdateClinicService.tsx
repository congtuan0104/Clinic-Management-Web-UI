import { CATEGORY_TYPE, Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, categoryApi, clinicApi, clinicServiceApi, staffApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { IClinicService, IPostClinicServiceParams } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo } from "react";
import { Form, useForm } from "react-hook-form";
import { NumberInput, Select, Switch, TextInput, Textarea } from "react-hook-form-mantine";
import { BsPatchCheck } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { SiMaildotru } from "react-icons/si";
import { useQuery } from "react-query";
import * as yup from "yup";


interface IModalProps {
  isOpen: boolean;
  service?: IClinicService;
  onClose: () => void;
  onSuccess: () => void;
}

interface IFormData {
  serviceName: string;
  price: number;
  description?: string;
  categoryId?: string | null;
  isDisabled: boolean;
}

const validateSchema = yup.object().shape({
  serviceName: yup.string().required('Tên dịch vụ không được để trống'),
  price: yup.number().required('Giá dịch vụ không được để trống'),
  description: yup.string(),
  categoryId: yup.string().nullable(),
  isDisabled: yup.boolean().required(),
});

const ModalUpdateClinicService = ({
  isOpen,
  service,
  onClose,
  onSuccess
}: IModalProps) => {

  const currentClinic = useAppSelector(currentClinicSelector);

  if (!service) {
    return null;
  }

  const { data: cates, isLoading } = useQuery(
    ['category', currentClinic?.id, CATEGORY_TYPE.SERVICE],
    () => categoryApi.getCategories(currentClinic!.id, { type: CATEGORY_TYPE.SERVICE })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset, watch } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      serviceName: service.serviceName,
      price: service.price,
      description: service.description || '',
      categoryId: service.categoryId?.toString(),
      isDisabled: !service.isDisabled,
    }
  });

  // useEffect(() => {
  //   reset({
  //     serviceName: service.serviceName,
  //     price: service.price,
  //     description: service.description,
  //     categoryId: service.categoryId,
  //     isDisabled: service.isDisabled,
  //   })
  // }, [service])

  const handleCancel = () => {
    reset();
    onClose();
  }



  const handleSubmitForm = async (newData: IFormData) => {
    const res = await clinicServiceApi.updateClinicService(
      service.id,
      {
        ...newData,
        isDisabled: !newData.isDisabled,
        categoryId: newData.categoryId ? parseInt(newData.categoryId) : undefined
      }
    )

    if (res.status) {
      notifications.show({
        title: 'Thành công',
        message: 'Cập nhật thông tin dịch vụ thành công',
        color: 'teal.5',
      });
      reset();
      onSuccess();
      onClose();
    }
    else {
      notifications.show({
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
        color: 'red.5',
      });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <ModalHeader>
          <Modal.Title fz={16} fw={600}>Dịch vụ {service.serviceName}</Modal.Title>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>
            <TextInput
              label="Tên dịch vụ"
              name="serviceName"
              required
              size="md"
              control={control}
            />

            <NumberInput
              label="Giá dịch vụ"
              name="price"
              required
              size="md"
              mt="md"
              control={control}
              suffix="₫"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              rightSection={<></>}
            />

            <Select
              name="categoryId"
              control={control}
              clearable
              label="Loại dịch vụ"
              placeholder={'Chọn loại dịch vụ (không bắt buộc)'}
              mt="md"
              size="md"
              disabled={isLoading}
              comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
              checkIconPosition="right"
              data={cates?.map((cate) => ({
                value: cate.id.toString(),
                label: cate.name,
              }))
              }
            />

            <Textarea
              label="Mô tả dịch vụ"
              name="description"
              size="md"
              mt='sm'
              autosize
              minRows={3}
              control={control}
            />

            <Switch
              label={watch('isDisabled') ? "Dịch vụ đang hoạt động" : "Dịch vụ ngừng hoạt động"}
              mt='sm'
              name="isDisabled"
              styles={{ label: { fontSize: '16px' } }}
              size="lg"
              color="primary.3"
              radius="lg"
              control={control}
            />

            <Flex justify='end' gap={10}>
              <Button mt="lg" size="md" color='gray.6' onClick={handleCancel}>
                Hủy
              </Button>
              <Button mt="lg" size="md" type="submit" color="primary.3">
                Lưu thay đổi
              </Button>
            </Flex>
          </Form>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalUpdateClinicService
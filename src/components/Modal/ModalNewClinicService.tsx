import { CATEGORY_TYPE, Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, categoryApi, clinicApi, clinicServiceApi, staffApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Form, useForm } from "react-hook-form";
import { NumberInput, Select, TextInput, Textarea } from "react-hook-form-mantine";
import { BsPatchCheck } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { SiMaildotru } from "react-icons/si";
import { useQuery } from "react-query";
import * as yup from "yup";


interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IFormData {
  serviceName: string;
  price: number;
  description?: string;
  categoryId?: number;
}

const validateSchema = yup.object().shape({
  serviceName: yup.string().required('Tên dịch vụ không được để trống'),
  price: yup.number().required('Giá dịch vụ không được để trống'),
  description: yup.string(),
  categoryId: yup.number(),
});

const ModalNewClinicService = ({
  isOpen,
  onClose,
  onSuccess
}: IModalProps) => {

  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: cates, isLoading } = useQuery(
    ['category', currentClinic?.id, CATEGORY_TYPE.SERVICE],
    () => categoryApi.getCategories(currentClinic!.id, { type: CATEGORY_TYPE.SERVICE })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      serviceName: '',
      price: 0,
      description: '',
      categoryId: undefined,
    },
  });


  const handleCancel = () => {
    reset();
    onClose();
  }



  const handleSubmitForm = async (data: IFormData) => {
    const res = await clinicServiceApi.createClinicService(
      currentClinic!.id,
      { ...data, isDisabled: false }
    )

    if (res.status) {
      notifications.show({
        title: 'Thêm dịch vụ thành công',
        message: 'Dịch vụ đã được thêm thành công',
        color: 'teal.5',
      });
      reset();
      onSuccess();
      onClose();
    }
    else {
      notifications.show({
        title: 'Thêm dịch vụ thất bại',
        message: 'Đã có lỗi xảy ra khi thêm dịch vụ',
        color: 'red.5',
      });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Dịch vụ mới</Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>
            <TextInput
              label="Tên dịch vụ"
              name="serviceName"
              required
              mt='md'
              size="md"
              control={control}
            />

            <NumberInput
              label="Giá dịch vụ"
              name="price"
              required
              size="md"
              mt='md'
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
              label="Loại dịch vụ"
              placeholder={'Chọn loại dịch vụ (không bắt buộc)'}
              withAsterisk
              mt="md"
              size="md"
              searchable
              required
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
              required
              size="md"
              mt='sm'
              autosize
              minRows={3}
              control={control}
            />

            <Flex justify='end' gap={10}>
              <Button mt="lg" size="md" color='gray.5' onClick={handleCancel}>
                Hủy
              </Button>
              <Button mt="lg" size="md" type="submit" color="primary.3">
                Lưu
              </Button>
            </Flex>
          </Form>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalNewClinicService
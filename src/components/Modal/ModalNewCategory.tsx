import { CATEGORY_TYPE, Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, categoryApi, clinicApi, clinicServiceApi, staffApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { ICreateCategoryPayload } from "@/types";
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

const validateSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên danh mục'),
  type: yup.number().required('Vui lòng chọn loại danh mục'),
  note: yup.string(),
  description: yup.string(),
});

const ModalNewCategory = ({
  isOpen,
  onClose,
  onSuccess
}: IModalProps) => {
  const currentClinic = useAppSelector(currentClinicSelector);


  const { control, reset } = useForm<ICreateCategoryPayload>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      name: '',
      description: '',
      note: '',
    },
  });

  const handleCancel = () => {
    reset();
    onClose();
  }

  const handleSubmitForm = async (data: ICreateCategoryPayload) => {
    const res = await categoryApi.createCategory(
      currentClinic!.id, data
    )

    if (res.status) {
      notifications.show({
        title: 'Thao tác thành công',
        message: 'Danh mục mới đã được tạo thành công',
        color: 'teal.5',
      });
      reset();
      onSuccess();
      onClose();
    }
    else {
      notifications.show({
        title: 'Thao tác thất bại',
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!',
        color: 'red.5',
      });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay />
      <Modal.Content radius='lg'>
        <ModalHeader>
          <Modal.Title fz={16} fw={600}>Thêm danh mục mới</Modal.Title>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>
            <Select
              name="type"
              control={control}
              label="Phân loại danh mục"
              withAsterisk
              size="md"
              searchable
              radius="sm"
              required
              comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
              checkIconPosition="right"
              data={[
                { label: 'Dịch vụ y tế', value: CATEGORY_TYPE.SERVICE.toString() },
                { label: 'Vật tư y tế', value: CATEGORY_TYPE.SUPPLIER.toString() }
              ]}
            />

            <TextInput
              label="Tên danh mục"
              name="name"
              required
              mt="md"
              size="md"
              radius="sm"
              control={control}
            />

            <TextInput
              label="Ghi chú"
              placeholder="Ghi chú (không bắt buộc)"
              name="note"
              mt='sm'
              size="md"
              radius="sm"
              control={control}
            />

            <Textarea
              label="Mô tả"
              name="description"
              placeholder="Thêm mô tả về danh mục (không bắt buộc)"
              size="md"
              radius="sm"
              mt='sm'
              autosize
              minRows={3}
              control={control}
            />

            <Flex justify='end' gap={10}>
              <Button mt="lg" radius="sm" size="md" type="submit">
                Lưu
              </Button>
              <Button mt="lg" radius="sm" size="md" variant='outline' color='red.5' onClick={handleCancel}>
                Hủy
              </Button>
            </Flex>
          </Form>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalNewCategory
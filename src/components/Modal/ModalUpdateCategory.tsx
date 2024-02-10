import { useAppSelector } from "@/hooks";
import { categoryApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { ICategory, ICreateCategoryPayload, IUpdateCategoryPayload } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalHeader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Form, useForm } from "react-hook-form";
import { TextInput, Textarea } from "react-hook-form-mantine";
import * as yup from "yup";


interface IModalProps {
  isOpen: boolean;
  category: ICategory;
  onClose: () => void;
  onSuccess: () => void;
}

const validateSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên danh mục'),
  note: yup.string(),
  description: yup.string(),
});

const ModalUpdateCategory = ({
  isOpen,
  category,
  onClose,
  onSuccess
}: IModalProps) => {
  const { control, reset } = useForm<IUpdateCategoryPayload>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      name: category.name,
      description: category.description,
      note: category.note,
    },
  });

  const handleCancel = () => {
    reset();
    onClose();
  }

  const handleSubmitForm = async (newData: IUpdateCategoryPayload) => {
    const res = await categoryApi.updateCategory(
      category.id,
      newData
    )

    if (res.status) {
      notifications.show({
        title: 'Thành công',
        message: 'Thông tin danh mục đã được cập nhật thành công!',
        color: 'teal.5',
      });
      reset();
      onSuccess();
      onClose();
    }
    else {
      notifications.show({
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!',
        color: 'red.5',
      });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Cập nhật thông tin danh mục</Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>

            <TextInput
              label="Tên danh mục"
              name="name"
              required
              mt="md"
              size="md"
              control={control}
            />

            <TextInput
              label="Ghi chú"
              placeholder="Ghi chú (không bắt buộc)"
              name="note"
              mt='sm'
              size="md"
              control={control}
            />

            <Textarea
              label="Mô tả"
              name="description"
              placeholder="Thêm mô tả về danh mục (không bắt buộc)"
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
              <Button mt="lg" size="md" type="submit">
                Lưu thay đổi
              </Button>
            </Flex>
          </Form>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalUpdateCategory
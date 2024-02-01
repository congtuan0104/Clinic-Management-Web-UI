import { Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, clinicApi, clinicServiceApi, staffApi } from "@/services";
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

  // const { data: roles, isLoading: isLoadingRoles } = useQuery(
  //   ['categories', currentClinic?.id],
  //   () => clinicApi.getClinicRoles(currentClinic!.id).then(res => res.data),
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );

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
        icon: BsPatchCheck,
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
        icon: MdErrorOutline,
      });
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay />
      <Modal.Content radius='lg'>
        <ModalHeader>
          <Modal.Title fz={16} fw={600}>Thêm dịch vụ mới</Modal.Title>
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
              radius="sm"
              control={control}
            />

            <NumberInput
              label="Giá dịch vụ"
              name="price"
              required
              size="md"
              radius="sm"
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
              radius="sm"
              required
              // disabled={isLoadingRoles || isDisabled}
              comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
              checkIconPosition="right"
              data={[]}
            // data={roles?.map((role) => ({
            //   value: role.id.toString(),
            //   label: role.name,
            // }))
            // }
            />


            <Textarea
              label="Mô tả dịch vụ"
              name="description"
              required
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

export default ModalNewClinicService
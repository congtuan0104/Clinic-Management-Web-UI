import { CATEGORY_TYPE, Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, categoryApi, clinicApi, clinicServiceApi, staffApi, suppliesApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { ICreateCategoryPayload, ICreateSuppliesPayload, IMedicalSupplies, IUpdateSuppliesPayload } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader, ScrollArea } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Form, useForm } from "react-hook-form";
import { NumberInput, Select, Switch, TextInput, Textarea } from "react-hook-form-mantine";
import { BsPatchCheck } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { SiMaildotru } from "react-icons/si";
import { useQuery } from "react-query";
import * as yup from "yup";


interface IModalProps {
  isOpen: boolean;
  supplies: IMedicalSupplies;
  onClose: () => void;
  onSuccess: () => void;
}

interface IFormData {
  medicineName: string;
  stock: number;
  unit: string;
  expiry?: string;
  expiredAt?: Date;
  vendor?: string;
  categoryId?: string;
  // note?: string;
  description?: string;
  isActivated: boolean;
}

const validateSchema = yup.object().shape({
  medicineName: yup.string().required('Vui lòng nhập tên danh mục'),
  stock: yup.number().required('Vui lòng nhập số lượng vật tư').min(1, 'Số lượng tối thiểu là 1'),
  unit: yup.string().required('Vui lòng nhập đơn vị tính'),
  expiry: yup.string(),
  expiredAt: yup.date(),
  vendor: yup.string(),
  categoryId: yup.string(),
  // note: yup.string(),
  description: yup.string(),
  isActivated: yup.boolean().required(),
});

const ModalUpdateSupplies = ({
  isOpen,
  supplies,
  onClose,
  onSuccess
}: IModalProps) => {
  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: cates, isLoading } = useQuery(
    ['category', currentClinic?.id, CATEGORY_TYPE.SUPPLIES],
    () => categoryApi.getCategories(currentClinic!.id, { type: CATEGORY_TYPE.SUPPLIES })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset, watch } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      medicineName: supplies.medicineName,
      stock: supplies.stock,
      unit: supplies.unit,
      expiry: supplies.expiry || '',
      vendor: supplies.vendor || '',
      // note: '',
      categoryId: supplies.categoryId?.toString(),
      description: supplies.description || '',
      isActivated: !supplies.isDisabled,
    },
  });

  const handleCancel = () => {
    reset();
    onClose();
  }

  const handleSubmitForm = async (data: IFormData) => {

    const payload: IUpdateSuppliesPayload = {
      medicineName: data.medicineName,
      stock: data.stock,
      unit: data.unit,
      expiry: data.expiry,
      expiredAt: data.expiredAt,
      vendor: data.vendor,
      description: data.description,
      clinicId: currentClinic!.id,
      categoryId: parseInt(data.categoryId!),
      isDisabled: !data.isActivated,
      // price: 60000000,
    }
    const res = await suppliesApi.updateSupplies(supplies.id, payload)

    if (res.status) {
      notifications.show({
        title: 'Thành công',
        message: 'Thông tin ' + data.medicineName + ' đã được cập nhật thành công',
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
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'auto'} scrollAreaComponent={ScrollArea.Autosize}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Thiết bị, vật tư mới</Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>

            <TextInput
              label="Tên"
              name="medicineName"
              placeholder="Tên thiết bị, vật tư"
              required
              mt="md"
              size="md"
              control={control}
            />

            <Select
              name="categoryId"
              control={control}
              label="Loại vật tư"
              withAsterisk
              size="md"
              mt='md'
              searchable
              required
              disabled={isLoading}
              comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
              checkIconPosition="right"
              data={cates?.map((cate) => ({
                value: cate.id.toString(),
                label: cate.name,
              }))}
            />


            <Grid gutter={10} mt="md">
              <Grid.Col span={4}>
                <NumberInput
                  label="Số lượng"
                  min={1}
                  name="stock"
                  placeholder="Số lượng vật tư hiện có"
                  required
                  size="md"
                  control={control}
                />
              </Grid.Col>
              <Grid.Col span={8}>
                <TextInput
                  label="Đơn vị"
                  name="unit"
                  placeholder="cái, hộp, lọ, ..."
                  required
                  size="md"
                  control={control}
                />
              </Grid.Col>

            </Grid>

            <TextInput
              label="Hạn sử dụng"
              name="expiry"
              placeholder="Hạn sử dụng (nếu có)"
              size="md"
              mt='md'
              control={control}
            />

            <TextInput
              label="Nhà sản xuất"
              name="vendor"
              placeholder="Nhà sản xuất(nếu có)"
              size="md"
              mt='md'
              control={control}
            />

            <Textarea
              label="Mô tả"
              name="description"
              placeholder="Thêm mô tả về thiết bị (không bắt buộc)"
              size="md"
              mt='sm'
              autosize
              minRows={3}
              control={control}
            />

            <Switch
              label={watch('isActivated') ? "Vật tư đang được sử dụng" : "Vật tư không sử dụng"}
              mt='sm'
              name="isActivated"
              styles={{ label: { fontSize: '16px' } }}
              size="lg"
              color="primary.3"
              radius="lg"
              control={control}
            />

            <Flex justify='end' gap={10}>
              <Button mt="lg" size="md" color='gray.5' onClick={handleCancel}>
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

export default ModalUpdateSupplies
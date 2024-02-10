import { useState } from 'react';
import {
  Flex,
  Button,
  Accordion,
  Title,
  Paper,
  Loader,
  Text
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { ModalNewCategory, ModalUpdateCategory } from "@/components";
import { useQuery } from 'react-query';
import { categoryApi } from '@/services';
import { CATEGORY_TYPE } from '@/enums';
import { notifications } from '@mantine/notifications';
import { BsXDiamondFill } from 'react-icons/bs';
import { modals } from '@mantine/modals';
import { ICategory } from '@/types';
import { TbCategoryPlus } from 'react-icons/tb';

const ClinicCategoryPage = () => {
  const currentClinic = useAppSelector(currentClinicSelector);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);
  const [selectedCate, setSelectedCate] = useState<ICategory | undefined>(undefined);

  console.log('selectedCate', selectedCate)

  // chuyển enum CATEGORY_TYPE thành mảng
  const categoryTypeList = Object.values(CATEGORY_TYPE).filter((v) => isNaN(Number(v)))
  console.log(categoryTypeList)

  // lấy dữ liệu từ api
  const { data: cates, refetch, isLoading, isFetching } = useQuery(
    ['category', currentClinic?.id],
    () => categoryApi.getCategories(currentClinic!.id).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const deleteCategory = async (cate: ICategory) => {
    modals.openConfirmModal({
      title: <Text size='md' fw={700}>Xác nhận</Text>,
      children: (
        <Text size="sm" lh={1.6}>
          Bạn có chắc muốn xóa danh mục <b>{cate.name}</b> không?<br />
          Thao tác này không thể hoàn tác sau khi xác nhận
        </Text>
      ),
      confirmProps: { color: 'red.5' },
      onConfirm: async () => {
        const res = await categoryApi.deleteCategory(cate.id)
        if (res.status) {
          notifications.show({
            title: 'Thành công',
            message: 'Danh mục đã được xóa',
            color: 'teal.5',
          })
          refetch()
        }
        else {
          notifications.show({
            title: 'Thất bại',
            message: 'Đã có lỗi xảy ra',
            color: 'red.5',
          })
        }
      }
    })
  }


  const renderCateByType = (type: CATEGORY_TYPE) => {
    const catesByType = cates?.filter(cate => cate.type === type)
    if (!catesByType || catesByType.length === 0) {
      return <div>Không có danh mục nào</div>
    }
    return catesByType.map(cate => (
      <div key={cate.id} className='flex justify-between items-center group h-[32px]'>
        <div className='flex gap-2 items-center'>
          <BsXDiamondFill className='text-gray-600 group-hover:text-primary-300' />
          <span className='text-gray-600 group-hover:text-primary-300'>{cate.name}</span>
        </div>
        <div className='gap-2 hidden group-hover:flex'>
          <Button color='primary.3' onClick={() => setSelectedCate(cate)} size="xs">Sửa</Button>
          <Button color='red.5' size="xs" onClick={() => deleteCategory(cate)}>Xóa</Button>
        </div>
      </div>
    ))
  }


  return (
    <div className='max-w-screen-lg mx-auto w-full'>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Danh mục, phân loại</Title>
          <Button
            color='secondary.3'
            rightSection={<TbCategoryPlus size={18} />}
            onClick={() => setOpenCreateModal(true)}>
            Danh mục mới
          </Button>
        </Flex>

        {(isLoading || isFetching) ? (<div className='flex justify-center items-center h-[90vh]'><Loader color="primary" size="xl" /></div>) : (
          <Accordion
            variant="filled"
            multiple
            styles={{
              label: {
                fontSize: 16,
                fontWeight: 600,
              },
            }}
            defaultValue={[CATEGORY_TYPE.SERVICE.toString(), CATEGORY_TYPE.SUPPLIES.toString()]}>
            <Accordion.Item value={CATEGORY_TYPE.SERVICE.toString()}>
              <Paper bg='white' radius='md'>
                <Accordion.Control>Loại dịch vụ</Accordion.Control>
                <Accordion.Panel>
                  <Flex direction="column" gap="md">
                    {renderCateByType(CATEGORY_TYPE.SERVICE)}
                  </Flex>
                </Accordion.Panel>

              </Paper>
            </Accordion.Item>

            <Accordion.Item value={CATEGORY_TYPE.SUPPLIES.toString()}>
              <Paper bg='white' radius='md' mt={12}>
                <Accordion.Control>Loại vật tư</Accordion.Control>
                <Accordion.Panel>
                  <Flex direction="column" gap="md">
                    {renderCateByType(CATEGORY_TYPE.SUPPLIES)}
                  </Flex>
                </Accordion.Panel>

              </Paper>
            </Accordion.Item>
          </Accordion>
        )}

      </Flex>

      <ModalNewCategory
        isOpen={isOpenCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => refetch()}
      />

      {selectedCate && (
        <ModalUpdateCategory
          isOpen={!!selectedCate}
          onClose={() => setSelectedCate(undefined)}
          onSuccess={() => refetch()}
          category={selectedCate}
        />
      )}
    </div>
  );
};

export default ClinicCategoryPage;

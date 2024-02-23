import { Text, Center, Stack, Grid, GridCol, Flex, Button, Card, Image, Group, Anchor, Box, Divider, Badge, MantineProvider, Input, Pagination, TypographyStylesProvider, Modal, ThemeIcon } from '@mantine/core';
import { Select, Switch, TextInput } from "react-hook-form-mantine";
import { firebaseStorage } from '@/config';
import { useQuery } from 'react-query';
import { newsApi } from '@/services';
import * as yup from 'yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import { INews } from '@/types';
import { MdOutlineNavigateNext } from "react-icons/md";
import { CiSearch } from 'react-icons/ci';
import { useDebouncedState, useDisclosure, usePagination } from '@mantine/hooks';
import { FaRegCalendar } from "react-icons/fa6";
import dayjs from 'dayjs';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { watch } from 'fs';
import { Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { notifications } from '@mantine/notifications';
import { useNavigate } from "react-router-dom";
import { ref } from "firebase/storage";
import { v4 } from 'uuid';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { TbNewsOff } from 'react-icons/tb';

type ImageUploadType = File | null;

interface IUpdateData {
  title: string,
  content?: string,
  logo?: string
  isShow?: any,
}

const schema = yup.object().shape({
  title: yup.string().required('Bạn chưa nhập tiêu đề'),
  content: yup.string(),
});

const NewsManagementPage = () => {
  const pageSize = 5;
  const currentClinic = useAppSelector(currentClinicSelector)
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [activePage, setPage] = useState(1);
  const [searchValue, setSearchValue] = useDebouncedState('', 500);
  const { data: news, isFetching, refetch } = useQuery(
    ['news', activePage, searchValue, currentClinic?.id],
    () => getNews(),
    {
      enabled: !!currentClinic?.id,
    }
  );
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);

  const [imageUpload, setImageUpload] = useState<ImageUploadType>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [opened, { open, close }] = useDisclosure(false);
  const [total, setTotal] = useState(0);

  // useEffect(() => {
  //   const updateTotal = async () => {
  //     const result = await getTotal();
  //     setTotal(result);
  //   };
  //   updateTotal();
  // }, []);

  useEffect(() => {
    setImageUrl(imageUpload ? URL.createObjectURL(imageUpload) : null);
  }, [imageUpload]);

  const { control, setValue, getValues, watch, handleSubmit } = useForm<IUpdateData>({
    resolver: yupResolver(schema),
    defaultValues: useMemo(() => {
      return {
        title: selectedNews?.title || '',
        content: selectedNews?.content || '',
      }
    }, []),
  });



  useEffect(() => {
    resetForm()
  }, [selectedNews]);

  const getNews = async () => {
    try {
      const response = await newsApi.getNews({
        title: searchValue,
        pageSize: pageSize,
        pageIndex: activePage - 1,
        clinicId: currentClinic?.id,
      });
      const total = Math.ceil((response.data?.total ?? 0) / pageSize);
      setTotal(total);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedNews(null)
  }, [currentClinic?.id])



  const onSubmit = async (data: IUpdateData) => {
    console.log('data', data)
    const logoUrl = await uploadFile();
    const updateInfo: IUpdateData = {
      title: data.title,
      content: data.content,
      isShow: data.isShow === 'true' ? true : false,
    }
    if (imageUrl !== null) {
      updateInfo.logo = logoUrl;
    }
    if (selectedNews?.id) {
      const res = await newsApi.updateNewsInfo(String(selectedNews?.id), updateInfo)

      if (res.status) {
        notifications.show({
          title: 'Thông báo',
          message: 'Cập nhật thông tin tin tức thành công',
          color: 'green',
        });
      }
      refetch();
      setSelectedNews(res.data ?? null);
      setImageUrl(res.data?.logo ?? null);
    }
    setIsUpdate(false);

    resetForm();
  }

  const deleteNews = async (newsId: number) => {
    const res = await newsApi.deleteNews(String(newsId))

    if (res.status) {
      notifications.show({
        title: 'Thông báo',
        message: 'Xóa tin tức thành công',
        color: 'green',
      });
    }
    refetch();
    setSelectedNews(null);

  }

  const handleSelectedNews = (newsItem: INews) => {
    setSelectedNews(newsItem);
  }


  const handleCancelChange = () => {
    setIsUpdate(false);
    resetForm();
  }
  const handleUpdate = () => {
    setIsUpdate(true);

    // setValue('lat', currentClinic?.lat);
    // setValue('long', currentClinic?.long);
  }

  const resetForm = () => {
    setValue('title', selectedNews?.title || '');
    setValue('logo', selectedNews?.logo);
    setValue('content', selectedNews?.content || '');
    setValue('isShow', selectedNews?.isShow ? 'true' : 'false');
    editor?.commands.setContent(selectedNews?.content || '')
    setImageUpload(null)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: watch('content'),
    onUpdate({ editor }) {
      setValue('content', editor.getHTML());
      // setEditorContent(editor.getHTML());
    },
    editable: true,

  });

  const uploadFile = async () => {
    if (imageUpload == null) return '';
    const imageRef = ref(firebaseStorage, `news-logo/${selectedNews?.id}/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload)

    const url = await getDownloadURL(snapshot.ref);
    // setValue('logo', url);
    return url;
  };

  return (
    <div className='max-w-screen-xl mx-auto px-5'>
      <Group align='center' justify='space-between' my={10}>
        <Text fw={700}>Tin tức - Thông báo</Text>
        <Flex gap={20}>
          <Input
            // size='md'
            leftSection={<CiSearch size={26} />}
            placeholder='Tìm kiếm tin tức'
            w={300}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
          />
          <Button color='secondary.3'>Thêm tin mới</Button>
        </Flex>
      </Group>
      <Stack>
        <Grid pb={30} grow gutter="xl">
          <GridCol span={5}>
            <Stack className='min-h-[calc(100vh_-_200px)]'>
              {news &&
                news.map((newsItem) => (
                  <Stack className='rounded-xl p-3 border border-solid border-primary-100 bg-white' key={newsItem.id}>
                    <Group align='flex-start'>
                      <Box w={150} h={100}>
                        <Image src={newsItem.logo} fallbackSrc={NewsLogoDefault} height={100} radius={'md'} />
                      </Box>
                      <Stack gap={5}>
                        <Anchor
                          fz="md"
                          fw={700}
                          maw={250}
                          c={'teal.7'}
                          onClick={() => handleSelectedNews(newsItem)}
                        >
                          {newsItem.title}
                        </Anchor>
                        <Group>
                          <FaRegCalendar color={'gray'} />
                          <Text c={'gray.5'}><b>{dayjs(newsItem.createdAt).format('DD/MM/YYYY')}</b></Text>
                        </Group>
                      </Stack>
                    </Group>
                  </Stack>
                ))}
            </Stack>
            <Group align='center' justify='center' className='rounded-md py-2 '>
              {news && news?.length > 0
                ? <Pagination total={total} value={activePage} onChange={setPage} mt="sm" />
                : <div className='flex flex-col items-center min-h-[calc(100vh_-_150px)] bg-white w-full justify-center'>
                  <ThemeIcon color='gray.5' size={110} variant='white'>
                    <TbNewsOff size={100} />
                  </ThemeIcon>
                  <Text c='gray.5'>Phòng khám này chưa có tin tức</Text>
                </div>
              }
            </Group>
          </GridCol>
          <Grid.Col span={7}>
            {selectedNews && selectedNews.id ? (
              <Card withBorder radius="lg" w={'100%'} h={'100%'} bg={'white'}>
                <Form control={control} onSubmit={e => onSubmit(e.data)} onError={e => console.log(e)}>
                  <div className='flex justify-between gap-8'>
                    <div className='flex flex-col flex-1'>
                      <TextInput
                        size='md'
                        label={<Text c='primary.3'>Tiêu đề bài viết</Text>}
                        w={'100%'}
                        readOnly={!isUpdate}
                        name='title'
                        control={control}
                      />

                      <Switch
                        label='Cho phép hiển thị'
                        name='isShow'
                        size='md'
                        mt={10}
                        control={control}
                        defaultValue={selectedNews?.isShow}
                        disabled={!isUpdate}
                      />

                      {/* <div className='flex-1' /> */}

                      <Group mt={20}>
                        {isUpdate ?
                          <>
                            <Button type="submit" onClick={handleSubmit(onSubmit)}>Lưu thay đổi</Button>
                            <Button variant="outline" onClick={handleCancelChange} color='gray.6'>Hủy thay đổi</Button>
                          </>
                          :
                          <Group>
                            <Button onClick={handleUpdate}>Chỉnh sửa</Button>
                            <Button variant="outline" onClick={open} color='red.6'>Xóa</Button>
                          </Group>

                        }
                      </Group>


                    </div>
                    <div className='flex flex-col'>
                      <div className='flex justify-between items-center'>
                        <Text c='primary.3'>Thumbnail</Text>
                        <Divider color='primary.1' size={2} ml={10} className='flex-1' />
                      </div>

                      {isUpdate ?
                        (
                          <>
                            <label htmlFor="upload-image" className="relative group">
                              <Image
                                w={250}
                                h={200}
                                radius={'md'}
                                className="cursor-pointer group-hover:opacity-90 rounded-md"
                                src={imageUrl || selectedNews?.logo}
                                fallbackSrc={NewsLogoDefault}
                              />
                              <div className="absolute opacity-90 cursor-pointer top-[50%] left-[19%] text-white bg-gray-500 px-2 py-1.5 rounded-md mx-auto hidden group-hover:block">
                                Chỉnh sửa thumbnail
                              </div>
                            </label>
                            <input
                              type="file"
                              id="upload-image"
                              className="hidden"
                              onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
                            />
                          </>
                        ) : (
                          <Box w={250} h={200}>
                            <Image src={imageUrl || selectedNews?.logo} fallbackSrc={NewsLogoDefault} height={200} radius={'md'} />
                          </Box>
                        )
                      }
                    </div>
                  </div>

                  <div className='flex justify-between items-center mt-5'>
                    <Text c='primary.3'>Nội dung bài viết</Text>
                    <Divider color='primary.1' size={2} ml={10} className='flex-1' />
                  </div>
                  {isUpdate ? (
                    <Center>
                      <RichTextEditor editor={editor} w='100%' maw={650} style={{ transform: "translateX(11px)" }}>
                        <RichTextEditor.Toolbar sticky stickyOffset={60}>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                          </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                        <RichTextEditor.Content style={{ minHeight: '8em' }} />
                      </RichTextEditor>
                    </Center>
                  ) : (
                    <TypographyStylesProvider>
                      <div className="p-5 w-full rounded-md" dangerouslySetInnerHTML={{ __html: selectedNews?.content || '' }}></div>
                    </TypographyStylesProvider>
                  )}



                </Form>
                <Modal opened={opened} onClose={close} title={<Text fw={700} size='20px'>Xác nhận xóa</Text>} centered>
                  <Text pb={15}>Bạn có muốn xóa '{selectedNews?.title}'</Text>
                  <Group justify='flex-end'>
                    <Button color='red.7' onClick={() => deleteNews(selectedNews.id)}>Xác nhận</Button>
                    <Button variant="outline" onClick={close} color='gray.6'>Hủy</Button>
                  </Group>

                </Modal>
              </Card>
            ) : (
              <Card withBorder radius="lg" w={'100%'} h={'100%'} bg={'white'}>
                <Center className='flex-1'>
                  <Text c='gray.5'>Chọn tin tức để xem và chỉnh sửa nội dung</Text>
                </Center>
              </Card>
            )}

          </Grid.Col>
        </Grid>
      </Stack>

    </div>
  );
};

export default NewsManagementPage;

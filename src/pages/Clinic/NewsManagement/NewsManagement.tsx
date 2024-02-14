import { Text, Center, Stack, Grid, GridCol, Button, Card, Image, Group, Anchor, Box, Divider, Badge, MantineProvider, Input, Pagination, TypographyStylesProvider } from '@mantine/core';
import { Select, TextInput } from "react-hook-form-mantine";
import { firebaseStorage } from '@/config';
import { useQuery } from 'react-query';
import { newsApi } from '@/services';
import * as yup from 'yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import { INews } from '@/types';
import { MdOutlineNavigateNext } from "react-icons/md";
import { CiSearch } from 'react-icons/ci';
import { useDebouncedState, usePagination } from '@mantine/hooks';
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
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [activePage, setPage] = useState(1);
    const [searchValue, setSearchValue] = useDebouncedState('', 500);
    const { data: news, isFetching, refetch } = useQuery(['news', activePage, searchValue], () =>
        getNews()
    );
    const [selectedNews, setSelectedNews] = useState<INews | null>(news && news.length > 0 ? news[0] : null);

    const [imageUpload, setImageUpload] = useState<ImageUploadType>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);



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
            });
            return response.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

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
        <div className='max-w-screen-xl mx-auto'>
            <Stack align='center'>
                <Text fw={700} size='30px' m={20} c={'teal.7'}>Tin tức - Thông báo</Text>
                <Input
                    name=''
                    w={660}
                    size='lg'
                    radius={'md'}
                    leftSection={<CiSearch size={26} />}
                    placeholder='Tìm kiếm tin tức'
                    onChange={(event) => setSearchValue(event.currentTarget.value)}
                />
            </Stack>
            <Stack>
                <Grid pt={30} pb={30} grow gutter="xl">
                    <GridCol span={5}>
                        <Stack>
                            {news &&
                                news.map((newsItem) => (
                                    <Stack className='rounded-md p-3 border border-solid border-primary-100 bg-white'>
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
                        {news && news?.length > 0 &&
                            <Group align='center' justify='center' bg='white' className='rounded-md py-2'>
                                <Pagination total={news.length - 1} value={activePage} onChange={setPage} mt="sm" />
                            </Group>}
                    </GridCol>
                    <Grid.Col span={7}>
                        <Card withBorder radius="md" w={'100%'} h={'100%'} bg={'white'}>
                            <Form control={control} onSubmit={e => onSubmit(e.data)} onError={e => console.log(e)}>
                                <Group mb={30} align='flex-start'>
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
                                                        Chỉnh sửa logo
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

                                    <Stack w={'100%'} maw={385}>
                                    <TextInput
                                        w={'100%'}
                                        maw={450}
                                        // size='md'
                                        label={<Text fw={700} size='20px'>Tiêu đề</Text>}
                                        readOnly={!isUpdate}
                                        name='title'
                                        control={control}
                                    />
                                    {isUpdate ?(
                                        <Group>
                                            <Text fw={700}>Trạng thái: </Text>
                                        <Select
                                        maw={150}
                                        name='isShow'
                                        control={control}
                                        defaultValue={selectedNews?.isShow ? 'true' : 'false'}
                                        data={[
                                            { value: 'true', label: 'Công khai' },
                                            { value: 'false', label: 'Tạm ẩn' },
                                          ]}
                                        />
                                        </Group>
                                    ) : (
                                        <Group>
                                            <Text fw={700}>Trạng thái: </Text>
                                            {selectedNews?.isShow ? 
                                            (<Text c={'green.7'}>Công khai</Text>)
                                            :
                                            (<Text c={'red.7'}>Tạm ẩn</Text>)}
                                        </Group>
                                        
                                    )}
                                    </Stack>

                                    
                                </Group>
                                <Divider pb={10} />
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


                                <Group justify="flex-end" align='flex-end' mt="lg">
                                    {isUpdate ?
                                        <>
                                            <Button type="submit" onClick={handleSubmit(onSubmit)}>Lưu thay đổi</Button>
                                            <Button variant="outline" onClick={handleCancelChange} color='gray.6'>Hủy thay đổi</Button>
                                        </>
                                        : <Button onClick={handleUpdate}>Chỉnh sửa</Button>
                                    }
                                </Group>
                            </Form>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Stack>
        </div>
    );
};

export default NewsManagementPage;

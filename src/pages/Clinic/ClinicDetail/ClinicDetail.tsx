import { Title, Button, Flex, Text, Box, Center, Stack, Divider, Grid, TextInput, NumberInput, Group, Image } from "@mantine/core"
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { useAppSelector } from '@/hooks';
import { listClinicSelector, currentClinicSelector } from '@/store'
import { useQuery } from 'react-query';
import { clinicApi, planApi } from '@/services';
import { IServicePlan } from "@/types";
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { notifications } from "@mantine/notifications";
import { firebaseStorage } from '@/config';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
  } from "firebase/storage";
import { v4 } from "uuid";



export default function ClinicDetail() {
    const { data: plans, isLoading: isLoadingPlan } = useQuery('plans', () => getAllPlans());

    const [plan, setPlan] = useState<IServicePlan>();

    const [editorContent, setEditorContent] = useState("");

    /* Xử lý đẩy ảnh lên firebase
    const [imageUpload, setImageUpload] = useState("");

     */

    //const [imageUrl, setImageUrl] = useState("");

    const currentClinic = useAppSelector(currentClinicSelector);
    console.log('phong kham hien tai: ', currentClinic)

    const getAllPlans = async () => {
        try {
          const response = await planApi.getAllPlans();
          return response.data;
        } catch (error) {
          console.log(error);
        }
      }

    const getPlanInfo = (planId: number) => {
        return plans?.find((plan) => plan.id == planId);
    }

    const subscription = currentClinic?.subscriptions?.[0];        

    const form = useForm({
        initialValues: {
          name: '',
          specialty: '',
          email: '',
          address: '',
          phone: '',
        },
    
        validate: {
          name: hasLength({ min: 2, max: 10 }, 'Name must be 2-10 characters long'),
          specialty: isNotEmpty('Chuyên môn không được để trống'),
          email: isEmail('Email không hợp lệ'),
          address: isNotEmpty('Địa chỉ không được để trống'),
          phone: isNotEmpty('Nhập số điện thoại của bạn'),
        },
      });
      
      useEffect(() => {
        if (subscription && subscription.planId) {
            const fetchedPlan = getPlanInfo(subscription.planId);
            setPlan(fetchedPlan);
          }
      },[subscription])
      const onSubmit = async () => {
        const updateInfor = {
            name: form.values.name,
            email: form.values.email,
            phone: form.values.phone,
            address: form.values.address,
            logo: '',
            description: editorContent
        }
        console.log('update infor: ', updateInfor);
        if (currentClinic?.id)
            await clinicApi.updateClinicInfor(currentClinic?.id, updateInfor)
                .then((res) => {
                    if (res.status)
                        notifications.show({
                            title: 'Thành công',
                            message: 'Cập nhật thông tin thành công',
                            color: 'green',
                        });
                })
      }

      const content = currentClinic?.description;

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
            content,
            onUpdate({ editor }) {
                setEditorContent(editor.getHTML());
            },
        });

        /* 
        Xử lý đẩy ảnh lên firebase
        const imagesListRef = ref(firebaseStorage, `avatars/${currentClinic?.id}`);
        const uploadFile = () => {
            if (imageUpload == null) return;
            const imageRef = ref(firebaseStorage, `avatars/${currentClinic?.id}/${imageUpload + v4()}`);
            uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrl(url);
            });
            });
        }; */
      
    return (
        <Center>
            <Stack>
                <Flex w='941px' h='160px' px='30px' align="center" justify={'space-between'} bg='#081692' style={{borderRadius: '10px'}} mt='30px' c='white'>
                    <Stack>
                        <Title order={5}>BẠN ĐANG SỬ SỬ DỤNG GÓI {plan && (plan?.planName)}</Title>
                        <Flex>
                            Thời gian sử dụng đến {dayjs(subscription?.expiredAt).format('DD/MM/YYYY')}
                        </Flex>
                        <Flex>
                            Còn lại {dayjs(subscription?.expiredAt).diff(dayjs(), 'day')} ngày
                        </Flex>
                    </Stack>
                    <Stack justify='right'>
                        <Button variant="filled" bg='#68B056'>Nâng cấp gói</Button>
                        <Text>Xem lịch sử đăng ký gói</Text>
                    </Stack>
                </Flex>
                <Box w='941px' h='636px' px='30px' bg='white' py='20px' style={{borderRadius: '10px'}}>
                    <Flex justify={"space-between"}>
                        <Title order={5}>THÔNG TIN CƠ SỞ Y TẾ</Title>
                        <Text c='#6B6B6B'>ID:{currentClinic?.id}</Text>
                    </Flex>
                    <Divider my="md" />
                    <Grid>
                        <Grid.Col span={3.5}>
                        {
                            currentClinic?.logo && currentClinic.logo.startsWith('https') ? (
                                <Image
                                w='189px'
                                h='186px'
                                src={currentClinic.logo}
                                />
                            ) : (
                                <Image
                                w='189px'
                                h='186px'
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                                />
                            )
                        }
                        </Grid.Col>
                        <Grid.Col span={8.5}>
                            <Box component="form" maw={700} mx="auto" onSubmit={form.onSubmit(onSubmit)}>
                                <TextInput label="Tên phòng khám" placeholder="Tên phòng khám" withAsterisk {...form.getInputProps('name')} />
                                <Grid>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Chuyên môn"
                                            placeholder=""
                                            withAsterisk
                                            mt="md"
                                            {...form.getInputProps('specialty')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Số điện thoại"
                                            placeholder=""
                                            withAsterisk
                                            mt="md"
                                            {...form.getInputProps('phone')}
                                        />                                        
                                    </Grid.Col>
                                </Grid>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Email liên hệ"
                                            placeholder=""                                            
                                            withAsterisk
                                            mt="md"
                                            {...form.getInputProps('email')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="Địa chỉ"
                                            placeholder=""
                                            withAsterisk
                                            mt="md"
                                            {...form.getInputProps('address')}
                                        />
                                    </Grid.Col>
                                    
                                    <Text ml='8px' mt='10px' fw={700} mb='7px'>Mô tả</Text>
                                    <RichTextEditor editor={editor} style={{transform: "translateX(11px)"}}>
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
                                        <RichTextEditor.Content/>
                                    </RichTextEditor>
                                </Grid>
                                <Group justify="flex-end" mt="md">
                                    <Button type="submit">Submit</Button>
                                </Group>
                                
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Stack>
        </Center>        
    )
}
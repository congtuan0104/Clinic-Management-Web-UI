import { Title, Button, Flex, Text, Box, Center, Stack, Divider, Grid, NumberInput, Group, Image } from "@mantine/core"
import { RichTextEditor, Link } from '@mantine/tiptap';
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, useForm } from "react-hook-form";
import { TextInput } from "react-hook-form-mantine";
import * as yup from 'yup';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store'
import { useQuery } from 'react-query';
import { clinicApi, planApi } from '@/services';
import { IServicePlan } from "@/types";
import { useState, useEffect, useMemo } from 'react';
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
import { useNavigate, useNavigation } from "react-router-dom";

type ImageUploadType = File | null;

interface IUpdateData {
  name: string,
  specialty: string,
  email: string,
  address: string,
  phone: string,
  logo?: string,
}

const schema = yup.object().shape({
  name: yup.string().required('Bạn chưa nhập tên phòng khám'),
  specialty: yup.string().required('Chuyên môn không được để trống'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  address: yup.string().required('Thông tin địa chỉ phòng khám là bắt buộc'),
  phone: yup.string().required('Thông tin số điện thoại là bắt buộc'),
  logo: yup.string(),
});


export default function ClinicDetail() {
  const currentClinic = useAppSelector(currentClinicSelector);
  const [editorContent, setEditorContent] = useState("");

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  //Xử lý đẩy ảnh lên firebase
  const [imageUpload, setImageUpload] = useState<ImageUploadType>(null);

  const navigate = useNavigate();

  const subscription = currentClinic?.subscriptions?.[0];

  const { control, setValue, getValues, reset } = useForm<IUpdateData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: useMemo(() => {
      return {
        name: currentClinic?.name || '',
        specialty: '',
        email: currentClinic?.email || '',
        address: currentClinic?.address || '',
        phone: currentClinic?.phone || '',
        logo: currentClinic?.logo || '',
      }
    }
      , [currentClinic]),
  });

  useEffect(() => {
    setIsUpdate(false);
    reset({
      name: currentClinic?.name || '',
      specialty: '',
      email: currentClinic?.email || '',
      address: currentClinic?.address || '',
      phone: currentClinic?.phone || '',
      logo: currentClinic?.logo || '',
    })
  }, [currentClinic])

  const onSubmit = async (data: IUpdateData) => {
    setIsUpdate(false);
    await uploadFile();
    const updateInfo = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      logo: getValues('logo'),
      description: editorContent
    }
    if (currentClinic?.id) {
      const res = await clinicApi.updateClinicInfo(currentClinic?.id, updateInfo)

      if (res.status)
        notifications.show({
          title: 'Thông báo',
          message: 'Cập nhật thông tin phòng khám thành công',
          color: 'green',
        });

    }

    navigate(0) // reload page
  }

  const content: string = `${currentClinic?.description}`;

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
    content: `${content}`,
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.commands.setContent(content)
  }, [editor])


  //Xử lý đẩy ảnh lên firebase
  const uploadFile = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(firebaseStorage, `clinic-logo/${currentClinic?.id}/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload)

    const url = await getDownloadURL(snapshot.ref);
    setValue('logo', url);
  };

  return (
    <Center>
      <Stack>
        {subscription && <Flex w='941px' h='160px' px='30px' align="center" justify={'space-between'} bg='#081692' style={{ borderRadius: '10px' }} mt='30px' c='white'>
          <Stack>
            <Title order={5}>BẠN ĐANG SỬ SỬ DỤNG GÓI {subscription.plans?.planName}</Title>
            <Flex>
              Thời gian sử dụng đến &nbsp; <b>{dayjs(subscription?.expiredAt).format('DD/MM/YYYY')}</b>
            </Flex>
            <Flex>
              Còn lại &nbsp; <b>{dayjs(subscription?.expiredAt).diff(dayjs(), 'day')}</b> &nbsp; ngày
            </Flex>
          </Stack>
          <Stack justify='right'>
            <Button variant="filled" bg='#68B056'>Nâng cấp gói</Button>
            <Text>Xem lịch sử đăng ký gói</Text>
          </Stack>
        </Flex>}
        <Box w='941px' h='636px' px='30px' bg='white' py='20px' style={{ borderRadius: '10px' }}>
          <Flex justify={"space-between"}>
            <Title order={5}>THÔNG TIN CƠ SỞ Y TẾ</Title>
            <Text c='#6B6B6B'>ID:{currentClinic?.id}</Text>
          </Flex>
          <Divider my="md" />
          <Grid>
            <Grid.Col span={3.5}>
              {isUpdate ?
                (
                  <>
                    <label htmlFor="upload-image" className="relative w-fit group">
                      <Image
                        w='189px'
                        h='186px'
                        radius='md'
                        className="cursor-pointer group-hover:opacity-90 transition-all"
                        src={imageUpload ? URL.createObjectURL(imageUpload) : currentClinic?.logo || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"}
                      />
                      <div className="absolute top-[50%] left-[50px] bg-gray-600 p-2 rounded-md text-white text-14 font-bold mx-auto hidden group-hover:block cursor-pointer">
                        Thay đổi logo
                      </div>
                    </label>
                    <input
                      type="file"
                      id="upload-image"
                      className="hidden"
                      onChange={(event) => {
                        setImageUpload(event.target.files?.[0] || null);
                      }}
                    />
                  </>
                ) :
                (currentClinic?.logo && currentClinic.logo.startsWith('https') ? (
                  <Image
                    w='189px'
                    h='186px'
                    radius='md'
                    src={currentClinic.logo}
                  />
                ) : (
                  <Image
                    w='189px'
                    h='186px'
                    radius='md'
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                  />
                ))
              }
            </Grid.Col>
            <Grid.Col span={8.5}>
              <Box maw={700} mx="auto" >
                <Form control={control} onSubmit={e => onSubmit(e.data)} onError={e => console.log(e)}>
                  <TextInput label="Tên phòng khám"
                    //  placeholder={currentClinic?.name}
                    name='name'
                    control={control} />
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Chuyên môn"
                        placeholder=""
                        control={control}
                        mt="md"
                        name='specialty'
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Số điện thoại"
                        placeholder={currentClinic?.phone}
                        control={control}
                        mt="md"
                        name='phone'
                      />
                    </Grid.Col>
                  </Grid>
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Email liên hệ"
                        placeholder={currentClinic?.email}
                        control={control}
                        mt="md"
                        name='email'
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Địa chỉ"
                        placeholder={currentClinic?.address}
                        control={control}
                        mt="md"
                        name='address'
                      />
                    </Grid.Col>
                    <Text ml='8px' mt='10px' fw={700} mb='7px'>Mô tả</Text>
                    <RichTextEditor editor={editor} style={{ transform: "translateX(11px)" }}>
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
                      <RichTextEditor.Content />
                    </RichTextEditor>
                  </Grid>
                  <Group justify="flex-end" mt="lg">
                    {
                      isUpdate ? (
                        <Button type="submit">Lưu thay đổi</Button>
                      ) : (
                        <Button onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsUpdate(true)
                        }}>Cập nhật thông tin</Button>
                      )
                    }
                  </Group>
                </Form>

              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </Center>
  )
}
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
import { useState, useEffect, useRef } from 'react';
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
import { useNavigate } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import classNames from "classnames";

type ImageUploadType = File | null;

interface IUpdateData {
  name: string,
  specialty?: string,
  email: string,
  address: string,
  phone: string,
  logo?: string,
}

const schema = yup.object().shape({
  name: yup.string().required('Bạn chưa nhập tên phòng khám'),
  specialty: yup.string(),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  address: yup.string().required('Thông tin địa chỉ phòng khám là bắt buộc'),
  phone: yup.string().required('Thông tin số điện thoại là bắt buộc'),
  logo: yup.string(),
});


export default function ClinicDetail() {

  const [editorContent, setEditorContent] = useState("");

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const imageRef2 = useRef<HTMLImageElement>(null);

  const imageRef3 = useRef<HTMLImageElement>(null);

  //Xử lý đẩy ảnh lên firebase
  const [imageUpload, setImageUpload] = useState<ImageUploadType>(null);

  const navigate = useNavigate();

  const currentClinic = useAppSelector(currentClinicSelector);

  const subscription = currentClinic?.subscriptions?.[0];

  console.log('thong tin phong kham: ', currentClinic);
  const { control, setValue, getValues } = useForm<IUpdateData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      name: currentClinic?.name,
      specialty: '',
      email: currentClinic?.email,
      address: currentClinic?.address,
      phone: currentClinic?.phone,
      logo: currentClinic?.logo,
    },
  });

  const onSubmit = async (data: IUpdateData) => {
    setIsUpdate(false);
    const updateInfo = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      logo: getValues('logo'),
      description: editorContent
    }
    if (currentClinic?.id) {
      const res = await clinicApi.updateClinicInfor(currentClinic?.id, updateInfo)

      if (res.status) {
        const logo = getValues('logo') || '';
        if (imageRef2.current) {
          console.log('logo: ', logo);
          imageRef2.current.src = logo;
        }
        if (imageRef3.current) {
          console.log('logo: ', logo);
          imageRef3.current.src = logo;
        }
        notifications.show({
          title: 'Thành công',
          message: 'Cập nhật thông tin thành công',
          color: 'green',
        });
      }
    }

    navigate('/clinic/thong-tin-phong-kham')
  }

  useEffect(() => {

  },[]);

  const previewImage = async (event:React.ChangeEvent<HTMLInputElement>) =>{
    setImageUpload(event.target.files?.[0] || null);
    console.log('setimage upload: ', imageUpload);
    await uploadFile();
    console.log('uploading thành công');
    const logo = getValues('logo') || ''; // Using an empty string as default if getValues returns undefined
    if (imageRef.current) {
      console.log('logo: ', logo);
      imageRef.current.src = logo;
    }
  }

  const onInputClick = ( event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement
    element.value = ''
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
    editable: false
  });

  const handleSetValue = () => {
    if (currentClinic?.name && currentClinic?.email && currentClinic?.phone && currentClinic?.address)
      {
        setValue('name', currentClinic?.name);
        setValue('email', currentClinic?.email);
        setValue('phone', currentClinic?.phone);
        setValue('address', currentClinic?.address);
      }
      if (currentClinic?.description)
        editor?.commands.setContent(currentClinic?.description)
      else
        editor?.commands.setContent('')
  }

  useEffect(() => {
    handleSetValue();
  }, [currentClinic]);

  const uploadFile = (): Promise<void> => {
    return new Promise( async (resolve, reject) => {
      if (imageUpload == null) return;
      const imageRef = ref(firebaseStorage, `clinic-logo/${currentClinic?.id}/${imageUpload.name + v4()}`);
      const snapshot = await uploadBytes(imageRef, imageUpload)

      const url = await getDownloadURL(snapshot.ref);
      
      console.log('đang upload file')
      setTimeout(() => {
        console.log('File uploaded'); // Simulated upload completion message
        setValue('logo', url);
        resolve(); // Resolve the promise after the upload is completed
      }, 1000); // Simulated 1 seconds delay for the upload
    });
  };

  return (
    <Center>
      <Stack>
        <Flex w='941px' h='160px' px='30px' align="center" justify={'space-between'} bg='#081692' style={{ borderRadius: '10px' }} mt='30px' c='white'>
          <Stack>
            <Title order={5}>BẠN ĐANG SỬ SỬ DỤNG GÓI {subscription && (subscription?.plans.planName)}</Title>
            <Flex>
              Thời gian sử dụng đến &nbsp; <b>{dayjs(subscription?.expiredAt).format('DD/MM/YYYY')}</b>
            </Flex>
            <Flex>
              Còn lại &nbsp; <b>{dayjs(subscription?.expiredAt).diff(dayjs(), 'day')}</b> &nbsp; ngày
            </Flex>
          </Stack>
          <Stack justify='right'>
            
            <Text>Xem lịch sử đăng ký gói</Text>
          </Stack>
        </Flex>
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
                    <label htmlFor="upload-image" className="relative">
                      <Image
                        w='189px'
                        h='186px'
                        className="cursor-pointer hover:opacity-90 rounded-md"
                        src="https://firebasestorage.googleapis.com/v0/b/clinus-1d1d1.appspot.com/o/public%2Fupload-file-icon.png?alt=media&token=4863e0f5-3164-47f9-83ed-ec55f0562e9c"
                        ref={imageRef}
                      />
                      <div className="absolute top-[110%] left-[19%] text-black mx-auto">
                        Chỉnh sửa logo
                      </div>
                    </label>
                    <input
                      type="file"
                      id="upload-image"
                      className="hidden"
                      onChange={previewImage}
                      /* onClick={onInputClick} */
                    />
                  </>
                ) :
                (currentClinic?.logo && currentClinic.logo.startsWith('https') ? (
                  <Image
                    w='189px'
                    h='186px'
                    src={currentClinic.logo}
                    ref={imageRef2}
                  />
                ) : (
                  <Image
                    w='189px'
                    h='186px'
                    src="https://firebasestorage.googleapis.com/v0/b/clinus-1d1d1.appspot.com/o/avatars%2Fe6c13d64-83bb-43cd-a2a5-5867168fb4fe%2Flogo-2.png60385af5-5855-412e-81f1-73f5a53fe068?alt=media&token=4b2291e8-9db5-4d35-8e90-f6fc4973bf90"
                    ref={imageRef3}
                  />
                ))
              }
            </Grid.Col>
            <Grid.Col span={8.5}>
              <Box maw={700} mx="auto" >
                <Form control={control} onSubmit={e => onSubmit(e.data)} onError={e => console.log(e)}>
                  <TextInput label="Tên phòng khám"
                    disabled={!isUpdate}
                    name='name'
                    control={control} />
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Chuyên môn"
                        disabled={!isUpdate}
                        control={control}
                        mt="md"
                        name='specialty'
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Số điện thoại"
                        disabled={!isUpdate}
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
                        disabled={!isUpdate}
                        control={control}
                        mt="md"
                        name='email'
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Địa chỉ"
                        disabled={!isUpdate}
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
                        <></>
                      )
                    }
                  </Group>
                </Form>
                  {isUpdate ? (
                    <Button onClick={() => {setIsUpdate(false); handleSetValue(); editor?.setEditable(false);}} bg='red' style={{transform: 'translateY(-35px)'}}>Hủy thay đổi</Button>
                  ): (<Button onClick={() => {setIsUpdate(true); editor?.setEditable(true)}}>Cập nhật thông tin</Button>)}
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </Center>
  )
}
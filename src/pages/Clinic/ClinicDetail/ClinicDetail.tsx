import { Title, Button, Flex, Text, Box, Center, Stack, Divider, Grid, NumberInput, Group, Image, CopyButton, ActionIcon, Tooltip } from "@mantine/core"
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
import { useState, useEffect, useRef, useMemo } from 'react';
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
import ClinusLogo from '@/assets/images/logo-2.png';
import { FaCopy } from "react-icons/fa6";
import Map, { Marker, NavigationControl, FullscreenControl, AttributionControl } from 'react-map-gl';
import { IoLocation } from "react-icons/io5";

type ImageUploadType = File | null;

interface IUpdateData {
  name: string,
  email: string,
  address: string,
  phone: string,
  description?: string,
  logo?: string,
  lat?: number,
  long?: number,
}

const schema = yup.object().shape({
  name: yup.string().required('Bạn chưa nhập tên phòng khám'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  address: yup.string().required('Thông tin địa chỉ phòng khám là bắt buộc'),
  phone: yup.string().required('Thông tin số điện thoại là bắt buộc'),
  description: yup.string(),
  lat: yup.number(),
  long: yup.number(),
});


export default function ClinicDetail() {
  // const [editorContent, setEditorContent] = useState("");

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  //Xử lý đẩy ảnh lên firebase
  const [imageUpload, setImageUpload] = useState<ImageUploadType>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(imageUpload ? URL.createObjectURL(imageUpload) : null);
  }, [imageUpload]);

  const navigate = useNavigate();

  const currentClinic = useAppSelector(currentClinicSelector);

  const subscription = currentClinic?.subscriptions?.[0];

  const { control, setValue, getValues, watch, handleSubmit } = useForm<IUpdateData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: useMemo(() => {
      return {
        name: currentClinic?.name || '',
        email: currentClinic?.email || '',
        address: currentClinic?.address || '',
        phone: currentClinic?.phone || '',
        description: currentClinic?.description || '',
        lat: currentClinic?.lat,
        long: currentClinic?.long,
      }
    }, [currentClinic]),
  });

  const lat = watch('lat')
  const long = watch('long')

  const onSubmit = async (data: IUpdateData) => {
    console.log('data', data)
    const logoUrl = await uploadFile();
    const updateInfo: IUpdateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      lat: data.lat,
      long: data.long,
      description: data.description,
    }
    if (imageUrl !== null) {
      updateInfo.logo = logoUrl;
  }
    if (currentClinic?.id) {
      const res = await clinicApi.updateClinicInfo(currentClinic?.id, updateInfo)

      if (res.status) {
        notifications.show({
          title: 'Thông báo',
          message: 'Cập nhật thông tin phòng khám thành công',
          color: 'green',
        });
      }
    }
    setIsUpdate(false);
    navigate(0)
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
    content: watch('description'),
    onUpdate({ editor }) {
      setValue('description', editor.getHTML());
      // setEditorContent(editor.getHTML());
    },
    editable: true,

  });

  // const handleSetValue = () => {
  //   if (currentClinic?.name && currentClinic?.email && currentClinic?.phone && currentClinic?.address) {
  //     setValue('name', currentClinic?.name);
  //     setValue('email', currentClinic?.email);
  //     setValue('phone', currentClinic?.phone);
  //     setValue('address', currentClinic?.address);
  //     setValue('logo', currentClinic?.logo);
  //     setValue('lat', currentClinic?.lat);
  //     setValue('long', currentClinic?.long);
  //   }
  //   if (currentClinic?.description)
  //     editor?.commands.setContent(currentClinic?.description)
  //   else
  //     editor?.commands.setContent('')
  // }

  const resetForm = () => {
    setValue('name', currentClinic?.name || '');
    setValue('email', currentClinic?.email || '');
    setValue('phone', currentClinic?.phone || '');
    setValue('address', currentClinic?.address || '');
    setValue('logo', currentClinic?.logo);
    setValue('lat', currentClinic?.lat);
    setValue('long', currentClinic?.long);
    setValue('description', currentClinic?.description || '');
    editor?.commands.setContent(currentClinic?.description || '')
    setImageUpload(null)
  }

  useEffect(() => {
    resetForm();
  }, [currentClinic]);

  //Xử lý đẩy ảnh lên firebase
  const uploadFile = async () => {
    if (imageUpload == null) return '';
    const imageRef = ref(firebaseStorage, `clinic-logo/${currentClinic?.id}/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload)

    const url = await getDownloadURL(snapshot.ref);
    // setValue('logo', url);
    return url;
  };

  if (!currentClinic) return null;

  return (
    <Center>
      <Stack pb={20}>
        {subscription &&
          <Flex px='30px' py={25} align="center" justify={'space-between'} bg='primary.9' style={{ borderRadius: '10px' }} mt='30px' c='white'>
            <Stack>
              <Title order={5}>BẠN ĐANG SỬ SỬ DỤNG GÓI {subscription?.plans?.planName}</Title>
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
          </Flex>}
        <Box px='30px' bg='white' py='20px' style={{ borderRadius: '10px' }}>
          <Flex justify={"space-between"}>
            <Title order={5}>THÔNG TIN CƠ SỞ Y TẾ</Title>
            <div className="flex flex-1 justify-end items-center gap-1">
              <Text c='#6B6B6B'>ID: {currentClinic.id}</Text>
              <CopyButton value={currentClinic.id}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Đã copy ID phòng khám' : 'Copy ID phòng khám'}>
                    <ActionIcon variant="outline" color={copied ? 'gray.5' : 'teal.5'} onClick={copy}>
                      <FaCopy />
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
          </Flex>
          <Divider my="md" />
          <Grid>
            <Grid.Col span={3.5}>
              {isUpdate ?
                (
                  <>
                    <label htmlFor="upload-image" className="relative group">
                      <Image
                        w={200}
                        h={200}
                        className="cursor-pointer group-hover:opacity-90 rounded-md"
                        src={imageUrl || currentClinic?.logo || ClinusLogo}
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
                  <Image
                    w={200}
                    h={200}
                    src={imageUrl || currentClinic?.logo || ClinusLogo}
                  />
                )
              }
            </Grid.Col>
            <Grid.Col span={8.5}>
              <Box maw={700} mx="auto" >
                <Form control={control} onSubmit={e => onSubmit(e.data)} onError={e => console.log(e)}>
                  <TextInput label="Tên phòng khám"
                    readOnly={!isUpdate}
                    name='name'
                    control={control} />
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Email liên hệ"
                        readOnly={!isUpdate}
                        control={control}
                        mt="md"
                        name='email'
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Số điện thoại liên hệ"
                        readOnly={!isUpdate}
                        control={control}
                        mt="md"
                        name='phone'
                      />
                    </Grid.Col>
                  </Grid>

                  <TextInput
                    label="Địa chỉ"
                    readOnly={!isUpdate}
                    control={control}
                    mt="md"
                    w={'100%'}
                    name='address'
                  />

                  {lat && long && (
                    <Map
                      mapboxAccessToken="pk.eyJ1IjoiY29uZ3R1YW4wMTA0IiwiYSI6ImNsczF2eXRxYTBmbmcya2xka3B6cGZrMnQifQ.AHAzE7JIHyehx-m1YJbzFg"
                      latitude={lat}
                      longitude={long}
                      initialViewState={{
                        zoom: 15,
                      }}
                      scrollZoom={true}
                      style={{ width: 645, height: 400, marginTop: 10, borderRadius: 5 }}
                      mapStyle="mapbox://styles/mapbox/streets-v12"
                      attributionControl={false}
                      onMove={(e) => {
                        setValue('lat', e.viewState.latitude);
                        setValue('long', e.viewState.longitude);
                      }}
                    >
                      <FullscreenControl />
                      <NavigationControl />
                      {currentClinic.lat && currentClinic.long && !isUpdate && (
                        <Marker latitude={currentClinic.lat} longitude={currentClinic.long}>
                          <IoLocation style={{ color: 'red' }} size={40} />
                        </Marker>
                      )}
                      {lat && long && isUpdate && (
                        <Marker latitude={lat} longitude={long}>
                          <IoLocation style={{ color: 'red' }} size={40} />
                        </Marker>
                      )}
                      <AttributionControl customAttribution={getValues('name')} />
                    </Map>)}

                  {(currentClinic?.description || isUpdate) && (
                    <Text w='100%' mt='20px' mb='7px'>Mô tả</Text>
                  )}

                  {isUpdate ? (
                    <RichTextEditor editor={editor} w='100%' style={{ transform: "translateX(11px)" }}>
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
                  ) : (
                    <div className="p-2 bg-black-10 w-full rounded-md" dangerouslySetInnerHTML={{ __html: currentClinic?.description || '' }}></div>
                  )}


                  <Group justify="flex-end" mt="lg">
                    {isUpdate ?
                      <>
                        <Button type="submit" onClick={handleSubmit(onSubmit)}>Lưu thay đổi</Button>
                        <Button variant="outline" onClick={handleCancelChange} color='gray.6'>Hủy thay đổi</Button>
                      </>
                      : <Button onClick={handleUpdate}>Chỉnh sửa</Button>
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
import { clinicApi, planApi } from "@/services";
import { IClinicWithSubscription, IServicePlan } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Text, Modal, Select as MantineSelect, ComboboxItem, ScrollArea, Grid } from "@mantine/core";
import { Form, useForm } from "react-hook-form";
import { NativeSelect, Select, TextInput } from "react-hook-form-mantine";
import { useQuery } from "react-query";
import * as yup from 'yup';
import { CurrencyFormatter, PlanCard } from "..";
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { locationApi } from "@/services/location.service";
import { useDebouncedState, useDebouncedValue } from "@mantine/hooks";
import { IMapBoxFeature } from "@/types/location.types";
import Map, { FullscreenControl, Marker, NavigationControl } from 'react-map-gl';
import { IoLocation } from "react-icons/io5";



interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (clinic: IClinicWithSubscription) => void;
  selectedPlanId?: number;
}

interface IAddClinicFormData {
  clinicName: string;
  email: string;
  phone: string;
  address: string;
  lat?: number;
  long?: number;
  planId: string;
}

const schema = yup.object().shape({
  clinicName: yup.string().required('Bạn chưa nhập tên phòng khám'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  phone: yup.string()
    .required('Thông tin số điện thoại là bắt buộc')
    .typeError("Số điện thoại không đúng định dạng")
    .length(10),
  address: yup.string().required('Thông tin địa chỉ phòng khám là bắt buộc'),
  planId: yup.string().required('Bạn chưa chọn gói dịch vụ'),
  lat: yup.number(),
  long: yup.number(),
});

const ModalCreateNewClinic = ({ isOpen, onClose, onSuccess, selectedPlanId }: IProps) => {

  const { data: plans, isLoading: isLoadingPlan } = useQuery(
    'plans',
    () => planApi.getAllPlans().then(res => res.data)
  );

  const { control, setValue, watch, reset } = useForm<IAddClinicFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: useMemo(() => {
      return {
        clinicName: '',
        email: '',
        phone: '',
        address: '',
        planId: selectedPlanId?.toString(),
        lat: 10.7758439,
        long: 106.7017555,
      }
    }
      , [selectedPlanId]),
  });

  // const [address, setAddress] = useState<string | undefined | null>('');
  const [searchAddress, setSearchAddress] = useState('');
  const [debounced] = useDebouncedValue(searchAddress, 500);
  const [suggestLocations, setSuggestLocations] = useState<ComboboxItem[]>([]);

  const lat = watch('lat')
  const long = watch('long')
  const planId = watch('planId')

  // console.log('lat', lat);
  // console.log('long', long);


  const getSuggestLocations = async (address: string) => {
    const res = await locationApi.getSuggestLocations(address);

    if (res.data) {
      const features: IMapBoxFeature[] = res.data.features;
      const suggestLocations: ComboboxItem[] = features.map((feature) => {
        return {
          label: feature.place_name,
          value: feature.center.toString(),
        }
      });
      setSuggestLocations(suggestLocations);
    }

  }

  useEffect(() => {
    getSuggestLocations(searchAddress);
  }, [debounced])


  // useEffect(() => {
  //   if (selectedPlanId) {
  //     setValue('planId', selectedPlanId);
  //   }
  // }, [selectedPlanId, setValue]);


  const handleAddClinic = async (data: IAddClinicFormData) => {
    const newClinicData = {
      name: data.clinicName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      lat: data.lat,
      long: data.long,
      planId: data.planId.toString()
    };

    const response = await clinicApi.createClinic(newClinicData);

    if (response.status && response.data) {
      onSuccess(response.data);
    }
    else {
      notifications.show({
        message: 'Tạo phòng khám thất bại',
        color: 'red',
      });
    }
  }

  const handleClose = () => {
    onClose();
    const timeout = setTimeout(() => {
      reset();
      clearTimeout(timeout);
    }, 300);
  }

  return (
    <Modal size='auto' opened={isOpen} radius='lg' fullScreen={!planId}
      onClose={handleClose}
      title={<Text fw={600} ml={20}>
        {planId ? 'Nhập thông tin phòng khám mới' : 'Chọn gói quản lý phòng khám'}
      </Text>}
      centered scrollAreaComponent={ScrollArea.Autosize}>
      {
        planId ? (
          <Form
            control={control}
            className="px-5"
            onSubmit={e => handleAddClinic(e.data)}
            onError={e => console.log(e)}>
            <TextInput
              label="Tên phòng khám"
              name="clinicName"
              required
              size="md"

              control={control}
            />
            <Flex justify="space-between" gap={20}>
              <TextInput
                label="Email liên hệ"
                name="email"
                required
                mt="md"
                size="md"
                className="flex-1"
                control={control}
              />
              <TextInput
                label="Số điện thoại liên hệ"
                name="phone"
                required
                mt="md"
                size="md"
                className="flex-1"
                width='100%'
                control={control}
              />
            </Flex>

            <MantineSelect
              label="Địa chỉ phòng khám"
              placeholder="Nhập địa chỉ phòng khám"
              required
              my="md"
              size="md"
              searchable
              clearable
              searchValue={searchAddress}
              onSearchChange={setSearchAddress}
              data={suggestLocations}
              // value={address}
              onChange={(_value, option) => {
                setValue('address', option.label);
                setValue('long', Number(option.value.split(',')[0]));
                setValue('lat', Number(option.value.split(',')[1]));
              }}
            />

            {/* <Flex justify="space-between" gap={20}>
          <TextInput
            label="Latitude"
            name="lat"
            required
            mt="md"
            size="md"
            radius="sm"
            control={control}
          />

          <TextInput
            label="Longitude"
            name="long"
            required
            mt="md"
            size="md"
            radius="sm"
            control={control}
          />
        </Flex> */}

            <Text mb='sm'>Chọn vị trí phòng khám của bạn</Text>
            <Map
              mapboxAccessToken="pk.eyJ1IjoiY29uZ3R1YW4wMTA0IiwiYSI6ImNsczF2eXRxYTBmbmcya2xka3B6cGZrMnQifQ.AHAzE7JIHyehx-m1YJbzFg"
              latitude={lat}
              longitude={long}
              initialViewState={{
                zoom: 15,
              }}
              scrollZoom={true}
              style={{ width: 600, height: 400, borderRadius: 10 }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              onMove={(e) => {
                setValue('lat', e.viewState.latitude);
                setValue('long', e.viewState.longitude);
              }}
            >
              <FullscreenControl />
              <NavigationControl />
              {lat && long && (
                <Marker latitude={lat} longitude={long}>
                  <IoLocation style={{ color: 'red' }} size={30} />
                </Marker>
              )}
            </Map>

            <Select
              name="planId"
              control={control}
              label="Chọn gói quản lý phòng khám"
              placeholder={isLoadingPlan ? 'Đang lấy danh sách gói' : ''}
              withAsterisk
              mt="md"
              size="md"
              required
              disabled={isLoadingPlan}
              comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
              checkIconPosition="right"
              data={plans?.map((plan) => ({
                value: plan.id.toString(),
                label: `${plan.planName} - ${plan.duration} ngày - ${plan.currentPrice} VNĐ`,
              }))
              }
            />

            <Flex justify='end' mt='xl' gap={8}>
              <Button color="gray.6" size="md" onClick={handleClose}>
                Hủy
              </Button>
              <Button size="md" type="submit">
                Đăng ký
              </Button>
            </Flex>
          </Form>
        ) : (
          <div className="px-5">
            <Grid gutter={20} mt={20}>
              {plans && plans.map((plan) => (
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={plan.id}>
                  <PlanCard key={plan.id} plan={plan} actionText='Chọn gói' action={() => setValue('planId', plan.id.toString())} />
                </Grid.Col>
              ))}
            </Grid>
          </div>
        )
      }

    </Modal>
  )
}

export default ModalCreateNewClinic;
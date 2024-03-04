import { Gender } from "@/enums";
import { IPatient } from "@/types"
import { Paper, Text, Flex, Image, Grid, TextInput as MantineTextInput } from "@mantine/core"
import dayjs from "dayjs";

interface IProps {
  patient: IPatient;
}

const PatientOverview = ({ patient }: IProps) => {
  return (
    <Paper p='md' radius='md' shadow="xs">
      <Text fw={600}>Thông tin bệnh nhân</Text>
      <Flex gap={30} mt='md' align='center'>
        <Image
          src={patient?.avatar}
          h={220}
          w={220}
          radius='50%'
          alt={patient?.lastName}
          fallbackSrc='/assets/images/patient-placeholder.png'
        />
        <Grid>
          <Grid.Col span={5}>
            <MantineTextInput
              label="Tên bệnh nhân"
              value={`${patient?.firstName} ${patient?.lastName}`}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <MantineTextInput
              label="Giới tính"
              value={patient.gender === Gender.Male ? 'Nam'
                : patient.gender === Gender.Female ? 'Nữ' : 'Chưa có thông tin'}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <MantineTextInput
              label="Tuổi"
              value={patient?.birthday
                ? dayjs().diff(patient?.birthday, 'year')
                : 'Chưa có thông tin'}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>

          <Grid.Col span={5}>
            <MantineTextInput
              label="Địa chỉ"
              value={patient?.address || 'Chưa có thông tin'}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <MantineTextInput
              label="Email"
              value={patient?.email}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <MantineTextInput
              label="Số điện thoại"
              value={patient?.phone || 'Chưa có thông tin'}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>

          <Grid.Col span={5}>
            <MantineTextInput
              label="Tiền sử bệnh"
              value={patient?.anamnesis || 'Chưa có thông tin'}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <MantineTextInput
              label="Số thẻ BHYT"
              value={patient?.healthInsuranceCode || 'Chưa có thông tin'}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <MantineTextInput
              label="Nhóm máu"
              value={patient?.bloodGroup || 'Chưa có thông tin'}
              readOnly
              variant='filled'
              size='md'
            />
          </Grid.Col>
        </Grid>
      </Flex>

    </Paper>
  )
}

export default PatientOverview
import { notificationApi } from '@/services';
import { Paper, Title, Text, TextInput, Textarea, Button, Select, Checkbox, Flex, Switch, SegmentedControl } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

const AdminNotify = () => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [isSendToDevice, setIsSendToDevice] = useState(false)
  const [isSchedule, setIsSchedule] = useState(false)
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null)

  useEffect(() => {
    if (isSchedule) {
      setScheduleTime(new Date())
    }
    else {
      setScheduleTime(null)
    }
  }, [isSchedule])

  const handleSendNotify = async () => {
    if (!title || !content) return;
    if (isSendToDevice) {
      await notificationApi.pushNotifyToDevice(title, content, userId, Number(moduleId))
    }

    const res2 = await notificationApi.createRealtimeNotify(title, content, userId, Number(moduleId))
    if (res2.status) {
      notifications.show({
        title: 'Thông báo',
        message: 'Gửi thông báo thành công',
        color: 'green.5',
      })
      setTitle('')
      setContent('')
      setUserId('')
      setModuleId('')
      setIsSendToDevice(false)
      setIsSchedule(false)
    }
    else {
      notifications.show({
        title: 'Thông báo',
        message: 'Gửi thông báo thất bại',
        color: 'red.5',
      })
    }
  }

  return (
    <Paper w={550} mx='auto' shadow='md' px={15} py={10} withBorder mt={25}>
      <Title order={2} ta="center" my='sm'>Thông báo mới</Title>

      {/* <Select
        data={['1', '2', '3']}
        label="Chọn người nhận"
        placeholder="Chọn người nhận"
        value={userId}
        size='md'
        onChange={setUserId}
      /> */}

      <Select
        data={
          [
            {
              label: 'Chủ phòng khám',
              value: '2'
            },
            {
              label: 'Bệnh nhân',
              value: '3',
            }
          ]
        }
        label="Chọn người nhận"
        placeholder="Chọn người nhận"
        value={moduleId}
        size='md'
        onChange={setModuleId}
      />

      <TextInput
        label="Tiêu đề"
        placeholder="Nhập tiêu đề thông báo"
        required
        size='md'
        mt='md'
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />

      <Textarea
        label="Nội dung"
        placeholder="Nhập nội dung thông báo"
        size='md'
        mt='md'
        required
        rows={5}
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
      />

      <Text size="md" fw={500} mt='md'>
        Thời gian gửi thông báo
      </Text>
      <SegmentedControl
        // mt='md'
        fullWidth
        size='md'
        value={isSchedule ? 'schedule' : 'now'}
        onChange={(value) => setIsSchedule(value === 'schedule')}
        data={[
          { value: 'now', label: 'Gửi ngay' },
          { value: 'schedule', label: 'Đặt lịch gửi' },
        ]}
      />


      {isSchedule &&
        <DateTimePicker
          label="Thời gian gửi"
          placeholder="Chọn thời gian gửi"
          size='md'
          mt='md'
          value={scheduleTime}
          onChange={setScheduleTime}
          valueFormat='DD-MM-YYYY HH:mm:ss'
        />}

      <Checkbox
        mt='md'
        checked={isSendToDevice}
        radius='sm'
        onChange={(e) => setIsSendToDevice(e.currentTarget.checked)}
        label='Gửi thông báo đến thiết bị của người dùng'
      />

      <Flex justify='flex-end'>
        <Button
          disabled={!title || !content || !moduleId}
          mt='md'
          size='md'
          fullWidth
          onClick={handleSendNotify}>
          Gửi thông báo
        </Button>
      </Flex>
    </Paper>
  );
};

export default AdminNotify;

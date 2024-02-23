import { GroupChatType } from "@/enums";
import { chatApi } from "@/services";
import { IGroupChat, IGroupChatMember } from "@/types";
import { ActionIcon, Avatar, Modal, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IoPersonRemove } from "react-icons/io5";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  data: IGroupChat;
}

const ModalChatInfo = ({
  isOpen,
  onClose,
  data,
}: IProps) => {

  const handleRemoveMember = async (member: IGroupChatMember) => {
    const res = await chatApi.removeMember(data.id, member.userId);

    if (res.status) {
      notifications.show({
        title: "Thành công",
        message: `Đã xóa ${member.firstName} ${member.lastName} khỏi nhóm chat`,
        color: "teal",
      })
      data.groupChatMember = data.groupChatMember?.filter(m => member.userId !== m.userId);
    } else {
      notifications.show({
        title: "Thất bại",
        message: `Xóa ${member.firstName} ${member.lastName} khỏi nhóm chat thất bại`,
        color: "red.5",
      })
    }
  }

  return (
    <Modal.Root opened={isOpen} onClose={onClose} size='auto' centered miw={400}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Thành viên</Modal.Title>
          <Modal.CloseButton variant="transparent" c="white" />
        </Modal.Header>
        <Modal.Body pt={10} miw={400}>
          <Stack mt={10}>
            {data.groupChatMember?.map((member, index) => (
              <div key={index} className="flex items-center mb-3">
                <Avatar src={member.avatar} alt="avatar" w={45} h={45} radius='xl'>
                  {member.firstName[0].slice(0, 1).toUpperCase()}
                </Avatar>
                <div className="ml-3">
                  <p className="text-md font-semibold">
                    {member.firstName} {member.lastName}
                    {member.isAdmin && data.type === GroupChatType.GROUP && <span className="font-medium"> (Admin)</span>}
                  </p>
                  <p className="text-gray-400 text-sm">{member.email}</p>
                </div>
                {!member.isAdmin && data.type === GroupChatType.GROUP &&
                  <ActionIcon
                    onClick={() => handleRemoveMember(member)}
                    color="red.4"
                    className="ml-auto"
                  >
                    <IoPersonRemove size={20} />
                  </ActionIcon>
                }
              </div>
            ))}
          </Stack>

        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ModalChatInfo;
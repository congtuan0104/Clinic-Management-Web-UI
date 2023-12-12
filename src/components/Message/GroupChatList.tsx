import { useEffect, useState } from "react";
import { IGroupChat } from "@/types"
import { Avatar, Box, Flex, Input, Text } from "@mantine/core";
import classNames from "classnames";

interface ChatHeadsProps {
  groups: IGroupChat[];  // danh sách các nhóm chat mà user hiện tại tham gia
  changeGroup: (group: IGroupChat) => void;  // thay đổi nhóm chat được hiển thị
  selectedGroup?: IGroupChat;  // nhóm chat được chọn để hiển thị
}

export default function GroupChatList({ groups, changeGroup, selectedGroup }: ChatHeadsProps) {
  const [searchGroup, setSearchGroup] = useState<string>("");
  const [searchGroupResult, setSearchGroupResult] = useState<IGroupChat[]>(groups);

  useEffect(() => {
    setSearchGroupResult(groups);
  }
    , [groups]);

  // useEffect(() => {
  //   if (searchGroup.trim().length === 0) {
  //     setSearchGroupResult(groups);
  //     return;
  //   }
  //   handleSearchGroup();
  // }
  //   , [searchGroup]);


  const handleSearchGroup = (textSearch: string) => {
    if (textSearch.trim().length === 0) {
      setSearchGroupResult(groups);
      return;
    }
    const result = groups.filter(
      (group) => group.groupName
        .toLowerCase()
        .includes(searchGroup
          .toLowerCase()));
    setSearchGroupResult(result);
  }

  return (
    <>
      <Input
        value={searchGroup}
        onChange={(e) => {
          setSearchGroup(e.target.value)
          handleSearchGroup(e.target.value)
        }}
        placeholder="Tìm kiếm nhóm chat"
        radius='lg' />

      <Flex my={10} align='center' direction='column'>
        {searchGroupResult.map((group) => (
          <Flex
            key={group.id}
            w={'100%'}
            onClick={() => changeGroup(group)}
            align='center'
            my={2}
            className={classNames(
              "cursor-pointer rounded-xl p-2",
              group.id === selectedGroup?.id ? "bg-blue-100" : 'hover:bg-gray-200'

            )}
          >
            <Avatar color="secondary.5" radius="xl" >
              {group.groupName.slice(0, 1)}
            </Avatar>

            <Text ml={8} size='md'>{group.groupName}</Text>
          </Flex>

        ))}
      </Flex>
    </>
  );
}

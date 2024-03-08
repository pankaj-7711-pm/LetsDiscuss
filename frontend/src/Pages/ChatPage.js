import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../Components/miscellaneous/sideDrawer';
import {Box} from "@chakra-ui/react"
import MyChats from '../Components/MyChats';
import ChatsBox from '../Components/ChatBox';
const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        width={"100%"}
        height={"91.5vh"}
        padding={"10px"}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} />
        )}
        {user && (
          <ChatsBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default ChatPage

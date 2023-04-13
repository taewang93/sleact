import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from "@utils/fetcher";
import { useParams } from "react-router-dom";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";

const DirectMessage = () => {
  const { workspace, id } = useParams<{workspace: string, id: string}>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    setChat('');
    console.log('submit');
  }, []);

  if( !myData || !userData ){
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  )
}

export default DirectMessage;

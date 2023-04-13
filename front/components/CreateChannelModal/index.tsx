import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/SignUp/styles";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { VFC, useCallback } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import useSWR from 'swr';

interface Props{
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flog: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal}) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const {workspace} = useParams<{workspace: string}>();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    axios
    .post(`/api/workspaces/${workspace}/channels`, {
      name: newChannel
    })
    .then(() => {
      revalidateChannel();
      setShowCreateChannelModal(false);
      setNewChannel('');
    })
    .catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    });
  }, [newChannel, revalidateChannel, setNewChannel, setShowCreateChannelModal, workspace]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="chanenl-label">
          <span>Channel name</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">create</Button>
      </form>
    </Modal>
  )
}

export default CreateChannelModal;

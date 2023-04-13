import React, { useCallback, VFC } from "react";
import { Button, Input, Label } from '@pages/SignUp/styles';
import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { useParams } from "react-router-dom";
import fetcher from "@utils/fetcher";
import useSWR from 'swr';
import { IChannel, IUser } from "@typings/db";
import axios from "axios";
import { toast } from 'react-toastify';

interface Props{
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flog: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{workspace: string, channel:string}>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate: revalidateMember } = useSWR<IChannel>(
    userData ? `/api/workspaces/${workspace}/members`: null,
    fetcher,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if(!newMember || !newMember.trim()) {
      return;
    }
    axios
    .post(`/api/workspace/${workspace}/channel/${channel}/members`, {
      email: newMember,
    })
    .then(() => {
      revalidateMember();
      setShowInviteChannelModal(false);
      setNewMember('');
    })
    .catch((error) => {
      console.log(error)
      toast.error(error.response?.data, {position:'bottom-center'});
    })
  }, [newMember, workspace, revalidateMember, setNewMember]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
}

export default InviteChannelModal;

import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import React, { VFC } from "react";
import { useParams } from 'react-router';
import { NavLink, useLocation } from "react-router-dom";
import useSWR from 'swr';

interface Props{
  member: any;
  isOnline: boolean;
}
const EachDM: VFC<Props> = ({member, isOnline}) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>(`/api/users`, fetcher, {
    dedupingInterval: 2000,
  });

  return (
    <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <span >{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      
    </NavLink>
  )
}

export default EachDM;

import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import React, { VFC } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import useSWR from "swr";

interface Props{
  channel: IChannel;
}

const EachChannel: VFC<Props> = ({ channel }) => {
  const { workspace } = useParams<{workspace: string}>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>(`/api/users`, fetcher, {
    dedupingInterval: 2000,
  });

  return (
    <NavLink key={channel.name} activeClassName="selected" to={`/workspace/${workspace}/channel/${channel.name}`}>
      <span># {channel.name}</span>
    </NavLink>
  );
}

export default EachChannel;

import useInput from "@hooks/useInput";
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import useSWR from 'swr';

const LogIn = () => {
  /*
    useSWR 첫번째: 정보받을주소, 두번째 주소를 어떻게 처리할지

    1. 로그인 완료후 swr 호출 
      - mutate를 넣고 로그인 했을때 mutate호출
      - revalidate, mutate 차이 revalidate는 서버에 정보요청, mutate 는 받은 내정보를 사용해서 다시사용해서
    2. swr이 주기적으로 호출하는데 그부분 정하기(너무 많이 가면 안좋으니)
      -3번째 매개변수로 dedupingInterval로 시간정하기
  */
  const {data, error, mutate} = useSWR('/api/users', fetcher);

  const [logInError, setLogInError] = useState(false);

  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setLogInError(false);
    axios
    .post('/api/users/login', { email, password }, {withCredentials: true})
    .then((response) => {
      mutate(response.data, false);
    })
    .catch((error) => {
      setLogInError(error.response?.data?.code === 401);
    });
  }, [email, password, mutate]);


  if(data) return <Redirect to="/workspace/sleact/channel/일반" />

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;

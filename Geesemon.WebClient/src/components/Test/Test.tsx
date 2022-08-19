import { Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../behavior/store";
import { incrementBy } from "../../behavior/test/testSlice";
import { logout } from "../../behavior/auth/userSlice";
import { Chat } from "../chat/Chat";
import { gql, useSubscription } from "@apollo/client";
import { receiveMessage } from "../../behavior/chat/chatSlice";
import { MessageSubscriptionResponse } from "../../behavior/chat/types";
import { useParams } from "react-router-dom";

export function Test() {
  let counter = useSelector((state: RootState) => state.test.counter);
  let user = useSelector((state: RootState) => state.user.user);
  let messages = useSelector((state: RootState) => state.chat.allMessages);

  let { userId } = useParams();

  console.log(userId);

  const dispatch = useAppDispatch();

  const COMMENTS_SUBSCRIPTION = gql`
    subscription SubscriptionTest {
      messageAdded {
        content
        sentAt
        fromId
      }
    }
  `;
  const { data, loading } = useSubscription<MessageSubscriptionResponse>(
    COMMENTS_SUBSCRIPTION
  );

  useEffect(() => {
    if (data) dispatch(receiveMessage(data.messageAdded));
  }, [data?.messageAdded]);

  return (
    <div className="App">
      <div>Hello {user?.login}</div>
      <Button type="primary" onClick={() => dispatch(logout())}>
        Logout
      </Button>
      <div>{counter}</div>
      <Button type="primary" onClick={() => dispatch(incrementBy({ by: 5 }))}>
        Click me
      </Button>

      <Chat />

      {messages?.map((a) => (
        <div>{a.content}</div>
      ))}
    </div>
  );
}

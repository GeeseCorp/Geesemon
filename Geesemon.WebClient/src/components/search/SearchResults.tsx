import styles from './SearchResults.module.scss';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../behavior/store';
import { searchActions } from '../../behavior/features/search/slice';
import { ChatItem } from './ChatItem/ChatItem';
import { SmallLoading } from '../common/SmallLoading/SmallLoading';
import { InfinityScroll } from '../common/InfinityScroll/InfinityScroll';

type Props = {
  keywords: string;
  onClickChat: (chatIdentifier: string) => void;
  setIsEnabledSearchMode: (value: boolean) => void;
};

export const SearchResults = ({ keywords, onClickChat, setIsEnabledSearchMode }: Props) => {
  const dispatch = useAppDispatch();

  const {
    chats,
    chatsGetLoading,
    chatsGetHasNext,
  } = useAppSelector(s => ({
    chats: s.search.chats,
    chatsGetLoading: s.search.chatsGetLoading,
    chatsGetHasNext: s.search.chatsGetHasNext,
  }));

  useEffect(() => {
    return () => {
      dispatch(searchActions.toInitialState());
    };
  }, []);

  useEffect(() => {
    dispatch(searchActions.setChats([]));
    dispatch(searchActions.chatsGetAsync({ keywords, paging: { take: 15, skip: 0 } }));
  }, [keywords]);

  const onClickChatHandler = (chatIdentifier: string) => {
    onClickChat(chatIdentifier);
    setIsEnabledSearchMode(false);
  };

  const onReachNextPage = () => {
    dispatch(searchActions.chatsGetAsync({ keywords, paging: { take: 15, skip: chats.length } }));
  };

  return (
    <div className={styles.searchResults}>
      <InfinityScroll
        items={chats}
        onItemRender={c => (
          <ChatItem
            key={c.id}
            chat={c}
            onClickChat={onClickChatHandler}
          />
        )}
        onReachBottom={onReachNextPage}
        hasBottomNext={chatsGetHasNext}
        bottomLoading={chatsGetLoading}
      />
      {chatsGetLoading && <SmallLoading className={styles.loading} />}
    </div>
  );
};

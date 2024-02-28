import './style.css';
import { SendOutlined, InfoCircleOutlined, FileImageOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, arrayUnion, Timestamp } from "firebase/firestore";
import { db, storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from 'store/hook';
import { v4 as uuid } from "uuid";
interface IUserFireStore {
    userId: string,
    username: string,
    chatId: string,
    avatar: string;
}
interface IChat {
    chatId: string,
    textLastMessage: string,
    userId: string,
    username: string,
    date: any,
    avatar: string;
}
interface IMessage {
    id: string,
    text: string,
    senderId: string,
    date: any,
    image?: string;
}
const MessagePage = () => {
    // store
    const { userInfo } = useAppSelector(state => state.authStore);

    // useRef 
    const el = useRef<null | HTMLDivElement>(null);

    // useState
    const [text, setText] = useState("");
    const [imgSend, setImageSend] = useState<File | null>(null);
    const [err, setErr] = useState(false);
    const [nameSearch, setNameSearch] = useState("");
    const [chats, setChats] = useState([] as IChat[]);
    const [user, setUser] = useState({} as IUserFireStore);
    const [messagesArray, setMessagesArray] = useState([] as IMessage[]);
    const [userOppositeChat, setUserOppositeChat] = useState({} as IUserFireStore);

    // Function
    // Function Input
    const handleSend = async () => {
        if (userInfo.userId) {
            if (imgSend !== null) {
                const storageRef = ref(storage, uuid());

                const uploadTask = uploadBytesResumable(storageRef, imgSend);

                uploadTask.then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", userOppositeChat.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: userInfo.userId,
                                date: Timestamp.now(),
                                image: downloadURL,
                            }),
                        });
                    });
                });
                setImageSend(null);
            }
            else {
                await updateDoc(doc(db, "chats", userOppositeChat.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: userInfo.userId,
                        date: Timestamp.now(),

                    }),
                });
            }
            await updateDoc(doc(db, "userchats", userInfo?.userId), {
                [userOppositeChat.chatId + ".lastMessage"]: {
                    text,
                },
                [userOppositeChat.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userchats", userOppositeChat.userId), {
                [userOppositeChat.chatId + ".lastMessage"]: {
                    text,
                },
                [userOppositeChat.chatId + ".date"]: serverTimestamp(),
            });

            setText("");
        }
    };

    // Chage user chat
    const handleSelectUserChat = async (userFireStore: IUserFireStore) => {
        if (userInfo.userId) {
            const combinedId = userInfo.userId > userFireStore.userId ?
                userInfo.userId + userFireStore.userId :
                userFireStore.userId + userInfo.userId;
            try {
                const res = await getDoc(doc(db, "chats", combinedId));
                if (!res.exists()) {
                    await setDoc(doc(db, "chats", combinedId), { messages: [] });

                    const checkUserChatsExists = await getDoc(doc(db, "userchats", userInfo.userId));

                    if (!checkUserChatsExists.exists()) {
                        await setDoc(doc(db, "userchats", userInfo.userId), {});
                    }
                    await updateDoc(doc(db, "userchats", userInfo.userId), {
                        [combinedId + '.userInfo']: {
                            userId: userFireStore.userId,
                            username: userFireStore.username
                        },
                        [combinedId + '.date']: serverTimestamp()
                    });

                    const checkUserChatsExists2 = await getDoc(doc(db, "userchats", userFireStore.userId));
                    if (!checkUserChatsExists2.exists()) {
                        await setDoc(doc(db, "userchats", userFireStore.userId), {});
                    }
                    await updateDoc(doc(db, "userchats", userFireStore.userId), {
                        [combinedId + '.userInfo']: {
                            userId: userInfo.userId,
                            username: userInfo.username ? userInfo.username : userInfo.email
                        },
                        [combinedId + '.date']: serverTimestamp()
                    });

                }
                let newUserOpposite: IUserFireStore = {
                    chatId: combinedId,
                    userId: userFireStore.userId,
                    username: userFireStore.username,
                    avatar: userFireStore.avatar
                };
                setUserOppositeChat(newUserOpposite);
            }
            catch (err) {
                console.log(err);
            }
        }
        setUser({} as IUserFireStore);
        setNameSearch("");
    };

    // when send chat auto scoll to bottom
    useEffect(() => {
        if (el.current === null) { }
        else {
            el!.current!.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messagesArray.length]);


    // handle search user chat and show result search
    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("username", "==", nameSearch)
        );

        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setUser({} as IUserFireStore);
                throw new Error();
            }

            querySnapshot.forEach((doc) => {
                setUser(doc.data() as IUserFireStore);
            });
        } catch (err) {
            setErr(true);
        }
    };

    // when press "enter" to search
    const handleKey = (e: React.KeyboardEvent<HTMLElement>) => {
        e.code === "Enter" && handleSearch();
    };

    // useEffect
    // when userId change update people chat
    useEffect(() => {
        if (userInfo?.userId) {
            const unsub = onSnapshot(doc(db, "userchats", userInfo?.userId), async (doc) => {
                let listChat = [] as IChat[];
                if (doc.exists()) {
                    listChat = await Promise.all(Object.entries(doc.data()).map(async dataChat => {
                        const q = query(
                            collection(db, "users"),
                            where("userId", "==", dataChat[1].userInfo.userId)
                        );
                        const querySnapshot = await getDocs(q);
                        let userInFirebase = {} as IUserFireStore;
                        querySnapshot.forEach(async (doc) => {
                            userInFirebase = (doc.data() as IUserFireStore);
                        });
                        const userChat: IChat = {
                            chatId: dataChat[0],
                            textLastMessage: dataChat[1].lastMessage ? dataChat[1].lastMessage.text : '',
                            username: dataChat[1].userInfo.username,
                            userId: dataChat[1].userInfo.userId,
                            date: dataChat[1].date,
                            avatar: userInFirebase?.avatar
                        };
                        if (!userOppositeChat.chatId) {
                            let newUserOpposite: IUserFireStore = {
                                chatId: userChat.chatId,
                                userId: userChat.userId,
                                username: userChat.username,
                                avatar: userChat.avatar
                            };
                            setUserOppositeChat(newUserOpposite);
                        }
                        return userChat;
                    }));
                }
                setChats(listChat);
            });

            return () => {
                unsub();
            };
        }
    }, [userInfo?.userId]);

    // when change user chat update content chat
    useEffect(() => {
        if (userOppositeChat.chatId) {
            const unSub = onSnapshot(doc(db, "chats", userOppositeChat.chatId), (doc) => {
                let listMessage = [] as IMessage[];
                if (doc.exists()) {

                    Object.entries(doc.data().messages).map(itemMessage => {
                        const newMessage: IMessage = {
                            date: (itemMessage[1] as IMessage).date,
                            id: (itemMessage[1] as IMessage).id,
                            senderId: (itemMessage[1] as IMessage).senderId,
                            text: (itemMessage[1] as IMessage).text,
                            image: (itemMessage[1] as IMessage).image ? (itemMessage[1] as IMessage).image : undefined
                        };
                        listMessage.push(newMessage);
                    });
                    setMessagesArray(listMessage);
                }
            });

            return () => {
                unSub();
            };
        }

    }, [userOppositeChat.chatId]);


    return (
        <div className='message-page'>
            {
                userInfo.userId ?
                    <div className="main-message-page">
                        <div className="main-left">
                            <div className="box-search">
                                <div className="wrap-input-search">
                                    <input
                                        className='base-input'
                                        type="text"
                                        placeholder="Tìm kiếm theo tên"
                                        onKeyDown={handleKey}
                                        onChange={(e) => { setNameSearch(e.target.value); setErr(false); }}
                                        value={nameSearch}
                                    />
                                </div>
                                {(err && !user.userId) && <span>User not found!</span>}
                                {user.userId && (
                                    <div className="userChat" onClick={() => handleSelectUserChat(user)}>
                                        <img className='image-user-searched' src={user.avatar} alt="" />
                                        <div className="userChatInfo">
                                            <span>{user.username}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="list-user-inbox">
                                {
                                    chats.sort((a, b) => b.date - a.date).map(chat => {
                                        return (
                                            <div className={"wrap-user-inbox " + (userOppositeChat.userId === chat.userId ? 'active' : '')}
                                                key={chat.userId}
                                                onClick={() =>
                                                    handleSelectUserChat(
                                                        { userId: chat.userId, username: chat.username, chatId: chat.chatId, avatar: chat.avatar } as IUserFireStore
                                                    )
                                                }
                                            >
                                                <div className="wrap-avatar-user">
                                                    <img src={chat.avatar} alt="" className="avatar-user" />
                                                </div>
                                                <div className="wrap-name-and-last-message">
                                                    <div className="name-user">{chat.username}</div>
                                                    <div className="last-message">{chat.textLastMessage}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="main-right">
                            {
                                userOppositeChat.userId ?
                                    <>
                                        <div className="header-main-right">
                                            <div className="info-user-chat">
                                                <div className="wrap-avatar-main-right">
                                                    <img src={userOppositeChat.avatar ? userOppositeChat.avatar : "https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg"} alt="" className="avatar-main-right" />
                                                </div>
                                                <div className="name-user-current-chat">{userOppositeChat?.username}</div>
                                            </div>
                                            <div className="tool-with-current-user-chat"><InfoCircleOutlined className='icon-more-action' /></div>
                                        </div>
                                        <div className="box-chat">
                                            {
                                                messagesArray.length > 0 ? messagesArray.map((messageItem, index) => {
                                                    return (
                                                        <div ref={el} key={messageItem.id + ' ' + index} style={{ display: ((messageItem.text != '' || messageItem.image) ? 'flex' : 'none') }} className={"box-chat-item  box-chat-" + (messageItem.senderId === userInfo?.userId ? 'right' : 'left')}>
                                                            {
                                                                (messageItem.senderId === userInfo?.userId && (messageItem.text != '' || messageItem.image)) ? <div className="text-chat-right">
                                                                    {messageItem.text}
                                                                    {
                                                                        messageItem.image ?
                                                                            <img className='image-sended' src={messageItem.image}></img>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                                    :
                                                                    <></>
                                                            }
                                                            <div className={"wrap-image-current-chat-" + (messageItem.senderId === userInfo?.userId ? 'right' : 'left')}>
                                                                <img src={messageItem.senderId === userInfo?.userId ? userInfo.avatar : userOppositeChat.avatar} alt="" className="image-current-chat" />
                                                            </div>
                                                            {
                                                                messageItem.senderId !== userInfo?.userId ? <div className="text-chat-left">
                                                                    {messageItem.text}
                                                                    {
                                                                        messageItem.image ?
                                                                            <img src={messageItem.image}></img>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                                    :
                                                                    <></>
                                                            }
                                                        </div>
                                                    );
                                                }) :
                                                    ''
                                            }
                                        </div>
                                        <div className="box-input-chat">
                                            <div className="wrap-input">
                                                <label htmlFor="file">
                                                    <FileImageOutlined style={{ fontSize: '20px', color: '#fff', marginRight: '10px', cursor: 'pointer' }} />
                                                </label>
                                                <input type="text" className="input-user-chat" value={text} onChange={(e) => setText(e.target.value)} />
                                                <input
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    id="file"
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            setImageSend(e.target.files[0]);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />

                                                <div className="icon-send" onClick={handleSend}><SendOutlined /></div>
                                            </div>
                                            <div className="wrap-image-preview">
                                                <div className='wrap-image-icon'>
                                                    {
                                                        imgSend !== null ?
                                                            <>
                                                                <img className='image-preview' src={URL.createObjectURL(imgSend)}></img>
                                                                <CloseCircleOutlined className='icon-delete-send' onClick={() => setImageSend(null)} />
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </> :
                                    <div className='no-user-chat'>Bạn không có cuộc trò chuyện nào.</div>
                            }

                        </div>
                    </div>
                    :
                    <div className='login-to-view-chat'>
                        Bạn chưa đăng nhập
                    </div>
            }

        </div>
    );
};
export default MessagePage;
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

function ConnectedUsers({ socket }) {
    const [userList, setUserList] = useState([]);
    const [firstTime, setFirstTime] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        if (firstTime) {
            socket.emit("lobby_data_pls");
            setFirstTime(false)
        }
        socket.on("lobby_user_list", (data) => {
            setUserList(data.list);

        });
    }, [firstTime, socket])


    return (
        <div className="lobby__connectedUsers">
            <h2 className="connectedUsers_title text-white">{t('connectedUsers')}</h2>
            <ul id="userList" className="connectedUsers__userList userList">

                {userList.map((user, index) => {
                    return (
                        <li className="userList__item item text-white" key={index}>
                            <img src={user.avatar} width="120px" ></img>
                            <div className="item__name">
                                <h3 className="text-white" id="list">{user.name}</h3>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div >

    );
}

export default ConnectedUsers;
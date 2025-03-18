import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../components/store';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const UserInfo = ({ onSharedValueChange, onSharedIdChange }) => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const token = localStorage.getItem('access_token');
    const [isLoading, setIsLoading] = useState(false);
    const [playedGames, setPlayedGames] = useState([]);
    const [boughtInfo, setBoughtInfo] = useState([]);
    const [uploadedGames, setUploadedGames] = useState([]);
    const [storeInfo, setStoreInfo] = useState([]);
    const [avatarSet, setAvatar] = useState([]);
    const otherInfo = useSelector((state) => state.dataOthers);
    const otherUserInfo = useSelector((state) => state.getUserId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleInputChange = (path, id) => {
        onSharedValueChange(path);
        onSharedIdChange(id)
        navigate('/game');
    };

    useEffect(() => {
        async function avatarOther() {
            if (boughtInfo.length >= 0) {
                const matchingItems = boughtInfo.filter(item => item.avatar && item.userId === otherUserInfo.id);
                if (matchingItems.length > 0) {
                    const userAvatarItem = storeInfo.find(item => item.id === matchingItems[0].itemId);
                    setAvatar(userAvatarItem.image_url);
                } else {
                    setAvatar("Controller.jpg")
                }
            }
        }
        async function fetchStoreItems() {
            try {
                const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/getStoreItems`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const avatar = await response.json();
                setStoreInfo(avatar);
                avatarOther();
            } catch (error) {
                console.error(error);
            }
        }
        async function fetchUsers() {
            try {
                const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/showProfileOthers?userId=${otherUserInfo.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const users = await response.json();
                dispatch(actions.dataOthers(users));
                setIsLoading(true);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchBoughtItems() {
            try {
                const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/getBoughtItems`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const infoItems = await response.json();

                const boughtItems = infoItems.filter(item => item.userId === otherUserInfo.id);
                setBoughtInfo(boughtItems)
                fetchStoreItems();
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchPlayedGame() {
            try {
                const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/showPlayedGame?userId=${otherUserInfo.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const infoPlayedGame = await response.json();
                setPlayedGames(infoPlayedGame);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchUploadedGames() {
            try {
                const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/getOtherUserGames?userId=${otherUserInfo.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const uploaded = await response.json();
                setUploadedGames(uploaded);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUploadedGames();
        fetchBoughtItems();
        fetchUsers();
        fetchPlayedGame();
    }, []);

    const purchasedItems = storeInfo.filter(item => {
        return boughtInfo.some(boughtItem => boughtItem.userId === otherUserInfo.id && boughtItem.itemId === item.id);
    });

    const [activeTab, setActiveTab] = useState(otherUserInfo.tab);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="overflow-auto bg-image-all bg-cover bg-no-repeat bg-center bg-fixed flex h-screen justify-center items-center ">
            {isLoggedIn ?
                <div className=" container h-full w-3/4 p-10">
                    <div className="block rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
                        <div className="p-4">
                            <div className="md:m-6 md:p-12">
                                <div className="text-center text-white">
                                    <nav className="backdrop-filter backdrop-blur-l bg-opacity-30 border-b-4 border-fuchsia-600 p-4">
                                        <div className="flex space-x-4">
                                            <li className={`w-1/4 list-none`}>
                                                <a onClick={() => handleTabClick("tab1")} className={`mt-4 mb-4 text-gray-300 text-xl hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium cursor-pointer p-4 ${activeTab === "tab1" ? "active bg-gray-700" : ""}`}>
                                                    {t('profileUserInfo')}
                                                </a>
                                            </li>
                                            <li className={`w-1/4 list-none`}>
                                                <a onClick={() => handleTabClick("tab2")} className={`text-gray-300 text-xl hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium cursor-pointer ${activeTab === "tab2" ? "active bg-gray-700" : ""}`}>
                                                    {t('profileHistorial')}
                                                </a>
                                            </li>
                                            <li className={`w-1/4 list-none`}>
                                                <a onClick={() => handleTabClick("tab3")} className={`text-gray-300 text-xl hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium cursor-pointer ${activeTab === "tab3" ? "active bg-gray-700" : ""}`}>
                                                    {t('profileColeccionables')}
                                                </a>
                                            </li>
                                            <li className={`w-1/4 list-none`}>
                                                <a onClick={() => handleTabClick("tab4")} className={`text-gray-300 text-xl hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer ${activeTab === "tab4" ? "active bg-gray-700" : ""}`}>
                                                    Tus Juegos
                                                </a>
                                            </li>
                                        </div>
                                    </nav>
                                    <br></br>                  <br></br>


                                    {activeTab === "tab1" &&
                                        <div>
                                            {isLoading ?
                                                <table className="table-auto w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="w-1/5 border-fuchsia-600 border-b">
                                                                {t('profileProfilePicture')}
                                                            </th>
                                                            <th className="w-1/5 border-fuchsia-600 border-b">
                                                                {t('profileName')}
                                                            </th>
                                                            <th className="w-1/5 border-fuchsia-600 border-b">
                                                                {t('profileTotalScore')}
                                                            </th>
                                                            <th className="w-1/5 border-fuchsia-600 border-b">
                                                                Jeacstars
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center"><img className="rounded-full border-4 border-fuchsia-600 w-3/4 h-3/4 mx-auto mt-4" src={avatarSet} alt=""></img></td>
                                                            <td><h4 className="text-2xl">{otherInfo.name}</h4></td>
                                                            <td><h4 className="text-2xl">{otherInfo.totalScore}</h4></td>
                                                            <td><h4 className="text-2xl">{otherInfo.jeacstars}<img className="w-10 h-10 inline" src="JeacstarNF.png"></img></h4></td>
                                                        </tr>
                                                    </tbody>
                                                </table> :
                                                <svg aria-hidden="true" className="inline-flex items-center w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            }
                                        </div>
                                    }

                                    {activeTab === "tab2" &&
                                        <div className="flex w-full">
                                            {isLoading ?
                                                <table className="table-auto flex-1">
                                                    <thead>
                                                        <tr>
                                                            <th className="w-1/3 border-fuchsia-600 border-b">
                                                                {t('historialGame')}
                                                            </th>
                                                            <th className="w-1/3 border-fuchsia-600 border-b">
                                                                {t('rankingPScore')}
                                                            </th>
                                                            <th className="w-1/3 border-fuchsia-600 border-b">
                                                                {t('historialDate')}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {playedGames.map((game, userId) => (
                                                            <tr className="h-20 odd:bg-gray-700" key={userId}>
                                                                <td>{game.name}</td>
                                                                <td>{game.score}</td>
                                                                <td>{moment(game.created_at).format('DD MMM YYYY HH:mm:ss')}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table> :
                                                <svg aria-hidden="true" className="inline-flex items-center w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            }
                                        </div>
                                    }
                                    <div>

                                        {activeTab === "tab3" &&
                                            <div className="mb-3 mt-md-4">
                                                {isLoading ?
                                                    <div>
                                                        {boughtInfo.length > 0 ?
                                                            <div style={{ display: 'flex' }}>
                                                                {
                                                                    purchasedItems.map((item, userId) => (
                                                                        <div className="text-center w-1/4" key={userId}>
                                                                            <h2>{t('itemsItem')}: {item.name}</h2>
                                                                            <img className="object-center" src={item.image_url} />
                                                                            <p>{t('itemsDesc')}: {item.description}</p>
                                                                            <p>{t('itemsPrice')}: {item.price * 0.5}<img className="w-10 h-10 inline" src="JeacstarNF.png"></img></p>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            :
                                                            <div>No tiene ningun item</div>
                                                        }
                                                    </div>
                                                    :
                                                    <svg aria-hidden="true" className="inline-flex items-center w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                    </svg>
                                                }
                                            </div>
                                        }
                                    </div>

                                    {activeTab === "tab4" &&
                                        <div className="flex w-full">
                                            {isLoading ?
                                                <table className="table-auto flex-1 w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="w-1/3 border-fuchsia-600 border-b">
                                                                Juego
                                                            </th>
                                                            <th className="w-1/3 border-fuchsia-600 border-b">
                                                                Descripción
                                                            </th>
                                                            <th className="w-1/3 border-fuchsia-600 border-b">
                                                                Play the Games
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {uploadedGames.map((game) => (
                                                            <tr key={game.id} className="h-20 odd:bg-gray-700">
                                                                <td>{game.name}</td>
                                                                <td>{game.description}</td>
                                                                <td>
                                                                    <button onClick={() => handleInputChange(game.path, game.id)}>PLAY</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table> :
                                                <svg aria-hidden="true" className="inline-flex items-center w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div className="p-10 text-center bg-gray-800 text-white font-bold rounded-lg">
                        <p className="mb-6 text-lg lg:text-2xl sm:px-16 xl:px-48 dark:text-gray-400">
                            {t('profileNotLoggedIn')}
                        </p>
                        <p className="mb-6 text-lg lg:text-2xl sm:px-16 xl:px-48 dark:text-gray-400">
                            {t('userNotLoggedError')}
                        </p>
                        <div className='flex justify-center uppercase'>
                            <div className='mr-2'>
                                <NavLink to="/login">
                                    <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-purple-800 rounded-lg hover:bg-purple-900 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                                        {t('logIn')}
                                    </a>
                                </NavLink>
                            </div>
                            <div className='ml-2'>
                                <NavLink to="/signin">
                                    <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-purple-800 rounded-lg hover:bg-purple-900 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                                        {t('signIn')}
                                    </a>
                                </NavLink>
                            </div>

                        </div>
                    </div>
                </div>
            }
        </div >
    );
};

export default UserInfo;

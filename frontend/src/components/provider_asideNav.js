import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { actions } from './store';
import Navbar from './navbar.js'
import { Routes, Route } from "react-router-dom";
import Games from '../pages/games'
import Home from '../pages/home'
import Profile from '../pages/userInfo.js';
import OtherProfile from '../pages/otherUserInfo.js'
import Upload from '../pages/upload.js';
import Update from '../pages/update.js';
import Signin from '../pages/signin'
import LoginForm from '../pages/login.js'
import Game from '../pages/plataforma.js'
import GetRanking from '../pages/ranking.js'
import GetGameStore from '../pages/storeItems.js'
import React, { useState } from 'react';
import Guide from '../pages/guide.js';
import Swal from "sweetalert2";

function AsideNav({ socket }) {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const dispatch = useDispatch();
    const storeItems = useSelector((state) => state.storeItems);
    const boughtItems = useSelector((state) => state.boughtItems);
    const userInfo = useSelector((state) => state.data);
    const [sharedValue, setSharedValue] = useState('');
    const [sharedId, setSharedId] = useState('');

    const handleSharedValueChange = (newValue) => {
        dispatch(actions.savePathGame(newValue));
        setSharedValue(newValue);

    };

    const handleSharedIdChange = (newValue) => {
        dispatch(actions.saveGameInfo(newValue));
        setSharedId(newValue)
    }

    function logout() {
        dispatch(actions.logout());
        localStorage.setItem('access_token', "0");
        Swal.fire({
            position: "bottom-end",
            icon: "info",
            title: "You have successfully loged out",
            showConfirmButton: false,
            timer: 1500,
        });
    }

    function avatar() {
        let imgAvatar = "";

        if (isLoggedIn) {
            if (boughtItems.length > 0) {
                const matchingItems = boughtItems.filter(item => item.avatar && item.userId === userInfo.id);
                if (matchingItems.length > 0) {
                    const userAvatarItem = storeItems.find(item => item.id === matchingItems[0].itemId);
                    imgAvatar = userAvatarItem.image_url;
                } else {
                    imgAvatar = "Controller.jpg";
                }
            } else {
                imgAvatar = "Controller.jpg";
            }
        }
        return imgAvatar
    }

    return (
        <div className="h-screen w-full bg-white relative flex overflow-hidden">
            <aside className="h-full w-10 md:w-13 lg:w-16 flex flex-col space-y-10 items-center justify-center relative bg-gray-800 text-white">
                <NavLink to="/profile">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                        {isLoggedIn ?
                            <img id="avatar_img" className="h-8 w-9 md:h-10 md:w-12 lg:h-10 lg:w-12 rounded-full" src={avatar()} alt=""></img>
                            : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        }

                    </div>
                </NavLink>
                <NavLink to="/ranking">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bar-chart-line" viewBox="0 0 16 16">
                            <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z" />
                        </svg>
                    </div>
                </NavLink>

                {isLoggedIn ?
                    <NavLink to="/store">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-basket2" viewBox="0 0 16 16">
                                <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0v-2z" />
                                <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6H2.163z" />
                            </svg>
                        </div>
                    </NavLink> :
                    null
                }

                {isLoggedIn ?
                    <NavLink to="/">
                        <div onClick={() => logout()} className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </div>
                    </NavLink> :
                    null
                }
            </aside>



            <div className="w-full h-full flex flex-col justify-between">

                <Navbar></Navbar>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<Games sharedValue={sharedValue} onSharedValueChange={handleSharedValueChange} sharedId={sharedId} onSharedIdChange={handleSharedIdChange} />} />
                    <Route path="/upload" element={<Upload socket={socket} />} />
                    <Route path="/update" element={<Update socket={socket} />} />
                    <Route path="/profile" element={<Profile socket={socket} />} />
                    <Route path="/otherProfile" element={<OtherProfile sharedValue={sharedValue} onSharedValueChange={handleSharedValueChange} sharedId={sharedId} onSharedIdChange={handleSharedIdChange}/>} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/game" element={<Game socket={socket} sharedValue={sharedValue} sharedId={sharedId} />} />
                    <Route path="/ranking" element={<GetRanking />} />
                    <Route path="/store" element={<GetGameStore />} />
                    <Route path="/guide" element={<Guide />} />

                </Routes>
            </div>

        </div>
    )

}

export default AsideNav;
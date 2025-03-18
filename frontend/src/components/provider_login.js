import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store, actions } from './store';
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from "sweetalert2";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('access_token');
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (data.isLoggedIn) {
                dispatch(actions.login());
                store.dispatch(actions.saveData(data[1]));
                localStorage.setItem('access_token', data[0]);
                navigate("/")

                Swal.fire({
                    position: "bottom-end",
                    icon: "success",
                    title: "You have successfully loged in",
                    showConfirmButton: false,
                    timer: 3500,
                });
            }else{
                Swal.fire({
                    position: "bottom-end",
                    icon: "error",
                    title: "Invalid Credentials",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            setLoading(false)
        } catch (error) {
            console.error(error);
            setLoading(false)
            Swal.fire({
                position: "bottom-end",
                icon: "error",
                title: "An error occurred while loading",
                showConfirmButton: false,
                timer: 1500,
            });
        }

        try {
            const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/getStoreItems`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const storeItems = await response.json();
            dispatch(actions.saveStoreItems(storeItems));
        } catch (error) {
            console.error(error);
        }

        try {
            const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/getBoughtItems`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const boughtItems = await response.json();
            dispatch(actions.saveBoughtItems(boughtItems));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="overflow-auto flex h-screen justify-center items-center min-h-screen bg-image-all bg-cover bg-no-repeat bg-center bg-fixed">
            {isLoggedIn ?
                <p>
                    {t('logInAlreadyLoggedIn')}
                </p> :
                <div className="g-6 flex h-full flex-wrap items-center justify-center">
                    <div className="w-full mb-14 rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
                        <div className="p-20">
                            <NavLink to="/">
                                <div className="text-center">
                                    <img
                                        className="m-auto w-74"
                                        src="LogoBuenoSNB.png"
                                        alt="logo" />
                                </div>
                            </NavLink>
                           
                            <br></br>
                            <br></br>
                            <form className="mt-5" onSubmit={handleSubmit} autoComplete="off">

                                <div className="relative z-0 w-full mb-6 group">
                                    <input value={email} autoComplete="off" onChange={(event) => setEmail(event.target.value)} type="email" name="floating_email" id="floating_email" className="block pt-4 px-0 w-full text-sm text-white  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-purple-600 peer" placeholder=" " required autoFocus />
                                    <label for="floating_email" className="peer-focus:font-medium absolute text-xl text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 font-bold peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{t('signInEmail')}</label>
                                </div>

                                <div className="relative z-0 w-full mb-6 group">
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="floating_password" id="floating_password" className="block pt-4 px-0 w-full text-sm text-white  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-purple-600 peer" placeholder=" " required />
                                    <label for="floating_password" className="font-bold text-xl peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{t('signInPassword')}</label>
                                </div>
                                <br></br>

                                <div className="mb-12 pb-1 pt-1 text-center">
                                    <button
                                        className="bg-gradient-to-r from-violet-400 to-fuchsia-800 mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                        type="submit" disabled={isLoading}
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                    >
                                        {isLoading ? (
                                            <div role="status">
                                                <svg aria-hidden="true" className="inline-flex items-center w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <span className="sr-only"></span>
                                            </div>
                                        ) : (
                                            <p>
                                                {t('logIn')}
                                            </p>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pb-6">
                                    <p className="mr-2 text-white">
                                        {t('logInNotAcc')}
                                    </p>
                                    <NavLink to="/signin">
                                        <button className="group relative h-10 w-36 border-2 overflow-hidden rounded-lg bg-transparent uppercase font-bold text-lg shadow" data-te-ripple-init data-te-ripple-color="light">
                                            <div className="absolute inset-0 w-3 bg-purple-400 transition-all duration-[500ms] ease-out group-hover:w-full"></div>
                                            <span className="relative text-white group-hover:text-black ">{t('signIn')}</span>
                                        </button>
                                    </NavLink>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            }


        </div>
    );
};

export default LoginForm;

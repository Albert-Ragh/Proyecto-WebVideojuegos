import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

function Signin() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            if (data.isRegistered) {
                navigate("/login")
                Swal.fire({
                    position: "bottom-end",
                    icon: "success",
                    title: "You have successfully registered",
                    showConfirmButton: false,
                    timer: 3500,
                });
            }

            setLoading(false);
        } catch (error) {
            Swal.fire({
                position: "bottom-end",
                icon: "error",
                title: "An error occurred while loading",
                showConfirmButton: false,
                timer: 1500,
            });
            setError(error);
            setLoading(false);
        }
    };

    return (
        <div className="overflow-auto flex h-screen justify-center items-center min-h-screen bg-image-all bg-cover bg-no-repeat bg-center bg-fixed">
            {isLoggedIn ?
                <p>
                    {t('signInAlreadyLoggedIn')}
                </p> :
                <div className="container h-full p-22">
                    <div
                        className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
                        <div className="w-full">
                            <div
                                className="block w-74 rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
                                <div className="g-0 lg:flex lg:flex-wrap">
                                    <div className="px-4 md:px-0 lg:w-6/12">
                                        <div className="md:mx-6 md:p-12">
                                            <div className="text-center">
                                                <img
                                                    className="mx-auto w-48"
                                                    src="LogoBuenoSNB.png"
                                                    alt="logo" />

                                            </div>
                                            <form onSubmit={handleSubmit}>

                                                <div className="relative z-0 w-full mb-6 group">
                                                    <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" type="text" name="floating_username" id="floating_username" className="block pt-4 px-0 w-full text-sm text-white  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-purple-600 peer" placeholder=" " required />
                                                    <label for="floating_username" className="peer-focus:font-medium absolute text-xl text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 font-bold peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                        {t('signInUsername')}
                                                    </label>
                                                </div>

                                                <div className="relative z-0 w-full mb-6 group">
                                                    <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="off" type="email" name="floating_username" id="floating_username" className="block pt-4 px-0 w-full text-sm text-white  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-purple-600 peer" placeholder=" " required />
                                                    <label for="floating_username" className="peer-focus:font-medium absolute text-xl text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 font-bold peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                        {t('signInEmail')}
                                                    </label>
                                                </div>

                                                <a className="text-neutral-500">
                                                    {t('signInEmailMustHave')}
                                                </a>
                                                <br></br><br></br>


                                                <div className="relative z-0 w-full mb-6 group">
                                                    <input value={password} onChange={(event) => setPassword(event.target.value)} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" autoComplete="off" type="password" name="floating_username" id="floating_username" className="block pt-4 px-0 w-full text-sm text-white  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-purple-600 peer" placeholder=" " required />
                                                    <label for="floating_username" className="peer-focus:font-medium absolute text-xl text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 font-bold peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                        {t('signInPassword')}
                                                    </label>
                                                </div>

                                                <a className="text-neutral-500">
                                                    {t('signInPasswordMustHave')}
                                                </a>

                                                <div className="mb-12 mt-10 pb-1 pt-1 text-center">
                                                    <button
                                                        className="relative bg-gradient-to-r from-violet-400 to-fuchsia-800 mb-3 w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
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
                                                            </div>
                                                        ) : (
                                                            <p>
                                                                {t('signIn')}
                                                            </p>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="flex mt-10 items-center justify-between pb-6">
                                                    <p className="mb-0 mr-2 text-white">
                                                        {t('signInAlreadyAcc')}
                                                    </p>
                                                    <NavLink to="/login">
                                                        <button
                                                            className="group relative h-10 w-36 border-2 overflow-hidden rounded-lg bg-transparent uppercase font-bold text-lg shadow"
                                                            data-te-ripple-init data-te-ripple-color="light"
                                                        >
                                                            <div className="absolute inset-0 w-3 bg-purple-400 transition-all duration-[500ms] ease-out group-hover:w-full"></div>
                                                            <span className="relative text-white group-hover:text-black ">
                                                                {t('logIn')}
                                                            </span>
                                                        </button>
                                                    </NavLink>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-violet-400 to-fuchsia-800 flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none">
                                        <div className="px-4 py-6 text-white md:mx-auto md:p-12">
                                            <img className="m-auto text-center" src="capoo-blue-cat.gif" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Signin;
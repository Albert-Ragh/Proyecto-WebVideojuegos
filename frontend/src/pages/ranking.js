import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { actions } from '../components/store.js';

function GetRanking() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/getRanking', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setUsers(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsers();
    }, []);

    function visitarPerfil(id) {
        dispatch(actions.getUserId({ id: id, visitor: true }));
        navigate("/otherProfile")
    }

    return (
        <div className="overflow-auto bg-image-all bg-cover bg-no-repeat bg-center bg-fixed flex h-screen justify-center items-center">
            <div className="container h-full w-full md:w-full lg:w-2/4 lg:p-5">
                <div className="block rounded-lg bg-gray-800 border-violet-300 shadow-lg dark:bg-neutral-800">
                    <div className="border-violet-300 border p-4">
                        <div className="md:mr-6 md:pr-12 md:ml-6 md:pl-12 md:mb-6 md:pb-12">
                            <div className="text-center">
                                <h1 className="font-mono text-white text-4xl mt-10 font-bold">
                                    {t('ranking')}
                                </h1>
                                <br></br>
                                {isLoading ? (
                                    <div
                                        className="m-12 inline-block h-8 text-white w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status">
                                        <span
                                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                        >{t('loading')}</span>
                                    </div>
                                ) : (
                                    <div>
                                        <table className="text-xl border-separate w-full text-sm text-left text-violet-100 dark:text-violet-100">
                                            <thead className="text-center text-xs text-white uppercase bg-violet-600 dark:text-white">
                                                <tr>
                                                    <th>
                                                        {t('rankingPos')}
                                                    </th>
                                                    <th>
                                                        {t('rankingPlayer')}
                                                    </th>
                                                    <th>
                                                        {t('rankingPScore')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {users.map((user, index) => (
                                                    <tr className="bg-violet-500 border-b border-violet-400 hover:bg-violet-600" key={user.id}>
                                                        <td className="w-1/3 px-6 py-4 font-medium text-violet-50 whitespace-nowrap dark:text-violet-100">
                                                            {index < 3 ? (
                                                                index === 0 ? (
                                                                    <img src="oro.png" alt="oro" className="mx-auto w-1/2" />
                                                                ) : index === 1 ? (
                                                                    <img src="plata.png" alt="plata" className="mx-auto w-1/2" />
                                                                ) : (
                                                                    <img src="bronce.png" alt="gold" className="mx-auto w-1/2" />
                                                                )
                                                            ) : (
                                                                index + 1
                                                            )}
                                                        </td>
                                                        <td className="w-1/3 text-white hover:text-sky-400 cursor-pointer">
                                                            <a onClick={() => visitarPerfil(user.id)}>{user.name}</a>
                                                        </td>
                                                        <td className="w-1/3">{user.totalScore}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default GetRanking;

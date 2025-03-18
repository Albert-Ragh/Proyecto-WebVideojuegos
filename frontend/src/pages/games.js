import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { actions } from '../components/store.js';
import { useTranslation } from 'react-i18next';

function Games({ onSharedValueChange, onSharedIdChange }) {
    const [fetchData, setFetchData] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    const handleInputChange = (path, id) => {
        onSharedValueChange(path);
        onSharedIdChange(id)
        navigate('/game');
    };

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/gamesList', {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                setFetchData(data)
            } catch (error) {
                this.setError(error);
            }
        }
        fetchGames();
    }, []);

    function visitarPerfil(id) {
        dispatch(actions.getUserId({ id: id, visitor: true, tab: "tab4" }));
        navigate("/otherProfile")
    }

    return (
        <div className="bg-image-arcade bg-cover bg-no-repeat bg-center flex h-screen justify-center items-center overflow-auto">
            <div className="flex mt-auto container w-3/4 p-10">
                <div className="flex grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
                    {fetchData.games ? (
                        fetchData.games.map((game) => (
                            <div key={game.id} className="flex flex-col h-full rounded-lg bg-gray-800 shadow-lg p-4">
                                <img className="flex h-36 w-48 object-cover rounded-t-lg md:rounded-none md:rounded-l-lg" src={process.env.REACT_APP_NODE_FITXERS_URL + game.img} alt="Game Image" />
                                <div className="flex flex-col justify-start p-6">
                                    <p className="mb-2 text-xl font-medium text-white">{game.name}</p>
                                    <p className="mb-4 text-base text-gray-400">{game.description}</p>
                                    <button onClick={() => handleInputChange(game.path, game.id)} className="bg-purple-500 hover:bg-purple-600 font-bold py-2 px-4 rounded text-white text-lg mt-auto self-end">
                                        {t('gamesPlay')}
                                    </button>
                                    <div className="text-center">
                                        <hr className="border-gray-600 mt-4 mb-4" />
                                        <p className="text-white text-lg font-bold relative group">
                                            {t('gamesCreatedBy')}<br />
                                            <a onClick={() => visitarPerfil(game.user.id)} className="cursor-pointer uppercase text-sm text-gray-400 group-hover:text-purple-500 transition-colors duration-300">{game.user.name}</a>
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-screen">
                            <div className="fixed top-0 left-0 right-0 flex items-center justify-center h-screen">
                                <div className="h-8 text-white w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                        {t('loading')}
                                    </span>
                                </div>
                            </div>
                        </div>

                    )}
                </div>

            </div>
        </div>






    )
}

export default Games;  

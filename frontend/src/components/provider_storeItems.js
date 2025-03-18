import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Tienda = () => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const token = localStorage.getItem('access_token');
    const [storeItems, setStoreItems] = useState([]);
    const [boughtItems, setBoughtItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userInfo = useSelector((state) => state.data);
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchStoreItems() {
            if (isLoggedIn) {
                try {
                    const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/getStoreItems`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const storeItems = await response.json();
                    setStoreItems(storeItems);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchStoreItems();

        async function fetchBoughtItems() {
            if (isLoggedIn) {
                try {
                    const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/getBoughtItems`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const boughtItems = await response.json();
                    setBoughtItems(boughtItems);
                    setIsLoading(true)
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchBoughtItems();
    }, []);

    async function buyItem(userId, itemId) {
        if (isLoggedIn) {
            try {
                const a = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/buyItems`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId, itemId }),
                });
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
                setBoughtItems(boughtItems);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const itemsToBuy = storeItems.filter(item => {
        return !boughtItems.some(boughtItem => boughtItem.userId === userInfo.id && boughtItem.itemId === item.id);
    });

    return (
        <div className="overflow-auto bg-image-all bg-cover bg-no-repeat bg-center bg-fixed flex h-screen justify-center items-center">
            <div className="text-center container h-full w-3/4 p-10">
                <div className="block rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
                    <div className="p-4">
                        <div className="md:mr-6 md:pr-12 md:ml-6 md:pl-12 md:mb-6 md:pb-12">
                            <h1 className="font-mono text-white text-4xl mt-10 font-bold md:pb-12">
                                {t('tiendaTitle')}
                            </h1>
                            <div className="justify-center text-white text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isLoggedIn ? (
                                    isLoading ? (
                                        itemsToBuy.length > 0 ? (
                                            itemsToBuy.map((item, id) => (
                                                <div className="flex flex-col text-black rounded-lg bg-purple-300 shadow-lg p-4" key={id}>
                                                    <h2 className='uppercase font-bold'>{item.name}</h2>
                                                    <br />
                                                    <div className="flex flex-col justify-start">
                                                        <img src={item.image_url} className="mx-auto w-48 h-48 object-cover" alt="Item Image" />
                                                        <br />
                                                        <p>{item.description}</p>
                                                        <br></br>
                                                        <div className="flex">
                                                            <div className="flex items-center justify-start">
                                                                <p>{t('itemsPrice')}: {item.price}</p>
                                                                <img className="inline w-10 h-10 ml-2" src="JeacstarNF.png" alt="JeacstarNF" />
                                                            </div>
                                                            <div className="flex items-center justify-end">
                                                                <button
                                                                    id={item.id}
                                                                    onClick={() => buyItem(userInfo.id, item.id)}
                                                                    className="bg-purple-500 hover:bg-purple-600 font-bold py-2 px-4 rounded text-white text-lg mt-auto self-end transition-colors duration-300"
                                                                >
                                                                    {t('storeBuyItem')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <br />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>{t('storeNoItemsLeft')}</p>
                                        )
                                    ) : (
                                        <div
                                            className="mx-[600px] inline-block h-8 text-white w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status">
                                            <span
                                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                            >{t('loading')}</span>
                                        </div>
                                    )
                                ) : (
                                    <p>{t('mensajeErrorNotLoggedInStore')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default Tienda;

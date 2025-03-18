import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';


let pathimagen = '';
let gameNamee = '';
let descriptionGame = '';
let pathScript = '';

const UpdateForm = ({ socket }) => {
    const [nameGame, setName] = useState('')
    const [img, setImg] = useState('')
    const [zip, setZip] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null);
    const [messageError, setMessageError] = useState("Error");

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const { t } = useTranslation();
    const userInfo = useSelector((state) => state.data);
    const uploadedGameId = useSelector((state) => state.uploadedGameId);
    const uploadedGameName = useSelector((state) => state.uploadedGameName);

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('message_error', function (msg) {

            setMessageError(msg);

            document.getElementById("popup").style.display = "block";
            setTimeout((() => {
                document.getElementById("popup").style.display = "none";
            }), 3000)
        });

        socket.on('update_complete', function (routes) {
            pathScript = routes.initGame;
            pathimagen = routes.img;
            hacerFetch(uploadedGameId);
        });

        return () => {
            socket.off('extraction_complete');
            socket.off('update_complete');
        };
    }, []);

    function UpdateGame(e) {
        e.preventDefault();

        let fileZip = document.getElementById("uploadZip").files[0];
        var fileImagen = document.getElementById("uploadImg").files[0];
        gameNamee = document.getElementById('nameGamee').value;
        descriptionGame = document.getElementById('descriptionGamee').value;
        let fileDataImg = null;

        if (fileZip && fileImagen) {

            const reader = new FileReader();
            reader.readAsDataURL(fileImagen);

            const reader2 = new FileReader();
            reader2.readAsDataURL(fileZip);

            reader.onload = (event) => {
                const fileData = {
                    name: fileImagen.name,
                    type: fileImagen.type,
                    data: event.target.result,
                };

                reader2.onload = (event) => {
                    const fileDataImg = {
                        name: fileZip.name,
                        type: fileZip.type,
                        data: event.target.result,
                    };

                    const Files = {
                        newName: nameGame,
                        currentName: uploadedGameName,
                        img: fileData,
                        zip: fileDataImg
                    }
                    socket.emit('file_update', Files);
                }
            }

        }
        else if (fileImagen && !fileZip) {


            const reader2 = new FileReader();
            reader2.readAsDataURL(fileImagen);

            reader2.onload = (event) => {
                let fileDataImg = {
                    name: fileImagen.name,
                    type: fileImagen.type,
                    data: event.target.result,
                };

                const fileData = {
                    name: fileImagen.name,
                    type: fileImagen.type,
                    data: event.target.result,
                };

                const file = {
                    newName: nameGame,
                    currentName: uploadedGameName,
                    img: fileDataImg
                }
                socket.emit('file_update', file);
            }
        }
        else if (!fileImagen && fileZip) {

            const readerZip = new FileReader();
            readerZip.readAsDataURL(fileZip);

            readerZip.onload = (event) => {
                let fileDataZip = {
                    name: fileZip.name,
                    type: fileZip.type,
                    data: event.target.result,
                };

                const file = {
                    newName: nameGame,
                    currentName: uploadedGameName,
                    zip: fileDataZip
                }

                socket.emit('file_update', file);


            }

        }
        else if (!fileImagen && !fileZip && nameGame != '') {
            const file = {
                newName: nameGame,
                currentName: uploadedGameName,
            }

            socket.emit('file_update', file);
        }
        else if (!fileImagen && !fileZip) {
            hacerFetch(uploadedGameId);
        }
    }

    async function hacerFetch(uploadedGameId) {
        try {
            let img = pathimagen;
            let script = pathScript;
            const formData = new FormData();

            if (gameNamee) {
                formData.append('name', gameNamee);
            }
            if (img) {
                formData.append('img', img);
            }

            if (descriptionGame) {
                formData.append('description', descriptionGame);
            }

            if (script) {
                formData.append('path', script);
            }

            const response = await fetch(process.env.REACT_APP_LARAVEL_URL + `/api/updateGame/${uploadedGameId}`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*'
                },
                body: formData,
            });
            if (!response.ok) {
                console.log('Error al actualizar el juego');
            } else {
                console.log('Juego actualizado correctamente');
                navigate("/profile")

            }
        } catch (error) {
            console.error('Error en la solicitud UPDATE:', error);
        }
    }


    const [activeTab, setActiveTab] = useState("tab1");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="overflow-auto flex h-screen justify-center items-center min-h-screen bg-image-all bg-cover bg-no-repeat bg-center bg-fixed">
            {isLoggedIn ?
                <div className=" container h-full w-3/4 p-10">
                    <div className="block rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
                        <div className="p-4">
                            <div className="text-center text-white">
                                <h1 className="font-mono text-white text-4xl mt-10 font-bold">{t('updateTitle')}</h1>
                                <br></br>
                                {activeTab === "tab1" &&
                                    <div>
                                        <form onSubmit={UpdateGame}>
                                            <div className="border-2 border-fuchsia-600 relative mb-4" data-te-input-wrapper-init>
                                                <label
                                                    htmlFor="exampleFormControlInput11"
                                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-white transition-all duration-200 ease-out peer-focus:-translate-y-[2rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                                                    {t('uploadName')}</label>
                                                <br></br>
                                                <input
                                                    className="text-white peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                    id="nameGamee" type='text' placeholder="Name" value={nameGame} onChange={(e) => { setName(e.target.value) }}>
                                                </input>
                                            </div>

                                            <div className="border-2 border-fuchsia-600 relative mb-4" data-te-input-wrapper-init>
                                                <label
                                                    htmlFor="exampleFormControlInput11"
                                                    className=" pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-white transition-all duration-200 ease-out peer-focus:-translate-y-[2rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                                                    {t('uploadImage')}</label>
                                                <br></br>
                                                <input
                                                    className="text-white peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                    id='uploadImg' type='file' accept="image/png, image/jpeg" value={img} onChange={(e) => setImg(e.target.value)}>
                                                </input>
                                            </div>

                                            <div className="border-2 border-fuchsia-600 relative mb-4" data-te-input-wrapper-init>
                                                <label
                                                    htmlFor="exampleFormControlInput11"
                                                    className=" pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-white transition-all duration-200 ease-out peer-focus:-translate-y-[2rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                                                    Zip</label>
                                                <br></br>
                                                <input
                                                    className="text-white peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                    id='uploadZip' type='file' accept=".zip,.rar,.7zip" value={zip} onChange={(e) => setZip(e.target.value)}>
                                                </input>
                                            </div>

                                            <div className="border-2 border-fuchsia-600 relative mb-4" data-te-input-wrapper-init>
                                                <label
                                                    htmlFor="exampleFormControlInput11"
                                                    className=" pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-white transition-all duration-200 ease-out peer-focus:-translate-y-[2rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                                                    {t('itemsDesc')}</label>
                                                <br></br>
                                                <input
                                                    className="text-white peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                    id="descriptionGamee" placeholder="Add a description" rows='5' cols='50' value={description} onChange={(e) => setDescription(e.target.value)}>
                                                </input>
                                            </div>
                                            <button className="text-white inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10" variant="primary">
                                                {t('uploadButton')}
                                            </button>
                                        </form>
                                    </div>
                                }
                                {activeTab === "tab2" &&
                                    <></>
                                }
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
}

export default UpdateForm;
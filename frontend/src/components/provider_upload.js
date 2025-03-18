import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { NavLink } from 'react-router-dom';

let pathimagen = '';
let gameNamee = '';
let descriptionGame = '';
let pathScript = '';

const UploadForm = ({ socket }) => {
    const [nameGame, setName] = useState('')
    const [img, setImg] = useState('')
    const [zip, setZip] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null);
    const [messageError, setMessageError] = useState("Error");

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const { t } = useTranslation();
    const userInfo = useSelector((state) => state.data);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('message_error', function (msg) {
            setMessageError(msg);

            document.getElementById("popup").style.display = "block";
            setTimeout((() => {
                document.getElementById("popup").style.display = "none";
            }), 3000)
        });
        return () => {
            socket.off('extraction_complete');
        };
    }, []);

    function UploadGame(e) {
        e.preventDefault();

        let file = document.getElementById("uploadZip").files[0];
        var fileImagen = document.getElementById("uploadImg").files[0];
        gameNamee = document.getElementById('nameGamee').value;
        descriptionGame = document.getElementById('descriptionGamee').value;

        const reader = new FileReader();
        reader.readAsDataURL(fileImagen);

        const reader2 = new FileReader();
        reader2.readAsDataURL(file);

        reader.onload = (event) => {
            const fileData = {
                name: fileImagen.name,
                type: fileImagen.type,
                data: event.target.result,
            };

            reader2.onload = (event) => {
                const fileDataImg = {
                    name: file.name,
                    type: file.type,
                    data: event.target.result,
                };

                console.log("fileDataImg", fileDataImg);
                console.log("fileData", fileData);


                const Files = {
                    name: nameGame,
                    img: fileData,
                    zip: fileDataImg
                }
                console.log("ASjksdhfkdhfasfkljd", Files);
                socket.emit('file_upload', Files);
            }
        }

        socket.on('extraction_complete', function (path) {
            pathScript = path.initGame;
            pathimagen = path.img;
            hacerFetch();
        });
    }

    async function hacerFetch() {
        try {
            let img = pathimagen;
            let script = pathScript;
            const formData = new FormData();
            formData.append('user_id', userInfo.id)
            formData.append('name', gameNamee);
            formData.append('img', img);
            formData.append('description', descriptionGame);
            formData.append('path', script);
            const response = await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/upload', {
                method: 'POST',
                headers: {
                    'Accept': '*/*'
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            } else {
                console.log('Juego subido correctamente');
                navigate("/games")
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "The uploading have not been completed correctly. Please try again",
                    html: "Remember to upload the type of file you play and that the game has the necessary functions",
                    showConfirmButton: false,
                    timer: 3500,
                });

            }
            const data = await response.json();
            Swal.fire({
                position: "center",
                icon: "succes",
                title: "The uploading have been completed correctly",
                // description: "Remember to upload the type of file you play and that the game has the necessary functions",
                showConfirmButton: false,
                timer: 3500,
            });
        } catch (error) {
            setError(error);
        }
    }

    return (
        <div className="overflow-auto flex h-screen justify-center items-center min-h-screen bg-image-all bg-cover bg-no-repeat bg-center bg-fixed">
            <div id="popup" className="hidden">{messageError}</div>
            {isLoggedIn ?
                <div className="container h-full w-3/4 p-10">
                    <div className="block rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
                        <div className="p-4">
                            <div className="text-white">
                                <h1 className="text-center font-mono text-white text-4xl mt-10 font-bold">{t('uploadtitle')}</h1><br>
                                </br>
                                <div>
                                    <form onSubmit={UploadGame}>
                                        <div className="flex mb-6">
                                            <div className="relative z-0 w-1/2 mr-2 group">
                                                {/* INPUT NOMBRE */}
                                                <div className="relative z-0 w-full mb-6 group">
                                                    <input value={nameGame} onChange={(e) => { setName(e.target.value) }} type="text" name="nameGamee" id="nameGamee" autoComplete='off' className="block pt-4 px-0 w-full text-sm text-white  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-purple-600 peer" placeholder=" " required />
                                                    <label for="nameGamee" className="font-bold text-xl peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                        {t('uploadName')}
                                                    </label>
                                                </div>
                                            </div>
                                            {/* INPUT DESCRIPCION */}
                                            <div className="relative z-0 w-full mb-6 group">
                                                <input value={description} onChange={(e) => { setDescription(e.target.value) }} type="text" name="descriptionGamee" id="descriptionGamee" autoComplete='off' className="block pt-4 px-0 w-full text-sm text-white  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-purple-600 peer" placeholder=" " required />
                                                <label for="descriptionGamee" className="font-bold text-xl peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    {t('itemsDesc')}
                                                </label>
                                            </div>
                                        </div>
                                        {/* ARCHIVOS */}
                                        <div className='flex justify-center p-6 text-black'>

                                            {/* IMAGEN */}
                                            <div className="border-4 border-fuchsia-600 relative mb-4 rounded-md mr-2" data-te-input-wrapper-init>
                                                <label
                                                    htmlFor="exampleFormControlInput11"
                                                    className=" font-bold pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-white transition-all duration-200 ease-out peer-focus:-translate-y-[2rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">

                                                    {t('uploadImage')} </label>
                                                <br></br>
                                                <br></br>
                                                <input
                                                    className="text-white peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                    id='uploadImg' type='file' accept="image/png, image/jpeg" value={img} onChange={(e) => setImg(e.target.value)} required>
                                                </input>
                                            </div>
                                            {/* ZIP */}
                                            <div className="border-4 border-fuchsia-600 rounded-md relative mb-4" data-te-input-wrapper-init>
                                                <label
                                                    htmlFor="exampleFormControlInput11"
                                                    className=" font-bold pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-white transition-all duration-200 ease-out peer-focus:-translate-y-[2rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                                                    {t('zipGame')}
                                                </label>
                                                <br></br>
                                                <br></br>
                                                <input
                                                    className="text-white peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                    id='uploadZip' type='file' accept='.zip' value={zip} onChange={(e) => setZip(e.target.value)} required>
                                                </input>
                                            </div>
                                        </div>
                                        <div className='flex justify-center mt-10'>
                                            {/* <NavLink to="/"> */}
                                                <button href="#_" className="relative inline-flex items-center justify-center py-10 px-40 p-20 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-xl shadow-md group">
                                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                                                        <svg fill="#000000" height="200px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.768 512.768" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(0 -1)"> <g> <path d="M504.233,6.244c-5.695-4.828-13.841-6.8-22.394-2.912L12.506,216.665c-16.337,7.426-16.764,30.477-0.713,38.502 l145.331,72.666l-7.767,163.239c-0.858,18.029,19.667,28.91,34.107,18.082l78.318-58.726l40.67,54.494 c10.136,13.582,31.299,10.491,37.128-5.422L511.358,30.573C515.039,20.522,511.111,11.419,504.233,6.244z M392.393,90.856 L233.58,249.669l-45.937,45.72L70.87,237.003L392.393,90.856z M194.13,447.828l3.938-82.764l38.194,51.172L194.13,447.828z M313.074,447.819l-92.868-124.435l43.527-43.527l174.484-173.664L313.074,447.819z"></path> </g> </g> </g></svg>
                                                    </span>
                                                    <span className="absolute flex items-center justify-center w-full h-full uppercase text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                                                        {t('uploadButton')}
                                                    </span>
                                                    <span className="relative invisible ">{t('uploadButton')}</span>
                                                </button>
                                            {/* </NavLink> */}
                                        </div>
                                    </form>
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
}

export default UploadForm;
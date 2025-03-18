import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
    const { t } = useTranslation();

    return (
        <div className="flex h-screen justify-center items-center min-h-screen bg-image-all bg-cover bg-no-repeat bg-center bg-fixed" >
            <div className="text-center">
                <img src="LogoBuenoSNB.png" className="inline-flex items-center rounded-full"></img>
                <p className="mb-6 mt-6 text-xs md:text-lg lg:text-lg font-normal text-white lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                    {t('textoLanding')}
                </p>
                <div>
                    <NavLink to="/games">
                        <div className="m-auto border-transparent">
                            <button href="#" className="w-1/2 h-20 relative inline-flex items-center justify-start font-bold transition duration-500 hover:scale-125 bg-gradient-to-r from-violet-400 to-fuchsia-500 rounded-full text-xl font-roboto">
                                    <div className='m-auto flex'>
                                        <p className=''>{t('playLanding')}</p>
                                        <svg className="w-5 h-5 ml-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>                       
                                    </div>
                            </button>
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Home;
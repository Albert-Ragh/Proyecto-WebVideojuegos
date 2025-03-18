function Guide() {


    return (
        <div className="overflow-auto bg-image-all bg-cover bg-no-repeat bg-center bg-fixed flex h-screen justify-center items-center ">
            <div className="container h-full w-3/4 p-10">
                <div className="block rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
                    <div className="p-4">
                        <h2 className="font-mono text-white text-center  text-4xl mt-10 font-bold">GUÍA CREACIÓN DE JUEGO</h2>
                        <div className="md:m-6 md:p-12">
                            <div className="text-white text-xl">

                                <p>En Jeacs Games nos esforzamos por brindarte una experiencia sencilla y conveniente al subir tus
                                    juegos. Para lograrlo, hemos desarrollado nuestra API, que te permite cargar juegos desarrollados en Phaser sin la
                                    necesidad de hosting adicional. Una vez que subas tu juego en la sección de "Upload", aparecerá en nuestra aplicación
                                    web y los usuarios podrán disfrutarlo.</p><br></br>

                                <p>Nuestra aplicación también incluye un modo multijugador, lo que significa que solo tendrás que agregar algunas
                                    funciones adicionales a tu script.</p><br></br>

                                <p>A continuación, te proporcionamos detalles sobre los elementos mínimos que tu juego necesita para ser compatible
                                    con nuestra aplicación.</p><br></br>

                                <p>  En primer lugar, descarga nuestra plantilla, la cual contiene los scripts básicos necesarios para configurar el
                                    juego.</p><br></br>
                                    
                                <div className = "text-center"><a className = "underline text-cyan-500" href = "Plantilla.zip" download = "Plantilla.zip">PLANTILLA JUEGO BASE "game.js"</a></div><br></br>

                                <p> Seguidamente, te explicaremos las variables y funciones esenciales que podrás modificar según tus necesidades.</p>
                                <br></br><br></br>


                                <h1 className="text-3xl font-bold text-center ">configGame</h1><br></br>

                                <p>Configuración inicial del juego donde se detalla si el juego va a ser multijugador o “single player”, como
                                    creador del juego tú puedes decidir, además puedes definir el máximo de jugadores por sala.</p><br></br>

                                <img src="imageN1.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img>
                                <br></br>

                                <p>Dentro de la variable tienes que definir:</p><br></br>

                                <p className = "text-center">-Si el juego es de un solo jugador, puede ser true o false</p><br></br>

                                <p className = "text-center">-Si el juego tiene multijugador, puede ser true o false</p><br></br>

                                <p className = "text-center">-El número de jugadores máximos que se pueden unir</p><br></br>

                                <p>El nombre de las variables tiene que ser el mismo que el de la imagen.</p><br></br>

                                <p>Más adelante se específica dónde llamar a esta variable.</p><br></br><br></br>

                                <h1 className="text-3xl font-bold text-center ">Función init</h1><br></br>

                                <img src="imageN2.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br>
                                
                                <p>La función init, se utiliza para iniciar el juego, se le pasan dos funciones desde la plataforma, una para enviar
                                información del juego a otros jugadores y la otra para indicar el final del juego.</p><br></br>
                                
                                <p>En esta función puedes añadir diferentes opciones como physics y scenes en el ejemplo. type, width, height y
                                canvas no se deberían modificar.</p><br></br>
                                
                                <p>La variable game debe declararse como variable global fuera del init.</p><br></br><br></br>


                                <h1 className="text-3xl font-bold text-center ">Función preload</h1><br></br>
                                
                                <p>En la función preload deberías añadir las imágenes necesarias para el funcionamiento del juego, para ello hay que
                                añadir el nombre de la imagen y la ruta de esta, la ruta tiene que ser la siguiente:</p><br></br>
                                
                                <p className = "italic">./fitxers/GamesFiles/nombreDelJuego/rutaImagenes</p><br></br>
                                
                                <p>Por ejemplo:</p><br></br>

                                <img src="imageN3.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br><br></br>

                                <h1 className="text-3xl font-bold text-center ">Función sendInfoGame</h1><br></br>
                               
                                <p>Esta es una función de nuestra plataforma, se le pasa al init como variable para que se ejecute al iniciar el 
                                    juego. Se utiliza para mandar la información del juego a la plataforma y al node para que los demás usuarios 
                                    puedan verlo.</p><br></br>
                                
                                <p>Esta función se llamará cuando se creen los objetos del juego, se le pasa un array con toda la información, un
                                ejemplo sería el siguiente código:</p><br></br>

                                <img src="imageN4.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br>

                                
                                <p>En este caso se crea un array infoGame y se le pasa a sendInfoGame como parámetro. El nombre del array puede
                                cambiar para cada juego.</p><br></br><br></br>

                                <h1 className="text-3xl font-bold text-center ">Función recibirInfoFromPlatform</h1><br></br>

                                
                                <p>Esta función recibe la información que se ha enviado a la plataforma por sendInfoGame de vuelta, cada usuario
                                puede gestionar esa información como vea conveniente.</p><br></br><br></br>

                                <h1 className="text-3xl font-bold text-center ">Función recibirInfoLobby</h1><br></br>

                                
                                <p>Esta función recibe la información del lobby, cada usuario puede utilizar esta información a su favor para la
                                creación del juego. Se recibe el identificador del lobby, los miembros con su id, el username y si son “owner” de
                                la sala o no, el id del owner y el id propio.</p><br></br>

                                
                                <p>En los juegos multijugador el “owner” de la sala es quien crea los objetos y se los envía a los demás jugadores,
                                por lo que esta información puede ser importante.</p><br></br>

                                <img src="imageN5.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br><br></br>

                                <h1 className="text-3xl font-bold text-center ">Función userLeft</h1><br></br>

                               
                                <p>Gestiona los usuarios que han abandonado el lobby, en caso de ser el owner del lobby quien abandona la sala
                                podría suponer errores en el juego, por lo que se podrá gestionar con esta función. </p><br></br>

                                <img src="imageN6.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br><br></br>

                                <h1 className="text-3xl font-bold text-center ">Función destroyGame</h1><br></br>

                                
                                <p>Función que se utiliza para eliminar el juego una vez el jugador abandona la página o la recarga, se puede
                                copiar y pegar de la plantilla tal cual está y no debería modificarse.</p><br></br>

                                <img src="imageN7.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br><br></br>

                                <h1 className="text-3xl font-bold text-center ">Función finalJuego</h1><br></br>
                                
                                
                                <p>Igual que la función sendInfoGame es una función de nuestra plataforma, a esta función se le pasa la variable
                                utilizada para guardar la puntuación del jugador como parámetro, se utiliza para avisar al servidor que el
                                juego ha llegado a su fin. Cada usuario la implementará de acuerdo a sus preferencias.</p><br></br>

                                
                                <p>Un ejemplo de implementación:</p><br></br>

                                <img src="imageN8.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br>

                                
                                <p>En el caso de este juego, cuando el contador llega a 0 se ejecuta la función con la puntuación total del
                                usuario.</p><br></br>

                                
                                <p>Finalmente, para poder ejecutar el script se necesita la función executeGame, está establecido en la plantilla
                                y no debería ser modificado.</p><br></br>

                                <img src="imageN9.png" className = "mx-auto border-2 rounded border-fuchsia-500"></img><br></br>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Guide;
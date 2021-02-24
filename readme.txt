instalando:
express: npm install --save express
nodemon: npm install --save-dev nodemon
express-validator:  npm install --save express-validator --> validaciones de todo tipo 
slug: npm install --save slug -->crear urls amigables
shortid: npm i shortid --> generador de id
Para el delete
babel-loader: (webpack,babel-loader,babel) --> npm install -D babel-loader @babel/core @babel/preset-env webpack
concurrently: npm i --save concurrently
--
--
axios y sweetalert2 : npm i --save axios sweetalert2
--
--
una secuencia logica para hacer un endpoint nuevo seria:
1-crear la ruta
2-crear controlador (probarlo desde el browser)
3-Hacemos la Vista (en esta parte incluimos un partial)
4-para probar hasta aqui lo hacemos poniendo la rura en el browser 
5-trabajamos en la Vista
6-creamos el modelo
7-importamos en modelo en el index (al salvar se deberia crear la tabla en el esquema)
--
--
8-incorporamos al router el metodo(post) de crearCuenta del contolador usuario
9- creamos ese metodo en el controlador
10- para encriptar los password instalamos bcryp --> npm i --save bcrypt-nodejs
11- vamos al  modelo y colocamos un hooks: linea 19
--
--
-- Validando ususarios en el servidor
1- instalamos lib de alertas y mensajes connect-flash, npm i --save connect-flash
2- la importamos en el index.js
3- lo hacemos parte de nuestra variables locales (lin 43)
4- lo cacheo en el controlador (linea 23)
5- lo renderizo a la vista (linea 25)
--
--
-- para que esto funcione debemos instalas dos librerias mas
1- npm i --save cookie-parser express-session
2- las importamos al index (principal)
--
-- Passport para autenticaciones
1- npm i --save passport
2- en la carpeta config, crear file passport.js
3- instalamos passport-local (asi nos autenticaremos) npm i --save passport-local
--
-- para poner a funcionar la autenticacion creamos un controlador nuevo authController
--
--
-- Haciendo restablecer password
1- en la vista de iniciarSesion incorporamos el enlace
2- en rotes incorpramos la nueva ruta
3- vamos a ususriosController y hacemos en metodo
4- creamos la vista reestablecer.pug
5- volvemos al router para hacer la verificvacion del usuario, creamos el post correspondiente
   haciendo un metodo enviarToken
--
--
-- Instalando nodemailer para envio de correos: 
    npm i --save nodemailer juice html-to-text
    tambien vamos a instalar mailtrap: hacer una cuenta y usamos SMTP
1- en config creamos email.js y copiamos las credenciales de mailtrap
2- creamos en raiz carpeta handlers y dentro de esta email.js
3- para el contenido de los email, creamos carpeta email en views, y dentro de esta un fichero.pug
--
--
-- Preparando pra el deploiment
1- Variables de entorno: creamos file variables.env en principal
    declaramos variables e instalamos: npm i --save dotenv y setiamos las variables en nuestro db.js
2- seguimos agregando variables y las importamos al index.js principal line 10 y las usamos
    a partir de la linea 85



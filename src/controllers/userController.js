const bcryptjs = require('bcryptjs');//para encriptar contrasenias
const {validationResult} = require('express-validator'); //validationResult es una funcion que tambien nos lo da express-validator 
//models
const User = require('../models/User')

const controlador ={ //IMPORTANTE
    /************Crear Usuario***************/
    register:(req, res)=>{
        return res.render('register');
    },
    processRegister:(req,res)=>{
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0){//resultValidation.errors es un objeto literal
        return res.render('register', {
            errors: resultValidation.mapped(), //mapped: pasa la variable resultValidation a literiario 
            oldData: req.body //Para mostrar los datos bien ingresados
            });
        }

        //Validamos si ya existe el mail ingresado antes de cargar el usuario nuevo
        let userInDB = User.findByField('email', req.body.email)
        if (userInDB){
            return res.render('register', {
                errors: {
                    email: {msg:'Este email ya esta registrado'}
                }, //mapped: pasa la variable resultValidation a literiario 
                oldData: req.body //Para mostrar los datos bien ingresados
                }) ; 
        }

        //crear el ususario
        let userToCreate = {//no me qedo entendido .. creo que es oara sacar el pash y no mostrar toda la infomacion del la ruta
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),//le doy el password del body y el dias es la encriptacion
            image: req.file.filename
        }

        let userCreated = User.create(userToCreate);//ejecuta los comandos de create de User.js
        return res.redirect('/user/login')
    },
    /******************LOGIN ***************/
    loguearse:(req, res)=>{
        return res.render('login');
    },
    processLoguearse:(req, res) => {
        let userToLogin = User.findByField('email', req.body.email);//etiar el login ejs
        //return res.send(userToLogin)
        //console.log(userToLogin)
        if (userToLogin){//si obtuve algo es true
            
            //si el mail es encontrado en DB  
                                                         //lo que viene     //lo que tengo en DB
            let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
            //console.log(isOkThePassword)
            if(isOkThePassword){
                return res.send('Oka podes ingresar')
            }

            //si el password no es valido
            return res.render('login', {
            errors: {
                email: {msg:'Las credenciales no son validas'}
            }
            })
            console.log(isOkThePassword)
        }

        //si el email no se encuentra
        return res.render('login', {
            errors: {
                email: {msg:'No se encontro el email en DB'}
            }
        })
    } 
}

        //exportamos el objeto literal con sus metodos
        module.exports = controlador;
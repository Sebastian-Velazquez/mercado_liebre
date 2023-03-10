//es un middleware de aplicaion o global. Se colocan en app.js// estos siempre estan ejecuandose, o cada vista y elementos.



const User = require("../../models/User")

function userLoggedMiddleware(req, res, next) {
    res.locals.isLogged = false;

    //Para loguear automaticamente a un usuario si esta en cookie
    let emailInCookie = req.cookies.userEmail;  //para guardar el usario de la cookie si esta
    let userFromCookie = User.findByField('email', emailInCookie);
    //console.log(userFromCookie);

    if (userFromCookie){//si hay usuario - guarda es session para cuando session pregunte si hay alguien.. ya cookie guardo uno
        req.session.userLogged = userFromCookie;
    } 

    //para trabajar en las vistas que el con los datos para rederizar las vistas como por ejemplo, no mostrar una parte si el usuario esta logueado
    if(req.session && req.session.userLogged){
    res.locals.isLogged = true;
    //pasa las variables que tiene en session a locals
    res.locals.userLogged = req.session.userLogged;//para poder usar variables locales que puedan ser usadas en distitas vistas.
    }
    

    next(); 
}
module.exports = userLoggedMiddleware;
var users = {
				admin: {id:1, username:"admin", password:"1234"},
				pepe: {id:2, username:"pepe", pasword:"5678"}
			};

//Comprueba si el usuario está registrado en user
//Si autenticación falla o hay errores se ejectua callback(error)
exports.autenticar = function(login, password, callback){
	if(users[login]){
		if(password === users[login].password){
			callback(null, users[login]);
		} else {
			callback(new Error('Password erroneo'));
		}
	} else {
		callback(new Error('No existe el usuario'));
	}
};
var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
								{dialect: "sqlite", storage: "quiz.sqlite"});
								
// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz // exportar definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DV
sequelize.sync().success(function(){
	//sucess(..) ejecutra el manejador una vez creada la tabla
	Quiz.count().success(function (count){
		if(count === 0){ // La tabla se incializa solo si está vacía
			Quiz.create({
							pregunta: 'Capital de italia',
							respuesta: 'Roma'
						})
			.success(function(){console.log('Base de datos incializada')});
		};
	});
});
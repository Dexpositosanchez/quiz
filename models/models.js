var path = require('path');

// Postgress DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name,user,pwd,
	{
		dialect : dialect,
		protocol: protocol,
		port:     port,
		host:     host,
		storage:  storage, // solo SQLite (.env)
		omitNull: true //Solo Postgress
	}
);
								
// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Quiz en comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// exportar definición de tablas
exports.Quiz = Quiz;
exports.Comment = Comment; 

// sequelize.sync() crea e inicializa tabla de preguntas en DV
sequelize.sync().then(function(){
	//sucess(..) ejecutra el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count === 0){ // La tabla se incializa solo si está vacía
			Quiz.create({
							pregunta: 'Capital de Italia',
							respuesta: 'Roma',
							tema: 'otro'
						});
			Quiz.create({
							pregunta: 'Creador de Linux',
							respuesta: 'Linus Torvalds',
							tema: 'tecnología'
						})
			.then(function(){console.log('Base de datos incializada')});
		};
	});
});
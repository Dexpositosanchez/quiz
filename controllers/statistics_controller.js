var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res){
	var stats = {
				countQuiz: 0,
				countComments: 0,
				average: 0,
				whitOutComments: 0,
				whitComments: 0			
	};
	//SQlite no acepta campos booleanos, así que lo convierto a 1
	var publish = true;
	if(models.dialect === 'sqlite'){
		publish = 1;
	}
	
	models.Quiz.findAndCountAll().then(function(result){
		stats.countQuiz = result.count;
		models.Comment.findAndCountAll({where:{publicado: true}}).then(function(result){
			stats.countComments = result.count;
			stats.average = stats.countComments / stats.countQuiz;
			models.Sequelize.query('SELECT count(*) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments" WHERE "publicado" = '+publish+')',
			{type: models.Sequelize.QueryTypes.SELECT}).then(function(result){
				stats.whitComments = result[0].n;
				stats.whitOutComments = stats.countQuiz - stats.whitComments;
				res.render('quizes/statistics', {stats: stats, errors:[]});
			});
		});
	});
	
};
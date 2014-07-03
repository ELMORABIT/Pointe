$(document).ready(function(){
	DB.getInstance();
});
var params = {
	db: 'admin', 						//nom de la BDD
	version: '1.0',						//version
	displayName: 'admin Database',		//nom de la BDD affiché
	maxSize: 100000						//en bytes
};
var DB = {};
/**
  * Renvoi l'instance unique de la connexion à la base de données locale, null si erreur
  */
DB.getInstance = function()
{
	if(DB.instance!=null) return DB.instance;
	try
	{
		if(window.openDatabase)
		{
			DB.instance = openDatabase(params.db,params.version,params.displayName,params.maxSize);
			createDB();
			return DB.instance;
		}
		else
		{
			alert("Le navigateur ne supporte pas les bases de données.");
		}
	}
	catch(e)
	{
		if(e===2) console.log("Version de la base de données invalide.");
		else console.log("Exception : "+e);
	}
	DB.instance = null;
	return null;
};
/**
  * Crée la base de données locale si elle n'existe pas
  */
createDB = function()
{
	DB.getInstance().transaction(
	function (trans) {
		trans.executeSql('CREATE TABLE IF NOT EXISTS personne (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, login TEXT NOT NULL, pwd TEXT NOT NULL);', [], refreshHandler, errorHandler);
	});
};
/**
  * Supprime une entrée dans la base de données
  */
deleteData = function(id)
{
	DB.getInstance().transaction(
	function (trans) {
		trans.executeSql('DELETE FROM personne WHERE id=?;', [id], refreshHandler, errorHandler);
	});
};
/**
  * Sélectionne tous les tuples de la base de données
  */
selectAll = function()
{
	DB.getInstance().transaction(
	function (trans) {
		trans.executeSql('SELECT * FROM personne;', [], dataSelectAllHandler, errorHandler);
	});
};
/**
  * Sélectionne tous les tuples de la base de données
  */
insertData = function()
{
	if($('#login').val()!='' && $('#pwd').val()!=''){
		DB.getInstance().transaction(
		function (trans) {
			trans.executeSql('INSERT INTO personne (login, pwd) VALUES (?,?);', [$('#login').val(),$('#pwd').val()], refreshHandler, errorHandler);
		});
	}
};
/**
  * Efface les données du formulaire
  */
resetForm = function()
{
	$('#login').val('');
	$('#pwd').val('');
};

////////////////////////////////////////////////////////////////////
// EVENTS
////////////////////////////////////////////////////////////////////

/**
  * Rafraichi les données affichées
  */
refreshHandler = function(trans, result)
{	
	resetForm();
	selectAll();
};
/**
  * Rafraichi les données affichées
  */
dataSelectAllHandler = function(trans, result)
{
	$('#personnes').html('');
	var el = $('<ul></ul>');
	for (var i=0; i<result.rows.length; i++) 
	{
		el.append('<li>'+result.rows.item(i)['id']+' : '+result.rows.item(i)['login']+' '+result.rows.item(i)['pwd']+' <a href="javascript:deleteData('+result.rows.item(i)['id']+')">Supprimer</a></li>');
	}
	$('#personnes').append(el);
};
/**
  * Traitement des erreurs
  */
errorHandler = function(trans, error){
	alert(error.message);
};
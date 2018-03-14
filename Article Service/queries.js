var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/articles';
var db = pgp(connectionString);

function getAllArticles(req, res, next) {
  db.any('select * from artics')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL articles'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleArticle(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from artics where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE article'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createArticle(req, res, next) {
  db.none('insert into artics(author, title, content)' +
      'values(${author}, ${title}, ${content})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one article'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateArticle(req, res, next) {
  db.none('update artics set author=$1, title=$2, content=$3',
    [req.body.author, req.body.title, req.body.content])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated aricle'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeArticle(req, res, next) {
  var artID = parseInt(req.params.id);
  db.result('delete from artics where id = $1', artID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed ${result.rowCount} aricle'
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  getAllArticles: getAllArticles,
  getSingleArticle: getSingleArticle,
  createArticle: createArticle,
  updateArticle: updateArticle,
  removeArticle: removeArticle
};

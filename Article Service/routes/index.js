var express = require('express');
var router = express.Router();
var db = require('../queries');


router.get('/api/articles', db.getAllArticles);
router.get('/api/articles/:id', db.getSingleArticle);
router.post('/api/article', db.createArticle);
router.put('/api/articles/:id', db.updateArticle);
router.delete('/api/articles/:id', db.removeArticle);

// application -------------------------------------------------------------
router.get('/', function (req, res) {

    res.render('index', {title: 'node-postgres-promises'}); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = router;

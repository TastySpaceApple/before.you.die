var express = require('express');
var path = require('path');
var fs = require('fs');
var todolist = require('./todolist');
var formidable = require('formidable');

var app = express();
 
app.use('/', express.static(path.join(__dirname, 'static')));

let formparser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  Object.assign(form);

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    Object.assign(req, { fields, files });
    next();
  });
}

var router = express();

router.post('/fetch', formparser, function(req, res){
  todolist.list(req.fields.since).then(
    todos => { res.json(
      {
        timestamp: new Date().getTime(),
        list: todos.map(t => t.content)
      }
    ); }
  )
})

router.post('/create', formparser, function(req, res){
  todolist.create(req.fields.text).then(
    res.json({success:true})
  );
})

app.use('/actions', router);

app.listen(process.env.PORT || 3000);

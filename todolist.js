var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var Todo = new Schema({
    content    : String,
    updated_at : Number
});
 
var TodoModel = mongoose.model( 'Todo', Todo );
mongoose.connect( 'mongodb://root:todoadmin1@ds115442.mlab.com:15442/thingstodo' );

module.exports = {
  list: (since) => {
    let query = {};
    if(since) query = {updated_at: {$gt : since || 0}}
    return new Promise((resolve, reject) => {
      TodoModel.find(query, function(err, todos, count){
        if(err) reject(err)
        else resolve(todos);
      })
    });
  },
  create: (text) => {
    console.log((new Date()).getTime());
    return new Promise((resolve, reject) => {
        new TodoModel({
          content    : text,
          updated_at : (new Date()).getTime()
        }).save( function( err, todo, count ){
          if(err) reject(err)
          else resolve();
        });
    });
  }
}

Promise=require('bluebird')
var express=require('express'),
mysql=require('mysql'),
credentials=require('./resources/credentials.json'),
DBF=require('./resources/dbf-setup.js');
var user = credentials.user;
var buttonInfo = [];
// var transactionItems = [];

app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});


app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT till_buttons.*, prices.price FROM ' + user + '.till_buttons INNER JOIN '+ user + '.prices ON till_buttons.id = prices.id';
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
             buttonInfo = rows;
             console.log(buttonInfo);
     res.send(rows);
  }})(res));
});

app.get("/items", function(req, res){
  var sql ='SELECT * FROM ' + user +'.transaction';
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
        //     transactionItems = rows;
        //     console.log(transactionItems);
     res.send(rows);
  }})(res));
});

app.get("/clickItem", function(res,req){
  var id = req.param("id");
  var sql = 'DELETE FROM ' + user + '.transaction WHERE itemID = ' + id;
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});


app.get("/click",function(req,res){
  var id = req.param("id");
  console.log(id);
  var label = extractProperty(buttonInfo, "label", id);
  var price = extractProperty(buttonInfo, "price", id);
  console.log(label);
  console.log(price);

  var sql = "INSERT INTO " + user + ".transaction VALUES (" + 01 + ", " + id + ", '" + label + "', " + 1 + ", " + price + ") ON DUPLICATE KEY UPDATE quantity = quantity + 1";

  /*
  if (extractProperty(transactionItems, "id", id) == -1) {
  var transactionItem = {
    item: label,
    price: price,
    quantity: 1,
    id: id
  };
  transactionItems.push(transactionItem);
}
else {
  for(var j = 0; j < transactionItems.length; j++) {
    console.log(transactionItems.length);
    console.log(transactionItems);
    if(transactionItems[j].id==id) {
      transactionItems[j].quantity = transactionItems[j].quantity + 1;
      sql = "UPDATE " + user + ".transaction SET quantity = " + extractProperty(transactionItems, "quantity", id) + " WHERE itemID = " + id;
    }
  }
}
*/
console.log("Attempting sql ->"+sql+"<-");
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});
// Your other API handlers go here!

function extractProperty (array, propertyName, id) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id == id) {
      return array[i][propertyName];
    }
  }
  return -1;
}

app.listen(port);

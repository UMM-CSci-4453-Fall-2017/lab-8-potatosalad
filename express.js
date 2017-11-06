Promise=require('bluebird')
var express=require('express'),
mysql=require('mysql'),
credentials=require('./resources/credentials.json'),
DBF=require('./resources/dbf-setup.js');
var user = credentials.user;
var buttonInfo = [];
var transactionItems = [];

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
  res.send(transactionItems);
});

app.get("/clickeditem", function(res,req){
  var id = req.param("id");
  for (var i = 0; i < transactionItems.length; i++) {
    if (transactionItems[i].id == id){
      transactionItems.splice(i, 1);
    }
  }
});

app.get("/click",function(req,res){
  var id = req.param("id");
  console.log(id);
  var label = extractProperty(buttonInfo, "label", id);
  var price = extractProperty(buttonInfo, "price", id);
  console.log(label);
  console.log(price);
  var sql = "INSERT INTO " + user + ".transaction values (" + 01 + ", " + id + ", '" + label + "', " +
  1 + ", " + price + ", " + "NOW()" + ")";
  console.log("Attempting sql ->"+sql+"<-");
  console.log(transactionItems);
  console.log(extractProperty(transactionItems, "id", id));
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
    }
  }
}

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

const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mysql = require('mysql'),
      methodOverride = require("method-override");

var connection = mysql.createConnection({
    host: 'LOCALHOST',
    user: 'USER5',
    password: 'HELLOWORLD',
    database: 'DBMS'
});

connection.connect();
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/users", function(req, res){
    connection.query("SELECT * FROM USERS", function (err, results) {
        if (err)            
            console.log(err);
        else {
            console.log(results[0]);
            res.render("user/index.ejs", { users: results });
        }
    });
});

app.get("/users/new", function(req, res){
    res.render("user/new.ejs");
});

app.post("/users", function(req, res){
    var U = req.body.U;
    console.log(U);
    connection.query("INSERT INTO USERS VALUES ('" + U.phone + "','" + U.fname + "','" + U.sname + "','" + U.email + "')",
        function (err, results) {
            if (err)
                console.log(err);
            else{
                console.log("INSERTED");
            }
        });
    res.redirect("/users");
}); 

app.get("/users/:id", function(req,res){
    connection.query("SELECT * FROM ORDERS WHERE UID = " + req.params.id, function (err, results) {
        if (err)
            console.log(err);
        else {
            res.render("user/show.ejs", { orders : results });
        }
    });
});

app.get("/orders/new", function(req, res){
    connection.query("SELECT * FROM PRODUCTS", function (err, results){
        if (err)
            console.log(err);
        else {
            res.render("order/new.ejs", {products: results});
        }
    });
});

app.post("/orders", function(req, res){
    console.log(req.body);
    var ord = req.body;

    var user_id = ord.uid;
    connection.query("SELECT * FROM USERS WHERE PHONE = " + user_id, function(err, results) {
        if(err) 
            console.log(err);
        else if (results.length == 0) {
            res.send("USER NOT REGISTERED");
            console.log(results);
        } else {
            connection.query("INSERT INTO ORDERS(UID, DATEO, TIMEO, AMT) VALUES('" + ord.uid + "', curdate(), curtime()," + ord.total + ")",
                function (err, results) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(results);

                        var tid = results.insertId;
                        for (var i = 0; i < ord.arr.length; ++i) {
                            connection.query("INSERT INTO ORDER_INFO VALUES(" + tid + "," + ord.arr[i] + "," + ord.amt[i] + ")", function (err, results) {
                                if (err)
                                    console.log(err);
                                else
                                    console.log(results);
                            });
                        }
                    }
                });
            res.redirect("/orders/new");
        }
    });
});

app.get("/orders/:id", function(req, res){
    connection.query("SELECT OID, PID, QTY FROM ORDER_INFO WHERE OID = " + req.params.id, function(err, results){
        if(err)
            console.log(err);
        else 
            res.render("order/show.ejs", {order_info : results});
    });
});

app.get("/products", function(req, res){
    connection.query("SELECT * FROM PRODUCTS", function(err, results){
        if(err)
            console.log(err);
        else {
            res.render("product/index.ejs", { products: results });
        }
    });
});

app.get("/products/new", function(req, res){
    res.render("product/new.ejs");
});

app.post("/products", function(req, res){
    var P = req.body.P;
    connection.query("INSERT INTO PRODUCTS VALUES (" + P.id +",'" + P.name + "','" + P.cat + "'," + P.price + "," + P.stock + ")",
    function(err, results){
        if(err) 
            console.log(err);
        else
            console.log("INSERTED");
    });
    res.redirect("/products");
});

app.get("/products/:id/edit", function(req, res){
    connection.query("SELECT * FROM PRODUCTS WHERE ID = " + req.params.id, function(err, results){
        if(err) 
            console.log(err);
        else {
            res.render("product/edit.ejs", {product: results[0]});
        }
    });
});

app.put("/products/:id", function(req, res){    
    var P = req.body.P;
    connection.query("UPDATE PRODUCTS SET NAME = '" + P.name + "',CAT ='" + P.cat + "', PRICE = " + P.price + ", STOCK  = " + P.stock+ " WHERE ID = "+ req.params.id,
    function(err, results){
        if(err) 
            console.log(err);
        else
            console.log("UPDATED");
    });
    res.redirect("/products");
});

app.delete("/products/:id", function(req, res){
    connection.query("DELETE FROM PRODUCTS WHERE ID = "+req.params.id, function(err, results){
        if(err)
            console.log(err);
        else 
            console.log("DELETED");    
    });
    res.redirect("/products");
});

app.listen(3000, function(){  
    console.log("SERVER STARTED");
});
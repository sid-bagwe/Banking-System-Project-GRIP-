// JS and JQuery

// Creating a Web sql database
var db = openDatabase("custDb", "1.0", "custDb", 655);

$(function(){
    $(function(){
        db.transaction(function(transaction){
            var sql = "CREATE TABLE customers" + 
                    "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," + 
                    "name VARCHAR(20)," + 
                    "email VARCHAR(30)," + 
                    "balance FLOAT);";
            transaction.executeSql(sql, undefined,
            function(){

            }, function(){
                // alert('Database is already created.Attempt been made to recreate database');
            });
        })

    });

    $(function(){
        db.transaction(function(transaction){
            var sql = "CREATE TABLE transfers" + 
                      "(fromid INTEGER NOT NULL," + 
                      "toid INTEGER NOT NULL,"+
                      "amount FLOAT);";
            transaction.executeSql(sql, undefined, function(){

            }, function(transaction, err){
                // alert(err.message);
            });                    
        });

    });

    $("#insert").click(function(){
        var name = $("#nameInput").val();
        var email = $("#exampleInputEmail1").val();
        var balance = $("#balanceInput").val();
        var checkbox = document.getElementById("exampleCheck1");
        if(name == "" || email == "" || balance == ""){
            alert("Please fill all the fields correctly\nEither of the 3 fields is empty.");
        }
        else{
            if(checkbox.checked){
            db.transaction(function(transaction){
            var sql = "INSERT INTO customers(name, email, balance) VALUES(?, ?, ?)";
            transaction.executeSql(sql, [name, email, balance], function(){
                    alert("User created successfully");
            }, function(){
                    alert("Please fill all the fields correctly");
                });
            });
        }
        else{
            alert('Please agree to the terms and conditions.');
        }
        }


    });


    $(function display(){
        db.transaction(function(transaction){
            var sql = "SELECT * FROM customers order by id ASC";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    for(var i = 0; i < result.rows.length; i++){
                        var row = result.rows.item(i);
                        var id = (row.id);
                        var name = row.name;
                        var email = row.email;
                        var balance = row.balance;
                        $('#CustTable').append('<tr><td>' + id + '</td><td>' + name  
                        + '</td><td>' + email + '</td><td>' + balance + '</td></tr>');
                    }
                }else{
                    $("#CustTable").append('<tr><td colspan = "3" align = "center"> No Entry Found</td></tr>');
                }
            }, function(transaction, err){
                alert(err.message);
            });

        });

    });

    $(function(){
        db.transaction(function(transaction){
            var sql = "SELECT * FROM transfers";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    for(var i = 0; i < result.rows.length; i++){
                        var row = result.rows.item(i);
                        var fromid = row.fromid;
                        var toid = row.toid;
                        var amount = row.amount;
                        $('#HistoryTable').append('<tr><td>' + fromid + '</td><td>' 
                        + toid + '</td><td>' + amount + '</td></tr>');
                    }
                }else{
                    $("#HistoryTable").append('<tr><td colspan = "3" align = "center"> No Entry Found</td></tr>');
                }
            }, function(transaction, err){
                alert(err.message);
            });

        });
    });

    $('#remove').click(function(){
        if(!confirm("Are you sure you want to delete the database ?", "")){
            return ;
        }
        db.transaction(function(transaction){
            var sql = "DROP TABLE customers";
            transaction.executeSql(sql, undefined, function(){
                alert("Table deleted successfully");
            }, function(transaction, err){
                alert(err.message);
            });
        });

        db.transaction(function(transaction){
            var sql = "DROP TABLE transfers";
            transaction.executeSql(sql, undefined, function(){
                alert("Table deleted successfully");
            }, function(transaction, err){
                alert(err.message);
            });
        });
    });

    $('#update').click(function(){
        if(!confirm("Are you sure you want to transfer this amount ?")){
            return ;
        }
        var toId = parseInt(document.getElementById("toAcc").value);
        var fromId = parseInt(document.getElementById("fromAcc").value);
        var amount = parseFloat(document.getElementById("amountVal").value);
        var toBal, fromBal;
        db.transaction(function(transaction){
            var sql = "SELECT * from customers order by id ASC";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    for(var i = 0; i < result.rows.length; i++){
                        var row = result.rows.item(i);
                        var id = parseInt(row.id);
                        var balance = parseFloat(row.balance);
                        var name = String(row.name);
                        var email = String(row.email);
                        if(id == toId){
                            toBal = parseFloat(balance);
                        }
                        if(id == fromId){
                            fromBal = parseFloat(balance);
                        }
                    }
                }
                
                db.transaction(function(transaction){
                    var sql1 = "UPDATE customers SET balance = CASE id WHEN ? THEN ? WHEN ? THEN ? END WHERE id IN (?, ?)";
                    transaction.executeSql(sql1, [fromId, fromBal - amount, toId, toBal + amount, fromId, toId], function(){
                        alert('Transaction Successful');
                        db.transaction(function(transaction){
                            var sql2 = "INSERT INTO transfers(fromid, toid, amount) values(?, ?, ?);";
                            transaction.executeSql(sql2, [fromId, toId, amount], function(){
                                alert('Transaction history Updated !');
                            }, function(transaction, err){
                                alert(err.message);
                            });
                        });
                    }, function(transaction, err){
                        alert(err.message);
                    });
                });
            }, function(transaction, err){
                alert(err.message);
            });
        });
    });

    $('#getDetails').click(function(){
        var fromId = parseInt(document.getElementById("fromAcc").value);
        db.transaction(function(transaction){
            var sql = "SELECT * from customers order by id ASC";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    for(var i = 0; i < result.rows.length; i++){
                        var row = result.rows.item(i);
                        var id = parseInt(row.id);
                        var balance = parseFloat(row.balance);
                        var name = String(row.name);
                        var email = String(row.email);
                        if(id == fromId){
                            var setName = document.getElementById("fromName");
                            var setEmail = document.getElementById("fromEmail");
                            var setBalance = document.getElementById("fromBalance");
                            setName.value = name;
                            setEmail.value = email;
                            setBalance.value = balance;
                        }
                        
                    }
                }

            });
        });
    });


    $('#getToDetails').click(function(){
        var toId = parseInt(document.getElementById("toAcc").value);
        db.transaction(function(transaction){
            var sql = "SELECT * from customers order by id ASC";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    for(var i = 0; i < result.rows.length; i++){
                        var row = result.rows.item(i);
                        var id = parseInt(row.id);
                        var balance = parseFloat(row.balance);
                        var name = String(row.name);
                        var email = String(row.email);
                        if(id == toId){
                            var setName = document.getElementById("toName");
                            var setEmail = document.getElementById("toEmail");
                            var setBalance = document.getElementById("toBalance");
                            setName.value = name;
                            setEmail.value = email;
                            setBalance.value = balance;
                        }
                    }
                }

            });
        });
    });
});


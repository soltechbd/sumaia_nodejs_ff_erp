var express = require('express')
  , cors = require('cors')
  , http = require('http').Server(express)
  ,validator = require('validator')
  , bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var server = app.listen(81);
var io = require('socket.io').listen(server);


var Sequelize = require('sequelize')
    , sequelize = new Sequelize('merchandise', 'root', '123456', {
    dialect: "mysql",
    port: 3306
})

sequelize.authenticate().complete(function (err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
})

var color_type_table=require('./node_library/models/color_type.js')(sequelize),
    item_type_table=require('./node_library/models/item_type.js')(sequelize),
    item_table=require('./node_library/models/item.js')(sequelize),
    supplier_table=require('./node_library/models/supplier.js')(sequelize),
    unit_type_table=require('./node_library/models/unit_type.js')(sequelize);

sequelize
    .sync({ force: false })
    .complete(function(err) {
        if (!!err) {
            console.log('An error occurred while creating the table:', err)
        } else {
            console.log('It worked!')
        }
    })

app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/unit-input', function(req, res){
    unit_type_table.findAll().complete(function(err, utt) {
        res.setHeader('Content-Type', 'application/json');
        res.send(utt);
        res.end("");

    })
});
app.post('/unit-input', function(req, res) {
    console.log(req.body);
});

app.get('/color_type_input', function(req, res){
    color_type_table.findAll().complete(function(err, ctt) {
        res.setHeader('Content-Type', 'application/json');
        res.send(ctt);
        res.end("");


    })
});

app.post('/color_type_input', function(req, res) {
    console.log(req.body);
});



app.get('/item_type_input', function(req, res){
    item_type_table.findAll().complete(function(err, ctt) {
        res.setHeader('Content-Type', 'application/json');
        res.send(ctt);
        res.end("");


    })
});

app.post('/item_type_input', function(req, res) {
    console.log(req.body);
});

app.get('/supplier_input', function(req, res){
    supplier_table.findAll().complete(function(err, sptt) {
        res.setHeader('Content-Type', 'application/json');
        res.send(sptt);
        res.end("");

    })
});

app.post('/supplier_input', function(req, res) {
    console.log(req.body);
});
//list show
app.get('/item_list', function(req, res){
    ShowAllItem(function(list) {
        res.setHeader('Content-Type', 'application/json');
        res.send(list);
        res.end("");

    })
});

app.post('/item_list', function(req, res) {
    console.log(req.body);
});

app.get('/unit_list', function(req, res){
    ShowAllUnit(function(unit_list) {
        res.setHeader('Content-Type', 'application/json');
        res.send(unit_list);
        res.end("");

    })
});

app.post('/unit_list', function(req, res) {
    console.log(req.body);
});

app.get('/color_list', function(req, res){
    ShowAllColor(function(color_list) {
        res.setHeader('Content-Type', 'application/json');
        res.send(color_list);
        res.end("");
    })
});

app.post('/color_list', function(req, res) {
    console.log(req.body);
});

app.get('/supplier_list', function(req, res){
    ShowAllSupplier(function(supplier_list) {
        res.setHeader('Content-Type', 'application/json');
        res.send(supplier_list);
        res.end("");
    })
});

app.post('/supplier_list', function(req, res) {
    console.log(req.body);
});

app.get('/all_store_item', function(req, res){
    SaveItem(function(list) {
        res.setHeader('Content-Type', 'application/json');
        res.send(list);
        res.end("");
    })
});

app.post('/all_store_item', function(req, res) {
    console.log(req.body);
});





io.on('connection', function (socket) {
    console.log("A stranger have want to mass with me. ;D");

    socket.on('all_input',function(data){

        console.log("STEP 1: "+JSON.stringify(data))

        colorupdater(data, function(data){
            itemupdater(data,function(data){
                unitupdater(data,function(data){
                    supplyupdater(data,function(data){
                        AddNewItem(data);
                    })
                })
            })
        })

    });
    /*socket.on('update',function(updateitem){
        updateitem.find({ where: {id: this.id} }).on('success', function(item_update) {
            if (item_update) { // if the record exists in the db
                item_update.updateAttributes({


                }).success(function() {});
            }
        })

    });*/

});



//update Table



function colorupdater(SUB, callback)
{
    if(SUB.colors.new_color_found){
        color_type_table.create({
            color_type_name: SUB.colors.value,
            comment: ""
        }).complete(function(err, colo_type) {
            SUB.colors.value=colo_type.id; // Changing value to new color id
            callback(SUB)
        })
    }else{
        callback(SUB)
    }
}

function itemupdater(SUB, callback)
{
    if(SUB.itemTypes.new_itemType_found){
        item_type_table.create({
            item_type_name: SUB.itemTypes.value,
            item_type_status: "",
            comment: ""
        }).complete(function(err, item_typ) {
            SUB.itemTypes.value=item_typ.id; // Changing value to new item type id
            callback(SUB)
        })
    }else{
        callback(SUB)
    }
}

function unitupdater(SUB, callback)
{
    if(SUB.unitTypes.new_unitType_found){
        unit_type_table.create({
            unit_type_name: SUB.unitTypes.value,
            comment: ""
        }).complete(function (err, uni_typ) {
            SUB.unitTypes.value = uni_typ.id; // Changing value to new unit id
            callback(SUB)
        })
    }else{
        callback(SUB)
    }
}

function  supplyupdater(SUB, callback) {
    if(SUB.suppliers.new_supplier_found){
        supplier_table.create({
            supplier_name: SUB.suppliers.value,
            comment: ""
        }).complete(function (err,suplier) {
            SUB.suppliers.value = suplier.id; // Changing value to new Supplier id
            callback(SUB)
        })
    }else{
        callback(SUB)
    }
}

function AddNewItem (SUB)
{
    if(!validator.isNull(SUB.itemTypes.value) && !validator.isNull(SUB.unitTypes.value) && !validator.isNull(SUB.colors.value) && !validator.isNull(SUB.suppliers.value)) {

        item_table.create({
            item_name: SUB.name,
            item_type: SUB.itemTypes.value,
            unit_type: SUB.unitTypes.value,
            item_description: SUB.descrip,
            item_color: SUB.colors.value,
            item_supplier: SUB.suppliers.value,
            item_comment: SUB.comm
        }).complete(function (err, item) {
            // console.log("ITEM ENTERED "+item.id);
        })

    }
}

function ShowAllItem(callback)
{
    sequelize.query("SELECT a.id, a.item_name, a.item_description, b.id AS item_type_id, b.item_type_name, c.id AS color_type_id, c.color_type_name, s.id AS supplier_id, s.supplier_name, u.id AS unit_type_id, u.unit_type_name, a.item_comment FROM item a, item_type b, color_type c, supplier s, unit_type u WHERE a.item_type = b.id AND a.item_color = c.id AND a.item_supplier = s.id AND a.unit_type = u.id ORDER BY a.id ASC").success(function (item) {
        callback(item)
    });
}

function SaveItem()
{
    sequelize.query("").success(function (item) {
        callback(item)
    });


}



function ShowAllUnit(callback)
{
    sequelize.query("SELECT id,unit_type_name From unit_type").success(function (unititem) {
        callback(unititem)
    });
}

function ShowAllColor(callback)
{
    sequelize.query("SELECT id,color_type_name From color_type").success(function (colorlist) {
        callback(colorlist)
    });
}
function ShowAllSupplier(callback)
{
    sequelize.query("SELECT id, supplier_name From supplier").success(function (supplierlist) {
        callback(supplierlist)
    });
}

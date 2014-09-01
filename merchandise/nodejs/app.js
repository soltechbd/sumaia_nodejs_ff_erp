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
    unit_type_table=require('./node_library/models/unit_type.js')(sequelize),
    buyer_table=require('./node_library/models/buyer_table.js')(sequelize),
    style_table=require('./node_library/models/style.js')(sequelize),
    order_table=require('./node_library/models/order_table.js')(sequelize),
    order_table_items=require('./node_library/models/order_table_items.js')(sequelize);

//item related table association
color_type_table.hasOne(item_table, { foreignKey: 'item_color'})
item_type_table.hasOne(item_table, { foreignKey: 'item_type'})
supplier_table.hasOne(item_table, { foreignKey: 'item_supplier'})
unit_type_table.hasOne(item_table, { foreignKey: 'unit_type'})

item_table.belongsTo(color_type_table, { foreignKey: 'item_color'}).belongsTo(item_type_table, { foreignKey: 'item_type'}).belongsTo(unit_type_table, { foreignKey: 'unit_type'}).belongsTo(supplier_table, { foreignKey: 'item_supplier'});

//order related table association
buyer_table.hasOne(order_table, { foreignKey: 'buyer_id'})
style_table.hasOne(order_table, { foreignKey: 'style_id'})
order_table.belongsTo(buyer_table, { foreignKey: 'buyer_id'}).belongsTo(style_table, { foreignKey: 'style_id'});

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
//item manager input starts
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
//item manager input ends

//list show
app.get('/item_list', function(req, res){
    Allitem(function(dta) {
        res.setHeader('Content-Type', 'application/json');
        res.send(dta);
        res.end("");

    })
});
app.post('/item_list', function(req, res) {
    console.log(req.body);
});

app.get('/itemdes_list', function(req, res){
    Showitdes(function(list) {
        res.setHeader('Content-Type', 'application/json');
        res.send(list);
        res.end("");

    })
});

app.post('/itemdes_list', function(req, res) {
    console.log(req.body);
});

/*buyer & style etc starts*/
app.get('/buyer_list', function(req, res){
    buyer_table.findAll().complete(function(err, odr) {
        res.setHeader('Content-Type', 'application/json');
        res.send(odr);
        res.end("");

    })
});

app.post('/buyer_list', function(req, res) {
    console.log(req.body);
});

app.get('/style_list', function(req, res){
    style_table.findAll().complete(function(err, stt) {
        res.setHeader('Content-Type', 'application/json');
        res.send(stt);
        res.end("");

    })
});

app.post('/style_list', function(req, res) {
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
    socket.on('all_store_item',function(updateitem){

        var updatedITEMS=JSON.parse(updateitem)
        //console.log("STEP 1: "+JSON.stringify(updatedITEMS))

        for (var i = 0; i < updatedITEMS.length; i++) {
            console.log("Item ID:"+updatedITEMS[i].id)
            UpdateItem(updatedITEMS[i],function(m){
                console.log(m)
            })
        }
    });

    socket.on('all_order_items',function(data){

        console.log("STEP order_input: "+JSON.stringify(data))

        buyerupdater(data, function(data){
            stylerupdater(data,function(data){
                console.log("style")
                AddOrder(data,function(data){
                    console.log("order_table is updated")
                    AddOrderItems(data)
                    console.log("order_items is updated")
                })

            })
        })

    });
    /*socket.on('all_order_list',function(updateodr){

        var updatedORDER=JSON.parse(updateodr)
        //console.log("STEP 1: "+JSON.stringify(updatedORDER))

        for (var i = 0; i < updatedORDER.length; i++) {
            console.log("order ID:"+updatedORDER[i].id)
            UpdateOrder(updatedORDER[i],function(m){
                console.log(m)
            })
        }
    });
*/

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

function UpdateItem(item,callback)
{
    item_table.find({ where: {id: item.id} }).on('success', function(project) {
        if (project) {
            project.updateAttributes({
                 item_name: item.item_name,
                 item_type: item.item_type_id,
                 unit_type: item.unit_type_id,
                 item_description:item.item_description,
                 item_color: item.color_type_id,
                 item_supplier: item.supplier_id,
                 item_comment: item.item_comment
             }).success(function() {
                    callback("success");
             });
        }
    })
}

function Allitem(callback)
{
    item_table.findAll({ include: [{ model: color_type_table, attributes: ['color_type_name'] }
                                  ,{ model: item_type_table, attributes: ['item_type_name'] }
                                  ,{ model: supplier_table, attributes: ['supplier_name'] }
                                  ,{ model: unit_type_table, attributes: ['unit_type_name'] }]


    }).success(function(tasks) {
        console.log(JSON.stringify(tasks, null, 4))
        callback(tasks)
    })
}

function Showitdes(callback)
{
   item_table.findAll({ include: [{ model: color_type_table, attributes: ['color_type_name'] }
                                  ,{ model: supplier_table, attributes: ['supplier_name'] }],
                            attributes: ['id','item_name','item_description']
    }).success(function(item) {
        console.log(JSON.stringify(item, null, 4))
        callback(item)
    })
}

/*Order,buyer,style input function*/

function buyerupdater(ORDER, callback)
{
    if(ORDER.buyers.new_buyer_found){
        buyer_table.create({
            buyer_name: ORDER.buyers.value
        }).complete(function(err, buyer_type) {
            ORDER.buyers.value=buyer_type.id; // Changing value to new buyer id
            callback(ORDER)
        })
    }else{
        callback(ORDER)
    }
}
function stylerupdater(ORDER, callback)
{
    if(ORDER.styles.new_style_found){
        style_table.create({
            style_name: ORDER.styles.value
        }).complete(function(err, style_type) {
            ORDER.styles.value=style_type.id; // Changing value to new buyer id
            callback(ORDER)
        })
    }else{
        callback(ORDER)
    }
}

function AddOrder(ORDER)
{
    if(!validator.isNull(ORDER.buyers.value) && !validator.isNull(ORDER.styles.value)) {

        order_table.create({
            buyer_id: ORDER.buyers.value,
            style_id: ORDER.styles.value,
            po_number: ORDER.poNo,
            shipment_date: ORDER.shiftDate,
            quantity: ORDER.qtyPcs,
            meta_data: ORDER.data

        }).complete(function (err, order) {
            // console.log("ITEM ENTERED "+item.id);
        })

    }
}

function AddOrderItems(ORDER)
{
    return 0;
    console.log("order ENTERED "+ORDER);

    order_table_items.create({
        order_id:ORDER.order_id,
        item_id:ORDER.item_id,
        unit_number:ORDER.unit_number,
        unit_type_id:ORDER.unitTypes.value,
        color_id: ORDER.colors.value,
        total_quantity: ORDER.total_quantity,
        quantity_unit_type_id:ORDER.quantity_unit_type_id ,
        supplier_id: ORDER.suppliers.value,
        excess_percentage: ORDER.excess_percentage ,
        total_quantity_with_excess_percentage:ORDER.total_quantity_with_excess_percentage,
        comment:ORDER.comm

        }).complete(function (err, orderitem) {
           console.log("order ENTERED "+ORDER);
        })
}
/*
function ShowAllOrder(callback)
{
 sequelize.query("SELECT a.id, o.id AS order_id , b.id AS item_id, a.unit_number, u.id AS unit_type_id, c.id AS color_id,a.total_quantity,a.quantity_unit_type_id, s.id AS supplier_id, a.comment FROM order_items_table a, order_table o, item b, unit_type u, color_type c, supplier s WHERE a.order_id = o.id AND a.item_id=b.id AND a.unit_type_id=u.id AND a.color_id=c.id AND a.supplier_id=s.id ORDER BY a.id ASC").success(function (order) {
 callback(order)
 });
}


 function updatedORDER(odr,callback)
 {
     order_table_items.find({ where: {id: odr.id} }).on('success', function(order_item) {
     if (order_item) {
        order_item.updateAttributes({
         order_id: odr.order_id,
         item_id: odr.item_id,
         unit_number: odr.unit_number,
         unit_type_id:odr.unit_type_id,
         color_id: odr.color_id,
         total_quantity: odr.total_quantity,
         quantity_unit_type_id: odr.quantity_unit_type_id ,
         supplier_id: odr.supplier_id,
         excess_percentage: odr.excess_percentage ,
         total_quantity_with_excess_percentage: odr.,
         comment: odr.comment
     }).success(function() {
        callback("success");
     });
     }
     })

 }

 function ShowAllItem(callback)
 {
 sequelize.query("SELECT a.id, a.item_name, a.item_description, b.id AS item_type_id, b.item_type_name, c.id AS color_type_id, c.color_type_name, s.id AS supplier_id, s.supplier_name, u.id AS unit_type_id, u.unit_type_name, a.item_comment FROM item a, item_type b, color_type c, supplier s, unit_type u WHERE a.item_type = b.id AND a.item_color = c.id AND a.item_supplier = s.id AND a.unit_type = u.id ORDER BY a.id ASC").success(function (item) {
 callback(item)

 sequelize.query("SELECT a.id AS item_id,a.item_name, a.item_description, c.color_type_name, s.supplier_name FROM item a, color_type c, supplier s WHERE a.item_color = c.id AND a.item_supplier = s.id ORDER BY a.id ASC")
 });
 }
 app.get('/item_description_list', function(req, res){
 showAlldescription(function(description) {
 res.setHeader('Content-Type', 'application/json');
 res.send(description);
 res.end("");

 })
 });

 app.post('/item_description_list', function(req, res) {
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

 function showAlldescription(callback)
 {

 sequelize.query("SELECT a.item_description  FROM item a ").success(function (descrip) {
 callback(descrip)
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
*/

/*app.get('/order_list', function(req, res){
 ShowAllOrder(function(orderlst) {
 res.setHeader('Content-Type', 'application/json');
 res.send(orderlst);
 res.end("");

 })
 });

 app.post('/order_list', function(req, res) {
 console.log(req.body);
 });
 */

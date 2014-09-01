var Sequelize = require('sequelize')
var buyer_table;

module.exports = function(sequelize){

    buyer_table = sequelize.define('newbuyer', {
        buyer_name: {type: Sequelize.STRING, unique: true}
    },{
        tableName: 'buyer_table'
    })

    return buyer_table;
}
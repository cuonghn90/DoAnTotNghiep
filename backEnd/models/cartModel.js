const { DataTypes, Sequelize } = require("sequelize");
const { User } = require("./userModel");
const {Product} = require('./productModel')
// const sequelize = new Sequelize(
//     'sql12668158',
//     'sql12668158',
//     '9cLYte5Atp',
//     {
//         host: 'sql12.freemysqlhosting.net',
//         dialect: 'mysql',
//         port: 3306
//     }
// );
const sequelize = new Sequelize(
    'datn',
    'root',
    '08102001',
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const productCartSchema = sequelize.define("productcart", {
    productCartId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    cartId:{
        type: DataTypes.UUID,
        allowNull: false
    },
    productId:{
        type: DataTypes.UUID,
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    }
}, { timestamps: true })

var cartSchema = sequelize.define('cart', 
    {
        id:{
            type: Sequelize.INTEGER,
            unique: true,
            autoIncrement: true,
        },
        cartId:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        cartTotal: {
            type: DataTypes.DOUBLE
        },
        userId:{
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        timestamps: true,
    },
    
);

User.hasMany(cartSchema, { sourceKey: 'userId', foreignKey: 'userId', onDelete: 'cascade' })
cartSchema.hasMany(productCartSchema, { sourceKey: 'cartId', foreignKey: 'cartId', onDelete: 'cascade'},)
Product.hasOne(productCartSchema, { sourceKey: 'productId', foreignKey: 'productId', onDelete: 'cascade' })

sequelize.sync().then(() => {
    console.log('Cart & ProductsCart table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = { cartSchema, productCartSchema }
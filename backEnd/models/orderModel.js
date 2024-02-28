const { DataTypes, Sequelize, UUIDV4 } = require("sequelize");
const { User } = require("./userModel");
const { Product } = require("./productModel");
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

const productOrderSchema = sequelize.define('productsorder', {
    productOrderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey:  true,
        unique: true
    },
    productId:{
        type: DataTypes.UUID,
        allowNull: false
    },
    orderId:{
        type: DataTypes.UUID,
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 1
    },
    note:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    }
}, { timestamps: true })


const orderSchema = sequelize.define(('order'),
    {
        id:{
            type: Sequelize.INTEGER,
            unique: true,
            autoIncrement: true,
        },
        orderId:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        paymentMethod:{
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentAmount:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        paymentAmountAfterDiscount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        couponCode:{
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentStatus:{
            type: Sequelize.DataTypes.ENUM("Unpaid",
                "Paid"),
            defaultValue: "Unpaid",
        },
        paymentCreate:{
            type: DataTypes.DATE,
            allowNull: false
        },
        paymentCurrency:{
            type: DataTypes.STRING,
            defaultValue: 'vnd'
        },
        orderStatus: {
            type: Sequelize.DataTypes.ENUM("Unconfimred",
                "Confirmed",
                "Processing",
                "Dispatched",
                "Cancelled",
                "Delivered"),
            defaultValue: "Unconfimred",
        },
        userId:{
            type: DataTypes.UUID,
            allowNull: false
        },
        addressShip:{
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneShip:{
            type: DataTypes.STRING,
            allowNull: false
        },
        isPay:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderIdPaypal:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        timestamps: true,
    }
);

User.hasMany(orderSchema,{sourceKey:'userId', foreignKey: 'userId' })
orderSchema.hasMany(productOrderSchema, { sourceKey: 'orderId', foreignKey: 'orderId' })
Product.hasOne(productOrderSchema, { sourceKey: 'productId', foreignKey: 'productId' })

sequelize.sync().then(() => {
    console.log('Order and productsOrder table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports =  { orderSchema, productOrderSchema}
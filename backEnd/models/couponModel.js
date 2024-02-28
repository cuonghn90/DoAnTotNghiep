const { DataTypes, Sequelize } = require("sequelize");
const { orderSchema } = require("./orderModel");
const { User } = require("./userModel");
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

var couponSchema = sequelize.define('coupon',
    {
        id: {
            type: Sequelize.INTEGER,
            unique: true,
            autoIncrement: true,
        },
        couponId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        couponCode:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        discount: {
            type: DataTypes.INTEGER
        },
        discountFor: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'order'
        },
        statusCoupon:{
            type: Sequelize.DataTypes.ENUM("expired",
                "paused",
                "unexpired",
            ),
            defaultValue: "unexpired",
        },
        startDateDiscount:{
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        endDateDiscount:{
            type: DataTypes.DATE,
            allowNull: true,
        },
        takeBy:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue: "system"
        }
    },
    {
        timestamps: true,
    },
);

var couponUsedSchema = sequelize.define('couponUsed',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        couponId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        }
    },
    {
        timestamps: true,
    },
);

couponSchema.hasMany(orderSchema, { sourceKey: 'couponCode', foreignKey: 'couponCode'})
couponSchema.hasMany(couponUsedSchema, { sourceKey: 'couponId', foreignKey: 'couponId' })
User.hasMany(couponUsedSchema, { sourceKey: 'userId', foreignKey: 'userId' })

sequelize.sync().then(() => {
    console.log('Cart & ProductsCart table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = { couponSchema, couponUsedSchema }
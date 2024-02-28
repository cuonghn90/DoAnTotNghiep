const { DataTypes, Sequelize } = require("sequelize");
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

// Declare the Schema of the Mongo model
const categorySchema = sequelize.define('category', {
    categoryId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:  false,
        primaryKey: true,
        unique:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},
    {
        timestamps: true,
    }
);

categorySchema.hasMany(Product, { sourceKey: 'categoryId', foreignKey: 'categoryId' });

sequelize.sync().then(() => {
    console.log('Category table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
//Export the model
module.exports = { categorySchema }
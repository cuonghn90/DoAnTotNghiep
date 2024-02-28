const { DataTypes, Sequelize } = require("sequelize");
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


const Rating = sequelize.define('ratings', {
    ratingId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    star: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, { timestamps: true })


const Comment = sequelize.define('comments', {
    commentId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true })


const Product = sequelize.define("products", {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    productId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    categoryId:{
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true
    },
    totalRating: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, { timestamps: true })

const productMapToDb = {
    name: {
        isRequire: true,
        dataType: "String"
    },
    slug: {
        isRequire: true,
        dataType: "String"
    },
    description: {
        isRequire: true,
        dataType: "String"
    },
    price: {
        isRequire: true,
        dataType: "Interger"
    },
    image: {
        isRequire: true,
        dataType: "String"
    },
    categoryId: {
        isRequire: true,
        dataType: "String"
    },
    brand: {
        isRequire: false,
        dataType: "String"
    },
    quantity: {
        isRequire: true,
        dataType: "Interger"
    },
    sold: {
        isRequire: false,
        dataType: "Interger"
    },
    tags: {
        isRequire: false,
        dataType: "String"
    },
    totalRating: {
        isRequire: false,
        dataType: "Interger"
    }
}

Product.hasMany(Rating, { sourceKey: 'productId', foreignKey: 'productId' });
Product.hasMany(Comment, { sourceKey: 'productId', foreignKey: 'productId' });
User.hasMany(Rating, { sourceKey: 'userId', foreignKey: 'userId' })
User.hasMany(Comment, { sourceKey: 'userId', foreignKey: 'userId' })

sequelize.sync().then(() => {
    console.log('Product table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = { Rating, Product, Comment, productMapToDb } 
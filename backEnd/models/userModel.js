const { Sequelize, DataTypes, DATE } = require("sequelize");
const bcrypt = require("bcrypt")
const crypto = require("crypto")
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

const User = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "user"
    },
    refreshToken: {
        type: DataTypes.STRING
    },
    passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpires: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, { timestamps: true });

const Friend = sequelize.define("friend", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    userFriendId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    isFriend: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    numberGiveGift: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { timestamps: true });

User.hasMany(Friend, { sourceKey: 'userId', foreignKey: 'userId' })

User.addHook('beforeSave', async (user, options) => {
    const salt = bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(user.password, salt);
})
User.prototype.isPasswordMatched = function (password) {
    return bcrypt.compareSync(password, this.password);
}
User.prototype.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000
    return resetToken;

}
sequelize.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = { User , Friend} 
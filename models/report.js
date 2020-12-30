module.exports = (sequelize, DataTypes) => {
    const report_tbl = sequelize.define('report_tbl', {
        path: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        report_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true
        }

    }, {
        freezeTableName: true
    });
    return report_tbl;
};
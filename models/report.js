module.exports = (sequelize, DataTypes) => {
  const report_tbl = sequelize.define(
    'report_tbl',
    {
      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return report_tbl;
};

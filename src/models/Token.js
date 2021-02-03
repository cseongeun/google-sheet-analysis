module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Token',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      contract_address: { type: DataTypes.STRING(150), allowNull: false },
      symbol: { type: DataTypes.STRING(10), allowNull: false },
      block_height: { type: DataTypes.BIGINT, allowNull: false },
      process: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'token',
      indexes: [
        {
          fields: ['contract_address'],
          unique: true,
        },
      ],
    },
  );

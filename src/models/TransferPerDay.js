module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'TransferPerDay',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: { type: DataTypes.STRING(20), allowNull: false },
      contract_address: { type: DataTypes.STRING(150) },
      num_of_transfer: { type: DataTypes.INTEGER, defaultValue: 0 },
      amount_of_transfer: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    },
    {
      tableName: 'transfer_per_day',
      indexes: [
        {
          fields: ['contract_address', 'date'],
          unique: true,
        },
      ],
    },
  );

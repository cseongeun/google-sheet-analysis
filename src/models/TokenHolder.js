module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'TokenHolder',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      contract_address: { type: DataTypes.STRING(150) },
      address: { type: DataTypes.STRING(150) },
      num_of_send: { type: DataTypes.INTEGER, defaultValue: 0 },
      num_of_receive: { type: DataTypes.INTEGER, defaultValue: 0 },
      activate_block_height: { type: DataTypes.BIGINT, allowNull: false },
      deactivate_block_height: { type: DataTypes.BIGINT, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'token_holder',
      indexes: [
        {
          fields: ['contract_address', 'address'],
          unique: true,
        },
      ],
    },
  );

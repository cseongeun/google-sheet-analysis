module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'TokenHolder',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      contractAddress: { type: DataTypes.STRING(150) },
      address: { type: DataTypes.STRING(150) },
      num_of_send: { type: DataTypes.INTEGER, defaultValue: 0 },
      num_of_receive: { type: DataTypes.INTEGER, defaultValue: 0 },
      activate_block_height: { type: DataTypes.BIGINT, allowNull: false },
      deactivate_block_height: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      tableName: 'tokenHolder',
      indexes: [
        {
          fields: ['contractAddress', 'address'],
          unique: true,
        },
      ],
    },
  );

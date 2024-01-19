import db from '@/db/db'
import { DataTypes } from 'sequelize'

const Codes = db.define('Codes', {
    code_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      class_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      js_time: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      js_expiry: {
        type: DataTypes.BIGINT,
        allowNull: true,
      }
}, {
    tableName: 'codes',
    timestamps: false
})

export default Codes
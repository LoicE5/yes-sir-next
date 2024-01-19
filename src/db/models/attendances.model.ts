import db from '@/db/db'
import { DataTypes } from 'sequelize'

const Attendances = db.define('Attendances', {
    attendance_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ip: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_ipv6: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      is_vpn: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      is_already_registered: {
        type: DataTypes.TINYINT,
        allowNull: true,
      }
}, {
    tableName: 'attendances',
    timestamps: false
})

export default Attendances
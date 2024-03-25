module.exports = (sequelize, DataTypes) => {
  const Amenity = sequelize.define('amenities', {
    amenityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // status: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // location: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // capacity: {
    //   type: DataTypes.DOUBLE,
    //   allowNull: true,
    // },
    // openingHours: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // additionalCost: {
    //   type: DataTypes.DOUBLE,
    //   allowNull: true,
    // },
    // bookingRequired: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: true,
    // },
    // maintenanceSchedule: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
  })
  return Amenity
}

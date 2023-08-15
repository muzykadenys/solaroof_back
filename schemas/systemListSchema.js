const mongoose = require("mongoose");

const markerType = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
});
const panelListType = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  parent: {
    type: String || null,
    required: true,
  },
  position: {
    type: [Number],
    required: true,
  },
  top: {
    type: String || null,
    required: true,
  },
  right: {
    type: String || null,
    required: true,
  },
  bottom: {
    type: String || null,
    required: true,
  },
  left: {
    type: String || null,
    required: true,
  },
  panelTypeIndex: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
const listOfPanelListType = new mongoose.Schema({
  panelList: {
    type: [panelListType],
    required: true,
  },
  angle: {
    type: Number,
    required: true,
  },
  orientationAngle: {
    type: Number,
    required: true,
  },
});
const panelChooseType = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  wattage: {
    type: Number,
    required: true,
  },
  efficiencyPercents: {
    type: Number,
    required: true,
  },
  temperatureCoefPower: {
    type: Number,
    required: true,
  },
});
const systemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  marker: {
    type: markerType,
    required: true,
  },
  isHaveStation: {
    type: Boolean,
    required: true,
  },
  isRoof: {
    type: Boolean,
    required: true,
  },
  listOfPanelList: {
    type: [listOfPanelListType],
    required: true,
  },
  panelChoose: {
    type: [panelChooseType],
    required: true,
  },
});

const systemListSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  // listOfSystem: {
  //   type: [String],
  //   required: true,
  // },
  listOfSystem: {
    type: [systemSchema],
    required: true,
  },
});

module.exports =  mongoose.model("SystemList", systemListSchema)


// {
//   marker:{
//       lat: 32,
//       lon: 27
//   },
//   isHaveStation: true,
//   isRoof: false,
//   listOfPanelList:[
//       {
//           panelList:[],
//           angle: 0,
//           orientationAngle: 180
//       }
//   ],
//   panelChoose:[
//       {
//           color: "pink",
//           wattage: 660,
//           efficiencyPercents: 21.2,
//           temperatureCoefPower: 0.34,
//       },
//       {
//           color: "green",
//           wattage: 540,
//           efficiencyPercents: 45.2,
//           temperatureCoefPower: 0.34,
//       },
//   ]
// }
const express = require("express");
const router = express.Router();
const SystemList = require("../schemas/systemListSchema");

router.post("/addSystem", async (req, res) => {
  const userId = "64db8b63c66d5e39022eb900";
  let systemListByUserId;

  systemListByUserId = (
    await SystemList.find({
      userId: userId,
    })
  )[0];

  if (systemListByUserId === undefined) {
    const systemList = new SystemList({
      userId: userId,
      listOfSystem: [],
    });
    const new_systemList = await systemList.save();

    console.log(`created empty systemList for ${userId}`);

    systemListByUserId = (
      await SystemList.find({
        userId: userId,
      })
    )[0];
  }

  SystemList.findOneAndUpdate(
    { userId: userId }, // Query to find the document
    {
      $set: { listOfSystem: [...systemListByUserId.listOfSystem, req.body] },
    }, // Update the field
    { new: true } // Return the updated document
  )
    .then((updatedDocument) => {
      if (updatedDocument) {
        // console.log("Updated document:", updatedDocument);
        res.status(201).json(updatedDocument);
      } else {
        res.status(404).json({ message: " User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

module.exports = router;

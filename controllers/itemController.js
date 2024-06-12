const Item = require("../models/Item");

const itemController = {};

itemController.getItems = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 20;
    const items = await Item.find({}).sort("-createdAt").skip((page - 1) * limit).limit(limit);
    return res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

itemController.addItem = async (req, res) => {
  try {
    const { name, description, images, addedBy } = req.body;
    const item =  new Item({ name, description, images, addedBy });
    await item.save();
    return res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
itemController.getItem = async (req, res) => {
  try {
    const item = await Item.find({ _id: req.id });
    return res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = itemController;
const Folder = require('../models/Folder');

exports.createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = new Folder({
      userId: req.user,
      name,
      parentId: parentId || null,
    });

    await folder.save();

    res.status(201).json({ message: 'Folder created', folder });
  } catch (error) {
    console.error('Create Folder Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllFolder = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user });
    res.json({ folders });
  } catch (error) {
    console.error('Get Folders Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      userId: req.user,
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    await Folder.deleteOne({ _id: folder._id });

    res.json({ message: 'Folder deleted' });
  } catch (error) {
    console.error('Delete Folder Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

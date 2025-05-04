import User from "../models/userModels.js";
import Conversation from "../models/conversationModels.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user._id;
    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentUserId },
        },
      ],
    })
      .select("-password")
      .select("-email");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    // console.log("error: ", error);
  }
};

export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentChatters = await Conversation.find({
      participants: currentUserId,
    }).sort({
      updatedAt: -1,
    });

    if (!currentChatters || currentChatters.length === 0)
      return res.status(200).send([]);

    const participantIDS = currentChatters.reduce((ids, conversation) => {
      const otherParticipants = conversation.participants.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      return [...ids, ...otherParticipants];
    }, []);

    const otherParticipantsIDS = participantIDS.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    const user = await User.find({ _id: { $in: otherParticipantsIDS } })
      .select("-password")
      .select("-email");

    const users = otherParticipantsIDS.map((id) =>
      user.find((user) => user._id.toString() === id.toString())
    );

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    //console.log("error: ", error);
  }
};

// controllers/userController.js
export const savePublicKey = async (req, res) => {
  const userId = req.user._id;
  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ message: "Public key is required." });
  }

  try {
    await User.findByIdAndUpdate(userId, { publicKey });
    res.status(200).json({ message: "Public key saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to save public key." });
  }
};

const router = require("express").Router();

const Message = require("../models/Message");

router.post("/sendMessage", async (req, res) => {
    const sender = req.user;
    const requestData = {
        ...req.body,
    };
    requestData.senderId = sender.id;
    
    // creating text message
    // TODO image upload, video upload, push notifiction
    const message = await new Message(requestData).save();

    return res.status(200).json({message: "Message sent successfully.", record: message});
});

router.get("/getMessages/:receiverId", async (req, res) => {
    
    // const receiverId = 2;
    const message1 = await Message.findAll({
        where: {
            senderId: req.user.id,
            receiverId: req.params.receiverId
        }
    });

    const message2 = await Message.findAll({
        where: {
            senderId: req.params.receiverId,
            receiverId: req.user.id
        }
    });

    const messages = message1.concat(message2);

    messages.sort(function(a, b) {
        var keyA = new Date(a.sentAt),
        keyB = new Date(b.sentAt);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });

    return res.status(200).json({message: "Messages fetched successfully.", records: messages});
});

module.exports = router;
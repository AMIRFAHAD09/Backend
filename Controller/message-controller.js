const { response } = require('express');
// const Message = require('../models/message-model');
const User = require('../models/auth-model');

const storeMessage = async(req,res)=>{
    try {
        const{from,to,content}=req.body;
        const userId = req.user._id; // from auth middleware
        const user = await User.findById(userId)

        const message = {
          from,
          to,
          content,
        };
    
  
         await User.findByIdAndUpdate(from, {
      $push: { messages: message }
    });

    // Store in receiver's message list
    await User.findByIdAndUpdate(to, {
      $push: { messages: message}
    });
    res.status(201).json(user);
    } catch (error) {
        res.status(400).json("message not store");
        console.log("error when store message")
    }
}

// Fetch chat history between two users
const getMessages = async (req, res) => {
    try {
      const { userId, contactId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      // console.log("Contact ID:", contactId);
    // console.log("All user messages:", user.messages);
    const filteredMessages = user.messages.filter(msg =>
      msg.from?.toString() === contactId || msg.to?.toString() === contactId
    );
         // Sort messages by timestamp
    filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      res.status(200).json(filteredMessages)
 
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };

 //clear message
 const clearMessages=async(req,res)=>{
  try {
    const{userId, contactId}= req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Keep only messages that are NOT related to contactId
    user.messages = user.messages.filter(msg =>
      msg.from?.toString() !== contactId && msg.to?.toString() !== contactId
    );

    await user.save(); // Save changes to DB
    return res.status(200).json({ msg: "Messages cleared successfully" });
  } catch (error) {
    console.error("Error deleteing messages:", error);
      res.status(500).json({ msg: "Server error" });
  }
 } 
module.exports = {storeMessage,getMessages,clearMessages};
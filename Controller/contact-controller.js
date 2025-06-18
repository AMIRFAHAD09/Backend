const User = require('../models/auth-model')
// const Message = require('../models/message-model')

const addContact = async(req,res)=>{
    try {
        const{username,number}=req.body;
        const userId = req.user._id; // from auth middleware
        const user = await User.findById(userId)
        const exists = user.chatContacts.some(c => c.number === number);

        if (exists) {
        return res.status(400).json({ msg: "Contact already added" });
        }
        user.chatContacts.push({ username, number });
        await user.save();
        res.status(200).json({ msg: "User added", chatContacts: user.chatContacts});
    } catch (error) {
        console.log("this is error from add contact")
    }
}

// delete contact
const deleteContact=async(req,res)=>{
  try {
    const{id}= req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    const {phone} = req.body;
    console.log("Received body:", req.body);
    // Keep only messages that are NOT related to contactId
    user.chatContacts = user.chatContacts.filter(msg =>
    msg.number!==phone);

    await user.save()
    res.status(200).json({ msg: "Contact deleted", chatContacts: user.chatContacts });
  } catch (error) {
    console.error("Error deleteing messages:", error);
      res.status(500).json({ msg: "Server error" });
  }
 } 
const updateContact=async(req,res)=>{
  try {
    const{username,number}=req.body;
    const userId = req.user._id; // from auth middleware
    const user = await User.findById(userId)
    const contactIndex = user.chatContacts.findIndex(c => c.number === number);
    if (contactIndex === -1) {
      return res.status(404).json({ msg: "Contact not found to update" });
    }
     // Update the username
     user.chatContacts[contactIndex].username = username;

     await user.save();
    res.status(200).json({ msg: "User update", chatContacts: user.chatContacts});
  } catch (error) {
    
  }
  
}
const getContacts = async (req, res) => {
  try {
    const userId = req.user._id; // From your auth middleware

    const user = await User.findById(userId).select('chatContacts'); // Only fetch contacts
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({
      msg: 'Contacts retrieved successfully',
      chatContacts: user.chatContacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ msg: 'Server error while fetching contacts' });
  }
};
//message store
// const addMessage = async(req,res)=>{
//   try {
//       const{senderId,receiverId,content,timestamp}=req.body;
      
//       res.status(200).json({ msg: "User added", chatContacts: user.chatContacts  });
//   } catch (error) {
//       console.log("this is error from add contact")
//   }
// }
module.exports={addContact,getContacts,updateContact,deleteContact}
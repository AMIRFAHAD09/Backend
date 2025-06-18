// const Message = require('./models/Message');

// socket.on('send_message', async (data) => {
//   try {
//     const savedMessage = await Message.create({
//       from: data.from,
//       to: data.to,
//       content: data.content,
//     });
//     // Emit to receiver
//     socket.to(data.to).emit('receive_message', savedMessage);
//   } catch (err) {
//     console.error('Error saving message:', err);
//   }
// });

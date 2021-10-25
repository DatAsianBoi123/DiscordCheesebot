module.exports = {
  name: 'say',
  description: 'Sends a message',
  options: [
    {
      name: 'message',
      description: 'The message to send',
      required: true,
      type: 'STRING'
    }
  ],
}
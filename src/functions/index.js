const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Set your SendGrid API Key securely (you can set this in Firebase config)
sgMail.setApiKey(functions.config().sendgrid.api_key);

// Function to fetch users (existing code)
exports.getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const formattedUsers = listUsers.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      name: user.displayName || "",
      createdAt: user.metadata.creationTime,
      lastSignIn: user.metadata.lastSignInTime,
    }));
    res.json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).send("Error fetching users");
  }
});

// Function to send emails based on order status update
exports.sendOrderStatusEmail = functions.firestore
  .document('customGiftOrders/{orderId}')
  .onUpdate((change, context) => {
    const newOrder = change.after.data(); // The order data after the update
    const oldOrder = change.before.data(); // The order data before the update

    // Check if the status or deliveryStatus has changed
    if (newOrder.status !== oldOrder.status || newOrder.deliveryStatus !== oldOrder.deliveryStatus) {
      let subject = '';
      let message = '';

      // Email content for Approved status
      if (newOrder.status === 'Approved') {
        subject = 'Your Custom Gift Order has been Approved!';
        message = `
          Hi ${newOrder.name},
          
          Your custom gift order has been approved. We are now preparing it for delivery. 
          
          Thank you for choosing our service!

          Best regards,
          The Custom Gifts Team
        `;
      }

      // Email content for Delivered status
      if (newOrder.deliveryStatus === 'Delivered') {
        subject = 'Your Custom Gift Order has been Delivered!';
        message = `
          Hi ${newOrder.name},
          
          We are happy to inform you that your custom gift order has been delivered!
          
          Thank you for your purchase. We hope you love your gift!

          Best regards,
          The Custom Gifts Team
        `;
      }

      // Send the email if subject and message are set
      if (subject && message) {
        const msg = {
          to: newOrder.email,
          from: 'your-email@example.com', // Use a valid sender email address
          subject: subject,
          text: message,
        };

        // Send the email using SendGrid
        return sgMail.send(msg)
          .then(() => {
            console.log(`Email sent to ${newOrder.email} for order ${context.params.orderId}`);
          })
          .catch((error) => {
            console.error('Error sending email:', error);
            return null;
          });
      }
    }
    return null;
  });
// const onRequest = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
  
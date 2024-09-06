const axios = require("axios");
require("dotenv").config();

class Messages {
  static async sendMessage(phoneNumber, endDate, brand, model, licensePlate) {
    console.log("Sending messages");
    let dateObj = new Date(endDate);
    const months = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const response = await axios({
      url: "https://graph.facebook.com/v20.0/442911372232023/messages",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: "39" + phoneNumber,
        type: "template",
        template: {
          name: "polizza_in_scadenza_ufficiale",
          language: {
            code: "it",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    id: "472583372438596",
                  },
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: day + " " + month,
                },
                {
                  type: "text",
                  text: brand + " " + model,
                },
                {
                  type: "text",
                  text: licensePlate,
                },
              ],
            },
          ],
        },
      }),
    });
    console.log(response.data);
  }

  /*async function uploadImage() {
  const data = new FormData();
  data.append("messaging_product", "whatsapp");
  data.append(
    "file",
    fs.createReadStream(process.cwd() + "/public/WA_Scadenza.jpg"),
    {
      contentType: "image/jpeg",
    }
  );
  data.append("type", "image/jpeg");

  const response = await axios({
    url: "https://graph.facebook.com/v20.0/442911372232023/media",
    method: "post",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    },
    data: data,
  });
}*/
}

module.exports = Messages;

const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  // Command is !clear <Number that's less than 100 and greater than 0.

  if(message.member.hasPermission("MANAGE_MESSAGES")) {
    if(args[0]) {
      message.channel.bulkDelete(args[0]).then(msg => msg.delete(5000));
    } else {
      let embed = new Discord.RichEmbed()
      .setAuthor(`» Error`)
      .setColor("#d62035")
      .addField("Insufficient arguments.",  `[${message.member}]`);
      message.channel.send(embed);
    }
  } else {
    let embed = new Discord.RichEmbed()
    .setAuthor(`» Error`)
    .setColor("#d62035")
    .addField("Insufficient permissions.",  `[${message.member}]`);
    message.channel.send(embed);
  }
}

module.exports.help = {
  name: "clear"
}

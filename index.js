const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (e, files) => {
  if(e) console.log(e);

  let jsFile = files.filter(f => f.split(".").pop() === "js");
  if(jsFile.length <= 0) {
    console.log("No commands found.");
    return;
  }

  jsFile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded.`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity(`${botconfig.activity}`);
});

bot.on("message", async message => {
  let fullMessage = message.content.split(" ");
  let firstMessage = fullMessage[0];

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

if(message.channel.id === `426472144197648395`) {
  if(firstMessage !== `!suggest`) {
    let staffRole = message.guild.roles.find("name", "Staff");
    if(!message.member.roles.has(staffRole.id)) {
        message.delete(1);

        message.author.send(`Hello, ${message.author.username}.\n\n:warning: Please don't chat in the #suggestions channel, to chat use other channels. :warning:\n\n**If you meant to submit a suggestion, use the following format:**\n!suggest (suggestion)`);
    }
  } else {
    message.delete(1);
      let suggestion = message.content.slice(9);
      let embed = new Discord.RichEmbed()
      .setAuthor("")
      .setColor("#68208e")
      .addField("Suggestion:", `${suggestion}`)
      .addField("Author:", `${message.author.username}`)
      .addField("Date:", `${message.createdAt.toDateString()}`);
      message.channel.send(embed).then(function (message) {
        const agree = message.guild.emojis.find("name", "Agree");
        const disagree = message.guild.emojis.find("name", "Disagree");
        message.react(agree.id)
        message.react(disagree.id)
      }).catch(e => {
        console.log(e);
      });
    }
  } else {
    if(firstMessage === `!clear`) {
      let args = fullMessage.slice(1);
      let commandFile = bot.commands.get(firstMessage.slice(1));
      if(commandFile) commandFile.run(bot, message, args);
    }
  }
});

bot.on("guildMemberAdd", (member) => {
  let memberRole = member.guild.roles.find("name", "Member");
  member.addRole(memberRole).catch(console.error);
  member.send(`Welcome ${member.user.username} to KaosMC's discord.\n\n__**Here are a couple of useful links:**__\n\nIP Address: ${botconfig.server_ip}\nStore: ${botconfig.store}\nWebsite: ${botconfig.website}`);

  let embed = new Discord.RichEmbed()
  .setAuthor("")
  .setColor("#25d136")
  .addField(`**${member.user.username}** has joined.`,  `Check out ${member.guild.channels.get("426471512426414081")} for information.`);
  member.guild.channels.get("434722319320088584").send(embed);
});

bot.on("guildMemberRemove", (member) => {
  let embed = new Discord.RichEmbed()
  .setAuthor("")
  .setColor("#d62035")
  .addField(`**${member.user.username}** has quit.`,  "We hope to see you again!");
  member.guild.channels.get("434722319320088584").send(embed);
});

bot.login(botconfig.token);

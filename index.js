//Requirement
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const ms = require ("ms");
const fs = require ("fs")
bot.commands = new Discord.Collection();

//Start log message
bot.on("ready", async () => {
  console.log('The bot is updated!');
  bot.user.setActivity(".help");
});
//start of code :D


//cmd lets
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  //conding

  if (cmd === `${prefix}dreltbest`) {
    return message.react('♥');
  }


  if (cmd === `${prefix}clear`) {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":x: You don't have permissions for that!");
    if(!args[0]) return message.reply(":x: You need to specify a amount of messages!");
    message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`:white_check_mark: Cleared ${args[0]} messages!`).then(msg => msg.delete(6000));
    });
  }



  if (cmd === `${prefix}dr`) {
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply(":x: You don't have permissions for that!");
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.reply(":x: Couldn't find that user");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply(":x: You didn't specify a role!");
    let gRole = message.guild.roles.find(`name`, role)
    if (!gRole) return message.reply(":x: Couldn't find that role!");

    if(!rMember.roles.has(gRole.id)) return message.reply(":x: That role isn't assigned to that person!");
    await(rMember.removeRole(gRole.id));

    try{
      await rMember.send(`:x: Your role ${gRole.name} is now deleted`)
    }catch(e){
      message.channel.send(`:x: ${rMember} Your role ${gRole.name} is deleted!`)
    }
}


  //.ar @name rolename
  if (cmd === `${prefix}ar`) {
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("You don't have permissions for that!");
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.reply(":x: Couldn't find that user");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply(":x: You didn't specify a role!");
    let gRole = message.guild.roles.find(`name`, role)
    if (!gRole) return message.reply(":x: Couldn't find that role!");

    if(rMember.roles.has(gRole.id)) return message.channel.send(`:x: That role is already assigned to that user`);
    await(rMember.addRole(gRole.id));

    try{
      await rMember.send(`Congrats, you have been given the role ${gRole.name} :tada:`)
    }catch(e){
      message.channel.send(`Congrats to ${rMember} have been given the role ${gRole.name}! :tada:`)
    }
}


  if (cmd === `${prefix}mute`) {
    
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply(":x: no user specified!");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply(":x: You can't mute a Administrator or a Moderator!")
    let muterole = message.guild.roles.find(`name`, "muted");
    //create role
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[] 
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false
          });
        });
      }catch(e){
        console.log(e.stack)
      }
    }
    //end of create role
    let mutetime = args[1];
    if(!mutetime) return message.reply(":x: You didn't specify a time!");

    await(tomute.addRole(muterole.id));
    message.channel.send(`:white_check_mark: <@${tomute.id}> has been muted for ${ms(mutetime)} :mute:`);

    setTimeout(function(){
      tomute.removeRole(muterole.id);
      message.channel.send(`<@${tomute.id}>'s mute has expired! :loud_sound:`);
    }, ms(mutetime));


  //end of command
  }

  if (cmd === `${prefix}flip`) {

    var chance = Math.floor(Math.random() * 2);
    if (chance == 0)
    {
      message.reply("**Your coin landed on Heads!**"); 
    }
    else
    {
      message.reply("**Your coin landed on Tails!**");

    }
  }
  
  if (cmd === `${prefix}help`) {

    let bicon = bot.user.displayAvatarURL;
    let helpEmbed = new Discord.RichEmbed()
    .setDescription ("I am a moderation bot but i have some more commands, here's a list of them!")
    .setColor("#000649")
    .setThumbnail(bicon)
    .addField("**.kick @[NAME] [REASON]: Kicks a user**", ("**You need to have permissions: Kick Members, Administrator or Moderators can't be kicked!**"))
    .addField("**.ban @[NAME] [REASON]: Bans user**", ("**You need to have permissions: Ban Members, Administrator or Moderators can't be kicked!**"))
    .addField("**.report @[NAME] [REASON]: Reporting a user**", ("**Cant kick or ban, just shows a log for administartors to watch, everyone can use this command!**"))
    .addField("**.flip: A good randomizer!**",("**Flips a coin, landing on either Heads or Tails!**"))
    .addField(`**.serverinfo: Shows information about this server!**`, ("**For example member count**"))
    .addField("**.botinfo: Shows information about me!**", ("**For example when i first turned online!**"))
    .addField("**.mute @[NAME] [TIME]S/M/H/D: Muting a member for specified time!**", ("You need to have permissions: Manage Members!"))
    .addField("**.help: A list of all my commands!**", ("**You looking at it right now!**"))
    .addField("**.ar @[NAME] <role>: Assigning a role for a user!**", ("**You need permissions: Manage Members**"))
    .addField("**.dr @[NAME] <role>: removing a role for the specified user**", ("**You need permissions: Manage Members**"))
    .addField("**.clear (AMOUNT OF MESSAGES): Removing specified amount of messages**", ("**You need permissions: Manage Messages!**"))
    .addField("That's all! I also have some easter eggs! Can you found one :thinking:", ("**VERSION 1.0.0**"));

    message.channel.send(helpEmbed);
  }

  //kick cmd
  if (cmd === `${prefix}kick`) {

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!kUser) return message.channel.send(":x: No user specified!")
    let kReason = args.join(" ").slice(22);
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(":x: You don't have permissions for that!")
    if (kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":x: You cant kick a moderator/a administrator!")

    let kickEmbed = new Discord.RichEmbed()
      .setDescription("~Kick~")
      .setColor("#000649")
      .addField("Kicked", `${kUser} with ID: ${kUser.id}`)
      .addField("Kicked By", `<@${message.author.id}> with ID: ${message.author.id}`)
      .addField("Kicked In", message.channel)
      .addField("Time", message.createdAt)
      .addField("Reason", kReason);

    message.guild.member(kUser).kick(kReason);
    message.channel.send(kickEmbed);

    return;
  }

  //ban cmd
  if (cmd === `${prefix}ban`) {


    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!bUser) return message.channel.send(":x: No user specified!")
    let bReason = args.join(" ").slice(22);
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(":x: You don't have permissions for that!")
    if (bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":x: You cant kick a moderator/administrator!")

    let banEmbed = new Discord.RichEmbed()
      .setDescription("~Ban~")
      .setColor("#000649")
      .addField("Banned", `${bUser} with ID: ${bUser.id}`)
      .addField("Banned By", `<@${message.author.id}> with ID: ${message.author.id}`)
      .addField("Banned In", message.channel)
      .addField("Time", message.createdAt)
      .addField("Reason", bReason);

    message.guild.member(bUser).ban(bReason);
    message.channel.send(banEmbed);


    return;
  }






  //report cmd
  if (cmd === `${prefix}report`) {



    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!rUser) return message.channel.send(":x: No user specified.");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
      .setColor("#000649")
      .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
      .addField("Channel", message.channel)
      .addField("Time", message.createdAt)
      .addField("Reason", reason);
  
  
    message.channel.send(reportEmbed);
  
    return;
  }



  if (cmd === `${prefix}serverinfo`) {
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
      .setDescription("Server Inforamtion")
      .setColor("#000649")
      .setThumbnail(sicon)
      .addField("Server Name", message.guild.name)
      .addField("Created On", message.guild.createdAt)
      .addField("Members", message.guild.memberCount)
      .addField(`You Joined`, message.member.joinedAt);

    return message.channel.send(serverembed);
  }



  if (cmd === `${prefix}botinfo`) {

    let botembed = new Discord.RichEmbed()
      .setDescription("Bot Information")
      .setColor("#2d2733")
      .setThumbnail(bicon)
      .addField("I am, for the most a moderation bot. I was made for the hypesquad event Discord Hackweek! For a list of all my commmands do .help!", bot.user.username)
      .addField("First time online", bot.user.createdAt);

    return message.channel.send(botembed);
  }

  

   
});



//login

bot.login(botconfig.token);
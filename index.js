const { Prefix, Status_Text, Status_Type, Server_Port, Ping_Message } = require("./config.js");

const express = require('express');

const app = express(); 

const port = Server_Port;

app.get("/", (request, response) => {

	response.sendFile(__dirname + "/index.html");});

app.listen(port, () => console.log(`Listening to localhost:${port}\n`) );

const Discord = require("discord.js");

const client = new Discord.Client({

    ws: {

        properties: {

            $browser: "Discord iOS"

        },

    },

});

const fs = require("fs");

client.commands = new Discord.Collection();

client.aliases = new Discord.Collection();

client.db = require("quick.db");

client.on("ready", async () => {

  console.log(`Logged in as ${client.user.tag}`);

  client.user

    .setActivity( Status_Text + ` | in ${client.guilds.cache.size} Servers! `, { type: Status_Type })

    .catch(error => console.log(error));

});

client.on("message", async message => {

  if (message.channel.type === "dm") return;

  if (message.author.bot) return;

  if (!message.guild) return;

  if (!message.member)

    message.member = await message.guild.fetchMember(message);

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>`))) {

    return message.channel.send( Ping_Message );

  }

});

let modules = ["fun", "info", "moderation"];

modules.forEach(function(module) {

  fs.readdir(`./commands/${module}`, function(err, files) {

    if (err)

      return new Error(

        "Missing Folder Of Commands! Example : Commands/<Folder>/<Command>.js"

      );

    files.forEach(function(file) {

      if (!file.endsWith(".js")) return;

      let command = require(`./commands/${module}/${file}`);

      console.log(`${command.name} Command Has Been Loaded\n`);

      if (command.name) client.commands.set(command.name, command);

      if (command.aliases) {

        command.aliases.forEach(alias =>

          client.aliases.set(alias, command.name)

        );

      }

      if (command.aliases.length === 0) command.aliases = null;

    });

  });

});

client.on("message", async message => {

  if (message.channel.type === "dm") return;

  if (message.author.bot) return;

  if (!message.guild) return;

  if (!message.member)

    message.member = await message.guild.fetchMember(message);

  if (!message.content.startsWith(Prefix)) return;

  const args = message.content

    .slice(Prefix.length)

    .trim()

    .split(" ");

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command =

    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!command) return;

  if (command) {

    if (!message.guild.me.hasPermission("ADMINISTRATOR"))

      return message.channel.send(

        "I Don't Have Enough Permission To Use This Or Any Of My Commands \nRequire : Administrator"

      );

    command.run(client, message, args);

  }

  console.log(

    `\nUser : ${message.author.tag} \nServer : ${message.guild.name} \nCommand : ${command.name}`

  );

});

client.login(process.env.Token);

//Coded by SX-Spy-Agent#1377 (DO NOT REMOVE THIS!!!)

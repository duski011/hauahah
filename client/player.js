const { DisTube } = require('distube');
const client = require("../index.js");
const { MessageEmbed } = require('discord.js');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YouTubeDLPlugin } = require("@distube/yt-dlp")
const { cookie } = require('../config.json');
const Format = Intl.NumberFormat();
const config = require('../config.json');
let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: false
};

client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: true,
  youtubeCookie: `${cookie}`,
  plugins: [
    new SpotifyPlugin(spotifyoptions),
    new SoundCloudPlugin()
  ]
})
if(config.spotifyapi.enabled) {
  spotifyoptions.api = {
    clientId: config.spotifyapi.clientId,
    clientSecret: config.spotifyapi.clientSecret,
  }}

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filters: \`${queue.filters.join(', ') || 'Off'}\` | Repeat: \`${
     queue.repeatMode ? (queue.repeatMode === 2 ? 'Playlist' : 'Song') : 'Off'
   }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube.on('addSong', (queue, song) =>
  queue.textChannel.send({embeds: [
      new MessageEmbed()
      .setColor('#ccff48')
      .setAuthor({name: 'Added...', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif'})
      .setDescription(`[${song.name}](${song.url})`)
      .setThumbnail(song.thumbnail)
      .addField("🔷 | Status", `
      ┕${status(queue).toString()}`, false)
        .addField('👀 | views', `
        ┕${Format.format(song.views)}`, true)
        .addField('👍 | like', `
        ┕${Format.format(song.likes)}`, true)
        .addField('👎 | dislike', `
        ┕${Format.format(song.dislikes)}`, true)
        .addField('⌛ | Played', `
        ┕${song.formattedDuration}`, true)
        .addField("👌 | request by ",`
        ┕${song.user}`, true)
  ]})
)

client.distube.on('addList', (queue, playlist) =>
    queue.textChannel.send({embeds: [
        new MessageEmbed()
        .setColor('#ccff48')
        .setAuthor({name: 'Added...', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif'})
        .setDescription(`Added [${playlist.name}](${playlist.url}) (${playlist.songs.length} songs) to playlist`)
        .setThumbnail(playlist.thumbnail)
        .addField("🔷 | Status", `
        ┕${status(queue).toString()}`, false)
        .addField('⌛ | Time', `
        ┕${playlist.formattedDuration}`, true)
        .addField("👌 | Requested by",`
        ┕${playlist.user}`, true)
    ]})
)

client.distube.on('playSong', (queue, song) =>
    queue.textChannel.send({embeds: [
        new MessageEmbed()
        .setColor('#ccff48')
        .setAuthor({name: 'Playing...', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif'})
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(song.thumbnail)
        .setColor('#ccff48')
        .setAuthor({name: 'Playing...', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif'})
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(song.thumbnail)
        .addField("🔷 | Status", `
        ┕${status(queue).toString()}`, false)
        .addField('🆙 | Uploaded by', `
        ┕[${song.uploader.name}](${song.uploader.url})`, true)
        .addField('👀 | Listens', `
        ┕${Format.format(song.views)}`, true)
        .addField('👍 | Like', `
        ┕${Format.format(song.likes)}`, true)
        .addField('⌛ | Time', `
        ┕${song.formattedDuration}`, true)
        .addField('📩 | Download link', `
        ┕[Click here](${song.streamURL})`, true)
        .addField("👌 | Requested by",`
        ┕${song.user}`, true)
        .addField('📻 | Play music at', `
        | ${client.channels.cache.get(queue.voiceChannel.id)}
        | ${queue.voiceChannel.bitrate / 1000} kbps`, false)
        .addField("🤖 | Recommended",`[${song.related[0].name}](${song.related[0].url})
        | Time: ${song.related[0].formattedDuration} | | Uploaded by: [${song.related[0].uploader.name}](${song.related[0].uploader.url})`, false)
    ]})
  )
  .on('error', (channel, e) => {
    channel.send(`| An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })
  .on('empty', channel => channel.send({embeds: [
      new MessageEmbed()
      .setColor('#ccff48')
      .setAuthor({name: 'Sold out...', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif'})
      .setDescription('End of songs in playlist')
    ]}))
  .on('searchNoResult', (message, query) =>
    message.channel.send({embeds: [
        new MessageEmbed()
        .setColor('#ccff48')
        .setAuthor({name: 'Not found...', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif'})
        .setDescription(`No songs found with keyword \`${query}\``)
    ]})
  )
  .on('finish', queue => queue.textChannel.send({embeds: [
      new MessageEmbed()
      .setColor('#ccff48')
      .setAuthor({name: 'Sold out...', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif'})
      .setDescription('End of songs in playlist')
    ]}))

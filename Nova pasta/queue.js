

exports.mp3 = async function (message) {
  for (let i = 0; i < queuemp3.length; i++) {
    if (queuemp3[i].from == message.from) {
      console.log(queuemp3[i].from)
      yt.mp3(queuemp3[i])
      queuemp3.splice(i, 1)
    }
  }
}

exports.mp4 = async function (message) {
  for (let i = 0; i < queuemp4.length; i++) {
    if (queuemp4[i].from == message.from) {
      console.log(queuemp4[i].from)
      yt.mp4(queuemp4[i])
      queuemp4.splice(i, 1)
      return
    }
  }
}


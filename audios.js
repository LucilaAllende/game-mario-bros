const INIT_AUDIOS = [
  {
    key: 'gameover',
    path: 'assets/sound/music/gameover.mp3'
  },
  {
    key: 'goomba-stomp',
    path: 'assets/sound/effects/goomba-stomp.wav'
  }
]

export const initAudios = ({ load }) => {
  INIT_AUDIOS.forEach(audio => {
    load.audio(audio.key, audio.path)
  })
}

export const playAudio = (id, { sound }, { volume = 1 } = {}) => {
  try {
    return sound.add(id, {
      loop: false,
      volume
    }).play()
  } catch (error) {
    console.error(error)
  }
}

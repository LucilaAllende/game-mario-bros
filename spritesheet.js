const INIT_SPRITESHEET = [
  {
    key: 'mario',
    url: 'assets/entities/mario.png',
    frameWidth: 18,
    frameHeight: 16
  },
  {
    key: 'goomba',
    url: 'assets/entities/overworld/goomba.png',
    frameWidth: 16,
    frameHeight: 16
  },
  {
    key: 'coin',
    url: 'assets/collectibles/coin.png',
    frameWidth: 16,
    frameHeight: 16
  }
]

export const initSpritesheet = ({ load }) => {
  return INIT_SPRITESHEET.forEach(({ key, url, frameWidth, frameHeight }) => {
    load.spritesheet(key, url, { frameWidth, frameHeight })
  })
}

export const createAnimations = (game) => {
  game.anims.create({
    key: 'mario-walk',
    frames: game.anims.generateFrameNumbers('mario', { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'mario-idle',
    frames: game.anims.generateFrameNumbers('mario', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'mario-jump',
    frames: game.anims.generateFrameNumbers('mario', { start: 5, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'mario-dead',
    frames: game.anims.generateFrameNumbers('mario', { start: 4, end: 4 }),
    frameRate: 10,
    repeat: -1
  });
}


import { createAnimations } from './animations.js'
import { checkControls } from './controls.js'
import { initAudios, playAudio } from './audios.js'
import { initSpritesheet } from './spritesheet.js'

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const game = new Phaser.Game(config)

function preload () {
  this.load.image('cloud', 'assets/scenery/overworld/cloud1.png')
  this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png')
  this.load.image('supermushroom', 'assets/collectibles/super-mushroom.png')
  initSpritesheet(this)
  initAudios(this)
}

function onHitGoomba (mario, goomba) {
  if (mario.body.touching.down && goomba.body.touching.up) {
    goomba.anims.play('goomba-dead', true)
    goomba.setVelocity(0)
    mario.setVelocityY(-200)

    playAudio('goomba-stomp', this)
    addToScore(200, mario, this)

    mario.body.checkCollision.none = true
    mario.setVelocityX(0)

    setTimeout(() => {
      goomba.destroy()
    }, 100)
  } else {
    console.log('Game Over')
    // killMario(this)
  }
}

function killMario (game) {
  const { mario, scene } = game
  if (mario.isDead) return

  mario.isDead = true
  mario.anims.play('mario-dead', true)
  mario.setCollideWorldBounds(false)

  playAudio('gameover', game, 0.2)

  mario.body.checkCollision.none = true
  mario.setVelocityX(0)

  setTimeout(() => {
    mario.setVelocityY(-200)
  }, 100)

  setTimeout(() => {
    scene.restart()
  }, 200)
}

function collectItem (mario, item) {
  const { texture: { key } } = item
  item.destroy()

  if (key === 'coin') {
    playAudio('coin-pickup', this)
    addToScore(100, mario, this)
  } else if (key === 'supermushroom') {
    playAudio('powerup', this)
    this.physics.world.pause()
    this.anims.pauseAll()

    let i = 0
    const interval = setInterval(() => {
      mario.anims.play(i % 2 === 0 ? 'mario-grown-idle' : 'mario-grown-walk', true)
      i++
    }, 100)

    mario.isBlocked = true
    mario.isGrown = true

    setTimeout(() => {
      mario.setDispalySize(18, 32)
      mario.body.setSize(18, 32)
      mario.body.setOffset(0, 0)
      mario.refreshBody()
      mario.isBlocked = false
      clearInterval(interval)
      this.physics.world.resume()
      this.anims.resumeAll()
    }, 1000)
  }
}

function addToScore (scoreToAdd, origin, game) {
  const scoreText = game.add.text(origin.x, origin.y, `+${scoreToAdd}`, {
    fontSize: config.width / 40,
    color: '#fff',
    fontFamily: 'pixel'
  }).setOrigin(0, 1)

  game.tweens.add({
    targets: scoreText,
    y: scoreText.y - 20,
    duration: 500,
    onComplete: () => {
      game.tweens.add({
        targets: scoreText,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          scoreText.destroy()
        }
      })
    }
  })
}

function create () {
  createAnimations(this)

  this.add.image(150, 10, 'cloud').setScale(0.15).setOrigin(0, 0)

  this.floor = this.physics.add.staticGroup()
  this.floor.create(0, config.height - 32, 'floorbricks').setOrigin(0, 0).refreshBody()
  this.floor.create(150, config.height - 32, 'floorbricks').setOrigin(0, 0).refreshBody()

  this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(350)

  this.goomba = this.physics.add.sprite(100, 100, 'goomba')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(350)
    .setVelocityX(-50)

  this.goomba.anims.play('goomba-walk', true)

  this.collectibles = this.physics.add.staticGroup()
  this.collectibles.create(200, 150, 'coin')
    .setOrigin(0, 1)
    .anims.play('coin-idle', true)
  this.collectibles.create(250, 175, 'coin')
    .setOrigin(0, 1)
    .anims.play('coin-idle', true)

  this.collectibles.create(200, config.height - 40, 'supermushroom').anims.play('supermushroom-idle', true)

  this.physics.add.overlap(this.mario, this.collectibles, collectItem, null, this)

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)
  this.physics.add.collider(this.goomba, this.floor)
  this.physics.add.collider(this.mario, this.goomba, onHitGoomba, null, this)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  this.keys = this.input.keyboard.createCursorKeys()
}

function update () {
  const { mario } = this

  checkControls(this)
  if (mario.y >= config.height) {
    killMario(this)
  }
}

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
  initSpritesheet(this)
  initAudios(this)
}

function onHitGoomba (mario, goomba) {
  if (mario.body.touching.down && goomba.body.touching.up) {
    goomba.anims.play('goomba-dead', true)
    goomba.setVelocity(0)
    mario.setVelocityY(-200)
    playAudio('goomba-stomp', this)

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

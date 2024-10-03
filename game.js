import { createAnimations } from './animations.js';

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

new Phaser.Game(config);

function preload() {
  this.load.image('cloud', 'assets/scenery/overworld/cloud1.png');
  this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png');
  this.load.spritesheet('mario', 'assets/entities/mario.png', { frameWidth: 18, frameHeight: 16 });
  this.load.audio('gameover', 'assets/sound/music/gameover.mp3');
}

function create() {

  createAnimations(this);

  this.add.image(150, 10, 'cloud').setScale(0.15).setOrigin(0, 0);

  this.floor = this.physics.add.staticGroup();
  this.floor.create(0, config.height -32, 'floorbricks').setOrigin(0, 0).refreshBody();
  this.floor.create(150, config.height -32, 'floorbricks').setOrigin(0, 0).refreshBody();

  this.mario = this.physics.add.sprite(50, 100, 'mario')
  .setOrigin(0, 1)
  .setCollideWorldBounds(true)
  .setGravityY(350);

  this.physics.world.setBounds(0, 0, 2000, config.height);
  this.physics.add.collider(this.mario, this.floor);

  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);

  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  if(this.mario.isDead) return;
  if (this.keys.right.isDown) {
    this.mario.x += 1;
    this.mario.anims.play('mario-walk', true);
    this.mario.flipX = false;
  }
  if (this.keys.left.isDown) {
    this.mario.x -= 1;
    this.mario.anims.play('mario-walk', true);
    this.mario.flipX = true;
  }
  else{
    this.mario.anims.play('mario-idle', true);
  }

  if(this.keys.up.isDown && this.mario.body.touching.down){
    this.mario.setVelocityY(-200);
    this.mario.anims.play('mario-jump', true);
  }

  if(this.mario.y >= config.height){
    this.mario.isDead = true;
    this.mario.anims.play('mario-dead', true);
    this.mario.setCollideWorldBounds(false);
    this.sound.add('gameover', {
      loop: false,
      volume: 0.5
    }).play();
    setTimeout(() => {
      this.mario.setVelocityY(-200);
    }, 100);

    setTimeout(() => {
      this.scene.restart();
    }, 200);
  }
}
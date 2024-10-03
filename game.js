

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
}

function create() {
  this.anims.create({
    key: 'mario-walk',
    frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'mario-idle',
    frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'mario-jump',
    frames: this.anims.generateFrameNumbers('mario', { start: 4, end: 4 }),
    frameRate: 10,
    repeat: -1
  });

  this.add.image(150, 10, 'cloud').setScale(0.15).setOrigin(0, 0);
  this.add.tileSprite(0, config.height, config.width, 32, 'floorbricks').setOrigin(0, 1);

  this.mario = this.add.sprite(50, 215, 'mario').setOrigin(0, 1);
  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
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

  if(this.keys.up.isDown){
    this.mario.y -= 5;
    this.mario.anims.play('mario-jump', true);
  }
}
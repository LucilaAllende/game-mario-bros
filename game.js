

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: '#049cd8',
  parent: 'game',
  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config);

function preload() {
  console.log('preload');
  this.load.image('cloud', 'assets/scenery/overworld/cloud1.png');
  this.load.spritesheet('mario', 'assets/entities/mario.png', { frameWidth: 18, frameHeight: 16 });
  this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png');
}

function create() {
  this.add.image(150, 10, 'cloud').setScale(0.15).setOrigin(0, 0);
  this.mario = this.add.sprite(50, 215, 'mario').setOrigin(0, 1);
  this.add.tileSprite(0, config.height, config.width, 32, 'floorbricks').setOrigin(0, 1);

  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.keys.right.isDown) {
    this.mario.x += 1;
  }
  if (this.keys.left.isDown) {
    this.mario.x -= 1;
  }
  if (this.keys.up.isDown) {
    this.mario.y -= 1;
  }
  if (this.keys.down.isDown) {
    this.mario.y += 1;
  }
}
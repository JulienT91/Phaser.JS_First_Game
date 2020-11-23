let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  let game = new Phaser.Game(config);
  let score = 0;
  let scoreText = null;
  console.log("ok");
  function preload() {
    // background
    this.load.image("tunnel", "assets/img/bcg/tunnel.jpg");
    // platforms
    this.load.image("ground", "assets/img/platforms/platform.png");
    // characters
    this.load.spritesheet("heroes", "assets/img/heroes/characters.png", {
      frameWidth: 78,
      frameHeight: 98
    });
    //item
    this.load.image("diamond", "assets/img/item/diamond.png");
  }
  let players;
  let plaforms;
  function create() {
    this.add.image(300, 275, "tunnel");

    platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 568, "ground")
      .setScale(2)
      .refreshBody();
    platforms.create(520, 400, "ground");
    platforms.create(20, 270, "ground");
    platforms.create(570, 150, "ground");

    players = this.physics.add.sprite(100, 450, "heroes");
    players.body.setGravityY(300);
    players.collider;
    players.setBounce(0.5);
    players.setCollideWorldBounds(true);
    this.physics.add.collider(players, platforms);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("heroes", {
        start: 13,
        end: 12
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "heroes", frame: 15 }],
      frameRate: 20
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("heroes", {
        start: 13,
        end: 12
      }),
      frameRate: 10,
      repeat: -1
    });

    let diamond = this.physics.add.group({
      key: "diamond",
      repeat: 14,
      setXY: { x: 50, y: 0, stepX: 30 }
    });

    this.physics.add.collider(diamond, platforms);

    diamond.children.iterate(function(child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.5));
    });

    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#fff"
    });

    this.physics.add.overlap(players, diamond, collect, null, this);
    this.players = players;
  }

  function update() {
    let cursors = this.cursors;
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      players.setVelocityX(-160);

      players.anims.play("left", true);
    } else if (cursors.right.isDown) {
      players.setVelocityX(160);

      players.anims.play("right", true);
    } else {
      players.setVelocityX(0);

      players.anims.play("turn");
    }

    if (cursors.up.isDown && players.body.touching.down) {
      players.setVelocityY(-430);
      players.anims.play("turn");
    }
    if (score == 300 || score == 620 || score == 940) {
      let diamond = this.physics.add.group({
        key: "diamond",
        repeat: 14,
        setXY: { x: 50, y: 0, stepX: 30 }
      });
      score += 20;
      this.physics.add.collider(diamond, platforms);
      this.physics.add.overlap(players, diamond, collect, null, this);
    }
  }

  function collect(players, diamond) {
    diamond.disableBody(true, true);

    score += 20;
    this.scoreText.setText("Score: " + score);
  }
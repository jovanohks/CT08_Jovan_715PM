let canvasWidth = 960;
let canvasHeight = 540;
let floorY;

let gameState = "title";
let roundNumber = 1;

let player;
let enemy;

let playerBullets = [];
let enemyBullets = [];

let stars = [];

const WEAPONS = {
  sword: {
    label: "Sword",
    damage: 25,
    cooldown: 500,
    ammo: Infinity,
    maxAmmo: Infinity,
    range: 85,
    projectile: false,
    color: "#7fe8ff",
  },
  machineGun: {
    label: "Machine Gun",
    damage: 7,
    cooldown: 120,
    ammo: 80,
    maxAmmo: 80,
    range: 500,
    projectile: true,
    speed: 9.5,
    color: "#ffc857",
  },
  rifle: {
    label: "Rifle",
    damage: 18,
    cooldown: 260,
    ammo: 24,
    maxAmmo: 24,
    range: 620,
    projectile: true,
    speed: 11,
    color: "#7dff9e",
  },
};

let controlsPrompt =
  "A / D move    SPACE jump    SHIFT crouch    LEFT CLICK fire    1/2/3 weapon";

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  floorY = height - 68;

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.8),
      r: random(1, 3),
      alpha: random(80, 220),
    });
  }

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  createPlayer();
  createEnemy();
  gameState = "title";
}

function draw() {
  drawBackground();

  if (gameState === "title") {
    drawTitleScreen();
    return;
  }

  if (gameState === "playing") {
    updatePlayer();
    updateEnemyAI();
    updateBullets();
    checkEndConditions();
  }

  drawArena();
  drawPlayer();
  drawEnemy();
  drawBullets();
  drawHUD();

  if (gameState === "won") {
    drawEndScreen("MISSION COMPLETE", "Press ENTER or R to play again");
  } else if (gameState === "lost") {
    drawEndScreen("MISSION FAILED", "Press ENTER or R to try again");
  }
}

function drawBackground() {
  background(7, 10, 22);
  for (const star of stars) {
    fill(140, 210, 255, star.alpha);
    circle(star.x, star.y, star.r * 2);
  }
}

function drawArena() {
  noStroke();
  fill(13, 22, 36);
  rect(0, floorY, width, height - floorY);

  stroke(85, 210, 255, 120);
  strokeWeight(2);
  line(0, floorY, width, floorY);

  noStroke();
  fill(25, 48, 70);
  for (let x = 0; x < width; x += 80) {
    rect(x, floorY + 25, 35, 20, 4);
  }
}

function drawTitleScreen() {
  textAlign(CENTER, CENTER);

  fill(110, 230, 255);
  textSize(32);
  text("NEON FRONTIER", width / 2, height * 0.34);

  fill(220, 230, 240);
  textSize(18);
  text("Sci-Fi Arena Duel", width / 2, height * 0.42);

  fill(130, 200, 255);
  textSize(16);
  text(controlsPrompt, width / 2, height * 0.5);

  fill(90, 255, 180);
  textSize(20);
  text("Press ENTER to start", width / 2, height * 0.62);

  drawPlayerPreview();
  drawEnemyPreview();
}

function drawPlayerPreview() {
  const previewX = width * 0.35;
  const previewY = height * 0.72;

  fill(71, 228, 255);
  rectMode(CENTER);
  rect(previewX, previewY, 34, 60, 8);

  fill(220, 255, 255);
  rect(previewX + 8, previewY - 18, 8, 8, 2);
  rectMode(CORNER);
}

function drawEnemyPreview() {
  const previewX = width * 0.65;
  const previewY = height * 0.72;

  fill(255, 96, 120);
  rectMode(CENTER);
  rect(previewX, previewY, 52, 68, 10);

  fill(255, 235, 228);
  rect(previewX - 11, previewY - 16, 8, 8, 2);
  rect(previewX + 11, previewY - 16, 8, 8, 2);
  rectMode(CORNER);
}

function createPlayer() {
  player = {
    x: 140,
    y: floorY - 32,
    width: 36,
    height: 58,
    velocityY: 0,
    onGround: true,
    speed: 5.2,
    health: 100,
    maxHealth: 100,
    lastShot: 0,
    shotDelay: 260,
    crouching: false,
    facing: 1,
    weapon: "rifle",
  };
}

function createEnemy() {
  const isBoss = roundNumber === 3;
  enemy = {
    x: width - 180,
    y: floorY - 36,
    width: isBoss ? 68 : 50,
    height: isBoss ? 82 : 64,
    health: isBoss ? 200 : 65 + roundNumber * 25,
    maxHealth: isBoss ? 200 : 65 + roundNumber * 25,
    speed: isBoss ? 2.6 : 1.8 + roundNumber * 0.45,
    shotDelay: isBoss ? 900 : 1200 - roundNumber * 120,
    lastShot: 0,
    velocityY: 0,
    onGround: true,
    crouching: false,
    facing: -1,
  };
}

function drawPlayer() {
  if (!player) return;

  const bodyX = player.x;
  const bodyY = player.y;
  const bodyH = player.crouching ? 36 : 58;
  const facing = player.facing;

  rectMode(CENTER);
  noStroke();

  fill(70, 230, 255);
  rect(bodyX, bodyY, player.width, bodyH, 8);

  fill(210, 255, 255);
  rect(bodyX + 8 * facing, bodyY - bodyH * 0.35, 8, 8, 2);

  if (facing === -1) {
    fill(60, 180, 210);
    rect(bodyX - 18, bodyY + 6, 12, 3);
  } else {
    fill(60, 180, 210);
    rect(bodyX + 18, bodyY + 6, 12, 3);
  }

  drawWeaponSprite(bodyX, bodyY, bodyH, facing, player.weapon);

  rectMode(CORNER);
}

function drawWeaponSprite(x, y, bodyHeight, facing, weaponName) {
  const weapon = WEAPONS[weaponName];
  const offsetX = facing * 20;
  const offsetY = y + 2;

  noStroke();

  if (weaponName === "sword") {
    fill(weapon.color);
    push();
    translate(x + offsetX, offsetY);
    rotate(facing === 1 ? 0 : PI);
    triangle(0, -10, 34, 0, 0, 10);
    pop();
    return;
  }

  if (weaponName === "machineGun") {
    fill("#e3b75a");
    rect(x + facing * 14, offsetY - 5, facing * 28, 8, 3);

    fill("#3d4e5b");
    rect(x + facing * 18, offsetY - 9, facing * 12, 6, 2);

    fill(weapon.color);
    rect(x + facing * 30, offsetY - 6, facing * 10, 4, 2);
    return;
  }

  fill("#2d3d4a");
  rect(x + facing * 14, offsetY - 5, facing * 28, 8, 3);

  fill(weapon.color);
  rect(x + facing * 30, offsetY - 4, facing * 18, 4, 2);

  fill("#111827");
  rect(x + facing * 10, offsetY - 9, facing * 8, 5, 2);
}

function drawEnemy() {
  if (!enemy) return;

  const bodyX = enemy.x;
  const bodyY = enemy.y;
  const bodyH = enemy.height;
  const isBoss = roundNumber === 3;

  rectMode(CENTER);
  noStroke();
  fill(255, isBoss ? 80 : 150, isBoss ? 130 : 80);
  rect(bodyX, bodyY, enemy.width, bodyH, 12);

  fill(255, 230, 220);
  rect(bodyX - 12, bodyY - bodyH * 0.35, 8, 8, 2);
  rect(bodyX + 12, bodyY - bodyH * 0.35, 8, 8, 2);

  fill(255, 95, 120);
  rect(bodyX - enemy.width / 2, bodyY - bodyH / 2 - 18, enemy.width, 8, 5);

  rectMode(CORNER);
}

function drawBullets() {
  noStroke();
  for (const bullet of playerBullets) {
    fill(90, 255, 255);
    circle(bullet.x, bullet.y, bullet.radius * 2);
  }
  for (const bullet of enemyBullets) {
    fill(255, 110, 140);
    circle(bullet.x, bullet.y, bullet.radius * 2);
  }
}

function drawHUD() {
  const barWidth = 260;
  const barX = 22;
  const enemyBarX = width - barWidth - 22;
  const weaponData = WEAPONS[player.weapon];

  drawHealthBar(barX, 20, barWidth, 18, player.health, player.maxHealth, "PILOT");
  drawHealthBar(
    enemyBarX,
    20,
    barWidth,
    18,
    enemy ? enemy.health : 0,
    enemy ? enemy.maxHealth : 100,
    roundNumber === 3 ? "BOSS" : "RIVAL"
  );

  textAlign(CENTER, TOP);
  fill(210, 230, 240);
  textSize(18);
  text("ROUND " + roundNumber, width / 2, 18);

  const ammoText =
    Number.isFinite(weaponData.ammo) && Number.isFinite(weaponData.maxAmmo)
      ? weaponData.ammo + "/" + weaponData.maxAmmo
      : "∞";

  textAlign(LEFT, TOP);
  fill(weaponData.color);
  textSize(14);
  text(weaponData.label + "  Ammo: " + ammoText, 24, 48);

  textAlign(CENTER, CENTER);
  fill(130, 200, 255);
  textSize(13);
  text(controlsPrompt, width / 2, height - 18);
}

function drawHealthBar(x, y, w, h, currentHealth, maxHealth, label) {
  const ratio = constrain(currentHealth / maxHealth, 0, 1);

  textAlign(LEFT, CENTER);
  fill(220, 240, 255);
  textSize(12);
  text(label, x, y - 10);

  fill(25, 35, 46);
  rect(x, y, w, h, 8);

  fill(label === "PILOT" ? color(70, 230, 180) : color(255, 100, 130));
  rect(x, y, w * ratio, h, 8);
}

function updatePlayer() {
  if (!player) return;

  const leftKey = keyIsDown(65);
  const rightKey = keyIsDown(68);

  if (leftKey && !rightKey) {
    player.x -= player.speed;
    player.facing = -1;
  } else if (rightKey && !leftKey) {
    player.x += player.speed;
    player.facing = 1;
  }

  player.x = constrain(player.x, 55, width - 55);

  player.crouching = keyIsDown(16);

  const targetHeight = player.crouching ? 36 : 58;
  if (player.height !== targetHeight) {
    player.height = lerp(player.height, targetHeight, 0.25);
  }

  if (player.onGround && keyIsDown(32)) {
    player.velocityY = -13.5;
    player.onGround = false;
  }

  player.velocityY += 0.72;
  player.y += player.velocityY;

  const groundY = floorY - player.height / 2;
  if (player.y >= groundY) {
    player.y = groundY;
    player.velocityY = 0;
    player.onGround = true;
  }

  if (
    mouseIsPressed &&
    mouseButton === LEFT &&
    millis() - player.lastShot >= WEAPONS[player.weapon].cooldown
  ) {
    firePlayerWeapon();
  }
}

function updateEnemyAI() {
  if (!enemy) return;

  enemy.crouching = false;

  const desiredDirection = player.x < enemy.x ? -1 : 1;
  enemy.facing = desiredDirection;
  enemy.x += desiredDirection * enemy.speed;

  enemy.x = constrain(enemy.x, 80, width - 80);

  if (random() < 0.015 && enemy.onGround) {
    enemy.velocityY = -12.5;
    enemy.onGround = false;
  }

  enemy.velocityY += 0.7;
  enemy.y += enemy.velocityY;

  const groundY = floorY - enemy.height / 2;
  if (enemy.y >= groundY) {
    enemy.y = groundY;
    enemy.velocityY = 0;
    enemy.onGround = true;
  }

  if (millis() - enemy.lastShot > enemy.shotDelay) {
    shootEnemyBullet();
    enemy.lastShot = millis();
  }
}

function updateBullets() {
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const bullet = playerBullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    bullet.life -= 1;

    const hitEnemy = dist(bullet.x, bullet.y, enemy.x, enemy.y) < enemy.width * 0.7;
    if (hitEnemy) {
      enemy.health -= WEAPONS[player.weapon].damage;
      playerBullets.splice(i, 1);
      continue;
    }

    if (
      bullet.life <= 0 ||
      bullet.x < -20 ||
      bullet.x > width + 20 ||
      bullet.y < -20 ||
      bullet.y > height + 20
    ) {
      playerBullets.splice(i, 1);
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    bullet.life -= 1;

    const hitPlayer = dist(bullet.x, bullet.y, player.x, player.y) < player.width * 0.8;
    if (hitPlayer) {
      player.health -= roundNumber === 3 ? 12 : 10;
      enemyBullets.splice(i, 1);
      continue;
    }

    if (
      bullet.life <= 0 ||
      bullet.x < -20 ||
      bullet.x > width + 20 ||
      bullet.y < -20 ||
      bullet.y > height + 20
    ) {
      enemyBullets.splice(i, 1);
    }
  }
}

function firePlayerWeapon() {
  const weapon = WEAPONS[player.weapon];

  if (weapon.ammo !== Infinity && weapon.ammo <= 0) {
    return;
  }

  if (millis() - player.lastShot < weapon.cooldown) {
    return;
  }

  const enemyInFront =
    player.facing === 1 ? enemy.x >= player.x : enemy.x <= player.x;

  if (!enemyInFront) {
    return;
  }

  if (weapon.ammo !== Infinity) {
    weapon.ammo -= 1;
  }

  player.lastShot = millis();

  if (weapon.projectile) {
    const angle = atan2(enemy.y - player.y, enemy.x - player.x);
    const speed = weapon.speed;

    playerBullets.push({
      x: player.x + cos(angle) * 26,
      y: player.y + sin(angle) * 20,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      life: 90,
      radius: 5,
    });
  } else {
    const distanceToEnemy = dist(player.x, player.y, enemy.x, enemy.y);
    const inRange = distanceToEnemy < weapon.range + 20;
    if (inRange) {
      enemy.health -= weapon.damage;
    }
  }
}

function shootEnemyBullet() {
  const angle = atan2(player.y - enemy.y, player.x - enemy.x);
  const speed = roundNumber === 3 ? 6.8 : 5.4;

  enemyBullets.push({
    x: enemy.x + cos(angle) * 24,
    y: enemy.y + sin(angle) * 24,
    vx: cos(angle) * speed,
    vy: sin(angle) * speed,
    life: 140,
    radius: 6,
  });
}

function checkEndConditions() {
  if (player.health <= 0) {
    gameState = "lost";
    return;
  }

  if (enemy.health <= 0) {
    if (roundNumber >= 3) {
      gameState = "won";
      return;
    }

    roundNumber += 1;
    resetPlayerAmmo();
    createEnemy();
  }
}

function resetPlayerAmmo() {
  WEAPONS.sword.ammo = Infinity;
  WEAPONS.machineGun.ammo = WEAPONS.machineGun.maxAmmo;
  WEAPONS.rifle.ammo = WEAPONS.rifle.maxAmmo;
}

function drawEndScreen(titleText, subtitleText) {
  fill(5, 9, 20, 200);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  fill(titleText === "MISSION COMPLETE" ? color(90, 255, 180) : color(255, 110, 130));
  textSize(30);
  text(titleText, width / 2, height * 0.42);

  fill(220, 240, 255);
  textSize(18);
  text(subtitleText, width / 2, height * 0.52);
}

function keyPressed() {
  if (gameState === "title" && (keyCode === ENTER || key === " ")) {
    startGame();
    return;
  }

  if (gameState === "won" || gameState === "lost") {
    if (keyCode === ENTER || key === "r" || key === "R") {
      startGame();
    }
    return;
  }

  if (key === "1") {
    player.weapon = "sword";
  } else if (key === "2") {
    player.weapon = "machineGun";
  } else if (key === "3") {
    player.weapon = "rifle";
  } else if (key === "r" || key === "R") {
    if (player.weapon !== "sword") {
      WEAPONS[player.weapon].ammo = WEAPONS[player.weapon].maxAmmo;
    }
  }

  if (keyCode === 32 && player.onGround) {
    player.velocityY = -13.5;
    player.onGround = false;
  }
}

function mousePressed() {
  if (gameState === "title") {
    startGame();
    return;
  }

  if (gameState === "playing" && mouseButton === LEFT) {
    firePlayerWeapon();
  }
}

function startGame() {
  roundNumber = 1;
  createPlayer();
  createEnemy();
  resetPlayerAmmo();
  player.health = 100;
  player.maxHealth = 100;
  enemy.health = enemy.maxHealth;
  playerBullets = [];
  enemyBullets = [];
  gameState = "playing";
}

function windowResized() {
  resizeCanvas(canvasWidth, canvasHeight);
}
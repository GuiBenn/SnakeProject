class Target {

  constructor(x, y, image) {
    this.pos = createVector(x, y);
    this.image = image;
    this.size = 30;
  }

  show() {
    // pour image centrée
    image(this.image, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
  }

  // Fonction pour vérifier la collision entre 2 objets
  checkCollision(x, y, width, height) {
    return (
      x - width / 2 < this.pos.x + this.size / 2 && // bord gauche touche bord droit, etc.
      x + width / 2 > this.pos.x - this.size / 2 &&
      y - height / 2 < this.pos.y + this.size / 2 &&
      y + height / 2 > this.pos.y - this.size / 2
      // verifie chevauchement
    );
  }
}

function spawnApple() {
  // évite bord canvas
  apple = new Target(random(20, width - 20), random(20, height - 20), appleImage);
}

function spawnApples() {
  apples = [];
  let numberOfApples = 5;
  for (let i = 0; i < numberOfApples; i++) {
    // évite bord canvas
    let newApple = new Target(random(20, width - 20), random(20, height - 20), appleImage);
    apples.push(newApple);
  }
}
let nbVehicles = 1;
let vehicles = [];

let apple;
let apples = [];
let badApples = [];

let targets = [];

let menuMode = false;
let autoMode = false;
let vFormationMode = false;

let font;
let snakeHeadImage;
let appleImage;
let badAppleImage;

function createVehicles(nbVehicles) {
  vehicles = [];
  for (let i = 0; i < nbVehicles; i++) {
    let x = width / 2;
    let y = height / 2;
    let shape = 'circle';
    if (i === 0 && !menuMode) {
      // 1er véhicule (tête snake)
      shape = 'triangle';
    }
    vehicles.push(new Vehicle(x, y, shape));
    // véhicules après le 1er
  }
}

function menuTargets() {
  // génère les positions des cibles du menu
  let points = font.textToPoints('Snake', 500, 400, 300, {sampleFactor: 0.15});

  // créer les cibles du menu
  targets = [];
  points.forEach(pt => {
    let target = createVector(pt.x, pt.y);
    targets.push(target);
  });

  // ajuste le nombre de véhicules au nombre de ciblesvc
  if (vehicles.length < targets.length) {
    for (let i = vehicles.length; i < targets.length; i++) {
      vehicles.push(new Vehicle(random(width), random(height), 'circle'));
    }
  } else if (vehicles.length > targets.length) {
    vehicles.splice(targets.length, vehicles.length - targets.length);
  }
}

function addVehicle() {
  // ajouter véhicule dans la queue
  let newVehicle = new Vehicle(vehicles[vehicles.length - 1].pos.x, vehicles[vehicles.length - 1].pos.y, 'circle');
  vehicles.push(newVehicle);

  // ajouter véhicule dans la queue selon formationV
  if (vFormationMode) {
    updateVFormation();
  }
}

function resetGame() {
  vehicles = [];
  createVehicles(1);

  apples = [];
  badApples = [];

  if (autoMode) {
    spawnApples();
  } else {
    spawnApple();
  }
}

function updateVFormation() {
  // donne vecteur avec position précise tête
  let headDirection = vehicles[0].vel.copy().normalize();

  let distanceVehicle = 40;
  let offset = 20;

  for (let i = 1; i < vehicles.length; i++) {
    let vehicle = vehicles[i];

    let distanceBehind = distanceVehicle * ((i + 1) / 2);
    let lateralPos = offset * Math.ceil(i / 2);

    if (i % 2 === 0) {
      lateralPos *= -1;
    }

    // creer vecteur direction opposé à la tête (derrire)
    let backOffset = p5.Vector.mult(headDirection, -distanceBehind);
    // creer vecteur perpendiculaire qui respecte offset lateral
    let offsetPos = new p5.Vector(-headDirection.y, headDirection.x).mult(lateralPos);

    // combine position et décalage en arriere et lateral pour avoir position finale
    vehicle.pos = p5.Vector.add(p5.Vector.add(vehicles[0].pos, backOffset), offsetPos);

    vehicle.update();
    vehicle.show();
  }
}

function spawnBadApples() {
  if (badApples.length < 5) {
    let delay = random(3000, 5000); // temps pour commencer a faire apparaite
    setTimeout(() => {
      let badApple = new Target(random(20, width - 20), random(20, height - 20), badAppleImage);
      badApples.push(badApple);

      setTimeout(() => {
        let index = badApples.indexOf(badApple);
        if (index >= 0) {
          badApples.splice(index, 1);
        }
      }, random(2000, 5000)); // temps d'apparition

      spawnBadApples();
    }, delay);
  } else {
    // si trop de pomme on recommence plus tard
    setTimeout(spawnBadApples, 1000);
  }
}
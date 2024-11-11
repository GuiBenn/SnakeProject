function preload() {
  font = loadFont('assets/Arial.ttf');

  snakeHeadImage = loadImage('assets/snake.png');
  appleImage = loadImage('assets/apple.png');
  badAppleImage = loadImage('assets/poisonedApple.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  createVehicles(nbVehicles);

  if (autoMode) {
    spawnApples();
  } else {
    spawnApple();
  }
  spawnBadApples();
}


function draw() {
  // couleur pour effacer l'écran
  background(241, 226, 190);
  // pour effet psychédélique
  //background(0, 0, 0, 10);

  // -------------------------------------------------------------- //
  // JEU SNAKE
  // -------------------------------------------------------------- //

  if (!menuMode) {
    let target;
    // -------------------------------------------------------------- //
    // Mode Snake AUTO
    // -------------------------------------------------------------- //

    if (autoMode) {
      // tête du snake cherche pomme la plus proche
      let head = vehicles[0];
      let closestApple = null;
      let minDistance = Infinity;

      apples.forEach(apple => {
        let d = p5.Vector.dist(head.pos, apple.pos);
        if (d < minDistance) {
          minDistance = d;
          closestApple = apple;
        }
      });

      if (closestApple) {
        // cible devient pomme la plus proche
        target = closestApple.pos.copy();
      }

      // evite les pommes empoisonnees
      badApples.forEach(badApple => {
        let avoidForce = head.avoid(badApple.pos, 100);
        head.applyForce(avoidForce);
      });

      // afficher les pommes
      apples.forEach(apple => {
        apple.show();
      });
      badApples.forEach(badApple => {
        badApple.show();
      });
    }

    // -------------------------------------------------------------- //
    // Mode Snake MANUEL
    // -------------------------------------------------------------- //
    else {
      // Cible qui suit la souris
      target = createVector(mouseX, mouseY);

      // afficher la ou les pommes
      apple.show();
      badApples.forEach(badApple => {
        badApple.show();
      });
    }

    // -------------------------------------------------------------- //
    // Dans les 2 modes (manuel et auto)
    // -------------------------------------------------------------- //

    // COMPORTEMENT 1er VÉHICULE

    // comportement arrive normal
    let head = vehicles[0];
    let steering = head.arrive(target);
    // On applique la force au véhicule
    head.applyForce(steering);
    head.update();

    // afficher la tête snake centrée
    let snakeHeadSize = 50;
    image(snakeHeadImage, head.pos.x - snakeHeadSize / 2, head.pos.y - snakeHeadSize / 2, snakeHeadSize, snakeHeadSize);

    // -------------------------------------------------------------- //
    // MANGER POMME

    // collision tête avec pommes mode auto
    if (autoMode) {
      for (let i = apples.length - 1; i >= 0; i--) {
        let apple = apples[i];
        if (apple.checkCollision(head.pos.x, head.pos.y, snakeHeadSize, snakeHeadSize)) {
          apples.splice(i, 1);
          addVehicle();

          // nouvelle pomme
          let newApple = new Target(random(20, width - 20), random(20, height - 20), appleImage);
          apples.push(newApple);
        }
      }
    }
    // collision tête avec pomme en mode manuel
    else {
      if (apple.checkCollision(head.pos.x, head.pos.y, snakeHeadSize, snakeHeadSize)) {
        spawnApple();
        addVehicle();
      }
    }

    // -------------------------------------------------------------- //
    // MANGER POMMES EMPOISONNÉES

    for (let i = badApples.length - 1; i >= 0; i--) {
      let badApple = badApples[i];
      if (badApple.checkCollision(head.pos.x, head.pos.y, snakeHeadSize, snakeHeadSize)) {
        resetGame();
      }
    }

    // collision de la queue avec les pommes empoisonnées
    for (let i = 1; i < vehicles.length; i++) {
      let vehicle = vehicles[i];
      for (let j = badApples.length - 1; j >= 0; j--) {
        let badApple = badApples[j];
        if (badApple.checkCollision(vehicle.pos.x, vehicle.pos.y, vehicle.r, vehicle.r)) {
          resetGame();
        }
      }
    }

    // -------------------------------------------------------------- //
    // PERDU

    // collision tête avec les bords
    if (
      head.pos.x < snakeHeadSize / 2 ||
      head.pos.x > width - snakeHeadSize / 2 ||
      head.pos.y < snakeHeadSize / 2 ||
      head.pos.y > height - snakeHeadSize / 2
    ) {
      resetGame();
    }

    // collision tête avec véhicule de la queue
    for (let i = 3; i < vehicles.length; i++) {
      let vehicle = vehicles[i];
      if (p5.Vector.dist(head.pos, vehicle.pos) < snakeHeadSize / 2) {
        resetGame();
      }
    }

    // -------------------------------------------------------------- //
    // COMPORTEMENT VÉHICULES QUEUE 

    if (!vFormationMode) {
      // mode normal
      for (let i = 1; i < vehicles.length; i++) {
        let vehicle = vehicles[i];
        let leader = vehicles[i - 1];
        let newTarget = leader.pos.copy();
        // Le dernier paramètre est la distance derrière le véhicule
        // précédent
        let steering = vehicle.arrive(newTarget, 15);

        // On applique la force au véhicule
        vehicle.applyForce(steering);

        // evite les pommes empoisonnées en mode auto
        if (autoMode) {
          badApples.forEach(badApple => {
            let avoidForce = vehicle.avoid(badApple.pos, 100);
            vehicle.applyForce(avoidForce);
          });
        }

        vehicle.update();
        vehicle.show();
      }
    } else {
      // Mode V Formation
      updateVFormation();
    }

  // -------------------------------------------------------------- //
  // AFFICHAGE MENU
  // -------------------------------------------------------------- //

  } else {
    // on parcourt le tableau des véhicules
    vehicles.forEach((vehicle, index) => {
      let target = targets[index % targets.length];
      let steering = vehicle.arrive(target, 0);

      let mouse = createVector(mouseX, mouseY);

      // comportement répulsion avec la souris
      let repulsionForce = vehicle.repulsion(mouse, 100);
      repulsionForce.mult(5);

      vehicle.applyForce(steering);
      vehicle.applyForce(repulsionForce);

      vehicle.update();
      vehicle.show();
    });

  }
}

// -------------------------------------------------------------- //
// -------------------------------------------------------------- //

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
  if (key === 'm') {
    menuMode = !menuMode;
    if (menuMode) {
      menuTargets();
    } else {
      resetGame();
    }
  }
  if (key === 'a') {
    autoMode = !autoMode;
    resetGame();
  }
  if (key === 'v') {
    vFormationMode = !vFormationMode;
    if (vFormationMode) {
      updateVFormation();
    } 
  }
}
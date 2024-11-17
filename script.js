// Configuration
const terrains = ["water", "land", "forest"];
const terrainSpeeds = {
  snake: { water: 3, land: 1, forest: 1 },
  horse: { water: 1, land: 3, forest: 1 },
  monkey: { water: 1, land: 1, forest: 3 },
};
const foodBoosts = {
  "🍌": { monkey: 50 },  // Boost for monkey with banana
  "🍳": { snake: 50 },    // Boost for snake with egg
  "🌿": { horse: 50 },    // Boost for horse with grass
};
const animals = {
  snake: document.getElementById("snake"),
  horse: document.getElementById("horse"),
  monkey: document.getElementById("monkey"),
};
const foods = [...document.querySelectorAll(".food")];

// Initialize game
function setupGame() {
  // Randomize terrains
  const terrainElements = document.querySelectorAll(".terrain");
  terrainElements.forEach((terrain, index) => {
    const randomType = terrains[Math.floor(Math.random() * terrains.length)];
    terrain.dataset.type = randomType;
    terrain.style.backgroundColor = randomType === "water" ? "#87CEEB" : randomType === "land" ? "#8B4513" : "#228B22";
  });

  // Randomize food placement across all terrains (ensuring food on last two terrains as well)
  const containerHeight = document.getElementById("game-container").offsetHeight;
  const numFoodItems = foods.length;
  const numTerrains = terrainElements.length - 1;

  // Assign food to each terrain
  for (let i = 0; i < numFoodItems; i++) {
    const food = foods[i];
    
    // Ensure that the food is placed on any terrain (including the last two)
    const terrainIndex = i % numTerrains;  // This ensures food is evenly distributed across all terrains
    const terrain = terrainElements[terrainIndex];

    const terrainRect = terrain.getBoundingClientRect();
    
    // Random position within the terrain (ensuring food stays within boundaries)
    const randomLeft = Math.random() * (terrainRect.width - food.offsetWidth);  // Random horizontal position
    const randomTop = Math.random() * (terrainRect.height - food.offsetHeight);  // Random vertical position, adjusted for food height

    // Set food position relative to terrain's position on the page
    food.style.left = `${randomLeft + terrainRect.left}px`;
    food.style.top = `${randomTop + terrainRect.top}px`;
  }
}

// Start race
function startRace() {
  let raceInProgress = true;  // Track if the race is still going

  const interval = setInterval(() => {
    if (!raceInProgress) return;  // Stop the race once it's over

    Object.keys(animals).forEach((animalKey) => {
      const animal = animals[animalKey];
      const currentTop = parseInt(animal.style.top || "10");
      const terrainIndex = Math.floor(currentTop / 100);
      const terrainType = document.querySelector(`#terrain${terrainIndex + 1}`)?.dataset.type || "land";

      // Get base speed
      let speed = terrainSpeeds[animalKey][terrainType];

      // Variable to hold total boost from foods
      let totalBoost = 0;

      // Check for food boost and compatibility
      foods.forEach((food) => {
        const foodRect = food.getBoundingClientRect();
        const animalRect = animal.getBoundingClientRect();
        if (
          animalRect.x < foodRect.x + foodRect.width &&
          animalRect.x + animalRect.width > foodRect.x &&
          animalRect.y < foodRect.y + foodRect.height &&
          animalRect.y + animalRect.height > foodRect.y
        ) {
          // Check if food is compatible with the animal
          const boost = foodBoosts[food.textContent]?.[animalKey] || 0;
          if (boost > 0) {
            // Add boost to total boost
            totalBoost += boost;
            food.style.display = "none"; // Remove food after it's eaten
          }
        }
      });

      // Apply total boost to speed
      speed += totalBoost;

      // Move animal with boosted speed
      animal.style.top = `${currentTop + speed}px`;

      // Check if animal wins (when animal reaches the finish line at the last terrain)
      if (currentTop + speed >= document.getElementById("game-container").offsetHeight - 40) {
        clearInterval(interval); // Stop the race when the first animal finishes
        raceInProgress = false;
        alert(`${animalKey.toUpperCase()} wins the race!`);
      }
    });
  }, 50);  // Decrease interval to make the race faster
}

// Initialize and start the game
document.addEventListener("DOMContentLoaded", () => {
  setupGame();
  document.getElementById("start-button").addEventListener("click", startRace);
});

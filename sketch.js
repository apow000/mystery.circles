let centerX, centerY;
let outerDiameter = 500;
let circles = [];
let lastResetTime = 0;
const resetInterval = 9000; // 9000 milliseconds = 9 seconds
let globalAngle = 0;
let rotationSpeed = 0.0005; // 초기 회전 속도
let maxRotationSpeed = 0.005; // 최대 회전 속도
let rotationAcceleration = 0.0001; // 회전 가속도
let rotationDeceleration = 0.0002; // 회전 감속도
let torusThickness = 1; // 도넛의 튜브 두께

let stopRotation = false;
let stopRotationTime = 0;
const stopDuration = 5000; // 5000 milliseconds = 5 seconds

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // WEBGL 모드로 캔버스 생성
  centerX = width / 2;
  centerY = height / 2;

  // 초기 패턴 생성
  generatePattern();

  // 조명 설정
  ambientLight(10); // 주변광 설정
  directionalLight(0, 0, 255, 300, 0, -1); // 방향광 설정
}

function draw() {
  background(0); // 배경을 검은색으로 설정

  // Calculate elapsed time since the last reset
  let currentTime = millis();
  let elapsedTime = currentTime - lastResetTime;

  // Rotate the scene
  if (!stopRotation) {
    rotationSpeed = calculateRotationSpeed(elapsedTime);
    globalAngle += rotationSpeed;
  }
  rotateX(globalAngle);
  rotateY(globalAngle);

  // Draw the outer torus (large circle)
  noFill(); // 내부를 채우지 않음
  stroke(0, 0, 255); // 획의 색을 파란색으로 설정 (RGB 값)
  strokeWeight(torusThickness); // 획의 두께 설정
  let outerCircleRadius = outerDiameter / 2;
  torus(outerCircleRadius, torusThickness); // 도넛 형태의 원을 그림

  // Draw and rotate the inner circles (donuts)
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    push();
    translate(circle.x - centerX, circle.y - centerY, 0);

    // Apply rotation with individual start times
    let currentAngle = globalAngle + circle.startTime;
    rotateX(currentAngle);
    rotateY(currentAngle);

    // Draw the inner torus shape
    torus(circle.r, torusThickness);
    
    pop();
  }

  // Check if it's time to stop rotation
  if (stopRotation && currentTime > stopRotationTime + stopDuration) {
    stopRotation = false;
    generatePattern(); // Generate new pattern after stop duration
    lastResetTime = currentTime; // Update the last reset time
  }
}

function mousePressed() {
  if (!stopRotation) {
    stopRotation = true;
    stopRotationTime = millis(); // Record the time when rotation stops
    saveCanvas('myPattern_' + generateRandomWord(), 'png'); // Save canvas as PNG with a random word
  }
}

function generatePattern() {
  circles = []; // 배열 초기화

  // 바깥쪽 도넛 (큰 원) 설정
  let outerCircleRadius = outerDiameter / 2;

  // 내부 도넛 (작은 원) 설정
  let numCircles = int(random(3, 6)); // 3에서 5개의 원을 랜덤하게 선택
  let minRadius = 50; // 최소 반지름
  let maxRadius = outerDiameter / 1.5; // 최대 반지름은 큰 원의 반지름의 3분의 1로 설정

  for (let i = 0; i < numCircles; i++) {
    let radius = random(minRadius, maxRadius);
    
    // 원의 중심을 랜덤하게 설정
    let angle = random(TWO_PI);
    let distance = random(outerCircleRadius - radius, outerCircleRadius + radius); // 큰 원의 반지름과 작은 원의 반지름을 고려하여 거리 설정
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;

    // 개별 원의 회전 시작 시점 설정
    let startTime = random(TWO_PI);

    circles.push({
      x: x,
      y: y,
      r: radius,
      startTime: startTime,
      initialRotationSpeed: random(rotationSpeed, maxRotationSpeed) * random([-1, 1]), // 초기 회전 속도
      currentRotationSpeed: 0 // 현재 회전 속도 (초기에 0으로 설정)
    });
  }
}

function calculateRotationSpeed(elapsedTime) {
  // 가속도 및 감속도를 적용하여 회전 속도 계산
  if (elapsedTime < 5000) {
    return map(elapsedTime, 0, 5000, 0, maxRotationSpeed);
  } else {
    return maxRotationSpeed;
  }
}

// 랜덤한 영어 단어 생성 함수
function generateRandomWord() {
  let words = [
    // 명사
    "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", 
    "imbe", "jackfruit", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", 
    "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", "watermelon", 
    "xigua", "yuzu", "zucchini", 
    
    // 동사
    "accelerate", "breathe", "calculate", "dig", "encode", "forecast", "gather", 
    "hike", "ignite", "juggle", "knit", "launch", "mend", "navigate", "open", "perform", 
    "quicken", "reach", "solve", "travel", "unveil", "visit", "wander", "xerox", "yield", 
    
    // 형용사
    "amazing", "brilliant", "curious", "daring", "exquisite", "fearless", "genuine", 
    "happy", "intrepid", "joyful", "kind", "luminous", "mysterious", "noble", "optimistic", 
    "playful", "quiet", "radiant", "serene", "tender", "unstoppable", "vivid", "witty", 
    
    // 부사
    "boldly", "carefully", "diligently", "eagerly", "fiercely", "gracefully", "happily", 
    "intently", "joyfully", "kindly", "lovingly", "merrily", "nobly", "optimistically", 
    "patiently", "quietly", "rapidly", "softly", "tenderly", "urgently", "vigorously", "wisely",
    
    // 특이한 단어들 추가
    "cosmic", "alien", "mushroom", "danger", "fear", "warning", 
    "phantom", "celestial", "paradox", "abyss", "lunar", "nebula", "whisper", 
    "surreal", "enigma", "ominous", "cryptic", "supernova", "chaos", 
    "serendipity", "ethereal", "arcane", "galactic", "stardust", "phantasm"
  ];

  return random(words);
}
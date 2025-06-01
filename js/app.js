const texts = [
  "Em cười xinh lắm đó♥️",
  "Em làm trái tim anh rung động",
  "Anh sẽ luôn ở đây😄",
  "You are my sunshine",
  "Chúc em luôn vui vẻ và hạnh phúc!",
  "Lúc nào cũng nhớ em",
  "Nhớ emmm",
];
let images = [
  "https://res.cloudinary.com/dija8tzko/image/upload/v1748762598/anh1_q1sx3h.png",
  "https://res.cloudinary.com/dija8tzko/image/upload/v1748762597/anh2_czingh.jpg",
];
let heartClickCount = 0;
let specialShown = false;
let fallingTextInterval, heartIntervalId, roseIntervalId, starIntervalId;
let isPaused = false;

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const maxRotate = isMobile ? 60 : 60;

const counter = document.createElement("div");
counter.id = "counter";
counter.style.position = "fixed";
counter.style.top = "16px";
counter.style.right = "24px";
counter.style.zIndex = 9999;
counter.style.color = "#ff69b4";
counter.style.fontSize = "22px";
counter.style.fontWeight = "bold";
counter.style.textShadow = "0 0 8px #fff0f6, 0 0 12px #ffb6e6";
counter.innerText = "❤️: 0";
document.body.appendChild(counter);

document.addEventListener("click", function () {
  const audio = document.getElementById("bgm");
  if (audio && audio.paused) {
    audio.play().catch((err) => {
      console.warn("Không thể phát nhạc:", err);
    });
  }
});

const scene = document.getElementById("scene");

let rotateX = 0,
  rotateY = 0;
let targetRotateX = 0,
  targetRotateY = 0;
let isMouseDown = false;
let lastMouseDownTime = 0;
const DOUBLE_CLICK_THRESHOLD = 300;

document.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    const currentTime = Date.now();
    if (currentTime - lastMouseDownTime < DOUBLE_CLICK_THRESHOLD) {
      isMouseDown = false;
      return;
    }
    isMouseDown = true;
    lastMouseDownTime = currentTime;
    scene.classList.add("grabbing");
    document.body.classList.add("grabbing");
  }
});
document.addEventListener("mouseup", () => {
  isMouseDown = false;
  targetRotateX = rotateX;
  targetRotateY = rotateY;
  scene.classList.remove("grabbing");
  document.body.classList.remove("grabbing");
});
document.addEventListener("mouseleave", () => {
  isMouseDown = false;
  targetRotateX = rotateX;
  targetRotateY = rotateY;
  scene.classList.remove("grabbing");
  document.body.classList.remove("grabbing");
});

document.addEventListener("mousemove", (e) => {
  if (isMobile || !isMouseDown) return;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  targetRotateY = ((e.clientX - centerX) / centerX) * maxRotate;
  targetRotateX = ((e.clientY - centerY) / centerY) * maxRotate;
});
let touchStartX = 0,
  touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    targetRotateY = ((touchX - centerX) / centerX) * maxRotate;
    targetRotateX = ((touchY - centerY) / centerY) * maxRotate;
  },
  { passive: false }
);

function updateRotation() {
  rotateX += (targetRotateX - rotateX) * 0.1;
  rotateY += (targetRotateY - rotateY) * 0.1;
  scene.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  requestAnimationFrame(updateRotation);
}
updateRotation();

function explodeHeart(x, y, z = 0, numOverride) {
  const colors = [
    "#ff69b4",
    "#ffb6e6",
    "#ffd6e0",
    "#fff0f6",
    "#ffe6b6",
    "#fff",
    "#ffecf7",
  ];
  const num = numOverride || 18 + Math.floor(Math.random() * 6);
  for (let i = 0; i < num; i++) {
    const mini = document.createElement("div");
    mini.className = "mini-heart";
    const color = colors[Math.floor(Math.random() * colors.length)];
    const scale = 0.8 + Math.random() * 0.7;
    const blur = Math.random() < 0.25 ? "drop-shadow(0 0 10px #fff0f6)" : "";
    mini.innerHTML = `<svg viewBox="0 0 32 29.6" style="filter:${blur}"><path d="M23.6,0c-2.7,0-5.1,1.3-6.6,3.3C15.5,1.3,13.1,0,10.4,0C4.7,0,0,4.7,0,10.4c0,7.1,9.6,13.2,15.1,18.7
    c0.6,0.6,1.6,0.6,2.2,0C22.4,23.6,32,17.5,32,10.4C32,4.7,27.3,0,23.6,0z" fill="${color}"/></svg>`;
    mini.style.left = x + "px";
    mini.style.top = y + "px";
    mini.style.zIndex = 30;
    mini.style.transform = `translateZ(${z}px) scale(${scale}) rotate(0deg)`;
    mini.style.opacity = "1";
    document.body.appendChild(mini);

    const dist = numOverride
      ? 120 + Math.random() * 120
      : 60 + Math.random() * 60;
    const angle = (2 * Math.PI * i) / num + Math.random() * 0.4;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const rotate = Math.random() * 360 - 180;
    const delay = Math.random() * 40;

    setTimeout(() => {
      mini.style.transition =
        "transform 0.65s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.65s";
      mini.style.transform = `translate(${dx}px, ${dy}px) scale(${
        scale * 0.7
      }) rotate(${rotate}deg)`;
      mini.style.opacity = "0";
    }, 10 + delay);

    setTimeout(() => mini.remove(), (numOverride ? 2000 : 700) + delay);
  }
}

function showRandomTextAt(x, y, z = 0) {
  const text = document.createElement("div");
  text.className = `falling-text text-${Math.floor(Math.random() * 3) + 1}`;
  text.innerText = texts[Math.floor(Math.random() * texts.length)];
  text.style.left = x + "px";
  text.style.top = y + "px";
  text.style.transform = `translateZ(${z}px)`;
  text.style.fontSize = `${Math.random() * 20 + 18}px`;
  text.style.pointerEvents = "none";
  scene.appendChild(text);

  setTimeout(() => text.remove(), 2000);
}

function pauseFalling() {
  isPaused = true;
  clearInterval(fallingTextInterval);
  clearInterval(heartIntervalId);
  clearInterval(roseIntervalId);
  clearInterval(starIntervalId);
  document.querySelectorAll(".falling-text, .heart, .rose").forEach((el) => {
    el.style.animationPlayState = "paused";
  });
  document.querySelectorAll(".shooting-star-css").forEach((el) => {
    el.style.display = "none";
  });
}

function resumeFalling() {
  isPaused = false;
  fallingTextInterval = setInterval(createFallingText, textInterval);
  heartIntervalId = setInterval(createHeart, heartInterval);
  roseIntervalId = setInterval(createRose, roseInterval);
  starIntervalId = setInterval(createStar, starInterval);
  document.querySelectorAll(".falling-text, .heart, .rose").forEach((el) => {
    el.style.animationPlayState = "running";
  });
  document.querySelectorAll(".shooting-star-css").forEach((el) => {
    el.style.display = "";
    el.style.opacity = "0.12";
  });
}

function getSafeX(size) {
  return Math.max(0, Math.random() * (window.innerWidth - size));
}
function getSafeY(size) {
  return Math.max(0, Math.random() * (window.innerHeight - size));
}

function createFallingText(initial = false) {
  const text = document.createElement("div");
  text.className = `falling-text text-${Math.floor(Math.random() * 3) + 1}`;
  text.innerText = texts[Math.floor(Math.random() * texts.length)];
  const textWidth = isMobile ? 150 : 220;
  const startX = getSafeX(textWidth);
  const zLayer = Math.random() * 400 - 200;
  text.style.left = startX + "px";
  text.style.fontSize = `${Math.random() * 20 + 18}px`;
  text.style.transform = `translateZ(${zLayer}px)`;
  const randomStart = Math.random() < 0.8;
  const textHeight = isMobile ? 24 : 32;
  const startY = randomStart ? getSafeY(textHeight) : -50;
  text.style.top = startY + "px";
  scene.appendChild(text);

  setTimeout(() => text.remove(), isMobile ? 6000 : 10000);

  let posY = startY;
  const speed = Math.random() * 0.8 + 0.8;

  function animate() {
    if (isPaused) return;
    posY += speed;
    text.style.top = posY + "px";
    if (posY > window.innerHeight + 50) {
      text.remove();
    } else {
      requestAnimationFrame(animate);
    }
  }
  animate();
}

function createHeart(initial = false, initialY = -50) {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerHTML = `<img src="${
    images[Math.floor(Math.random() * images.length)]
  }" alt="♡" draggable="false" />`;
  setTimeout(() => {
    const img = heart.querySelector("img");
    if (img) {
      img.addEventListener("dragstart", (e) => e.preventDefault());
    }
  }, 0);

  const heartSize = isMobile ? 65 : 110;
  const startX = getSafeX(heartSize);
  const zLayer = Math.random() * 400 - 200;
  heart.style.left = startX + "px";
  const heartHeight = heartSize;
  heart.style.top = initial ? getSafeY(heartHeight) + "px" : "-50px";
  heart.style.transform = `translateZ(${zLayer}px)`;
  scene.appendChild(heart);

  heart.addEventListener("click", function (e) {
    e.stopPropagation();
    const rect = heart.getBoundingClientRect();
    explodeHeart(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      zLayer
    );
    heart.remove();

    showRandomTextAt(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      zLayer
    );

    heartClickCount++;
    counter.innerText = `❤️: ${heartClickCount}`;
    if (heartClickCount >= 10 && !specialShown) {
      specialShown = true;
      showSpecialAnimation();
    }
  });

  heart.addEventListener("touchstart", function (e) {
    e.stopPropagation();
    const rect = heart.getBoundingClientRect();
    explodeHeart(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      zLayer
    );
    heart.remove();

    showRandomTextAt(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      zLayer
    );

    heartClickCount++;
    counter.innerText = `❤️: ${heartClickCount}`;
    if (heartClickCount >= 10 && !specialShown) {
      specialShown = true;
      showSpecialAnimation();
    }
  });

  const duration = isMobile ? 3000 : 4000;
  const fadeDuration = 700;
  setTimeout(() => {
    heart.classList.add("fade-out");
    setTimeout(() => heart.remove(), fadeDuration);
  }, duration - fadeDuration);

  let posY = initial ? parseFloat(heart.style.top) : -50;
  const speed = Math.random() * 1.1 + 1;

  function animateHeart() {
    if (isPaused) return;
    posY += speed;
    heart.style.top = posY + "px";
    if (posY > window.innerHeight + 50) {
      heart.remove();
    } else {
      requestAnimationFrame(animateHeart);
    }
  }
  animateHeart();
}

function createRose(initial = false, initialY = -50) {
  const rose = document.createElement("div");
  rose.className = "rose";
  rose.innerText = "❤️";
  const roseSize = isMobile ? 24 : 40;
  const startX = getSafeX(roseSize);
  const zLayer = Math.random() * 400 - 200;
  rose.style.left = startX + "px";
  const roseHeight = roseSize;
  rose.style.top = initial ? getSafeY(roseHeight) + "px" : "-50px";
  rose.style.transform = `translateZ(${zLayer}px) rotate(${
    Math.random() * 360
  }deg)`;
  scene.appendChild(rose);
  setTimeout(() => rose.remove(), isMobile ? 4000 : 6000);

  let posY = initial ? parseFloat(rose.style.top) : -50;
  const speed = Math.random() * 1.5 + 1;

  function animateRose() {
    if (isPaused) return;
    posY += speed;
    rose.style.top = posY + "px";
    if (posY > window.innerHeight + 50) {
      rose.remove();
    } else {
      requestAnimationFrame(animateRose);
    }
  }
  animateRose();
}

function createStar() {
  const star = document.createElement("div");
  star.className = "star";
  if (Math.random() < 0.2) star.classList.add("large");
  if (Math.random() < 0.3) star.classList.add("slow");
  star.style.left = Math.random() * window.innerWidth + "px";
  star.style.top = Math.random() * window.innerHeight + "px";
  document.getElementById("starfield").appendChild(star);
  setTimeout(
    () => {
      star.classList.add("fade-out");
      setTimeout(() => star.remove(), 1000);
    },
    isMobile ? 16000 : 20000
  );
}

function createGalaxyHeart() {
  const heartPoints = [
    { x: 0, y: -50 },
    { x: 30, y: -40 },
    { x: 50, y: -20 },
    { x: 60, y: 0 },
    { x: 50, y: 20 },
    { x: 30, y: 40 },
    { x: 0, y: 50 },
    { x: -30, y: 40 },
    { x: -50, y: 20 },
    { x: -60, y: 0 },
    { x: -50, y: -20 },
    { x: -30, y: -40 },
  ];
  heartPoints.forEach((point, i) => {
    setTimeout(() => {
      const star = document.createElement("div");
      star.className = "star galaxy-star";
      star.style.left = window.innerWidth / 2 + point.x + "px";
      star.style.top = window.innerHeight / 2 + point.y + "px";
      star.style.opacity = "1";
      star.style.transform = "scale(1)";
      document.getElementById("starfield").appendChild(star);
      setTimeout(() => {
        star.style.transition = "opacity 0.5s, transform 0.5s";
        star.style.opacity = "0";
        star.style.transform = "scale(0.5)";
        setTimeout(() => star.remove(), 500);
      }, 2000);
    }, i * 50);
  });
}

function createMeteorShower() {
  const numMeteors = isMobile ? 12 : 30;
  for (let i = 0; i < numMeteors; i++) {
    setTimeout(() => {
      const meteor = document.createElement("div");
      meteor.className = "meteor-shower";
      meteor.style.top = Math.random() * 100 + "px";
      meteor.style.left = Math.random() * window.innerWidth + "px";
      meteor.style.right = "auto";
      document.getElementById("starfield").appendChild(meteor);
      setTimeout(() => meteor.remove(), 3000);
    }, i * 80);
  }
}

function showSpecialAnimation() {
  pauseFalling();

  const bigHeart = document.createElement("div");
  bigHeart.className = "big-heart";

  const svgWidth = isMobile ? 120 : 220;
  const svgHeight = isMobile ? 110 : 200;

  bigHeart.innerHTML = `
    <div class="big-heart-inner" style="width:${svgWidth}px;height:${svgHeight}px;position:relative;display:flex;align-items:center;justify-content:center;">
      <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 220 200">
        <path d="M110,180 C40,120 0,70 55,40
                 C90,20 110,50 110,70
                 C110,50 130,20 165,40
                 C220,70 180,120 110,180Z"
              fill="#ff69b4" filter="url(#glow)"/>
        <defs>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div class="big-heart-text">I Love You</div>
    </div>
  `;
  document.body.appendChild(bigHeart);

  setTimeout(() => {
    bigHeart.style.transition = "all 0.8s cubic-bezier(.68,-0.55,.27,1.55)";
    bigHeart.style.opacity = "1";
    bigHeart.style.transform = "translate(-50%, -50%) scale(1.1)";
  }, 50);

  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      explodeHeart(window.innerWidth / 2, window.innerHeight / 2, 0, 40);
    }, 200 + i * 60);
  }

  createGalaxyHeart();
  createMeteorShower();

  setTimeout(() => {
    bigHeart.style.opacity = "0";
    setTimeout(() => {
      bigHeart.remove();
      heartClickCount = 0;
      counter.innerText = `❤️: ${heartClickCount}`;
      specialShown = false;
      resumeFalling();
    }, 800);
  }, 2000);
}

const initialTextCount = isMobile ? 2 : 10;
const initialHeartCount = isMobile ? 1 : 3;
const initialRoseCount = isMobile ? 1 : 1;
const initialStarCount = isMobile ? 40 : 80;
const textInterval = isMobile ? 1200 : 800;
const heartInterval = isMobile ? 2500 : 1500;
const roseInterval = isMobile ? 2000 : 1000;
const starInterval = isMobile ? 900 : 300;

for (let i = 0; i < initialTextCount; i++) createFallingText(true);
for (let i = 0; i < initialHeartCount; i++) createHeart(true);
for (let i = 0; i < initialRoseCount; i++) createRose(true);
for (let i = 0; i < initialStarCount; i++) createStar();

fallingTextInterval = setInterval(createFallingText, textInterval);
heartIntervalId = setInterval(createHeart, heartInterval);
roseIntervalId = setInterval(createRose, roseInterval);
starIntervalId = setInterval(createStar, starInterval);

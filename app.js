const eventDetails = {
  celebrant: "Birthday Person Name",
  age: "Age",
  dateLabel: "Birthday Date",
  timeLabel: "Birthday Time",
  venue: "Venue Name",
  address: "Venue Address",
  mapsUrl: "https://maps.google.com",
  phone: "+000000000000",
  whatsappUrl: "https://wa.me/000000000000",
  dressCode: "Royal Black & Gold",
  invitationMessage:
    "Join us for an unforgettable birthday celebration crafted with elegance, warmth, and royal spirit.",
  targetDate: "2026-12-31T20:00:00",
  moments: [
    {
      title: "The Royal Arrival",
      text: "A cinematic welcome for family, friends, and honored guests."
    },
    {
      title: "Golden Toast",
      text: "A signature birthday moment surrounded by music, light, and celebration."
    },
    {
      title: "Number One Night",
      text: "An evening designed for joy, prestige, and memories that last."
    }
  ]
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

document.body.classList.add("is-locked");

function applyEventDetails() {
  document.title = `${eventDetails.celebrant} | Royal Birthday Celebration`;
  $("#celebrant-name").textContent = eventDetails.celebrant;
  $("#birthday-line").textContent = `${eventDetails.age} Birthday Celebration`;
  $("#invitation-message").textContent = eventDetails.invitationMessage;
  $("#detail-date").textContent = eventDetails.dateLabel;
  $("#detail-time").textContent = eventDetails.timeLabel;
  $("#detail-venue").textContent = eventDetails.venue;
  $("#detail-dress").textContent = eventDetails.dressCode;
  $("#venue-name").textContent = eventDetails.venue;
  $("#venue-address").textContent = eventDetails.address;
  $("#venue-date").textContent = eventDetails.dateLabel;
  $("#venue-time").textContent = eventDetails.timeLabel;
  $("#maps-link").href = eventDetails.mapsUrl;
  $("#confirm-link").href = eventDetails.whatsappUrl;
  $("#whatsapp-link").href = eventDetails.whatsappUrl;
  $("#call-link").href = `tel:${eventDetails.phone.replace(/\s/g, "")}`;
  $("#year").textContent = new Date().getFullYear();

  $("#timeline").innerHTML = eventDetails.moments
    .map(
      (moment) => `
        <div class="moment reveal">
          <article>
            <h3>${moment.title}</h3>
            <p>${moment.text}</p>
          </article>
        </div>`
    )
    .join("");
}

applyEventDetails();

function setupParticles() {
  const canvas = $("#particle-canvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.length = 0;
    const count = Math.min(90, Math.floor(width * height / 13000));
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.35,
        vx: (Math.random() - 0.5) * 0.18,
        vy: Math.random() * -0.25 - 0.08,
        alpha: Math.random() * 0.6 + 0.18
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      gradient.addColorStop(0, `rgba(255, 224, 163, ${p.alpha})`);
      gradient.addColorStop(1, "rgba(215, 169, 79, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
}

setupParticles();

function setupCursorLight() {
  const light = $(".cursor-light");
  window.addEventListener(
    "pointermove",
    (event) => {
      light.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    },
    { passive: true }
  );
}

setupCursorLight();

let kingObject;
let kingRenderer;
let kingScene;
let kingCamera;

async function setupKing() {
  const stage = $("#king-stage");
  try {
    const THREE = await import("three");
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    kingScene = new THREE.Scene();
    kingCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    kingCamera.position.set(0, 0.55, 5.2);

    kingRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    kingRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    kingRenderer.setSize(window.innerWidth, window.innerHeight);
    kingRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    kingRenderer.toneMappingExposure = 1.35;
    stage.prepend(kingRenderer.domElement);

    const key = new THREE.SpotLight(0xffdfa0, 92, 12, 0.45, 0.62, 0.8);
    key.position.set(1.6, 4, 3.3);
    const rim = new THREE.PointLight(0xd79b32, 10, 7);
    rim.position.set(-2.4, 1.4, 2.2);
    const fill = new THREE.HemisphereLight(0xffe8b0, 0x090604, 1.7);
    kingScene.add(key, rim, fill);

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync("chess_piece_king.glb");
    kingObject = gltf.scene;
    kingObject.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = new THREE.MeshPhysicalMaterial({
          color: 0xe1aa3e,
          metalness: 1,
          roughness: 0.18,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          envMapIntensity: 1.6
        });
      }
    });
    const box = new THREE.Box3().setFromObject(kingObject);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    kingObject.position.sub(center);
    const scale = 2.45 / Math.max(size.x, size.y, size.z);
    kingObject.scale.setScalar(scale);
    kingObject.position.y = -0.85;
    kingScene.add(kingObject);
    $(".king-fallback").style.display = "none";

    function resize() {
      kingCamera.aspect = window.innerWidth / window.innerHeight;
      kingCamera.updateProjectionMatrix();
      kingRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      if (kingObject) {
        kingObject.rotation.y += 0.005;
        kingObject.rotation.x = Math.sin(performance.now() * 0.00055) * 0.035;
      }
      kingRenderer.render(kingScene, kingCamera);
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    animate();
  } catch (error) {
    console.warn("3D king fallback active", error);
  }
}

window.setTimeout(setupKing, 700);

function setupMusic() {
  const audio = $("#bg-music");
  const toggle = $("#music-toggle");
  audio.volume = 0;

  function fade(to) {
    const from = audio.volume;
    const started = performance.now();
    const duration = 850;
    function tick(now) {
      const t = Math.min(1, (now - started) / duration);
      audio.volume = from + (to - from) * t;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  async function play() {
    try {
      await audio.play();
      document.body.classList.add("music-on");
      toggle.setAttribute("aria-label", "Pause music");
      fade(0.58);
    } catch {
      document.body.classList.remove("music-on");
    }
  }

  function pause() {
    fade(0);
    setTimeout(() => audio.pause(), 880);
    document.body.classList.remove("music-on");
    toggle.setAttribute("aria-label", "Play music");
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) play();
    else pause();
  });

  return { play };
}

const music = setupMusic();

function setupIntro() {
  const enter = $("#enter-btn");
  const intro = $("#intro");
  const openSite = async () => {
    if (intro.classList.contains("is-open")) return;
    intro.classList.add("is-open");
    await music.play();

    const timeline = window.gsap
      ? gsap.timeline()
      : {
          to: (target, vars) => {
            Object.assign($(target)?.style || target.style || {}, { opacity: vars.opacity ?? "", transform: vars.y ? `translateY(${vars.y}px)` : "" });
            return timeline;
          },
          set: () => timeline,
          call: (fn) => {
            fn();
            return timeline;
          }
        };

    if (window.gsap) {
      timeline
        .to(".intro__copy", { y: -34, opacity: 0, duration: 0.85, ease: "power3.inOut" })
        .to("#king-stage", { y: "-34vh", scale: 1.28, filter: "brightness(1.8)", duration: 1.35, ease: "power4.inOut" }, "-=0.35")
        .to(".intro", { opacity: 0, duration: 1.1, ease: "power2.inOut" }, "-=0.2")
        .call(() => {
          document.body.classList.remove("is-locked");
          document.body.classList.add("entered");
          intro.remove();
          revealVisible();
        });
    } else {
      intro.style.transition = "opacity 1s ease";
      intro.style.opacity = "0";
      setTimeout(() => {
        document.body.classList.remove("is-locked");
        document.body.classList.add("entered");
        intro.remove();
        revealVisible();
      }, 1000);
    }
  };

  enter.addEventListener("click", openSite);
}

setupIntro();

function setupSmoothScroll() {
  if (!window.Lenis) return;
  const lenis = new Lenis({ duration: 1.25, smoothWheel: true, touchMultiplier: 1.1 });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

setupSmoothScroll();

function revealVisible() {
  $$(".reveal").forEach((element) => {
    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.9) element.classList.add("is-visible");
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.16 }
);

$$(".reveal").forEach((element) => revealObserver.observe(element));

function setupCountdown() {
  const target = new Date(eventDetails.targetDate).getTime();
  const fields = {
    days: $("#days"),
    hours: $("#hours"),
    minutes: $("#minutes"),
    seconds: $("#seconds")
  };

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function tick() {
    const distance = Math.max(0, target - Date.now());
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    fields.days.textContent = pad(days);
    fields.hours.textContent = pad(hours);
    fields.minutes.textContent = pad(minutes);
    fields.seconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

setupCountdown();

function setupScratchSeal() {
  const area = $("#scratch-area");
  const canvas = $("#scratch-canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let drawing = false;
  let revealed = false;

  function resize() {
    const rect = area.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSeal(rect.width, rect.height);
  }

  function drawSeal(width, height) {
    ctx.globalCompositeOperation = "source-over";
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#6c4315");
    gradient.addColorStop(0.32, "#ffe2a1");
    gradient.addColorStop(0.58, "#bd842d");
    gradient.addColorStop(1, "#4c2c0c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.31, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,248,220,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff0bd";
    ctx.font = `${Math.max(54, width * 0.18)}px Georgia`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♛", 0, -8);
    ctx.font = "700 12px Inter, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("SCRATCH THE ROYAL SEAL", 0, Math.min(width, height) * 0.21);
    ctx.restore();
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  }

  function scratch(event) {
    if (!drawing || revealed) return;
    event.preventDefault();
    const p = point(event);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
    ctx.fill();
    checkProgress();
  }

  function checkProgress() {
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < image.length; i += 64) {
      if (image[i] < 40) transparent += 1;
    }
    const progress = transparent / (image.length / 64);
    if (progress > 0.42) complete();
  }

  function complete() {
    revealed = true;
    canvas.style.transition = "opacity .75s ease, transform .75s ease";
    canvas.style.opacity = "0";
    canvas.style.transform = "scale(1.08)";
    burst();
  }

  function burst() {
    const burstLayer = $("#seal-burst");
    for (let i = 0; i < 34; i += 1) {
      const petal = document.createElement("span");
      petal.style.position = "absolute";
      petal.style.left = "50%";
      petal.style.top = "50%";
      petal.style.width = `${Math.random() * 8 + 4}px`;
      petal.style.height = `${Math.random() * 16 + 8}px`;
      petal.style.borderRadius = "999px 999px 999px 0";
      petal.style.background = i % 3 ? "#f7d88e" : "#fff1bd";
      petal.style.boxShadow = "0 0 14px rgba(255,224,163,.55)";
      burstLayer.appendChild(petal);
      const x = (Math.random() - 0.5) * 330;
      const y = -Math.random() * 310 - 40;
      petal.animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ],
        { duration: 1300 + Math.random() * 900, easing: "cubic-bezier(.19,1,.22,1)", fill: "forwards" }
      );
    }
  }

  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    scratch(event);
  });
  canvas.addEventListener("pointermove", scratch);
  window.addEventListener("pointerup", () => {
    drawing = false;
  });
  window.addEventListener("resize", resize, { passive: true });
  resize();
}

setupScratchSeal();

function setupRipples() {
  $$(".glass-button, .gold-button, .icon-button").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });
}

setupRipples();

window.addEventListener(
  "scroll",
  () => {
    const heroImage = $(".hero__media img");
    const y = window.scrollY * 0.08;
    heroImage.style.transform = `scale(1.05) translate3d(0, ${y}px, 0)`;
  },
  { passive: true }
);

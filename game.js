import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import Peer from 'https://esm.sh/peerjs@1.5.4';
const canvas = document.querySelector('#game');
const scene = new THREE.Scene(); scene.background = new THREE.Color('#a5a4d5'); scene.fog = new THREE.FogExp2('#a5a4d5', .011);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 180);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8)); renderer.setSize(innerWidth, innerHeight); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
scene.add(new THREE.HemisphereLight('#e5e5ff', '#55527d', 2.2));
const sun = new THREE.DirectionalLight('#fff0d4', 3.2); sun.position.set(-12, 24, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -40; sun.shadow.camera.right = 40; sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40; scene.add(sun);
const fill = new THREE.PointLight('#8cf5e5', 42, 42); fill.position.set(1, 8, -15); scene.add(fill);
const mat = (color, roughness = .7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const materials = { mint: new THREE.MeshStandardMaterial({ color: '#8fe8d5', roughness: .45, metalness: .2, emissive: '#4ddbc5', emissiveIntensity: .45 }) };
const platforms = [];
function platform(x, y, z, w, d, color, options = {}) {
  const h = options.h || .75, group = new THREE.Group(); group.position.set(x, y, z); scene.add(group);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, .57, .04)); body.castShadow = body.receiveShadow = true; group.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(w - .16, .08, d - .16), mat(options.top || '#e2e4ff', .62)); top.position.y = h / 2 + .025; top.receiveShadow = true; group.add(top);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(w + .06, .12, d + .06), mat(options.edge || '#828dcf', .38, .1)); edge.position.y = -h / 2 + .1; group.add(edge);
  if (options.glow) { const strip = new THREE.Mesh(new THREE.BoxGeometry(w * .68, .035, .09), new THREE.MeshBasicMaterial({ color: options.glow })); strip.position.set(0, -h / 2 + .16, d / 2 + .04); group.add(strip); }
  platforms.push({ x, z, y: y + h / 2 + .08, w: w - .15, d: d - .15 }); return group;
}
platform(0, 0, 9, 13, 16, '#8285c7', { top: '#c6c8ff', edge: '#666caa', glow: '#98f4e3' });
platform(-4, .9, -2, 5.2, 5.2, '#91c5d6', { top: '#d3f4ed', edge: '#568ca6', glow: '#9af4df' });
platform(3.1, 1.8, -9.1, 4.6, 4.7, '#c19bd4', { top: '#f5d8ed', edge: '#8a6cae', glow: '#ffd49b' });
platform(-2.2, 2.8, -16.3, 4.8, 4.4, '#dfad9f', { top: '#ffe0c5', edge: '#aa777b', glow: '#ffcb99' });
platform(3.5, 3.8, -23.2, 4.6, 4.7, '#92bca9', { top: '#d2f3d9', edge: '#5d8e86', glow: '#a0ffe2' });
platform(0, 4.8, -31, 10, 10, '#7b8cc2', { top: '#d5dcff', edge: '#536390', glow: '#a5ffdf' });
const cloudMat = new THREE.MeshStandardMaterial({ color: '#ecebff', roughness: 1, transparent: true, opacity: .8 });
for (let i = 0; i < 22; i++) { const cloud = new THREE.Group(); cloud.position.set((Math.random() - .5) * 90, 8 + Math.random() * 19, -45 + Math.random() * 68); scene.add(cloud); for (let j = 0; j < 4; j++) { const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 + Math.random() * 1.8, 1), cloudMat); puff.position.set((j - 1.5) * 1.8, Math.random() * .5, Math.random() * .8); puff.scale.y = .55; cloud.add(puff); } }
for (let i = 0; i < 32; i++) { const shard = new THREE.Mesh(new THREE.OctahedronGeometry(.4 + Math.random() * .8), mat(i % 2 ? '#f6c6d9' : '#c9d4ff', .45)); shard.position.set((Math.random() - .5) * 65, 3 + Math.random() * 20, -35 + Math.random() * 50); shard.rotation.set(Math.random(), Math.random(), Math.random()); scene.add(shard); }
for (let i = 0; i < 18; i++) { const t = i / 17, bead = new THREE.Mesh(new THREE.SphereGeometry(.055, 8, 8), new THREE.MeshBasicMaterial({ color: '#d7fff2', transparent: true, opacity: .6 })); bead.position.set(Math.sin(t * Math.PI * 4) * 2.1, 1.25 + t * 4.8, 8 - t * 38); scene.add(bead); }
function makeAvatar(color = '#f5a982') {
  const root = new THREE.Group(), bodyMat = mat(color, .48), pantsMat = mat('#454a7b', .62), whiteMat = mat('#fff0d8', .38), shoeMat = mat('#293453', .62);
  const body = new THREE.Mesh(new THREE.BoxGeometry(.78, .8, .42), bodyMat); body.position.y = .99; body.castShadow = true; root.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(.62, .62, .61), whiteMat); head.position.y = 1.72; head.castShadow = true; root.add(head);
  const hair = new THREE.Mesh(new THREE.BoxGeometry(.68, .2, .66), mat('#443c65', .8)); hair.position.set(0, 2.08, -.015); root.add(hair);
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#323753' });
  for (const x of [-.14, .14]) { const eye = new THREE.Mesh(new THREE.BoxGeometry(.055, .065, .018), eyeMat); eye.position.set(x, 1.78, .315); root.add(eye); }
  const legs = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(.3, .61, .34), pantsMat); leg.position.set(side * .2, .31, 0); leg.castShadow = true; root.add(leg); legs.push(leg);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(.34, .18, .47), shoeMat); shoe.position.set(side * .2, .07, .045); root.add(shoe);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.24, .69, .3), bodyMat); arm.position.set(side * .52, .98, 0); arm.castShadow = true; root.add(arm);
  }
  const backpack = new THREE.Mesh(new THREE.BoxGeometry(.43, .5, .2), mat('#75d9cf', .4)); backpack.position.set(0, 1.05, -.29); root.add(backpack); root.userData.legs = legs; return root;
}
const player = { group: makeAvatar(), pos: new THREE.Vector3(0, .455, 12), vel: new THREE.Vector3(), grounded: true, checkpoint: new THREE.Vector3(0, .455, 12), stars: 0 };
scene.add(player.group); player.group.position.copy(player.pos);
let avatarBob = 0;
// A generated image texture gives the wall-phasing chaser its unmistakable face.
function makeIdTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const glow = g.createRadialGradient(128, 128, 54, 128, 128, 128);
  glow.addColorStop(0, '#ffb1b8'); glow.addColorStop(.58, '#fa6e95'); glow.addColorStop(1, '#e34982');
  g.fillStyle = glow; g.beginPath(); g.arc(128, 128, 123, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#fff0e8'; g.lineWidth = 8; g.stroke();
  g.fillStyle = '#fff5e9'; g.beginPath(); g.ellipse(128, 134, 74, 82, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#483450';
  g.beginPath(); g.ellipse(100, 122, 11, 20, -.1, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(156, 122, 11, 20, .1, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#68455c'; g.lineWidth = 9; g.lineCap = 'round';
  g.beginPath(); g.moveTo(98, 177); g.quadraticCurveTo(128, 151, 158, 177); g.stroke();
  g.fillStyle = '#fff8e9'; g.font = 'bold 20px sans-serif'; g.textAlign = 'center'; g.fillText('ID', 128, 238);
  const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}
const idGroup = new THREE.Group(); scene.add(idGroup);
const idSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeIdTexture(), transparent: true, depthWrite: false }));
idSprite.scale.set(2.35, 2.35, 1); idGroup.add(idSprite);
const idHalo = new THREE.Mesh(new THREE.TorusGeometry(1.35, .035, 8, 48), new THREE.MeshBasicMaterial({ color: '#ff91ae', transparent: true, opacity: .7 }));
idHalo.rotation.x = Math.PI / 2; idGroup.add(idHalo);
const idLight = new THREE.PointLight('#ff648f', 3.2, 8); idGroup.add(idLight);
idGroup.position.set(1.8, 2.25, 30);

const starShape = new THREE.Shape();
for (let i = 0; i < 10; i++) {
  const r = i % 2 === 0 ? .43 : .2, a = Math.PI / 2 + i * Math.PI / 5;
  const x = Math.cos(a) * r, y = Math.sin(a) * r;
  i === 0 ? starShape.moveTo(x, y) : starShape.lineTo(x, y);
}
starShape.closePath();
const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: .1, bevelEnabled: true, bevelThickness: .06, bevelSize: .04, bevelSegments: 2 });
const stars = [];
const starPoints = [[-2.4, 1.8, 2.1], [-4, 2.3, -2.1], [3.1, 3.2, -8.8], [4.1, 3.5, -10.3], [-2.4, 4.1, -16.3], [-.5, 4.2, -15.1], [3.4, 5.1, -23.2], [0, 6.1, -31]];
for (const [x, y, z] of starPoints) {
  const group = new THREE.Group();
  const star = new THREE.Mesh(starGeo, new THREE.MeshStandardMaterial({ color: '#ffdc91', emissive: '#ffb94e', emissiveIntensity: 1.4, roughness: .28, metalness: .2 }));
  star.castShadow = true; group.add(star);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(.62, .018, 6, 32), new THREE.MeshBasicMaterial({ color: '#ffedb4', transparent: true, opacity: .48 })); halo.rotation.x = Math.PI / 2; group.add(halo);
  group.add(new THREE.PointLight('#ffc96c', 1.4, 4)); group.position.set(x, y, z); scene.add(group); stars.push({ group, baseY: y, collected: false });
}
const goal = new THREE.Group(); goal.position.set(0, 6.05, -31); scene.add(goal);
const beacon = new THREE.Mesh(new THREE.CylinderGeometry(.13, .2, 2.9, 8), materials.mint); beacon.position.y = 1.55; beacon.castShadow = true; goal.add(beacon);
const beaconTop = new THREE.Mesh(new THREE.OctahedronGeometry(.55, 0), new THREE.MeshBasicMaterial({ color: '#b5fff0' })); beaconTop.position.y = 3.25; goal.add(beaconTop);
const beaconRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, .055, 9, 56), new THREE.MeshBasicMaterial({ color: '#a3ffea' })); beaconRing.position.y = 2.1; beaconRing.rotation.x = Math.PI / 2; goal.add(beaconRing);
goal.add(new THREE.PointLight('#9cf6dd', 11, 15)).position.y = 2.5;

const keys = new Set();
let jumpQueued = false, audioOn = false, audioContext, musicGain, musicTimer = null;
let musicStep = 0, nextMusicTime = 0;
const musicTempo = 92, stepDuration = 60 / musicTempo / 2;
const musicChords = [
  { root: 130.81, chord: [261.63, 329.63, 392.00] }, // C
  { root: 110.00, chord: [220.00, 261.63, 329.63] }, // A minor
  { root: 174.61, chord: [261.63, 349.23, 440.00] }, // F
  { root: 196.00, chord: [246.94, 293.66, 392.00] }  // G
];
const melody = [523.25, 0, 587.33, 659.25, 0, 783.99, 659.25, 587.33, 523.25, 0, 392.00, 523.25, 0, 587.33, 659.25, 0,
  440.00, 0, 523.25, 587.33, 0, 659.25, 587.33, 523.25, 440.00, 0, 392.00, 440.00, 0, 523.25, 587.33, 0];
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
  keys.add(k);
  if (k === ' ' || k === 'w' || k === 'arrowup') jumpQueued = true;
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
for (const button of document.querySelectorAll('[data-key]')) {
  const k = button.dataset.key;
  const down = e => { e.preventDefault(); if (k === 'space') jumpQueued = true; else { keys.add(k); if (k === 'w') jumpQueued = true; } };
  const up = e => { e.preventDefault(); if (k !== 'space') keys.delete(k); };
  button.addEventListener('pointerdown', down); button.addEventListener('pointerup', up); button.addEventListener('pointercancel', up); button.addEventListener('lostpointercapture', up);
}

const joystick = document.querySelector('#joystick'), joystickKnob = document.querySelector('#joystick-knob');
let joystickPointer = null;
const joystickInput = { x: 0, z: 0 };
function updateJoystick(e) {
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2, centerY = rect.top + rect.height / 2;
  const maxRadius = Math.min(rect.width, rect.height) * .32;
  let dx = e.clientX - centerX, dy = e.clientY - centerY;
  const length = Math.hypot(dx, dy);
  if (length > maxRadius) { dx = dx / length * maxRadius; dy = dy / length * maxRadius; }
  joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  // Keep a small dead zone, then scale smoothly so small thumb movements still feel precise.
  const magnitude = Math.hypot(dx, dy) / maxRadius;
  const strength = magnitude < .12 ? 0 : (magnitude - .12) / .88;
  joystickInput.x = magnitude ? dx / maxRadius / magnitude * strength : 0;
  joystickInput.z = magnitude ? dy / maxRadius / magnitude * strength : 0;
}
function releaseJoystick(e) {
  if (e.pointerId !== joystickPointer) return;
  joystickPointer = null; joystickInput.x = 0; joystickInput.z = 0;
  joystickKnob.style.transform = 'translate(0, 0)';
  if (joystick.hasPointerCapture(e.pointerId)) joystick.releasePointerCapture(e.pointerId);
}
joystick.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (joystickPointer !== null) return;
  joystickPointer = e.pointerId; joystick.setPointerCapture(e.pointerId); updateJoystick(e);
});
joystick.addEventListener('pointermove', e => { if (e.pointerId === joystickPointer) updateJoystick(e); });
joystick.addEventListener('pointerup', releaseJoystick);
joystick.addEventListener('pointercancel', releaseJoystick);
joystick.addEventListener('lostpointercapture', releaseJoystick);
const $ = s => document.querySelector(s);
const toast = text => { const el = $('#toast'); el.textContent = text; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200); };
function ensureAudio() {
  audioContext ||= new AudioContext();
  if (!musicGain) {
    musicGain = audioContext.createGain();
    musicGain.gain.value = .42;
    musicGain.connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') audioContext.resume();
}
function scheduleMusicNote(freq, time, duration, volume, type = 'sine') {
  const osc = audioContext.createOscillator(), gain = audioContext.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(.0001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + .035);
  gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
  osc.connect(gain); gain.connect(musicGain);
  osc.start(time); osc.stop(time + duration + .03);
}
function scheduleMusic() {
  if (!audioOn || !audioContext) return;
  const horizon = audioContext.currentTime + .12;
  while (nextMusicTime < horizon) {
    const step = musicStep % 32, chord = musicChords[Math.floor(step / 8)];
    if (step % 8 === 0) {
      scheduleMusicNote(chord.root, nextMusicTime, stepDuration * 3.8, .045, 'sine');
      chord.chord.forEach((freq, i) => scheduleMusicNote(freq, nextMusicTime, stepDuration * 7.5, .012 - i * .001, 'triangle'));
    }
    if (melody[step]) scheduleMusicNote(melody[step], nextMusicTime, stepDuration * .82, .038, 'sine');
    musicStep++; nextMusicTime += stepDuration;
  }
}
function startMusic() {
  ensureAudio();
  musicGain.gain.cancelScheduledValues(audioContext.currentTime);
  musicGain.gain.setTargetAtTime(.42, audioContext.currentTime, .12);
  nextMusicTime = audioContext.currentTime + .08;
  musicTimer = setInterval(scheduleMusic, 35);
}
function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  if (musicGain && audioContext) {
    musicGain.gain.cancelScheduledValues(audioContext.currentTime);
    musicGain.gain.setTargetAtTime(0, audioContext.currentTime, .08);
  }
}
function playTone(freq = 700, duration = .12) {
  if (!audioOn) return;
  try { ensureAudio(); const osc = audioContext.createOscillator(), gain = audioContext.createGain(); osc.frequency.value = freq; osc.type = 'sine'; gain.gain.setValueAtTime(.055, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration); osc.connect(gain); gain.connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + duration); } catch {}
}
$('#sound-btn').addEventListener('click', () => {
  audioOn = !audioOn;
  $('#sound-btn').textContent = audioOn ? '♫' : '♪';
  $('#sound-btn').title = audioOn ? 'Turn music off' : 'Turn music on';
  $('#sound-btn').setAttribute('aria-label', audioOn ? 'Turn music off' : 'Turn music on');
  $('#sound-btn').setAttribute('aria-pressed', String(audioOn));
  if (audioOn) startMusic(); else stopMusic();
  toast(audioOn ? 'CLOUDLINE MUSIC ON' : 'MUSIC OFF');
  playTone(680);
});
$('#help-btn').addEventListener('click', () => $('#help-modal').classList.add('open'));
$('#help-close').addEventListener('click', () => $('#help-modal').classList.remove('open'));
$('#got-it').addEventListener('click', () => $('#help-modal').classList.remove('open'));
$('#join-btn').addEventListener('click', () => { $('#connect-btn').textContent = 'JOIN WORLD ↗'; $('#connect-btn').dataset.mode = 'join'; $('#join-modal').classList.add('open'); });
$('#modal-close').addEventListener('click', () => $('#join-modal').classList.remove('open'));
$('#join-modal').addEventListener('click', e => { if (e.target === $('#join-modal')) $('#join-modal').classList.remove('open'); });
$('#help-modal').addEventListener('click', e => { if (e.target === $('#help-modal')) $('#help-modal').classList.remove('open'); });
$('#copy-room').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#room-code').textContent); toast('ROOM CODE COPIED'); } catch { toast(`ROOM: ${$('#room-code').textContent}`); } });

let checkpointIndex = 0, caughtTimer = 0, catchGrace = 4.5, win = false, distance = 0, gameTime = 0;
function setCheckpoint(index) {
  if (index <= checkpointIndex) return;
  checkpointIndex = index; player.checkpoint.set(player.pos.x, player.pos.y, player.pos.z);
  toast('CHECKPOINT SAVED'); playTone(820, .16);
}
function respawn(message) {
  player.pos.copy(player.checkpoint); player.vel.set(0, 0, 0); player.grounded = true;
  idGroup.position.set(player.pos.x + (Math.random() - .5) * 2, player.pos.y + 2.3, player.pos.z + 13);
  caughtTimer = 0; catchGrace = 3; $('#danger-banner').classList.remove('show'); toast(message); playTone(180, .28);
}

// PeerJS room host relays player position updates so all connected players can see each other.
let peer = null, isHost = false, room = 'SKY-01', myPeerId = null, sendClock = 0;
const connections = new Map(), remotePlayers = new Map();
const avatarColors = ['#9de9d7', '#d2a5ee', '#f4c778', '#95b9f4', '#f39eb5'];
function setRoomUi(label, code, status) { $('#session-label').textContent = label; $('#room-code').textContent = code; $('#room-status').textContent = status; }
function updatePlayerCount() { $('#player-count').textContent = String(remotePlayers.size + 1); }
function makeRemote(id, data = {}) {
  if (remotePlayers.has(id)) return remotePlayers.get(id);
  const group = makeAvatar(data.color || avatarColors[remotePlayers.size % avatarColors.length]); scene.add(group);
  const tagCanvas = document.createElement('canvas'); tagCanvas.width = 256; tagCanvas.height = 64;
  const ctx = tagCanvas.getContext('2d'); ctx.fillStyle = '#171832'; ctx.globalAlpha = .8; ctx.roundRect(8, 8, 240, 46, 18); ctx.fill();
  ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText((data.name || `PLAYER ${remotePlayers.size + 2}`).slice(0, 14), 128, 38);
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(tagCanvas), transparent: true, depthWrite: false })); label.scale.set(2, .5, 1); label.position.y = 2.8; group.add(label);
  const remote = { group, target: new THREE.Vector3() }; remotePlayers.set(id, remote); updatePlayerCount(); return remote;
}
function removeRemote(id) { const remote = remotePlayers.get(id); if (!remote) return; scene.remove(remote.group); remotePlayers.delete(id); updatePlayerCount(); }
function applyRemote(id, data) {
  const sourceId = data?.id || id;
  if (!data || data.type !== 'state' || sourceId === myPeerId || !data.pos) return;
  const remote = makeRemote(sourceId, data); remote.target.set(data.pos.x, data.pos.y, data.pos.z); remote.group.rotation.y = data.yaw || 0;
}
function broadcastState() {
  const payload = { type: 'state', pos: { x: player.pos.x, y: player.pos.y, z: player.pos.z }, yaw: player.group.rotation.y, color: '#f5a982', name: 'SKY RUNNER' };
  for (const conn of connections.values()) if (conn.open) { try { conn.send(payload); } catch {} }
}
function acceptConnection(conn) {
  connections.set(conn.peer, conn);
  conn.on('data', data => {
    applyRemote(conn.peer, data);
    if (isHost && data?.type === 'state') for (const [otherId, other] of connections) if (otherId !== conn.peer && other.open) { try { other.send({ ...data, id: conn.peer }); } catch {} }
  });
  conn.on('close', () => { connections.delete(conn.peer); removeRemote(conn.peer); });
  conn.on('error', () => { connections.delete(conn.peer); removeRemote(conn.peer); });
  conn.on('open', () => { toast('PLAYER SPAWNED IN'); if (isHost) broadcastState(); });
}
function closeNetwork() {
  connections.forEach(c => { try { c.close(); } catch {} }); connections.clear();
  [...remotePlayers.keys()].forEach(removeRemote);
  if (peer) { try { peer.destroy(); } catch {} peer = null; }
  isHost = false; myPeerId = null; updatePlayerCount();
}
function peerError(err) {
  const msg = err?.type === 'peer-unavailable' ? 'ROOM NOT FOUND — CHECK THE CODE' : err?.type === 'unavailable-id' ? 'ROOM CODE IS ALREADY HOSTED' : 'CONNECTION ISSUE — TRY AGAIN';
  toast(msg); $('#room-status').textContent = 'OFFLINE';
}
function hostRoom(code) {
  closeNetwork(); room = code.toUpperCase(); const id = `skybound-${room.toLowerCase().replace(/[^a-z0-9-]/g, '')}`;
  if (id.length < 10) { toast('PLEASE ENTER A LONGER ROOM CODE'); return; }
  peer = new Peer(id, { host: '0.peerjs.com', port: 443, path: '/', secure: true }); isHost = true; setRoomUi('HOSTING WORLD', room, 'CONNECTING');
  peer.on('open', id => { myPeerId = id; setRoomUi('HOSTING WORLD', room, 'ONLINE'); toast(`WORLD OPEN — SHARE ${room}`); });
  peer.on('connection', acceptConnection); peer.on('error', peerError);
  peer.on('disconnected', () => { $('#room-status').textContent = 'RETRYING'; try { peer.reconnect(); } catch {} });
}
function joinRoom(code) {
  closeNetwork(); room = code.toUpperCase(); const id = `skybound-${room.toLowerCase().replace(/[^a-z0-9-]/g, '')}`;
  if (id.length < 10) { toast('PLEASE ENTER A LONGER ROOM CODE'); return; }
  peer = new Peer(undefined, { host: '0.peerjs.com', port: 443, path: '/', secure: true }); setRoomUi('JOINING WORLD', room, 'CONNECTING');
  peer.on('open', ownId => {
    myPeerId = ownId; const conn = peer.connect(id, { reliable: true }); acceptConnection(conn);
    conn.on('open', () => { setRoomUi('CREW SESSION', room, 'ONLINE'); toast('YOU DROPPED INTO THE WORLD'); broadcastState(); });
  });
  peer.on('error', peerError); peer.on('disconnected', () => { $('#room-status').textContent = 'RETRYING'; try { peer.reconnect(); } catch {} });
}
$('#host-btn').addEventListener('click', () => {
  $('#room-input').value = $('#room-code').textContent; $('#connect-btn').textContent = 'HOST WORLD ↗'; $('#connect-btn').dataset.mode = 'host'; $('#join-modal').classList.add('open');
});
$('#connect-btn').addEventListener('click', () => {
  const code = $('#room-input').value.trim().toUpperCase().replace(/\s+/g, '-');
  $('#join-modal').classList.remove('open'); $('#room-input').value = code;
  if ($('#connect-btn').dataset.mode === 'host') hostRoom(code); else joinRoom(code);
});
$('#room-input').addEventListener('keydown', e => { if (e.key === 'Enter') $('#connect-btn').click(); });

const MAX_DISTANCE = 43;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
function platformAt(x, z) {
  return platforms.find(p => Math.abs(x - p.x) <= p.w / 2 && Math.abs(z - p.z) <= p.d / 2);
}
function updateHud() {
  distance = clamp(12 - player.pos.z, 0, MAX_DISTANCE);
  $('#distance').textContent = `${Math.floor(distance)} m`;
  $('#progress-fill').style.width = `${(distance / MAX_DISTANCE) * 100}%`;
  $('#star-count').textContent = `${player.stars} / ${stars.length} found`;
  $('.beacon-chip b').textContent = String(player.stars).padStart(2, '0');
}
function movePlayer(dt) {
  const forward = keys.has('w') || keys.has('arrowup');
  const backward = keys.has('s') || keys.has('arrowdown');
  const left = keys.has('a') || keys.has('arrowleft'), right = keys.has('d') || keys.has('arrowright');
  let mx = (right ? 1 : 0) - (left ? 1 : 0) + joystickInput.x;
  let mz = (forward ? -1 : 0) + (backward ? 1 : 0) + joystickInput.z;
  const length = Math.hypot(mx, mz);
  if (length > 1) { mx /= length; mz /= length; }
  const speed = 7.3;
  player.vel.x = mx * speed;
  player.vel.z = mz * speed;
  if (length > .02) player.group.rotation.y = Math.atan2(mx, -mz);

  const previousY = player.pos.y;
  if (jumpQueued && player.grounded) {
    player.vel.y = 8.6; player.grounded = false; playTone(440, .08);
  }
  jumpQueued = false;
  player.vel.y -= 20 * dt;
  player.pos.x += player.vel.x * dt;
  player.pos.z += player.vel.z * dt;
  player.pos.y += player.vel.y * dt;
  player.grounded = false;
  if (player.vel.y <= 0) {
    for (const p of platforms) {
      const inside = Math.abs(player.pos.x - p.x) <= p.w / 2 && Math.abs(player.pos.z - p.z) <= p.d / 2;
      if (inside && previousY >= p.y - .04 && player.pos.y <= p.y) {
        player.pos.y = p.y; player.vel.y = 0; player.grounded = true; break;
      }
    }
  }
  if (player.pos.y < -10) respawn('BACK TO THE LAST CHECKPOINT');
  player.group.position.copy(player.pos);
  const moving = Math.abs(mx) + Math.abs(mz) > 0 && player.grounded;
  avatarBob += dt * (moving ? 12 : 3);
  player.group.userData.legs.forEach((leg, i) => { leg.rotation.x = moving ? Math.sin(avatarBob + i * Math.PI) * .55 : 0; });
  if (player.grounded) {
    const landed = platformAt(player.pos.x, player.pos.z);
    if (landed) {
      const idx = platforms.indexOf(landed);
      if (idx > 0) setCheckpoint(idx);
    }
  }
}
function updateStars(dt) {
  for (const star of stars) {
    if (star.collected) continue;
    star.group.rotation.y += dt * 1.4; star.group.rotation.z = Math.sin(gameTime * 2 + star.group.position.z) * .12;
    star.group.position.y = star.baseY + Math.sin(gameTime * 2.4 + star.group.position.x) * .12;
    if (star.group.position.distanceTo(player.pos) < 1.35) {
      star.collected = true; star.group.visible = false; player.stars++; updateHud(); toast('STARDUST COLLECTED'); playTone(980, .14);
    }
  }
}
function updateChaser(dt) {
  // The ID follows directly through the air: it never tests or collides with platforms.
  const target = new THREE.Vector3(player.pos.x, player.pos.y + 1.2, player.pos.z + 1.3);
  const delta = target.sub(idGroup.position), separation = delta.length();
  const chaseSpeed = 2.8 + Math.min(gameTime * .02, 1.1);
  if (catchGrace > 0) catchGrace = Math.max(0, catchGrace - dt);
  if (separation > .001) idGroup.position.addScaledVector(delta.normalize(), Math.min(separation, chaseSpeed * dt));
  idGroup.position.y += Math.sin(gameTime * 3.2) * dt * .16;
  idHalo.rotation.z += dt * 1.15;
  const playerGap = idGroup.position.distanceTo(new THREE.Vector3(player.pos.x, player.pos.y + 1.1, player.pos.z));
  const danger = playerGap < 7;
  $('#danger-banner').classList.toggle('show', danger && !win && catchGrace <= 0);
  if (!win && catchGrace <= 0 && playerGap < 1.45) {
    caughtTimer += dt;
    if (caughtTimer > .22) { respawn('THE ID CAUGHT YOU — TRY AGAIN'); caughtTimer = 0; }
  } else caughtTimer = Math.max(0, caughtTimer - dt * 2.5);
}
function updateCamera(dt) {
  const desired = new THREE.Vector3(player.pos.x * .38, player.pos.y + 7.2, player.pos.z + 10.5);
  camera.position.lerp(desired, 1 - Math.exp(-dt * 3.8));
  camera.lookAt(player.pos.x, player.pos.y + 1.05, player.pos.z - 4.3);
}
function updateWorld(dt) {
  gameTime += dt;
  movePlayer(dt); updateStars(dt); updateChaser(dt); updateHud();
  for (const remote of remotePlayers.values()) remote.group.position.lerp(remote.target, 1 - Math.exp(-dt * 10));
  beaconTop.rotation.y += dt * 1.5; beaconTop.rotation.x += dt * .6; beaconRing.rotation.z += dt * .8;
  if (!win && player.pos.distanceTo(new THREE.Vector3(0, 6.05, -31)) < 2.1) {
    win = true; $('#danger-banner').classList.remove('show'); $('#status-message').textContent = 'BEACON REACHED — YOU MADE IT!'; $('#status-message').classList.add('visible'); toast(`RUN COMPLETE — ${player.stars} / ${stars.length} STARDUST`); playTone(1040, .35);
  }
  sendClock += dt;
  if (sendClock > .08) { sendClock = 0; broadcastState(); }
  updateCamera(dt);
}
let previousFrame = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - previousFrame) / 1000, .04); previousFrame = now;
  updateWorld(dt); renderer.render(scene, camera);
}
function resize() {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8)); renderer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', resize);
addEventListener('blur', () => {
  keys.clear(); jumpQueued = false; joystickPointer = null; joystickInput.x = 0; joystickInput.z = 0;
  joystickKnob.style.transform = 'translate(0, 0)';
});
updateHud(); updatePlayerCount(); updateCamera(1); requestAnimationFrame(animate);


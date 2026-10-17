import * as THREE from 'three';
import { START, movePlayer } from './world.js';

export function createVoxelRoom(host, { t, onInteract, unlocked = false, snapshot } = {}) {
  const abort = new AbortController();
  const listen = (target, event, callback, options = {}) => target.addEventListener(event, callback, { ...options, signal: abort.signal });
  const player = { ...START, ...snapshot };
  const keys = new Set(), materials = new Map(), batches = new Map(), textures = new Set();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = false, disposed = false, frame = 0, previous = performance.now(), visible = true, near = null, dirty = true;
  let dragging = null, dragX = 0, dragY = 0, exited = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#e1ebe1'); scene.fog = new THREE.Fog('#e1ebe1', 11, 27);
  const camera = new THREE.PerspectiveCamera(68, 1, 0.06, 40); camera.rotation.order = 'YXZ';
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.35;
  renderer.domElement.tabIndex = 0;
  host.classList.add('voxel-shell');
  host.innerHTML = '<div class="voxel-canvas"></div><div class="voxel-top"><span class="voxel-badge">3D / LIVE</span><button type="button" class="voxel-reset"></button></div><div class="voxel-crosshair" aria-hidden="true">+</div><div class="voxel-overlay"><strong>NOVA / SECTOR 01</strong><p class="voxel-instructions"></p><button class="button primary voxel-start" type="button"></button></div><div class="voxel-hud"><button type="button" class="voxel-interact"></button><button type="button" class="voxel-pause"></button></div><div class="voxel-pad" aria-label="Movement controls"><button type="button" data-walk="forward">↑</button><button type="button" data-walk="left">←</button><button type="button" data-walk="backward">↓</button><button type="button" data-walk="right">→</button></div><div class="voxel-location" aria-hidden="true"></div>';
  const canvas = renderer.domElement;
  host.querySelector('.voxel-canvas').append(canvas);
  const overlay = host.querySelector('.voxel-overlay'), interactButton = host.querySelector('.voxel-interact');
  scene.add(new THREE.HemisphereLight(0xf9ffe6, 0x74856e, 2.3));
  const sun = new THREE.DirectionalLight(0xfff2cb, 3); sun.position.set(-4, 9, 5); scene.add(sun);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  function material(color, glow = false) {
    const key = color + glow;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.02, ...(glow ? { emissive: color, emissiveIntensity: 0.38 } : {}) }));
    return materials.get(key);
  }
  function box(x, y, z, w, h, d, color, glow = false) {
    const mat = material(color, glow);
    if (!batches.has(mat)) batches.set(mat, []);
    batches.get(mat).push([x, y, z, w, h, d]);
  }
  for (let x = -5.5; x < 6; x++) for (let z = -5.5; z < 6; z++) box(x, -0.12, z, 0.98, 0.24, 0.98, (x + z) % 2 === 0 ? '#b2c09e' : '#bcc8ac');
  for (let row = 0; row < 4; row++) {
    const y = row * 0.8 + 0.4;
    for (let col = -5.5; col <= 5.5; col++) {
      if (Math.abs(col) > 1 || row === 3) box(col, y, -6, 0.98, 0.78, 0.35, row % 2 ? '#a1b59b' : '#b6c6a9');
      box(-6, y, col, 0.35, 0.78, 0.98, row % 2 ? '#c4d0b6' : '#b8c7aa');
      box(6, y, col, 0.35, 0.78, 0.98, row % 2 ? '#9db297' : '#afbea0');
      box(col, y, 6, 0.98, 0.78, 0.35, '#c1cbb3');
    }
  }
  box(0, 0.02, -6.8, 2.3, 0.15, 2, '#d6dfbc');
  box(-1.25, 1.5, -6.8, 0.3, 3, 2, '#a1b59b'); box(1.25, 1.5, -6.8, 0.3, 3, 2, '#a1b59b');
  box(0, 1.2, -7.9, 2.5, 2.4, 0.2, '#c4d0b6');
  // Window panes and low ceiling beams keep the space bright and blocky.
  box(-5.78, 1.95, 0, 0.1, 1.25, 3.8, '#b9e7e7', true);
  for (const z of [-1.9, 0, 1.9]) box(-5.68, 1.95, z, 0.13, 1.4, 0.09, '#657e6c');
  for (const y of [1.29, 2.6]) box(-5.68, y, 0, 0.13, 0.09, 3.9, '#657e6c');
  for (const z of [-3.8, 2.8]) { box(0, 3.22, z, 12, 0.18, 0.2, '#889f83'); box(0, 3.1, z, 3.2, 0.06, 0.35, '#f9f4d5', true); }
  function desk(x) {
    box(x, 1, -2.3, 2.5, 0.2, 1.5, '#c8b88f');
    for (const dx of [-1, 1]) for (const dz of [-0.5, 0.5]) box(x + dx, 0.44, -2.3 + dz, 0.13, 0.9, 0.13, '#667e6a');
    box(x, 1.55, -2.65, 1.55, 0.95, 0.16, '#153f3b');
    box(x, 1.15, -2.65, 0.2, 0.2, 0.25, '#153f3b');
    box(x, 1.115, -2.05, 1.1, 0.04, 0.32, '#e5e1cc');
    for (let i = 0; i < 7; i++) box(x - 0.42 + i * 0.14, 1.14, -2.05, 0.09, 0.02, 0.22, '#a7b29b');
    box(x + 0.95, 1.23, -2.15, 0.2, 0.3, 0.2, '#f2eee1');
    box(x + 0.95, 1.39, -2.15, 0.15, 0.02, 0.15, '#68594a');
    box(x, 0.52, -0.9, 0.75, 0.16, 0.65, '#3b6255');
    box(x, 0.85, -0.55, 0.75, 0.7, 0.12, '#4f7561');
    box(x, 0.25, -0.9, 0.15, 0.5, 0.15, '#647b68');
  }
  desk(-3.7); desk(3.7);
  for (const x of [-5.1, 5.1]) {
    box(x, 0.35, 3.7, 0.75, 0.7, 0.75, '#b69572');
    box(x, 0.7, 3.7, 0.8, 0.12, 0.8, '#d1b18c');
    box(x, 0.9, 3.7, 0.15, 0.5, 0.15, '#6c8250');
    box(x, 1.35, 3.7, 0.8, 0.8, 0.8, '#6e9657');
    box(x + 0.3, 1.65, 3.7, 0.55, 0.55, 0.55, '#92b46a');
    box(x - 0.25, 1.75, 3.7, 0.5, 0.5, 0.5, '#86a661');
  }
  box(4.8, 0.9, -4.7, 1.5, 1.8, 0.7, '#8e9b7d');
  for (const y of [0.4, 0.95, 1.5]) {
    box(4.8, y, -4.65, 1.6, 0.1, 0.8, '#c5b591');
    for (let i = 0; i < 6; i++) box(4.25 + i * 0.22, y + 0.22, -4.58, 0.16, 0.35, 0.4, ['#62b45d', '#d7de93', '#d99b74'][i % 3]);
  }
  box(0, 0.2, 0, 1.5, 0.4, 1.5, '#486d5d'); box(0, 0.5, 0, 1.25, 0.2, 1.25, '#8baf89');
  // Floor guidance stripes lead toward the three interactive stations.
  for (let i = 0; i < 4; i++) for (const side of [-1, 1]) box(side * (1.3 + i * 0.6), 0.018, 1.1, 0.3, 0.02, 0.07, '#d1f55e', true);
  for (let z = -4.8; z < -1.5; z += 0.65) box(0, 0.018, z, 0.12, 0.02, 0.32, '#62b45d');
  for (const [mat, cubes] of batches) {
    const mesh = new THREE.InstancedMesh(geometry, mat, cubes.length); const transform = new THREE.Object3D();
    cubes.forEach(([x,y,z,w,h,d], i) => { transform.position.set(x,y,z); transform.scale.set(w,h,d); transform.updateMatrix(); mesh.setMatrixAt(i, transform.matrix); });
    mesh.computeBoundingSphere(); scene.add(mesh);
  }
  const robot = new THREE.Group();
  function robotBox(x,y,z,w,h,d,color,glow=false) { const mesh=new THREE.Mesh(geometry,material(color,glow));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);robot.add(mesh);return mesh; }
  robotBox(0,1.4,0,0.86,1.35,0.75,'#81b5a1'); robotBox(0,2.1,0,1,0.65,0.85,'#a5d6b0');
  robotBox(0,2.1,0.442,0.78,0.4,0.03,'#233f40');
  for (const x of [-0.2,0.2]) robotBox(x,2.13,0.47,0.13,0.13,0.04,'#d1f55e',true);
  robotBox(0,1.8,0.43,0.25,0.04,0.03,'#557e67');robotBox(0,2.56,0,0.06,0.3,0.06,'#547862');
  robotBox(0,2.76,0,0.13,0.13,0.13,'#62b45d',true);
  robotBox(0,1.36,0.4,0.48,0.35,0.04,'#62b45d');
  for(const side of [-1,1])robotBox(side*0.6,1.45,0,0.22,0.6,0.25,'#75a98b');
  scene.add(robot);
  const door=new THREE.Mesh(geometry,material('#42685c'));door.scale.set(1.95,2.65,0.22);door.position.set(0,1.325,-5.95);scene.add(door);
  const doorStrip=new THREE.Mesh(geometry,material(unlocked?'#d1f55e':'#f49064',true));doorStrip.scale.set(1.7,0.09,0.04);doorStrip.position.set(0,2.4,-5.81);scene.add(doorStrip);
  const labelPlanes=[];
  function label(x,y,z,w,h,text,key,bg='#153f3b',color='#d1f55e') {
    const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.LinearFilter;textures.add(texture);
    const mat=new THREE.MeshBasicMaterial({map:texture});const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);plane.position.set(x,y,z);scene.add(plane);
    const record={c,ctx,texture,text,key,bg,color,plane,mat};labelPlanes.push(record);return record;
  }
  label(-3.7,1.55,-2.555,1.32,0.75,'TERMINAL','terminal');label(3.7,1.55,-2.555,1.32,0.75,'HANDBOOK','manual');
  label(0,2.94,-5.77,1.8,0.35,'EXIT','exit');
  function drawLabels() {
    for(const item of labelPlanes){const {ctx,c,texture,bg,color}=item;ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.font='bold 48px monospace';ctx.textAlign='center';ctx.textBaseline='middle';const text=item.key==='exit'?(unlocked?'EXIT / OPEN':'EXIT / LOCKED') : t(item.key).toUpperCase();ctx.fillText(text,256,118,470);ctx.fillStyle='#72978a';ctx.fillRect(80,186,350,5);texture.needsUpdate=true;}
  }
  const stations=[{id:'terminal',x:-3.7,z:-1.5,key:'terminalStation'},{id:'manual',x:3.7,z:-1.5,key:'manualStation'},{id:'nova',x:0,z:0,key:'novaStation'},{id:'exit',x:0,z:-5.7,key:'exitStation'}];
  function interaction() {
    let closest=null, distance=2.25;
    for(const target of stations){const dx=target.x-player.x,dz=target.z-player.z,dist=Math.hypot(dx,dz);const dot=(-Math.sin(player.yaw)*dx-Math.cos(player.yaw)*dz)/(dist||1);if(dist<distance&&dot>0.05){distance=dist;closest=target;}}
    near=closest;interactButton.textContent=near?t('voxelInteract',{target:t(near.key)}):t('voxelWalk');interactButton.disabled=!near||!active;
  }
  function setActive(value) {
    active=value;previous=performance.now();dirty=true;keys.clear();dragging=null;overlay.classList.toggle('hidden',active);host.classList.toggle('exploring',active);
    if(active)canvas.focus({preventScroll:true});interaction();
  }
  function interact() { if(active&&near){setActive(false);onInteract?.(near.id);} }
  function update(next={}) {
    dirty=true;
    if(next.t)t=next.t;
    if(next.unlocked!==undefined)unlocked=Boolean(next.unlocked);
    canvas.setAttribute('aria-label',t('canvasLabel'));
    host.querySelector('.voxel-instructions').textContent=matchMedia('(pointer:coarse)').matches?t('voxelTouch'):t('voxelHelp');
    host.querySelector('.voxel-start').textContent=t(active?'voxelResume':'voxelStart');
    host.querySelector('.voxel-reset').textContent=t('voxelReset');host.querySelector('.voxel-pause').textContent=t('voxelPause');
    host.querySelectorAll('[data-walk]').forEach(button=>button.setAttribute('aria-label',t(button.dataset.walk)));
    drawLabels();interaction();
  }
  listen(host.querySelector('.voxel-start'),'click',()=>setActive(true));
  listen(host.querySelector('.voxel-pause'),'click',()=>setActive(false));
  listen(host.querySelector('.voxel-reset'),'click',()=>{Object.assign(player,START);exited=false;setActive(false);});
  listen(interactButton,'click',interact);
  const movementKeys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyQ','KeyE'];
  listen(canvas,'keydown',event=>{
    if(event.code==='Escape'){setActive(false);event.preventDefault();return;}
    if(!active)return;
    if(movementKeys.includes(event.code)){event.preventDefault();keys.add(event.code);}
    if(event.code==='KeyF'){event.preventDefault();interact();}
  });
  listen(window,'keyup',event=>keys.delete(event.code));
  listen(canvas,'blur',()=>keys.clear());
  listen(window,'blur',()=>setActive(false));
  listen(document,'visibilitychange',()=>{if(document.hidden)setActive(false);});
  listen(canvas,'pointerdown',event=>{if(!active)return;dragging=event.pointerId;dragX=event.clientX;dragY=event.clientY;canvas.setPointerCapture(event.pointerId);canvas.focus({preventScroll:true});});
  listen(canvas,'pointermove',event=>{if(!active||dragging!==event.pointerId)return;player.yaw-=(event.clientX-dragX)*0.005;player.pitch=Math.max(-1.05,Math.min(1.05,player.pitch-(event.clientY-dragY)*0.004));dragX=event.clientX;dragY=event.clientY;});
  const endDrag=event=>{if(dragging===event.pointerId)dragging=null;};
  listen(canvas,'pointerup',endDrag);listen(canvas,'pointercancel',endDrag);
  for(const button of host.querySelectorAll('[data-walk]')){
    const code={forward:'KeyW',backward:'KeyS',left:'KeyA',right:'KeyD'}[button.dataset.walk];
    listen(button,'pointerdown',event=>{if(!active)return;event.preventDefault();button.setPointerCapture(event.pointerId);keys.add(code);});
    const release=()=>keys.delete(code);listen(button,'pointerup',release);listen(button,'pointercancel',release);listen(button,'lostpointercapture',release);
  }
  listen(canvas,'webglcontextlost',event=>{event.preventDefault();setActive(false);host.dispatchEvent(new CustomEvent('voxel-failed',{bubbles:true}));});
  const resize=new ResizeObserver(()=>{const width=host.clientWidth,height=host.clientHeight;if(width&&height){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;}});resize.observe(host);
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)setActive(false);});visibility.observe(host);
  const direction=new THREE.Vector3();
  function animate(now) {
    if(disposed)return;
    frame=requestAnimationFrame(animate);
    const dt=Math.min((now-previous)/1000,0.25);previous=now;
    if(!visible||document.hidden)return;
    const doorMoving=Math.abs(door.position.x-(unlocked?2.05:0))>0.005;
    if(!active&&!dirty&&!doorMoving)return;
    dirty=false;
    if(active){
      if(keys.has('KeyQ'))player.yaw+=dt*1.7;if(keys.has('KeyE'))player.yaw-=dt*1.7;
      const forward=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'));
      const strafe=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
      const length=Math.hypot(forward,strafe)||1, speed=2.9*dt/length;
      const dx=(-Math.sin(player.yaw)*forward+Math.cos(player.yaw)*strafe)*speed;
      const dz=(-Math.cos(player.yaw)*forward-Math.sin(player.yaw)*strafe)*speed;
      Object.assign(player,movePlayer(player,dx,dz,unlocked));
      if(unlocked&&player.z<-7&&!exited){exited=true;setActive(false);onInteract?.('exit');}
    }
    camera.position.set(player.x,1.65,player.z);camera.rotation.set(player.pitch,player.yaw,0);
    robot.position.y=reducedMotion?0:Math.sin(now*0.0015)*0.045;
    door.position.x=THREE.MathUtils.damp(door.position.x,unlocked?2.05:0,5,dt);
    doorStrip.position.x=door.position.x;doorStrip.material=material(unlocked?'#d1f55e':'#f49064',true);
    camera.getWorldDirection(direction);
    interaction();
    host.querySelector('.voxel-location').textContent=`X ${player.x.toFixed(1)} / Z ${player.z.toFixed(1)}`;
    renderer.render(scene,camera);
  }
  update();frame=requestAnimationFrame(animate);
  return {
    update, pause:()=>setActive(false), snapshot:()=>({...player}),
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);abort.abort();resize.disconnect();visibility.disconnect();geometry.dispose();for(const mat of materials.values())mat.dispose();for(const item of labelPlanes){item.plane.geometry.dispose();item.mat.dispose();}for(const texture of textures)texture.dispose();renderer.dispose();renderer.forceContextLoss();host.replaceChildren();}
  };
}

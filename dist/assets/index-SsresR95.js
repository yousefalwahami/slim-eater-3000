(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function s(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=s(i);fetch(i.href,o)}})();function b(e,t){e.innerHTML=`
    <div class="main-menu">
      <h1>🎮 Slim Eater 3000</h1>
      <div class="game-buttons">
        <button id="game1-btn">Square Game</button>
        <button id="game2-btn">🍎 Slim Catcher</button>
      </div>
    </div>
  `,document.getElementById("game1-btn").addEventListener("click",()=>t("square")),document.getElementById("game2-btn").addEventListener("click",()=>t("fruitCatcher"))}function y(e,t){e.innerHTML=`
    <div class="game-container">
      <div class="game-header">
        <h2>Square Game</h2>
        <button class="back-button" id="back-btn">← Back to Menu</button>
      </div>
      <div class="game-canvas">
        <div class="square"></div>
      </div>
      <div class="game-info">
        <p>A simple pulsing square - more features coming soon!</p>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",t)}const n={canvas:null,ctx:null,player:{x:275,y:350,width:100,height:140,speed:8},fruits:[],bombs:[],scoreIndicators:[],score:0,missed:0,gameStarted:!1,gameOver:!1,keys:{},animationId:null,lastFruitSpawn:0,lastBombSpawn:0,fruitSpawnRate:1500,bombSpawnRate:3e3,fruitTypes:["🍕","🍔","🍟","🌭","🍗","🍣","🌮","🌯"],slimIdle:null,slimEating:null,isEating:!1,eatingTimer:0,imagesLoaded:!1,selectedMap:null,mapImage:null,showMapSelection:!0,sounds:{bgMusic:null,eatSound:null,bombSound:null,gameOverSound:null},soundsLoaded:!1,musicMuted:!1};function h(e,t){e.innerHTML=`
    <div class="game-container">
      <div class="game-header">
        <h2>Slim Catcher</h2>
        <div class="header-buttons">
          <button class="mute-button" id="mute-btn">🔊 Music</button>
          <button class="back-button" id="back-btn">← Back to Menu</button>
        </div>
      </div>
      <div class="game-stats">
        <div class="stat">Score: <span id="score">0</span></div>
        <div class="stat">Missed: <span id="missed">0</span></div>
      </div>
      <div id="map-selector" class="map-selector" style="display: none;">
        <h3>Select a Map</h3>
        <div class="map-buttons">
          <button class="map-btn" id="map1-btn">
            <img src="/assets/cei-1.jpg" alt="Map 1" />
            <span>Map 1</span>
          </button>
          <button class="map-btn" id="map2-btn">
            <img src="/assets/cei-2.jpg" alt="Map 2" />
            <span>Map 2</span>
          </button>
        </div>
      </div>
      <canvas id="fruit-canvas"></canvas>
      <div class="game-controls">
        <p>Use ← → Arrow Keys to Move | Press SPACE to Start | Avoid 💣 Bombs!</p>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>{n.animationId&&cancelAnimationFrame(n.animationId),n.sounds.bgMusic&&(n.sounds.bgMusic.pause(),n.sounds.bgMusic.currentTime=0),document.removeEventListener("keydown",f),document.removeEventListener("keyup",p),t()}),document.getElementById("mute-btn").addEventListener("click",()=>{S()});const s=document.getElementById("map-selector");s.style.display="flex",document.getElementById("map1-btn").addEventListener("click",()=>{u("cei-1")}),document.getElementById("map2-btn").addEventListener("click",()=>{u("cei-2")})}function u(e){n.selectedMap=e,document.getElementById("map-selector").style.display="none",v()}function S(){const e=n,t=document.getElementById("mute-btn");e.musicMuted=!e.musicMuted,e.sounds.bgMusic&&(e.musicMuted?(e.sounds.bgMusic.pause(),t.textContent="🔇 Music"):(e.gameStarted&&!e.gameOver&&e.sounds.bgMusic.play().catch(s=>console.log("Music play failed:",s)),t.textContent="🔊 Music"))}function v(){const e=document.getElementById("fruit-canvas"),t=e.getContext("2d"),s=window.devicePixelRatio||1;e.width=window.innerWidth*s,e.height=window.innerHeight*s,e.style.width=window.innerWidth+"px",e.style.height=window.innerHeight+"px",t.scale(s,s),n.canvas=e,n.ctx=t,n.fruits=[],n.bombs=[],n.scoreIndicators=[],n.score=0,n.missed=0,n.gameStarted=!1,n.gameOver=!1,n.player.x=window.innerWidth/2-50,n.player.y=window.innerHeight-180,n.lastFruitSpawn=0,n.lastBombSpawn=0,n.fruitSpawnRate=1500,n.bombSpawnRate=3e3,n.isEating=!1,n.eatingTimer=0,n.imagesLoaded=!1;const a=new Image,i=new Image;let o=0;const d=()=>{o++,o===2&&(n.imagesLoaded=!0)};a.onload=d,i.onload=d,a.src="/assets/slim-1.png",i.src="/assets/slim-2.png",n.slimIdle=a,n.slimEating=i;const r=new Image;r.onload=()=>{n.mapImage=r},r.src=`/assets/${n.selectedMap}.jpg`;try{n.sounds.bgMusic=new Audio("/assets/bazooka.mp3"),n.sounds.bgMusic.loop=!0,n.sounds.bgMusic.volume=.05,n.sounds.eatSound=new Audio("/assets/nom.mp3"),n.sounds.eatSound.volume=.5,n.sounds.bombSound=new Audio("/assets/nom.mp3"),n.sounds.bombSound.volume=.5,n.sounds.gameOverSound=new Audio("/assets/game-over.mp3"),n.sounds.gameOverSound.volume=.5,n.soundsLoaded=!0}catch(w){console.log("Sounds not loaded:",w)}document.addEventListener("keydown",f),document.addEventListener("keyup",p),g()}function f(e){e.key===" "&&!n.gameStarted&&(n.gameStarted=!0,n.lastFruitSpawn=Date.now(),n.lastBombSpawn=Date.now(),n.sounds.bgMusic&&!n.musicMuted&&n.sounds.bgMusic.play().catch(t=>console.log("Music play failed:",t))),n.keys[e.key]=!0}function p(e){n.keys[e.key]=!1}function x(){const e={x:Math.random()*(window.innerWidth-80),y:-80,size:60,speed:2+Math.random()*2,emoji:n.fruitTypes[Math.floor(Math.random()*n.fruitTypes.length)]};n.fruits.push(e)}function M(){const e={x:Math.random()*(window.innerWidth-80),y:-80,size:60,speed:2.5+Math.random()*1.5,emoji:"💣"};n.bombs.push(e)}function m(e,t,s,a){n.scoreIndicators.push({x:e,y:t,text:s,color:a,opacity:1,lifetime:0})}function E(){if(!n.gameStarted)return;const e=n,t=e.player;e.keys.ArrowLeft&&t.x>0&&(t.x-=t.speed),e.keys.ArrowRight&&t.x<window.innerWidth-t.width&&(t.x+=t.speed);const s=Date.now();s-e.lastFruitSpawn>e.fruitSpawnRate&&(x(),e.lastFruitSpawn=s,e.fruitSpawnRate>600&&(e.fruitSpawnRate-=10)),s-e.lastBombSpawn>e.bombSpawnRate&&(M(),e.lastBombSpawn=s,e.bombSpawnRate>1500&&(e.bombSpawnRate-=20));for(let a=e.fruits.length-1;a>=0;a--){const i=e.fruits[a];i.y+=i.speed,i.y+i.size>t.y&&i.y<t.y+t.height&&i.x+i.size>t.x&&i.x<t.x+t.width?(e.fruits.splice(a,1),e.score+=10,document.getElementById("score").textContent=e.score,m(t.x+t.width/2,t.y-10,"+10","#4ade80"),e.isEating=!0,e.eatingTimer=200,e.sounds.eatSound&&(e.sounds.eatSound.currentTime=0,e.sounds.eatSound.play().catch(o=>console.log("Sound play failed:",o)))):i.y>window.innerHeight&&(e.fruits.splice(a,1),e.missed++,document.getElementById("missed").textContent=e.missed,e.missed>=10&&(e.gameOver=!0,e.sounds.bgMusic&&(e.sounds.bgMusic.pause(),e.sounds.bgMusic.currentTime=0),e.sounds.gameOverSound&&e.sounds.gameOverSound.play().catch(o=>console.log("Sound play failed:",o))))}for(let a=e.bombs.length-1;a>=0;a--){const i=e.bombs[a];i.y+=i.speed,i.y+i.size>t.y&&i.y<t.y+t.height&&i.x+i.size>t.x&&i.x<t.x+t.width?(e.bombs.splice(a,1),e.score=Math.max(0,e.score-20),document.getElementById("score").textContent=e.score,m(t.x+t.width/2,t.y-10,"-20","#ef4444"),e.isEating=!0,e.eatingTimer=200,e.sounds.bombSound&&(e.sounds.bombSound.currentTime=0,e.sounds.bombSound.play().catch(o=>console.log("Sound play failed:",o)))):i.y>window.innerHeight&&e.bombs.splice(a,1)}for(let a=e.scoreIndicators.length-1;a>=0;a--){const i=e.scoreIndicators[a];i.lifetime+=16,i.y-=1,i.opacity=1-i.lifetime/1e3,i.lifetime>1e3&&e.scoreIndicators.splice(a,1)}e.isEating&&(e.eatingTimer-=16,e.eatingTimer<=0&&(e.isEating=!1))}function I(){const e=n,t=e.ctx;if(e.mapImage&&e.mapImage.complete?t.drawImage(e.mapImage,0,0,window.innerWidth,window.innerHeight):(t.fillStyle="#1a1a1a",t.fillRect(0,0,window.innerWidth,window.innerHeight)),e.imagesLoaded){const s=e.isEating?e.slimEating:e.slimIdle;t.drawImage(s,e.player.x,e.player.y,e.player.width,e.player.height)}else t.fillStyle="#646cff",t.fillRect(e.player.x,e.player.y,e.player.width,e.player.height);t.font="60px Arial",e.fruits.forEach(s=>{t.fillText(s.emoji,s.x,s.y+s.size)}),e.bombs.forEach(s=>{t.fillText(s.emoji,s.x,s.y+s.size)}),e.scoreIndicators.forEach(s=>{t.save(),t.globalAlpha=s.opacity,t.fillStyle=s.color,t.font="bold 36px Arial",t.textAlign="center",t.fillText(s.text,s.x,s.y),t.restore()}),t.textAlign="left",e.gameStarted||(t.fillStyle="rgba(0, 0, 0, 0.7)",t.fillRect(0,0,window.innerWidth,window.innerHeight),t.fillStyle="#646cff",t.font="48px Arial",t.textAlign="center",t.fillText("Press SPACE to Start!",window.innerWidth/2,window.innerHeight/2),t.fillStyle="#888",t.font="28px Arial",t.fillText("Catch fast food 🍕 (+10) | Avoid bombs 💣 (-20)",window.innerWidth/2,window.innerHeight/2+40),t.textAlign="left"),e.gameOver&&(t.fillStyle="rgba(0, 0, 0, 0.8)",t.fillRect(0,0,window.innerWidth,window.innerHeight),t.fillStyle="#ff4444",t.font="64px Arial",t.textAlign="center",t.fillText("Game Over!",window.innerWidth/2,window.innerHeight/2-30),t.fillStyle="#fff",t.font="32px Arial",t.fillText(`Final Score: ${e.score}`,window.innerWidth/2,window.innerHeight/2+20),t.fillStyle="#888",t.font="24px Arial",t.fillText("Click 'Back to Menu' to play again",window.innerWidth/2,window.innerHeight/2+60),t.textAlign="left")}function g(){E(),I(),n.gameOver||(n.animationId=requestAnimationFrame(g))}const c=document.querySelector("#app");function l(){b(c,A)}function A(e){switch(e){case"square":y(c,l);break;case"fruitCatcher":h(c,l);break;default:l()}}l();

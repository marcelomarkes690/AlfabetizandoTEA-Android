
const words=[
 {w:'GATO',e:'🐱'},{w:'PATO',e:'🦆'},{w:'BOLA',e:'⚽'},{w:'CASA',e:'🏠'},{w:'SAPO',e:'🐸'},
 {w:'RATO',e:'🐭'},{w:'PEIXE',e:'🐟'},{w:'FLOR',e:'🌸'},{w:'LUA',e:'🌙'},{w:'SOL',e:'☀️'},
 {w:'BANANA',e:'🍌'},{w:'MAÇÃ',e:'🍎'},{w:'UVA',e:'🍇'},{w:'LIVRO',e:'📚'},{w:'CARRO',e:'🚗'},
 {w:'MESA',e:'🪑'},{w:'OVO',e:'🥚'},{w:'LEITE',e:'🥛'},{w:'CHAVE',e:'🔑'},{w:'NAVIO',e:'🚢'},
 {w:'ESCOLA',e:'🏫'},{w:'CADERNO',e:'📒'},{w:'BOCA',e:'👄'},{w:'DADO',e:'🎲'},{w:'FACA',e:'🔪'}
];
const games=[
 {id:'assoc',icon:'🧩',title:'Associação imagem-palavra',desc:'100 atividades para observar a imagem e selecionar a palavra correta.',tag:'Alfabetização'},
 {id:'mem',icon:'🃏',title:'Jogo da memória',desc:'100 configurações de pares entre imagens e palavras.',tag:'Memória'},
 {id:'caca',icon:'🔎',title:'Caça-palavras',desc:'100 grades diferentes para localizar palavras-alvo.',tag:'Atenção'},
 {id:'ordem',icon:'🔤',title:'Monte a palavra',desc:'100 atividades para organizar letras ou partes de palavras.',tag:'Escrita'},
 {id:'seq',icon:'➡️',title:'Sequências',desc:'100 desafios com padrões numéricos e lógicos.',tag:'Cognição'},
 {id:'math',icon:'🔢',title:'Desafio matemático',desc:'100 atividades de adição, subtração, multiplicação e divisão.',tag:'Matemática'}
];
const legacy=['Letras e sons','Sílabas','Pré-silábica','Silábica','Silábico-alfabética','Alfabética','Leitura','Interpretação','Ortografia','Vocabulário','Frases e textos','Caça-palavras','Memória','Atenção','Sequências','Números','Adição','Subtração','Multiplicação','Divisão','Geometria','Medidas','Tempo','Dinheiro','Tabelas e gráficos'];

let level='Inicial', current=games[0], round=0, score=0, attempts=0, memoryState={};
const gameCards=document.getElementById('gameCards'), gameArea=document.getElementById('gameArea'), feedback=document.getElementById('feedback');
document.getElementById('legacyGrid').innerHTML=legacy.map(x=>`<span>${x}</span>`).join('');

function seeded(seed){let x=Math.sin(seed*99991+17)*10000;return x-Math.floor(x)}
function randSeed(seed,n){return Math.floor(seeded(seed)*n)}
function shuffleSeed(a,seed){a=[...a];for(let i=a.length-1;i>0;i--){let j=randSeed(seed+i*17,i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function say(t){if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';speechSynthesis.speak(u)}}
function setFeedback(text,ok){feedback.textContent=text;feedback.className='feedback '+(ok?'ok':'no')}
function updateScore(){document.getElementById('scoreLabel').textContent=`Acertos: ${score}`;document.getElementById('attemptLabel').textContent=`Respondidas: ${attempts}`}
function seedBase(extra=0){return games.findIndex(g=>g.id===current.id)*10000 + round*101 + (level==='Inicial'?1:level==='Intermediário'?2:3)*997 + extra}
function updateProgress(){document.getElementById('activityCounter').textContent=`Atividade ${round+1} de 100`;document.getElementById('bar').style.width=`${round+1}%`}

function renderGameCards(){
 gameCards.innerHTML='';
 games.forEach(g=>{
  const el=document.createElement('article');
  el.innerHTML=`<div class="game-icon">${g.icon}</div><div class="game-title">${g.title}</div><div class="game-desc">${g.desc}</div><span class="game-tag">${g.tag}</span>`;
  el.onclick=()=>{current=g;round=0;renderGame();document.getElementById('play').scrollIntoView({behavior:'smooth'})};
  gameCards.appendChild(el);
 });
}
function renderGame(){
 feedback.textContent='';feedback.className='feedback';updateProgress();
 document.getElementById('gameEyebrow').textContent=current.tag;
 document.getElementById('gameTitle').textContent=current.title;
 if(current.id==='assoc')renderAssoc();
 if(current.id==='mem')renderMemory();
 if(current.id==='caca')renderCaca();
 if(current.id==='ordem')renderOrdem();
 if(current.id==='seq')renderSeq();
 if(current.id==='math')renderMath();
}
function register(ok,correctText=''){
 attempts++;
 if(ok){score++;setFeedback('Muito bem! Resposta correta.',true)}
 else setFeedback(correctText||'Tente novamente na próxima atividade.',false);
 updateScore();
}
function renderAssoc(){
 const seed=seedBase();
 const target=words[randSeed(seed,words.length)];
 const pool=words.filter(x=>x.w!==target.w);
 const others=shuffleSeed(pool,seed+5).slice(0, level==='Avançado'?5:2);
 const choices=shuffleSeed([target,...others],seed+11);
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">${target.e}</div><div class="instruction">Qual palavra corresponde à imagem?</div><div class="choice-grid">${choices.map(x=>`<button class="choice" data-a="${x.w}">${x.w}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
   gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);
   if(b.dataset.a===target.w){b.classList.add('correct');register(true)}
   else{b.classList.add('wrong');[...gameArea.querySelectorAll('.choice')].find(x=>x.dataset.a===target.w)?.classList.add('correct');register(false,`A resposta correta é ${target.w}.`)}
 });
}
function renderMemory(){
 const seed=seedBase(), pairs=level==='Inicial'?3:level==='Intermediário'?4:6;
 const chosen=shuffleSeed(words,seed).slice(0,pairs);
 let cards=[];chosen.forEach((x,i)=>{cards.push({k:i,t:x.e});cards.push({k:i,t:x.w})});
 cards=shuffleSeed(cards,seed+27);memoryState={first:null,locked:false,matched:0,completed:false};
 gameArea.innerHTML=`<div class="instruction">Encontre todos os pares de imagem e palavra.</div><div class="memory-grid">${cards.map((c,i)=>`<button class="memory-card covered" data-i="${i}" data-k="${c.k}">${c.t}</button>`).join('')}</div>`;
 gameArea.querySelectorAll('.memory-card').forEach(b=>b.onclick=()=>flipMemory(b,pairs));
}
function flipMemory(b,pairs){
 if(memoryState.locked||b.classList.contains('matched')||!b.classList.contains('covered'))return;
 b.classList.remove('covered');
 if(!memoryState.first){memoryState.first=b;return}
 if(memoryState.first.dataset.k===b.dataset.k){
  memoryState.first.classList.add('matched');b.classList.add('matched');memoryState.first=null;memoryState.matched++;
  if(memoryState.matched===pairs&&!memoryState.completed){memoryState.completed=true;register(true);setFeedback('Parabéns! Você encontrou todos os pares.',true)}
 }else{
  memoryState.locked=true;const first=memoryState.first;
  setTimeout(()=>{first.classList.add('covered');b.classList.add('covered');memoryState.first=null;memoryState.locked=false},650)
 }
}
function renderCaca(){
 const seed=seedBase(), allowed=words.filter(x=>x.w.length<=8), target=allowed[randSeed(seed,allowed.length)].w;
 const size=8, letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';let grid=Array(size*size).fill('').map((_,i)=>letters[randSeed(seed+i*13,letters.length)]);
 const direction=randSeed(seed+3,2);let positions=[];
 if(direction===0){
  const row=randSeed(seed+4,size), start=randSeed(seed+5,size-target.length+1);
  for(let i=0;i<target.length;i++){let p=row*size+start+i;grid[p]=target[i];positions.push(p)}
 }else{
  const col=randSeed(seed+4,size), start=randSeed(seed+5,size-target.length+1);
  for(let i=0;i<target.length;i++){let p=(start+i)*size+col;grid[p]=target[i];positions.push(p)}
 }
 gameArea.innerHTML=`<div class="instruction">Encontre a palavra <strong>${target}</strong> na grade e toque nas letras na ordem.</div><div class="wordsearch">${grid.map((l,i)=>`<button class="wordcell" data-i="${i}">${l}</button>`).join('')}</div>`;
 let chosen=[];
 gameArea.querySelectorAll('.wordcell').forEach(b=>b.onclick=()=>{
   const p=+b.dataset.i;
   if(b.classList.contains('selected')){b.classList.remove('selected');chosen=chosen.filter(x=>x!==p)}
   else{b.classList.add('selected');chosen.push(p)}
   if(chosen.length===positions.length){
     const ok=chosen.every((x,i)=>x===positions[i]);
     gameArea.querySelectorAll('.wordcell').forEach(x=>x.disabled=true);
     register(ok,`A palavra ${target} estava em outra sequência de casas.`);
   }
 });
}
function renderOrdem(){
 const seed=seedBase(), t=words[randSeed(seed,words.length)];
 let chunk=level==='Inicial'?1:2;
 let parts=[];for(let i=0;i<t.w.length;i+=chunk)parts.push(t.w.slice(i,i+chunk));
 if(level==='Avançado'&&parts.length<4){chunk=1;parts=[];for(let i=0;i<t.w.length;i+=chunk)parts.push(t.w.slice(i,i+chunk))}
 let built=[];
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">${t.e}</div><div class="instruction">Monte a palavra correspondente à imagem.</div><div class="dropzone" id="drop">Toque nas partes abaixo.</div><div class="tiles">${shuffleSeed(parts,seed+19).map((p,i)=>`<button class="tile" data-p="${p}" data-i="${i}">${p}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{
  if(b.disabled)return;b.disabled=true;b.classList.add('selected');built.push(b.dataset.p);document.getElementById('drop').textContent=built.join('');
  if(built.length===parts.length){register(built.join('')===t.w,`A palavra correta é ${t.w}.`)}
 });
}
function renderSeq(){
 const seed=seedBase();
 let step=level==='Inicial'?1+(randSeed(seed,2)):level==='Intermediário'?2+randSeed(seed,4):3+randSeed(seed,6);
 let start=1+randSeed(seed+7,12);
 let len=level==='Avançado'?5:4;
 let arr=[];for(let i=0;i<len-1;i++)arr.push(start+i*step);
 let ans=start+(len-1)*step;
 let choices=shuffleSeed([ans,ans+step,Math.max(0,ans-step)],seed+31);
 gameArea.innerHTML=`<div class="instruction">Qual número completa a sequência?</div><div class="sequence-grid">${arr.map(x=>`<div class="seq-card">${x}</div>`).join('')}<div class="seq-card">?</div></div><div class="choice-grid" style="margin-top:16px">${choices.map(x=>`<button class="choice" data-a="${x}">${x}</button>`).join('')}</div>`;
 gameArea.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
  gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);
  if(+b.dataset.a===ans){b.classList.add('correct');register(true)}else{b.classList.add('wrong');register(false,`A resposta correta é ${ans}.`)}
 });
}
function renderMath(){
 const seed=seedBase();let a,b,op,ans;
 if(level==='Inicial'){a=1+randSeed(seed,10);b=1+randSeed(seed+2,9);op=randSeed(seed+4,2)?'+':'−';if(op==='−'&&a<b)[a,b]=[b,a];ans=op==='+'?a+b:a-b}
 else if(level==='Intermediário'){a=2+randSeed(seed,30);b=1+randSeed(seed+2,12);op=['+','−','×'][randSeed(seed+4,3)];if(op==='−'&&a<b)[a,b]=[b,a];ans=op==='+'?a+b:op==='−'?a-b:a*b}
 else{const type=randSeed(seed+4,2);if(type===0){a=2+randSeed(seed,12);b=2+randSeed(seed+2,12);op='×';ans=a*b}else{b=2+randSeed(seed,9);ans=2+randSeed(seed+2,10);a=b*ans;op='÷'}}
 let choices=shuffleSeed([ans,ans+1,Math.max(0,ans-1)],seed+41);
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">🔢</div><div class="instruction">Resolva: <strong>${a} ${op} ${b}</strong></div><div class="choice-grid">${choices.map(x=>`<button class="choice" data-a="${x}">${x}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.choice').forEach(bu=>bu.onclick=()=>{
  gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);
  if(+bu.dataset.a===ans){bu.classList.add('correct');register(true)}else{bu.classList.add('wrong');register(false,`A resposta correta é ${ans}.`)}
 });
}

document.querySelectorAll('.level').forEach(b=>b.onclick=()=>{document.querySelectorAll('.level').forEach(x=>x.classList.remove('active'));b.classList.add('active');level=b.dataset.level;round=0;renderGame()});
document.getElementById('nextRound').onclick=()=>{round=(round+1)%100;renderGame()};
document.getElementById('prevRound').onclick=()=>{round=(round+99)%100;renderGame()};
document.getElementById('ouvir').onclick=()=>say(document.querySelector('.instruction')?.innerText||current.desc);
document.getElementById('surpresa').onclick=()=>{current=games[randSeed(Date.now(),games.length)];round=randSeed(Date.now()+17,100);renderGame();document.getElementById('play').scrollIntoView({behavior:'smooth'})};

renderGameCards();renderGame();updateScore();

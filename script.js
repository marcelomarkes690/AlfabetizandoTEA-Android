
const words=[
 {w:'GATO',e:'🐱'},{w:'PATO',e:'🦆'},{w:'BOLA',e:'⚽'},{w:'CASA',e:'🏠'},{w:'SAPO',e:'🐸'},
 {w:'RATO',e:'🐭'},{w:'PEIXE',e:'🐟'},{w:'FLOR',e:'🌸'},{w:'LUA',e:'🌙'},{w:'SOL',e:'☀️'},
 {w:'BANANA',e:'🍌'},{w:'MAÇÃ',e:'🍎'},{w:'UVA',e:'🍇'},{w:'LIVRO',e:'📚'},{w:'CARRO',e:'🚗'}
];
const games=[
 {id:'assoc',icon:'🧩',title:'Associação imagem-palavra',desc:'Observe a imagem e selecione a palavra correta.',tag:'Alfabetização'},
 {id:'mem',icon:'🃏',title:'Jogo da memória',desc:'Encontre pares de imagem e palavra.',tag:'Memória'},
 {id:'caca',icon:'🔎',title:'Caça-palavras',desc:'Localize uma palavra em uma grade de letras.',tag:'Atenção'},
 {id:'ordem',icon:'🔤',title:'Monte a palavra',desc:'Toque nas partes na ordem correta para formar a palavra.',tag:'Escrita'},
 {id:'seq',icon:'➡️',title:'Sequências',desc:'Descubra o próximo item de uma sequência.',tag:'Cognição'},
 {id:'math',icon:'🔢',title:'Desafio matemático',desc:'Resolva operações e situações simples.',tag:'Matemática'}
];
const legacy=['Letras e sons','Sílabas','Pré-silábica','Silábica','Silábico-alfabética','Alfabética','Leitura','Interpretação','Ortografia','Vocabulário','Frases e textos','Caça-palavras','Memória','Atenção','Sequências','Números','Adição','Subtração','Multiplicação','Divisão','Geometria','Medidas','Tempo','Dinheiro','Tabelas e gráficos'];
let level='Inicial', current=games[0], round=0, score=0, memoryState={};

const gameCards=document.getElementById('gameCards'), gameArea=document.getElementById('gameArea'), feedback=document.getElementById('feedback');
document.getElementById('legacyGrid').innerHTML=legacy.map(x=>`<span>${x}</span>`).join('');

function rand(n){return Math.floor(Math.random()*n)}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=rand(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function say(t){if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';speechSynthesis.speak(u)}}
function setFeedback(text,ok){feedback.textContent=text;feedback.className='feedback '+(ok?'ok':'no')}
function updateScore(){document.getElementById('scoreLabel').textContent=`Acertos: ${score}`}

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
 feedback.textContent='';feedback.className='feedback';
 document.getElementById('gameEyebrow').textContent=current.tag;
 document.getElementById('gameTitle').textContent=current.title;
 if(current.id==='assoc')renderAssoc();
 if(current.id==='mem')renderMemory();
 if(current.id==='caca')renderCaca();
 if(current.id==='ordem')renderOrdem();
 if(current.id==='seq')renderSeq();
 if(current.id==='math')renderMath();
}
function renderAssoc(){
 const target=words[rand(words.length)], others=shuffle(words.filter(x=>x.w!==target.w)).slice(0,2);
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">${target.e}</div><div class="instruction">Qual palavra corresponde à imagem?</div><div class="choice-grid">${shuffle([target,...others]).map(x=>`<button class="choice" data-a="${x.w}">${x.w}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
   gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);
   if(b.dataset.a===target.w){b.classList.add('correct');setFeedback('Muito bem! Resposta correta.',true);score++}
   else{b.classList.add('wrong');[...gameArea.querySelectorAll('.choice')].find(x=>x.dataset.a===target.w).classList.add('correct');setFeedback(`A resposta correta é ${target.w}.`,false)}
   updateScore();
 });
}
function renderMemory(){
 const pairs=level==='Inicial'?3:level==='Intermediário'?4:6;
 const chosen=shuffle(words).slice(0,pairs);
 let cards=[];
 chosen.forEach((x,i)=>{cards.push({k:i,t:x.e});cards.push({k:i,t:x.w})});
 cards=shuffle(cards);memoryState={first:null,locked:false,matched:0};
 gameArea.innerHTML=`<div class="instruction">Encontre os pares de imagem e palavra.</div><div class="memory-grid">${cards.map((c,i)=>`<button class="memory-card covered" data-i="${i}" data-k="${c.k}">${c.t}</button>`).join('')}</div>`;
 gameArea.querySelectorAll('.memory-card').forEach(b=>b.onclick=()=>flipMemory(b,pairs));
}
function flipMemory(b,pairs){
 if(memoryState.locked||b.classList.contains('matched')||!b.classList.contains('covered'))return;
 b.classList.remove('covered');
 if(!memoryState.first){memoryState.first=b;return}
 if(memoryState.first.dataset.k===b.dataset.k){
  memoryState.first.classList.add('matched');b.classList.add('matched');memoryState.first=null;memoryState.matched++;score++;updateScore();
  if(memoryState.matched===pairs)setFeedback('Parabéns! Você encontrou todos os pares.',true);
 }else{
  memoryState.locked=true;const first=memoryState.first;
  setTimeout(()=>{first.classList.add('covered');b.classList.add('covered');memoryState.first=null;memoryState.locked=false},650)
 }
}
function renderCaca(){
 const target=words.filter(x=>x.w.length<=8)[rand(words.filter(x=>x.w.length<=8).length)].w;
 const size=8, letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; let grid=Array(size*size).fill('').map(()=>letters[rand(letters.length)]);
 const row=rand(size), start=rand(size-target.length+1); for(let i=0;i<target.length;i++)grid[row*size+start+i]=target[i];
 gameArea.innerHTML=`<div class="instruction">Encontre a palavra <strong>${target}</strong> na grade e toque nas letras em sequência.</div><div class="wordsearch">${grid.map((l,i)=>`<button class="wordcell" data-i="${i}">${l}</button>`).join('')}</div>`;
 let selected='';
 gameArea.querySelectorAll('.wordcell').forEach(b=>b.onclick=()=>{
  b.classList.toggle('selected');
  selected=[...gameArea.querySelectorAll('.wordcell.selected')].map(x=>x.textContent).join('');
  if(selected===target){setFeedback(`Muito bem! Você encontrou ${target}.`,true);score++;updateScore()}
 });
}
function renderOrdem(){
 const t=words[rand(words.length)], chunk=level==='Inicial'?1:level==='Intermediário'?2:2;
 let parts=[];for(let i=0;i<t.w.length;i+=chunk)parts.push(t.w.slice(i,i+chunk));
 let built=[];
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">${t.e}</div><div class="instruction">Monte a palavra correspondente à imagem.</div><div class="dropzone" id="drop">Toque nas partes abaixo.</div><div class="tiles">${shuffle(parts).map((p,i)=>`<button class="tile" data-p="${p}">${p}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{
  if(b.disabled)return;b.disabled=true;b.classList.add('selected');built.push(b.dataset.p);document.getElementById('drop').textContent=built.join('');
  if(built.length===parts.length){
   if(built.join('')===t.w){setFeedback('Excelente! Palavra formada corretamente.',true);score++;updateScore()}
   else setFeedback(`A palavra correta é ${t.w}.`,false)
  }
 });
}
function renderSeq(){
 let step=level==='Inicial'?1:level==='Intermediário'?2:rand(3)+2,start=rand(6)+1;
 const arr=[start,start+step,start+2*step],ans=start+3*step;
 gameArea.innerHTML=`<div class="instruction">Qual número completa a sequência?</div><div class="sequence-grid">${arr.map(x=>`<div class="seq-card">${x}</div>`).join('')}<div class="seq-card">?</div></div><div class="choice-grid" style="margin-top:16px">${shuffle([ans,ans+step,Math.max(0,ans-step)]).map(x=>`<button class="choice" data-a="${x}">${x}</button>`).join('')}</div>`;
 gameArea.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
  gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);
  if(+b.dataset.a===ans){b.classList.add('correct');setFeedback('Correto!',true);score++;updateScore()}else{b.classList.add('wrong');setFeedback(`A resposta correta é ${ans}.`,false)}
 });
}
function renderMath(){
 let a,b,op,ans;
 if(level==='Inicial'){a=rand(10)+1;b=rand(8)+1;op=rand(2)?'+':'−';ans=op==='+'?a+b:Math.max(a,b)-Math.min(a,b);if(op==='−'&&a<b)[a,b]=[b,a]}
 else if(level==='Intermediário'){a=rand(20)+2;b=rand(10)+1;op=['+','−','×'][rand(3)];ans=op==='+'?a+b:op==='−'?a-b:a*b}
 else{b=rand(8)+2;ans=rand(8)+2;a=b*ans;op='÷'}
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">🔢</div><div class="instruction">Resolva: <strong>${a} ${op} ${b}</strong></div><div class="choice-grid">${shuffle([ans,ans+1,Math.max(0,ans-1)]).map(x=>`<button class="choice" data-a="${x}">${x}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.choice').forEach(bu=>bu.onclick=()=>{
  gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);
  if(+bu.dataset.a===ans){bu.classList.add('correct');setFeedback('Muito bem!',true);score++;updateScore()}else{bu.classList.add('wrong');setFeedback(`A resposta correta é ${ans}.`,false)}
 });
}
document.querySelectorAll('.level').forEach(b=>b.onclick=()=>{document.querySelectorAll('.level').forEach(x=>x.classList.remove('active'));b.classList.add('active');level=b.dataset.level;renderGame()});
document.getElementById('nextRound').onclick=()=>{round++;renderGame()};
document.getElementById('ouvir').onclick=()=>say(document.querySelector('.instruction')?.innerText||current.desc);
document.getElementById('surpresa').onclick=()=>{current=games[rand(games.length)];renderGame();document.getElementById('play').scrollIntoView({behavior:'smooth'})};
renderGameCards();renderGame();updateScore();


const wordSets = {
 Animais:[['GATO','🐱'],['PATO','🦆'],['SAPO','🐸'],['RATO','🐭'],['PEIXE','🐟'],['CÃO','🐶'],['VACA','🐄'],['LEÃO','🦁'],['MACACO','🐒'],['COELHO','🐰']],
 Alimentos:[['BANANA','🍌'],['MAÇÃ','🍎'],['UVA','🍇'],['OVO','🥚'],['LEITE','🥛'],['PÃO','🍞'],['BOLO','🍰'],['PERA','🍐'],['MEL','🍯'],['MILHO','🌽']],
 Escola:[['LIVRO','📚'],['CADERNO','📒'],['LÁPIS','✏️'],['MESA','🪑'],['ESCOLA','🏫'],['REGRA','📏'],['MOCHILA','🎒'],['COLA','🧴'],['TESOURA','✂️'],['QUADRO','🖼️']],
 Casa:[['CASA','🏠'],['CHAVE','🔑'],['CAMA','🛏️'],['MESA','🪑'],['PORTA','🚪'],['JANELA','🪟'],['COPO','🥛'],['PRATO','🍽️'],['SOFÁ','🛋️'],['LÂMPADA','💡']],
 Transporte:[['CARRO','🚗'],['NAVIO','🚢'],['ÔNIBUS','🚌'],['TREM','🚆'],['AVIÃO','✈️'],['BICICLETA','🚲'],['BARCO','⛵'],['MOTO','🏍️'],['CAMINHÃO','🚚'],['METRÔ','🚇']],
 Natureza:[['SOL','☀️'],['LUA','🌙'],['FLOR','🌸'],['ÁRVORE','🌳'],['CHUVA','🌧️'],['NUVEM','☁️'],['RIO','🏞️'],['MAR','🌊'],['FOLHA','🍃'],['PEDRA','🪨']],
 Corpo:[['BOCA','👄'],['MÃO','✋'],['PÉ','🦶'],['OLHO','👁️'],['ORELHA','👂'],['NARIZ','👃'],['DENTE','🦷'],['BRAÇO','💪'],['CABEÇA','🙂'],['CORAÇÃO','❤️']],
 Objetos:[['BOLA','⚽'],['DADO','🎲'],['FACA','🔪'],['CHAVE','🔑'],['RELÓGIO','⌚'],['ÓCULOS','👓'],['TELEFONE','📱'],['CADEADO','🔒'],['GUARDA-CHUVA','☂️'],['GARRAFA','🧴']]
};
const themes=Object.keys(wordSets);
const games=[
 {id:'assoc',icon:'🧩',title:'Associação imagem-palavra',desc:'100 atividades por temas: animais, alimentos, escola, casa, natureza, corpo e objetos.',tag:'Alfabetização'},
 {id:'mem',icon:'🃏',title:'Jogo da memória',desc:'100 combinações temáticas com pares imagem-palavra e diferentes quantidades de cartas.',tag:'Memória'},
 {id:'caca',icon:'🔎',title:'Caça-palavras',desc:'100 grades com palavras de temas e tamanhos variados, em diferentes direções.',tag:'Atenção'},
 {id:'ordem',icon:'🔤',title:'Monte a palavra',desc:'100 tarefas com letras, sílabas simples, sílabas complexas e pares fonêmicos.',tag:'Escrita'},
 {id:'seq',icon:'➡️',title:'Sequências',desc:'100 desafios de progressão, alternância, repetição e padrões.',tag:'Cognição'},
 {id:'math',icon:'🔢',title:'Desafio matemático',desc:'100 problemas e cálculos de adição, subtração, multiplicação e divisão.',tag:'Matemática'}
];
const legacy=['Letras e sons','Sílabas','Pré-silábica','Silábica','Silábico-alfabética','Alfabética','Leitura','Interpretação','Ortografia','Vocabulário','Frases e textos','Caça-palavras','Memória','Atenção','Sequências','Números','Adição','Subtração','Multiplicação','Divisão','Geometria','Medidas','Tempo','Dinheiro','Tabelas e gráficos'];
let level='Inicial',current=games[0],round=0,score=0,attempts=0,memoryState={};

const cards=document.getElementById('gameCards'),gameArea=document.getElementById('gameArea'),feedback=document.getElementById('feedback');
document.getElementById('legacyGrid').innerHTML=legacy.map(x=>`<span>${x}</span>`).join('');

function seeded(seed){let x=Math.sin(seed*9781+31)*10000;return x-Math.floor(x)}
function r(seed,n){return Math.floor(seeded(seed)*n)}
function shuffle(a,seed){a=[...a];for(let i=a.length-1;i>0;i--){let j=r(seed+i*13,i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function flatWords(theme){return wordSets[theme].map(([w,e])=>({w,e}))}
function say(t){if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';speechSynthesis.speak(u)}}
function setFeedback(text,ok){feedback.textContent=text;feedback.className='feedback '+(ok?'ok':'no')}
function updateScore(){document.getElementById('scoreLabel').textContent=`Acertos: ${score}`;document.getElementById('attemptLabel').textContent=`Respondidas: ${attempts}`}
function register(ok,msg=''){attempts++;if(ok){score++;setFeedback('Muito bem! Resposta correta.',true)}else setFeedback(msg||'Tente novamente na próxima atividade.',false);updateScore()}
function themeForRound(){return themes[Math.floor(round/13)%themes.length]}
function updateMeta(){document.getElementById('activityCounter').textContent=`Atividade ${round+1} de 100`;document.getElementById('bar').style.width=`${round+1}%`;document.getElementById('themeCounter').textContent=`Tema: ${themeForRound()}`}

function renderCards(){cards.innerHTML='';games.forEach(g=>{const el=document.createElement('article');el.innerHTML=`<div class="game-icon">${g.icon}</div><div class="game-title">${g.title}</div><div class="game-desc">${g.desc}</div><span class="game-tag">${g.tag}</span>`;el.onclick=()=>{current=g;round=0;renderGame();document.getElementById('play').scrollIntoView({behavior:'smooth'})};cards.appendChild(el)})}
function renderGame(){feedback.textContent='';feedback.className='feedback';updateMeta();document.getElementById('gameEyebrow').textContent=current.tag;document.getElementById('gameTitle').textContent=current.title;
 if(current.id==='assoc')assoc();if(current.id==='mem')memory();if(current.id==='caca')caca();if(current.id==='ordem')ordem();if(current.id==='seq')seq();if(current.id==='math')math();
}

function assoc(){
 const theme=themeForRound(),pool=flatWords(theme),seed=round*97+(level==='Inicial'?1:level==='Intermediário'?2:3);
 const target=pool[r(seed,pool.length)];
 const others=shuffle(pool.filter(x=>x.w!==target.w),seed+9).slice(0,level==='Avançado'?5:level==='Intermediário'?3:2);
 const choices=shuffle([target,...others],seed+17);
 const prompt = round%4===0 ? `Qual palavra corresponde à imagem?` :
                round%4===1 ? `Escolha o nome correto da figura.` :
                round%4===2 ? `Observe e identifique a palavra.` : `Qual opção nomeia esta imagem?`;
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">${target.e}</div><div class="instruction">${prompt}</div><div class="choice-grid">${choices.map(x=>`<button class="choice" data-a="${x.w}">${x.w}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);if(b.dataset.a===target.w){b.classList.add('correct');register(true)}else{b.classList.add('wrong');[...gameArea.querySelectorAll('.choice')].find(x=>x.dataset.a===target.w)?.classList.add('correct');register(false,`A resposta correta é ${target.w}.`)}})
}

function memory(){
 const theme=themeForRound(),seed=round*89+(level==='Inicial'?11:level==='Intermediário'?22:33),pool=flatWords(theme);
 const pairs=level==='Inicial'?3:level==='Intermediário'?4:6;
 const chosen=shuffle(pool,seed).slice(0,pairs);let arr=[];chosen.forEach((x,i)=>{arr.push({k:i,t:x.e});arr.push({k:i,t:x.w})});arr=shuffle(arr,seed+19);
 memoryState={first:null,locked:false,matched:0,completed:false};
 gameArea.innerHTML=`<div class="instruction">Encontre todos os pares de imagem e palavra do tema <strong>${theme}</strong>.</div><div class="memory-grid">${arr.map((c,i)=>`<button class="memory-card covered" data-k="${c.k}">${c.t}</button>`).join('')}</div>`;
 gameArea.querySelectorAll('.memory-card').forEach(b=>b.onclick=()=>{
   if(memoryState.locked||b.classList.contains('matched')||!b.classList.contains('covered'))return;
   b.classList.remove('covered');
   if(!memoryState.first){memoryState.first=b;return}
   if(memoryState.first.dataset.k===b.dataset.k){memoryState.first.classList.add('matched');b.classList.add('matched');memoryState.first=null;memoryState.matched++;if(memoryState.matched===pairs&&!memoryState.completed){memoryState.completed=true;register(true);setFeedback('Parabéns! Todos os pares foram encontrados.',true)}}
   else{memoryState.locked=true;const f=memoryState.first;setTimeout(()=>{f.classList.add('covered');b.classList.add('covered');memoryState.first=null;memoryState.locked=false},650)}
 })
}

function caca(){
 const theme=themeForRound(),pool=flatWords(theme).filter(x=>x.w.replace('-','').length<=8),seed=round*83+(level==='Inicial'?3:level==='Intermediário'?6:9);
 const target=pool[r(seed,pool.length)].w.replace('-','');
 const size=8,letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';let grid=Array(size*size).fill('').map((_,i)=>letters[r(seed+i*7,letters.length)]),positions=[];
 const mode=round%4;
 if(mode===0){const row=r(seed+2,size),start=r(seed+3,size-target.length+1);for(let i=0;i<target.length;i++){let p=row*size+start+i;grid[p]=target[i];positions.push(p)}}
 else if(mode===1){const col=r(seed+2,size),start=r(seed+3,size-target.length+1);for(let i=0;i<target.length;i++){let p=(start+i)*size+col;grid[p]=target[i];positions.push(p)}}
 else if(mode===2){const row=r(seed+2,size),start=r(seed+3,size-target.length+1);for(let i=0;i<target.length;i++){let p=row*size+start+(target.length-1-i);grid[p]=target[i];positions.push(p)}}
 else{const col=r(seed+2,size),start=r(seed+3,size-target.length+1);for(let i=0;i<target.length;i++){let p=(start+target.length-1-i)*size+col;grid[p]=target[i];positions.push(p)}}
 gameArea.innerHTML=`<div class="instruction">Encontre <strong>${target}</strong> na grade. A palavra pode estar na horizontal ou vertical, em ordem normal ou invertida.</div><div class="wordsearch">${grid.map((l,i)=>`<button class="wordcell" data-i="${i}">${l}</button>`).join('')}</div>`;
 let chosen=[];gameArea.querySelectorAll('.wordcell').forEach(b=>b.onclick=()=>{const p=+b.dataset.i;if(b.classList.contains('selected')){b.classList.remove('selected');chosen=chosen.filter(x=>x!==p)}else{b.classList.add('selected');chosen.push(p)}if(chosen.length===positions.length){gameArea.querySelectorAll('.wordcell').forEach(x=>x.disabled=true);register(chosen.every((x,i)=>x===positions[i]),`A palavra ${target} estava em outra sequência de casas.`)}})
}

function ordem(){
 const theme=themeForRound(),pool=flatWords(theme),seed=round*79+(level==='Inicial'?4:level==='Intermediário'?8:12),t=pool[r(seed,pool.length)];
 let parts=[];
 if(round%4===0){parts=t.w.split('')}
 else if(round%4===1){for(let i=0;i<t.w.length;i+=2)parts.push(t.w.slice(i,i+2))}
 else if(round%4===2){
   const vowels='AEIOUÁÉÍÓÚÂÊÔÃÕ';let cur='';for(const ch of t.w){cur+=ch;if(vowels.includes(ch)){parts.push(cur);cur=''}}if(cur)parts.push(cur)
 } else {
   const digraphs=['CH','LH','NH','RR','SS'];let w=t.w,i=0;while(i<w.length){let d=w.slice(i,i+2);if(digraphs.includes(d)){parts.push(d);i+=2}else{parts.push(w[i]);i++}}
 }
 let built=[];gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">${t.e}</div><div class="instruction">Monte a palavra usando as partes na ordem correta.</div><div class="dropzone" id="drop">Toque nas partes abaixo.</div><div class="tiles">${shuffle(parts,seed+21).map(p=>`<button class="tile" data-p="${p}">${p}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;b.classList.add('selected');built.push(b.dataset.p);document.getElementById('drop').textContent=built.join('');if(built.length===parts.length)register(built.join('')===t.w,`A palavra correta é ${t.w}.`)})
}

function seq(){
 const seed=round*73+(level==='Inicial'?5:level==='Intermediário'?10:15),kind=round%5;let arr=[],ans,choices;
 if(kind===0){let start=1+r(seed,9),step=1+r(seed+2,3);arr=[start,start+step,start+2*step];ans=start+3*step}
 else if(kind===1){let start=2+r(seed,7),step=2+r(seed+2,4);arr=[start,start+step,start+2*step,start+3*step];ans=start+4*step}
 else if(kind===2){let a=1+r(seed,5),b=a+1;arr=[a,b,a,b];ans=a}
 else if(kind===3){let a=2+r(seed,4);arr=[a,a*2,a*4];ans=a*8}
 else{let a=10+r(seed,10),step=1+r(seed+2,3);arr=[a,a-step,a-2*step];ans=a-3*step}
 choices=shuffle([ans,ans+1,Math.max(0,ans-1)],seed+31);
 gameArea.innerHTML=`<div class="instruction">Observe o padrão e escolha o próximo item.</div><div class="sequence-grid">${arr.map(x=>`<div class="seq-card">${x}</div>`).join('')}<div class="seq-card">?</div></div><div class="choice-grid" style="margin-top:16px">${choices.map(x=>`<button class="choice" data-a="${x}">${x}</button>`).join('')}</div>`;
 gameArea.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);if(+b.dataset.a===ans){b.classList.add('correct');register(true)}else{b.classList.add('wrong');register(false,`A resposta correta é ${ans}.`)}})
}

function math(){
 const seed=round*67+(level==='Inicial'?7:level==='Intermediário'?14:21),kind=round%6;let q,ans,choices;
 if(kind===0){let a=1+r(seed,12),b=1+r(seed+1,10);ans=a+b;q=`Quanto é ${a} + ${b}?`}
 else if(kind===1){let a=5+r(seed,15),b=1+r(seed+1,a-1);ans=a-b;q=`Quanto é ${a} − ${b}?`}
 else if(kind===2){let a=2+r(seed,8),b=2+r(seed+1,8);ans=a*b;q=`Quanto é ${a} × ${b}?`}
 else if(kind===3){let b=2+r(seed,8),res=2+r(seed+1,8),a=b*res;ans=res;q=`Quanto é ${a} ÷ ${b}?`}
 else if(kind===4){let a=2+r(seed,10),b=1+r(seed+1,8);ans=a+b;q=`Ana tinha ${a} figurinhas e ganhou mais ${b}. Quantas tem agora?`}
 else{let a=5+r(seed,10),b=1+r(seed+1,a-1);ans=a-b;q=`Havia ${a} lápis. ${b} foram usados. Quantos restaram?`}
 choices=shuffle([ans,ans+1,Math.max(0,ans-1)],seed+41);
 gameArea.innerHTML=`<div class="prompt-center"><div class="prompt-emoji">🔢</div><div class="instruction">${q}</div><div class="choice-grid">${choices.map(x=>`<button class="choice" data-a="${x}">${x}</button>`).join('')}</div></div>`;
 gameArea.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{gameArea.querySelectorAll('.choice').forEach(x=>x.disabled=true);if(+b.dataset.a===ans){b.classList.add('correct');register(true)}else{b.classList.add('wrong');register(false,`A resposta correta é ${ans}.`)}})
}

document.querySelectorAll('.level').forEach(b=>b.onclick=()=>{document.querySelectorAll('.level').forEach(x=>x.classList.remove('active'));b.classList.add('active');level=b.dataset.level;round=0;renderGame()});
document.getElementById('nextRound').onclick=()=>{round=(round+1)%100;renderGame()};
document.getElementById('prevRound').onclick=()=>{round=(round+99)%100;renderGame()};
document.getElementById('ouvir').onclick=()=>say(document.querySelector('.instruction')?.innerText||current.desc);
document.getElementById('surpresa').onclick=()=>{current=games[r(Date.now(),games.length)];round=r(Date.now()+17,100);renderGame();document.getElementById('play').scrollIntoView({behavior:'smooth'})};
renderCards();renderGame();updateScore();

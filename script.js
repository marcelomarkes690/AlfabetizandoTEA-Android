
const categorias = [
  {icon:'🔤',title:'Letras e sons',desc:'Reconhecimento de letras, sons iniciais e consciência fonológica.',tag:'Alfabetização'},
  {icon:'🧩',title:'Sílabas',desc:'Combinação de sílabas simples e complexas para formar palavras.',tag:'Consciência silábica'},
  {icon:'📖',title:'Leitura',desc:'Palavras, frases curtas e compreensão de pequenos textos.',tag:'Leitura'},
  {icon:'✍️',title:'Escrita',desc:'Completar palavras, ordenar letras e praticar ortografia.',tag:'Escrita'},
  {icon:'🧠',title:'Atenção',desc:'Atividades rápidas de foco, associação e discriminação visual.',tag:'Funções cognitivas'},
  {icon:'🃏',title:'Memória',desc:'Pares de letras, sílabas, palavras e imagens.',tag:'Jogo'},
  {icon:'🔢',title:'Números',desc:'Contagem, comparação, sequência e reconhecimento numérico.',tag:'Matemática'},
  {icon:'➕',title:'Operações',desc:'Adição, subtração e resolução de situações simples.',tag:'Matemática'},
  {icon:'📐',title:'Formas e espaço',desc:'Geometria, posição, padrões e orientação espacial.',tag:'Matemática'},
  {icon:'⏰',title:'Tempo',desc:'Dias, horários, sequência de eventos e rotina.',tag:'Matemática'},
  {icon:'💰',title:'Dinheiro',desc:'Reconhecimento de valores e situações do cotidiano.',tag:'Matemática'},
  {icon:'📊',title:'Gráficos e dados',desc:'Leitura simples de tabelas, gráficos e comparações.',tag:'Matemática'}
];

const atividades = [
  {emoji:'🐱',q:'Qual palavra corresponde à imagem?',opts:['GATO','PATO','RATO'],ans:'GATO'},
  {emoji:'🍌',q:'Qual palavra começa com a sílaba BA?',opts:['BOLA','BANANA','MALA'],ans:'BANANA'},
  {emoji:'🚗',q:'Qual é a primeira letra de CARRO?',opts:['C','R','A'],ans:'C'},
  {emoji:'🐶',q:'Complete: CA__RRO',opts:['CHO','XU','RR'],ans:'CHO'},
  {emoji:'🔢',q:'Quanto é 2 + 3?',opts:['4','5','6'],ans:'5'},
  {emoji:'🍎',q:'Há 4 maçãs e chegam mais 2. Quantas ficam?',opts:['5','6','7'],ans:'6'},
  {emoji:'🔺',q:'Qual destas é uma forma com 3 lados?',opts:['Círculo','Triângulo','Quadrado'],ans:'Triângulo'},
  {emoji:'🕒',q:'Se agora são 3 horas, qual número aparece no relógio?',opts:['2','3','4'],ans:'3'},
  {emoji:'💵',q:'Qual valor é maior?',opts:['R$ 2','R$ 5','R$ 1'],ans:'R$ 5'}
];

const cards = document.getElementById('cards');
const busca = document.getElementById('busca');
const emoji = document.getElementById('emoji');
const pergunta = document.getElementById('pergunta');
const opcoes = document.getElementById('opcoes');
const feedback = document.getElementById('feedback');
const acertosEl = document.getElementById('acertos');

let atual = 0;
let nivel = 'Inicial';
let acertos = Number(localStorage.getItem('alfatea_acertos') || 0);
acertosEl.textContent = acertos;

function renderCards(filtro=''){
  cards.innerHTML='';
  categorias.filter(c => (c.title+' '+c.desc+' '+c.tag).toLowerCase().includes(filtro.toLowerCase()))
    .forEach((c,i)=>{
      const el=document.createElement('article');
      el.innerHTML=`<div class="card-icon">${c.icon}</div><div class="card-title">${c.title}</div><div class="card-desc">${c.desc}</div><span class="tag">${c.tag}</span>`;
      el.onclick=()=>{ atual=i%atividades.length; renderAtividade(); document.querySelector('.practice').scrollIntoView({behavior:'smooth'}); };
      cards.appendChild(el);
    });
}
function renderAtividade(){
  const a=atividades[atual];
  emoji.textContent=a.emoji;
  pergunta.textContent=a.q;
  feedback.textContent='';
  feedback.className='feedback';
  opcoes.innerHTML='';
  a.opts.forEach(o=>{
    const b=document.createElement('button');
    b.className='option';
    b.textContent=o;
    b.onclick=()=>responder(b,o,a.ans);
    opcoes.appendChild(b);
  });
}
function responder(btn,resposta,certa){
  document.querySelectorAll('.option').forEach(b=>b.disabled=true);
  if(resposta===certa){
    btn.classList.add('correct');
    feedback.textContent='Muito bem! Resposta correta.';
    feedback.classList.add('ok');
    acertos++;
    localStorage.setItem('alfatea_acertos',acertos);
    acertosEl.textContent=acertos;
  }else{
    btn.classList.add('wrong');
    [...document.querySelectorAll('.option')].find(b=>b.textContent===certa)?.classList.add('correct');
    feedback.textContent=`A resposta correta é ${certa}.`;
    feedback.classList.add('no');
  }
}
document.getElementById('proxima').onclick=()=>{atual=(atual+1)%atividades.length;renderAtividade()};
document.getElementById('surpresa').onclick=()=>{atual=Math.floor(Math.random()*atividades.length);renderAtividade();document.querySelector('.practice').scrollIntoView({behavior:'smooth'})};
document.getElementById('ouvir').onclick=()=>{
  if('speechSynthesis' in window){
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(pergunta.textContent);
    u.lang='pt-BR'; speechSynthesis.speak(u);
  } else alert('Leitura por voz não disponível neste navegador.');
};
document.getElementById('zerar').onclick=()=>{
  localStorage.removeItem('alfatea_acertos'); acertos=0; acertosEl.textContent=0;
};
busca.oninput=e=>renderCards(e.target.value);
document.querySelectorAll('.level').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.level').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); nivel=b.dataset.level;
  document.getElementById('tituloAtividade').textContent=`Forme a palavra — ${nivel}`;
});
renderCards(); renderAtividade();

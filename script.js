
const categorias = [
 {id:'letras',icon:'🔤',title:'Letras e sons',group:'Alfabetização',desc:'Reconhecimento de letras, sons iniciais e consciência fonológica.'},
 {id:'silabas',icon:'🧩',title:'Sílabas',group:'Alfabetização',desc:'Sílabas simples e complexas, segmentação e formação de palavras.'},
 {id:'hip_pre',icon:'🖍️',title:'Hipótese pré-silábica',group:'Alfabetização',desc:'Quantidade, variedade de letras, nome próprio e relação entre desenho e escrita.'},
 {id:'hip_sil',icon:'🔡',title:'Hipótese silábica',group:'Alfabetização',desc:'Correspondência entre partes faladas e registros gráficos.'},
 {id:'hip_silalf',icon:'🧱',title:'Silábico-alfabética',group:'Alfabetização',desc:'Transição entre registro silábico e alfabético.'},
 {id:'hip_alf',icon:'✍️',title:'Hipótese alfabética',group:'Alfabetização',desc:'Escrita convencional, ortografia e segmentação.'},
 {id:'leitura',icon:'📖',title:'Leitura',group:'Linguagem',desc:'Palavras, frases, pequenos textos e fluência.'},
 {id:'interpretacao',icon:'💬',title:'Interpretação',group:'Linguagem',desc:'Compreensão literal, inferência, sequência e ideia principal.'},
 {id:'ortografia',icon:'📝',title:'Ortografia',group:'Linguagem',desc:'Regularidades, dígrafos, encontros consonantais e pares fonêmicos.'},
 {id:'vocabulario',icon:'🗂️',title:'Vocabulário',group:'Linguagem',desc:'Significados, categorias semânticas, sinônimos e antônimos.'},
 {id:'frases',icon:'🧾',title:'Frases e textos',group:'Linguagem',desc:'Ordenação, pontuação, coesão e produção de frases.'},
 {id:'caca',icon:'🔎',title:'Caça-palavras',group:'Linguagem',desc:'Busca visual de palavras por temas e níveis.'},
 {id:'memoria',icon:'🃏',title:'Jogo da memória',group:'Cognição',desc:'Pares de letras, sílabas, palavras e conceitos.'},
 {id:'atencao',icon:'🎯',title:'Atenção e foco',group:'Cognição',desc:'Discriminação visual, seleção, sequência e foco sustentado.'},
 {id:'sequencia',icon:'➡️',title:'Sequências e padrões',group:'Cognição',desc:'Ordem lógica, padrões visuais, numéricos e linguísticos.'},
 {id:'numeros',icon:'🔢',title:'Números e contagem',group:'Matemática',desc:'Reconhecimento, contagem, comparação e sequência numérica.'},
 {id:'adicao',icon:'➕',title:'Adição',group:'Matemática',desc:'Cálculo mental, composição e situações-problema.'},
 {id:'subtracao',icon:'➖',title:'Subtração',group:'Matemática',desc:'Retirada, diferença, comparação e problemas.'},
 {id:'mult',icon:'✖️',title:'Multiplicação',group:'Matemática',desc:'Adição de parcelas iguais, grupos e fatos básicos.'},
 {id:'div',icon:'➗',title:'Divisão',group:'Matemática',desc:'Repartição equitativa e formação de grupos.'},
 {id:'formas',icon:'📐',title:'Geometria',group:'Matemática',desc:'Formas, lados, vértices, posição e orientação espacial.'},
 {id:'medidas',icon:'📏',title:'Grandezas e medidas',group:'Matemática',desc:'Comprimento, massa, capacidade e comparação.'},
 {id:'tempo',icon:'⏰',title:'Tempo e calendário',group:'Matemática',desc:'Horas, dias, meses, duração e rotina.'},
 {id:'dinheiro',icon:'💰',title:'Sistema monetário',group:'Matemática',desc:'Valores, troco e situações de compra.'},
 {id:'dados',icon:'📊',title:'Tabelas e gráficos',group:'Matemática',desc:'Leitura, comparação e interpretação de dados.'}
];

const palavras = [
 ['CASA','🏠'],['GATO','🐱'],['PATO','🦆'],['BOLA','⚽'],['MALA','🧳'],['SAPO','🐸'],['FACA','🔪'],
 ['BOCA','👄'],['DADO','🎲'],['LUA','🌙'],['SOL','☀️'],['FLOR','🌸'],['PÃO','🍞'],['PEIXE','🐟'],['CHAVE','🔑'],
 ['RATO','🐭'],['RUA','🛣️'],['CARRO','🚗'],['NAVIO','🚢'],['BANANA','🍌'],['JANELA','🪟'],['ESCOLA','🏫'],
 ['LIVRO','📚'],['CADERNO','📒'],['CADEIRA','🪑'],['MESA','🪵'],['LEITE','🥛'],['UVA','🍇'],['MAÇÃ','🍎'],['OVO','🥚']
];

const levelFactor = {Inicial:0,Intermediário:1,Avançado:2};
let nivel='Inicial', cat=categorias[0], idx=0;
let acertos=Number(localStorage.getItem('atea_acertos')||0), respondidas=Number(localStorage.getItem('atea_resp')||0);
const cards=document.getElementById('cards'), busca=document.getElementById('busca');

function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pick(arr,seed){return arr[seed%arr.length]}
function shuffle(arr,seed){let a=[...arr];for(let i=a.length-1;i>0;i--){seed=(seed*1664525+1013904223)>>>0;let j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function distractWord(word,seed){
 const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 let chars=word.split(''); let p=seed%chars.length; chars[p]=letters[(seed>>3)%letters.length];
 const x=chars.join(''); return x===word?word+'A':x;
}

function atividade(c,i,lev){
 const f=levelFactor[lev], seed=hash(c.id+'-'+i+'-'+lev), [w,e]=pick(palavras,seed);
 const [w2]=pick(palavras,seed+7), [w3]=pick(palavras,seed+13);
 let q='',opts=[],ans='',emoji=c.icon;
 const n1=1+(seed%((f+1)*10+9)), n2=1+((seed>>5)%((f+1)*8+7));
 switch(c.id){
  case 'letras': q=`Qual é a primeira letra de ${w}?`; ans=w[0]; opts=shuffle([ans,pick('BCDFGHJKLMNPQRSTVXZ'.split(''),seed+2),pick('AEIOU'.split(''),seed+4)],seed); emoji=e; break;
  case 'silabas': {
    const s=w.length>4?w.slice(0,2):w.slice(0,1); q=`Qual opção começa como ${w}?`; ans=w;
    opts=shuffle([w,w2,w3],seed); emoji=e; break;
  }
  case 'hip_pre': q=`Qual escrita pode representar a palavra ${w}?`; ans=w; opts=shuffle([w,'AAA','XYZ'],seed); emoji=e; break;
  case 'hip_sil': q=`Quantas partes faladas você percebe em ${w}?`; ans=String(Math.max(1,Math.round(w.length/2.4))); opts=shuffle([ans,String(+ans+1),String(Math.max(1,+ans-1))],seed); emoji=e; break;
  case 'hip_silalf': q=`Complete a palavra: ${w.slice(0,Math.max(1,w.length-2))}__`; ans=w.slice(-2); opts=shuffle([ans,distractWord(ans,seed),pick(['RA','TA','CA','LA'],seed)],seed); emoji=e; break;
  case 'hip_alf': q=`Qual escrita está correta?`; ans=w; opts=shuffle([w,distractWord(w,seed+3),distractWord(w,seed+9)],seed); emoji=e; break;
  case 'leitura': q=`Leia e escolha a palavra correspondente à imagem.`; ans=w; opts=shuffle([w,w2,w3],seed); emoji=e; break;
  case 'interpretacao': {
    const nomes=['Ana','Bia','Caio','Davi','Lia']; const nome=pick(nomes,seed); const objeto=pick(['livro','bola','caderno','brinquedo'],seed+2);
    q=`${nome} guardou o ${objeto} depois de usar. O que ${nome} fez depois de usar o objeto?`; ans=`Guardou o ${objeto}`;
    opts=shuffle([ans,`Perdeu o ${objeto}`,`Quebrou o ${objeto}`],seed); emoji='📘'; break;
  }
  case 'ortografia': {
    const pares=[['CH','X'],['RR','R'],['SS','S'],['M','N'],['P','B'],['D','T']]; const [a,b]=pick(pares,seed);
    q=`Qual opção apresenta a escrita correta?`; ans=w; opts=shuffle([w,distractWord(w,seed+5),distractWord(w,seed+11)],seed); emoji='📝'; break;
  }
  case 'vocabulario': {
    const sets=[['feliz','contente','triste'],['rápido','veloz','lento'],['grande','enorme','pequeno'],['bonito','belo','feio']];
    const s=pick(sets,seed); q=`Qual palavra tem sentido parecido com "${s[0]}"?`; ans=s[1]; opts=shuffle([s[1],s[2],pick(['longe','ontem','azul'],seed)],seed); emoji='🗂️'; break;
  }
  case 'frases': {
    const ss=[['A menina lê um livro.','menina livro lê A.','Livro um a menina.'],['O gato dorme na cadeira.','cadeira gato na dorme.','Dorme o na gato.'],['Pedro joga bola no pátio.','bola Pedro no joga.','Pátio joga Pedro no bola.']];
    const s=pick(ss,seed); q='Qual frase está organizada corretamente?'; ans=s[0]; opts=shuffle(s,seed); emoji='🧾'; break;
  }
  case 'caca': q=`Encontre a palavra-alvo: ${w}`; ans=w; opts=shuffle([w,distractWord(w,seed+1),distractWord(w,seed+2)],seed); emoji='🔎'; break;
  case 'memoria': q=`Qual palavra combina com a imagem mostrada?`; ans=w; opts=shuffle([w,w2,w3],seed); emoji=e; break;
  case 'atencao': {
    const alvo=pick(['🔵','🔺','⭐','🟩'],seed); const outro=pick(['🟣','⬛','❤️','🟨'],seed+1); q=`Qual símbolo é igual ao modelo ${alvo}?`; ans=alvo; opts=shuffle([alvo,outro,pick(['🔷','🔶','⚫'],seed+2)],seed); emoji='🎯'; break;
  }
  case 'sequencia': {
    let a=1+(seed%5), passo=1+(seed%((f+1)*3)); q=`Complete a sequência: ${a}, ${a+passo}, ${a+2*passo}, __`; ans=String(a+3*passo);
    opts=shuffle([ans,String(a+4*passo),String(a+2*passo+1)],seed); emoji='➡️'; break;
  }
  case 'numeros': q=`Qual número vem depois de ${n1}?`; ans=String(n1+1); opts=shuffle([ans,String(n1),String(n1+2)],seed); emoji='🔢'; break;
  case 'adicao': q=`Quanto é ${n1} + ${n2}?`; ans=String(n1+n2); opts=shuffle([ans,String(n1+n2+1),String(Math.max(0,n1+n2-1))],seed); emoji='➕'; break;
  case 'subtracao': {let a=Math.max(n1,n2),b=Math.min(n1,n2);q=`Quanto é ${a} − ${b}?`;ans=String(a-b);opts=shuffle([ans,String(a-b+1),String(Math.max(0,a-b-1))],seed);emoji='➖';break}
  case 'mult': {let a=1+(seed%(f?10:5)),b=1+((seed>>3)%(f?10:5));q=`Quanto é ${a} × ${b}?`;ans=String(a*b);opts=shuffle([ans,String(a*b+a),String(Math.max(0,a*b-b))],seed);emoji='✖️';break}
  case 'div': {let b=1+(seed%(f?9:5)),res=1+((seed>>4)%(f?9:5)),a=b*res;q=`Quanto é ${a} ÷ ${b}?`;ans=String(res);opts=shuffle([ans,String(res+1),String(Math.max(1,res-1))],seed);emoji='➗';break}
  case 'formas': {
    const s=pick([['Triângulo','3 lados'],['Quadrado','4 lados iguais'],['Círculo','nenhum lado reto'],['Retângulo','4 lados']],seed);
    q=`Qual característica corresponde a ${s[0]}?`;ans=s[1];opts=shuffle([s[1],'5 lados','apenas 1 lado'],seed);emoji='📐';break;
  }
  case 'medidas': {
    const s=pick([['Qual unidade é mais adequada para medir uma mesa?','centímetro','litro','quilograma'],['Qual unidade usamos para medir massa?','quilograma','hora','metro'],['Qual unidade usamos para líquidos?','litro','metro','grau']],seed);
    q=s[0];ans=s[1];opts=shuffle([s[1],s[2],s[3]],seed);emoji='📏';break;
  }
  case 'tempo': {
    const hora=1+(seed%11); q=`Se agora são ${hora} horas e passa 1 hora, que horas serão?`; ans=String(hora+1)+' horas'; opts=shuffle([ans,String(hora)+' horas',String(hora+2)+' horas'],seed);emoji='⏰';break;
  }
  case 'dinheiro': {
    let a=1+(seed%(f?50:10)),b=1+((seed>>5)%(f?20:5)); q=`Você tem R$ ${a} e recebe mais R$ ${b}. Quanto terá?`; ans=`R$ ${a+b}`;opts=shuffle([ans,`R$ ${a+b+1}`,`R$ ${Math.max(0,a+b-1)}`],seed);emoji='💰';break;
  }
  case 'dados': {
    const a=1+(seed%9),b=1+((seed>>5)%9),cc=1+((seed>>9)%9); const vals=[['Azul',a],['Verde',b],['Amarelo',cc]].sort((x,y)=>y[1]-x[1]);
    q=`Em uma pesquisa: Azul=${a}, Verde=${b}, Amarelo=${cc}. Qual teve maior quantidade?`; ans=vals[0][0];opts=shuffle(['Azul','Verde','Amarelo'],seed);emoji='📊';break;
  }
 }
 return {q,opts,ans,emoji};
}

function renderCards(){
 const termo=busca.value.toLowerCase(), grupo=document.querySelector('.filter.active').dataset.group;
 cards.innerHTML='';
 categorias.filter(c=>(grupo==='Todas'||c.group===grupo)&&(c.title+' '+c.desc+' '+c.group).toLowerCase().includes(termo)).forEach(c=>{
   const el=document.createElement('article');
   el.innerHTML=`<div class="card-icon">${c.icon}</div><div class="card-title">${c.title}</div><div class="card-desc">${c.desc}</div><div class="card-footer"><span class="tag">${c.group}</span><span class="count">200 atividades</span></div>`;
   el.onclick=()=>{cat=c;idx=0;renderAtividade();document.getElementById('pratica').scrollIntoView({behavior:'smooth'})};
   cards.appendChild(el);
 });
}
function renderAtividade(){
 const a=atividade(cat,idx,nivel);
 document.getElementById('categoriaAtual').textContent=cat.title;
 document.getElementById('grupoAtual').textContent=cat.group;
 document.getElementById('tituloAtividade').textContent=`${nivel} — atividade ${idx+1}`;
 document.getElementById('contador').textContent=`Atividade ${idx+1} de 200`;
 document.getElementById('bar').style.width=`${((idx+1)/200)*100}%`;
 document.getElementById('emoji').textContent=a.emoji;
 document.getElementById('pergunta').textContent=a.q;
 const ops=document.getElementById('opcoes'); ops.innerHTML='';
 const fb=document.getElementById('feedback'); fb.textContent='';fb.className='feedback';
 a.opts.forEach(o=>{const b=document.createElement('button');b.className='option';b.textContent=o;b.onclick=()=>responder(b,o,a.ans);ops.appendChild(b)});
}
function responder(btn,r,c){
 document.querySelectorAll('.option').forEach(x=>x.disabled=true);
 respondidas++;
 if(r===c){btn.classList.add('correct');document.getElementById('feedback').textContent='Muito bem! Resposta correta.';document.getElementById('feedback').classList.add('ok');acertos++}
 else{btn.classList.add('wrong');[...document.querySelectorAll('.option')].find(x=>x.textContent===c)?.classList.add('correct');document.getElementById('feedback').textContent=`A resposta correta é: ${c}`;document.getElementById('feedback').classList.add('no')}
 localStorage.setItem('atea_acertos',acertos);localStorage.setItem('atea_resp',respondidas);updateDash();
}
function updateDash(){
 document.getElementById('acertos').textContent=acertos;document.getElementById('respondidas').textContent=respondidas;
 document.getElementById('percentual').textContent=respondidas?Math.round(acertos/respondidas*100)+'%':'0%';
}
busca.oninput=renderCards;
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCards()});
document.querySelectorAll('.level').forEach(b=>b.onclick=()=>{document.querySelectorAll('.level').forEach(x=>x.classList.remove('active'));b.classList.add('active');nivel=b.dataset.level;idx=0;renderAtividade()});
document.getElementById('proxima').onclick=()=>{idx=(idx+1)%200;renderAtividade()};
document.getElementById('anterior').onclick=()=>{idx=(idx+199)%200;renderAtividade()};
document.getElementById('surpresaTopo').onclick=()=>{cat=pick(categorias,Date.now());idx=Date.now()%200;renderAtividade();document.getElementById('pratica').scrollIntoView({behavior:'smooth'})};
document.getElementById('ouvir').onclick=()=>{if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(document.getElementById('pergunta').textContent);u.lang='pt-BR';speechSynthesis.speak(u)}else alert('Leitura por voz indisponível neste navegador.')};
document.getElementById('zerar').onclick=()=>{localStorage.removeItem('atea_acertos');localStorage.removeItem('atea_resp');acertos=0;respondidas=0;updateDash()};
renderCards();renderAtividade();updateDash();

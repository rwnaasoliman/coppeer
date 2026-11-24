const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=n=>Number(n||0).toLocaleString('en-US',{maximumFractionDigits:2});
const today=()=>new Date().toISOString().slice(0,10);
const TL={sale:'بيع',purchase:'شراء',receipt:'تحصيل',payment:'سداد',expense:'مصروف',sret:'مرتجع بيع',pret:'مرتجع شراء'};
const TABS={dash:'الرئيسية',parties:'العملاء والموردين',prod:'الأصناف والأسعار',tx:'الحركات',rep:'التقارير'};
let S={parties:[],products:[],tx:[],seq:1},tab='dash',dbDoc=null,rep={a:today().slice(0,8)+'01',b:today()};
const LK='copper_factory_v1';
let pt=null;
function persist(){BC=null;clearTimeout(pt);$('#st').textContent='...';
 pt=setTimeout(()=>{try{localStorage.setItem(LK,JSON.stringify(S))}catch(e){}
  if(dbDoc)dbDoc.set(JSON.parse(JSON.stringify(S))).then(()=>$('#st').textContent='محفوظ ✓').catch(()=>$('#st').textContent='محفوظ على الجهاز فقط');else $('#st').textContent='محفوظ على الجهاز'},700)}
addEventListener('pagehide',()=>{try{localStorage.setItem(LK,JSON.stringify(S))}catch(e){}});
function id(){return S.seq++}
const P=i=>S.parties.find(x=>x.id==i)||{name:'—',sp:{}};
const PR=i=>S.products.find(x=>x.id==i)||{name:'—'};
const eff=t=>t.type=='sale'||t.type=='purchase'?t.total-t.paid:t.type=='sret'||t.type=='pret'?-(t.total-t.paid):(t.type=='receipt'||t.type=='payment'?-t.total:0);
const norm=t=>t.type=='sret'?{...t,type:'sale',qty:-t.qty,total:-t.total}:t.type=='pret'?{...t,type:'purchase',qty:-t.qty,total:-t.total}:t;
const srt=(a,b)=>a.date<b.date?-1:a.date>b.date?1:0;
function revStock(t){const p=S.products.find(x=>x.id==t.prid);if(!p)return;if(t.type=='sale'||t.type=='pret')p.stock+=t.qty;else p.stock-=t.qty}
function cash0F(){modal(`<h3>رصيد الخزنة الافتتاحي</h3><p class="mu">المبلغ اللي كان في الخزنة قبل ما تبدأي تستخدمي السيستم.</p><label>المبلغ<input id="c0" type="number" step="any" value="${S.cash0||0}"></label><button class="pr" onclick="S.cash0=+$('#c0').value||0;persist();closeM();render()">حفظ</button>`)}
function setRole(){document.body.dataset.role=ROLE;$('#rl').textContent=' · '+({manager:'مدير',staff:'موظف',viewer:'مشاهدة فقط'})[ROLE];if(ROLE!='manager'&&tab=='rep')tab='dash';render()}
let BC=null,showAll=false,ROLE='manager',EDIT=0;
const bal=p=>{if(!BC){BC={};S.tx.forEach(t=>{BC[t.pid]=(BC[t.pid]||0)+eff(t)})}return (+p.open||0)+(BC[p.id]||0)};
const cashFx=t=>t.type=='sale'||t.type=='pret'?t.paid:t.type=='purchase'||t.type=='sret'?-t.paid:t.type=='receipt'?t.total:-t.total;
const bc=v=>v>0.005?'pos':v<-0.005?'neg':'mu';
const ml=t=>t.date.slice(0,7)==today().slice(0,7);
const profit=t=>t.type=='sale'?t.total-t.qty*t.cost:0;

function modal(h){$('#m').innerHTML='<div class="box">'+h+'</div>';$('#m').className='on'}
function closeM(){$('#m').className=''}
$('#m').onclick=e=>{if(e.target.id=='m')closeM()};
function go(t){tab=t;render()}
function filt(el){const q=el.value.trim();el.closest('.card').querySelectorAll('tbody tr').forEach(r=>r.style.display=r.textContent.includes(q)?'':'none')}
function search(){return '<input class="sec" placeholder="بحث..." oninput="filt(this)">'}

/* ---------- views ---------- */

function vRep(){
 const T=S.tx.filter(t=>t.date>=rep.a&&t.date<=rep.b),sl=T.filter(t=>t.type=='sale'||t.type=='sret').map(norm),pu=T.filter(t=>t.type=='purchase'||t.type=='pret').map(norm),ex=T.filter(t=>t.type=='expense');
 const rev=sl.reduce((a,t)=>a+t.total,0),gp=sl.reduce((a,t)=>a+profit(t),0),xs=ex.reduce((a,t)=>a+t.total,0);
 const by=(arr,k)=>{const m={};arr.forEach(t=>{const n=k(t);m[n]=m[n]||{q:0,v:0,g:0};m[n].q+=t.qty;m[n].v+=t.total;m[n].g+=profit(t)});return Object.entries(m).sort((a,b)=>b[1].v-a[1].v)};
 const tb=(rows,h)=>`<div class="tw"><table><thead><tr><th>${h}</th><th>كجم</th><th>المبيعات</th><th>الربح</th></tr></thead><tbody>${rows.map(([n,v])=>`<tr><td>${esc(n)}</td><td class="n">${f(v.q)}</td><td class="n">${f(v.v)}</td><td class="n">${f(v.g)}</td></tr>`).join('')||'<tr><td colspan=4 class="mu">لا توجد بيانات</td></tr>'}</tbody></table></div>`;
 return `<h2>التقارير</h2><div class="card np"><div class="g2"><label>من<input type="date" value="${rep.a}" onchange="rep.a=this.value;render()"></label><label>إلى<input type="date" value="${rep.b}" onchange="rep.b=this.value;render()"></label></div></div>
 <div class="kp"><div class="k cu"><span>المبيعات</span><b class="n">${f(rev)}</b></div><div class="k"><span>المشتريات</span><b class="n">${f(pu.reduce((a,t)=>a+t.total,0))}</b></div><div class="k"><span>مجمل الربح</span><b class="n neg">${f(gp)}</b></div><div class="k"><span>المصروفات</span><b class="n">${f(xs)}</b></div><div class="k pr"><span>صافي الربح</span><b class="n ${gp-xs>=0?'neg':'pos'}">${f(gp-xs)}</b></div></div>
 <div class="card"><h2>حسب الصنف</h2>${tb(by(sl,t=>t.prod),'الصنف')}</div>
 <div class="card"><h2>حسب العميل</h2>${tb(by(sl,t=>P(t.pid).name),'العميل')}</div>
 <div class="card np"><h2>نسخة احتياطية</h2><button class="b" onclick="backup()">تصدير / استيراد البيانات</button> <button class="b d" onclick="wipe()">مسح كل البيانات</button></div>`;
}
/* ---------- backup ---------- */
function backup(){
 modal(`<h3>نسخة احتياطية</h3><p class="mu">انسخ النص واحفظه في مكان آمن. للاستيراد الصق نسخة سابقة واضغط استيراد.</p><textarea id="bk" rows="10">${esc(JSON.stringify(S))}</textarea>
 <div class="row" style="margin-top:10px"><button class="pr" onclick="restore()">استيراد</button><button class="b" onclick="closeM()">إغلاق</button></div>`);
}
function restore(){try{const d=JSON.parse($('#bk').value);if(!d.parties||!d.products||!d.tx)throw 0;if(!confirm('سيتم استبدال البيانات الحالية. متابعة؟'))return;S=d;persist();closeM();render()}catch(e){alert('النص غير صالح')}}
function wipe(){if(confirm('مسح كل البيانات نهائياً؟')&&confirm('تأكيد أخير: لا يمكن التراجع')){S={parties:[],products:[],tx:[],seq:1};persist();render()}}


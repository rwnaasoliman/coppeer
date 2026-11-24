function vDash(){
 const sales=S.tx.filter(t=>(t.type=='sale'||t.type=='sret')&&ml(t)).map(norm),exp=S.tx.filter(t=>t.type=='expense'&&ml(t));
 const cust=S.parties.filter(p=>p.type=='customer'),sup=S.parties.filter(p=>p.type=='supplier');
 const debt=cust.map(p=>[p,bal(p)]).filter(x=>x[1]>0.005).sort((a,b)=>b[1]-a[1]);
 const owe=sup.reduce((a,p)=>a+Math.max(0,bal(p)),0);
 const cash=(+S.cash0||0)+S.tx.reduce((a,t)=>a+cashFx(t),0);
 const stockV=S.products.reduce((a,p)=>a+p.stock*p.cost,0);
 const gp=sales.reduce((a,t)=>a+profit(t),0),ex=exp.reduce((a,t)=>a+t.total,0);
 const low=S.products.filter(p=>p.stock<=(+p.min||0)&&p.min>0);
 return `<div class="kp">
 <div class="k cu"><span>مبيعات الشهر</span><b class="n">${f(sales.reduce((a,t)=>a+t.total,0))}</b></div>
 <div class="k cu mg"><span>صافي ربح الشهر (بعد المصروفات)</span><b class="n ${gp-ex>=0?'neg':'pos'}">${f(gp-ex)}</b></div>
 <div class="k pr mg" onclick="cash0F()" style="cursor:pointer" title="اضغط لتعديل الرصيد الافتتاحي"><span>الخزنة (النقدية) ✎</span><b class="n">${f(cash)}</b></div>
 <div class="k pr"><span>مديونيات العملاء</span><b class="n pos">${f(debt.reduce((a,x)=>a+x[1],0))}</b></div>
 <div class="k pr"><span>مستحق للموردين</span><b class="n">${f(owe)}</b></div>
 <div class="k pr mg"><span>قيمة المخزون</span><b class="n">${f(stockV)}</b></div></div>
 ${!S.products.length&&!S.parties.length?`<div class="card em">ابدأ بإضافة الأصناف وأسعارها، ثم العملاء، ثم سجّل أول حركة.<br><br><button class="cu" onclick="go('prod')">إضافة الأصناف</button></div>`:''}
 ${low.length?`<div class="card"><b class="pos">تنبيه: مخزون منخفض</b><br>${low.map(p=>esc(p.name)+' ('+f(p.stock)+' كجم)').join('، ')}</div>`:''}
 <div class="g2" style="align-items:start"><div class="card"><h2>أعلى المديونيات</h2>${debt.length?`<div class="tw"><table><tbody>${debt.slice(0,6).map(([p,b])=>`<tr><td>${esc(p.name)}</td><td class="n pos">${f(b)}</td><td><button class="b s" onclick="stmt(${p.id})">كشف</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="em">لا توجد مديونيات</div>'}</div>
 <div class="card"><h2>آخر الحركات</h2>${S.tx.length?`<div class="tw"><table><tbody>${S.tx.slice(-7).reverse().map(t=>`<tr><td>${t.date}</td><td>${TL[t.type]}</td><td>${esc(t.pid?P(t.pid).name:t.note)}</td><td class="n">${f(t.total)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="em">لا توجد حركات بعد</div>'}</div></div>
 <button class="cu" onclick="txForm()">+ حركة جديدة</button>`;
}

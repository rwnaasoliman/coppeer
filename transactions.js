function vTx(){
 return `<div class="row"><h2 class="sp">الحركات</h2><button class="cu" onclick="txForm()">+ حركة جديدة</button></div>
 <div class="card">${search()}<div class="tw"><table><thead><tr><th>التاريخ</th><th>النوع</th><th>الطرف</th><th>التفاصيل</th><th>الإجمالي</th><th>المدفوع</th><th></th></tr></thead><tbody>
 ${S.tx.slice(showAll?0:-150).reverse().map(t=>`<tr><td>${t.date}</td><td>${TL[t.type]}</td><td>${esc(t.pid?P(t.pid).name:'—')}</td><td>${t.prod?esc(t.prod)+' · '+f(t.qty)+' كجم × '+f(t.price):esc(t.note)}</td><td class="n">${f(t.total)}</td><td class="n">${t.prod?f(t.paid):'—'}</td>
 <td>${t.type=='sale'?`<button class="b s" onclick="invoice(${t.id})">فاتورة</button> `:''}<button class="b s" onclick="txForm(${t.id})">تعديل</button> <button class="b s d" onclick="delTx(${t.id})">حذف</button></td></tr>`).join('')}
 </tbody></table></div>${S.tx.length?'':'<div class="em">لا توجد حركات</div>'}${!showAll&&S.tx.length>150?'<div class="em"><button class="b" onclick="showAll=true;render()">عرض كل الحركات ('+S.tx.length+')</button></div>':''}</div>`;
}
/* ---------- transactions ---------- */
function txForm(e){EDIT=e||0;
 modal(`<h3>حركة جديدة</h3>
 <label>نوع الحركة<select id="tt" onchange="tu()"><option value="sale">بيع لعميل</option><option value="purchase">شراء من مورد</option><option value="receipt">تحصيل من عميل</option><option value="payment">سداد لمورد</option><option value="sret">مرتجع بيع (من عميل)</option><option value="pret">مرتجع شراء (لمورد)</option><option value="expense">مصروف</option></select></label>
 <label id="lp">الطرف<select id="tp" onchange="tpr()"></select></label>
 <div id="lg"><label>الصنف<select id="tg" onchange="tpr()">${S.products.map(p=>`<option value="${p.id}">${esc(p.name)} (متاح ${f(p.stock)})</option>`).join('')}</select></label>
 <div class="g2"><label>الكمية (كجم)<input id="tq" type="number" step="any" oninput="tc()"></label><label>السعر / كجم<input id="tx" type="number" step="any" oninput="tc()"></label></div>
 <div class="tot" id="ttot"></div><label><span id="lpa">المدفوع الآن</span><input id="tpa" type="number" step="any" oninput="this.dataset.d=1"></label></div>
 <label id="la">المبلغ<input id="tam" type="number" step="any"></label>
 <div class="g2"><label>التاريخ<input id="td" type="date" value="${today()}"></label><label>ملاحظة<input id="tn"></label></div>
 <button class="pr" onclick="txSave()">حفظ الحركة</button>`);if(ROLE!='manager')[...$('#tt').options].forEach(o=>{if(!['sale','receipt','sret'].includes(o.value))o.remove()});tu();if(e)txFill(e);
}
function tu(){
 const t=$('#tt').value,g=['sale','purchase','sret','pret'].includes(t),want=['sale','receipt','sret'].includes(t)?'customer':'supplier';
 $('#lpa').textContent=t=='sret'?'المبلغ المسترد نقداً للعميل':t=='pret'?'المبلغ المستلم نقداً من المورد':'المدفوع الآن';
 $('#lp').style.display=t=='expense'?'none':'';$('#lg').style.display=g?'':'none';$('#la').style.display=g?'none':'';
 $('#tp').innerHTML=S.parties.filter(p=>p.type==want).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')||'<option value="">— أضف طرفاً أولاً —</option>';
 $('#tpa').dataset.d='';tpr();
}
function tpr(){
 const t=$('#tt').value;if(!['sale','purchase','sret','pret'].includes(t))return;
 const pr=PR($('#tg').value),pa=P($('#tp').value);
 $('#tx').value=(t=='sale'||t=='sret')?(pa.sp&&pa.sp[pr.id]||pr.price||''):(pr.cost||'');tc();
}
function tc(){
 const tot=(+$('#tq').value||0)*(+$('#tx').value||0);$('#ttot').textContent='الإجمالي: '+f(tot);
 if(!$('#tpa').dataset.d)$('#tpa').value=['sret','pret'].includes($('#tt').value)?'':tot||'';
}
function txFill(i){const t=S.tx.find(x=>x.id==i);$('#tt').value=t.type;tu();
 if(t.pid)$('#tp').value=t.pid;
 if(t.prid){$('#tg').value=t.prid;$('#tq').value=t.qty;$('#tx').value=t.price;$('#tpa').dataset.d=1;$('#tpa').value=t.paid;tc()}else $('#tam').value=t.total;
 $('#td').value=t.date;$('#tn').value=t.note||''}
function txSave(){
 const sp=JSON.stringify(S.products),old=EDIT?S.tx.find(x=>x.id==EDIT):null,n=S.tx.length-(old?1:0);
 if(old){revStock(old);S.tx=S.tx.filter(x=>x!==old)}
 txSave0();
 if(S.tx.length==n){S.products=JSON.parse(sp);if(old){S.tx.push(old);S.tx.sort(srt)}}else EDIT=0;
}
function txSave0(){
 const type=$('#tt').value,date=$('#td').value||today(),note=$('#tn').value,g=['sale','purchase','sret','pret'].includes(type);
 const pid=type=='expense'?0:+$('#tp').value;
 if(type!='expense'&&!pid)return alert('اختر الطرف (أضفه من تبويب العملاء والموردين)');
 let t={id:EDIT||id(),date,type,pid,note};
 if(g){
  const pr=PR($('#tg').value),q=+$('#tq').value,px=+$('#tx').value;
  if(!pr.id||!(q>0)||!(px>=0))return alert('أكمل الصنف والكمية والسعر');
  if((type=='sale'||type=='pret')&&q>pr.stock&&!confirm('الكمية أكبر من المخزون ('+f(pr.stock)+' كجم). متابعة؟'))return;
  t=Object.assign(t,{prid:pr.id,prod:pr.name,qty:q,price:px,total:q*px,paid:Math.min(+$('#tpa').value||0,q*px),cost:pr.cost});
  if(type=='sale'||type=='pret')pr.stock-=q;else if(type=='sret')pr.stock+=q;else{pr.cost=pr.stock>0?(pr.stock*pr.cost+q*px)/(pr.stock+q):px;pr.stock+=q}
 }else{const a=+$('#tam').value;if(!(a>0))return alert('اكتب المبلغ');t.total=a}
 S.tx.push(t);S.tx.sort(srt);persist();closeM();render();
 if(type=='sale')invoice(t.id);
}
function delTx(i){
 const t=S.tx.find(x=>x.id==i);if(!confirm('حذف هذه الحركة؟ سيتم عكس أثرها على المخزون.'))return;
 revStock(t);
 S.tx=S.tx.filter(x=>x.id!=i);persist();render();
}
function invoice(i){
 const t=S.tx.find(x=>x.id==i),p=P(t.pid),b=bal(p);
 modal(`<h3>فاتورة بيع رقم ${t.id}</h3><div class="mu">${t.date}</div><p><b>العميل:</b> ${esc(p.name)} ${esc(p.phone)}</p>
 <div class="tw"><table><thead><tr><th>الصنف</th><th>الكمية (كجم)</th><th>السعر</th><th>الإجمالي</th></tr></thead><tbody><tr><td>${esc(t.prod)}</td><td class="n">${f(t.qty)}</td><td class="n">${f(t.price)}</td><td class="n">${f(t.total)}</td></tr></tbody></table></div>
 <p>المدفوع: <b class="n">${f(t.paid)}</b> &nbsp; المتبقي: <b class="n pos">${f(t.total-t.paid)}</b><br>إجمالي رصيد العميل: <b class="n">${f(b)}</b></p>${t.note?'<p>'+esc(t.note)+'</p>':''}
 <div class="row np"><button class="pr" onclick="print()">طباعة</button><button class="b" onclick="closeM()">إغلاق</button></div>`);
}


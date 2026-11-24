function vParties(){
 return `<div class="row"><h2 class="sp">العملاء والموردين</h2><button class="cu" onclick="partyForm()">+ إضافة</button></div>
 <div class="card">${search()}<div class="tw"><table><thead><tr><th>الاسم</th><th>النوع</th><th>الموبايل</th><th>الرصيد</th><th></th></tr></thead><tbody>
 ${S.parties.map(p=>{const b=bal(p);return `<tr><td><b>${esc(p.name)}</b></td><td>${p.type=='customer'?'عميل':'مورد'}</td><td class="n">${esc(p.phone)}</td><td class="n ${p.type=='customer'?bc(b):'mu'}">${f(b)} <small class="mu">${b>0.005?(p.type=='customer'?'عليه':'له'):''}</small></td>
 <td><button class="b s" onclick="stmt(${p.id})">كشف حساب</button> <button class="b s" onclick="partyForm(${p.id})">تعديل</button> <button class="b s d" onclick="delParty(${p.id})">حذف</button></td></tr>`}).join('')}
 </tbody></table></div>${S.parties.length?'':'<div class="em">لم تضف أي عميل بعد</div>'}</div>`;
}
/* ---------- parties ---------- */
function partyForm(i){
 const p=S.parties.find(x=>x.id==i)||{type:'customer',sp:{}};
 modal(`<h3>${i?'تعديل':'إضافة'} عميل / مورد</h3>
 <label>الاسم<input id="pn" value="${esc(p.name)}"></label>
 <div class="g2"><label>النوع<select id="pt" onchange="$('#spw').style.display=this.value=='customer'?'':'none'"><option value="customer" ${p.type=='customer'?'selected':''}>عميل</option><option value="supplier" ${p.type=='supplier'?'selected':''}>مورد</option></select></label>
 <label>الموبايل<input id="pp" inputmode="tel" value="${esc(p.phone)}"></label></div>
 <label>العنوان / ملاحظات<input id="pa" value="${esc(p.addr)}"></label>
 <label>رصيد سابق (المبلغ المستحق له أو عليه)<input id="po" type="number" step="any" value="${p.open||0}"></label>
 <div id="spw" style="${p.type=='customer'?'':'display:none'}"><b>أسعار خاصة بهذا العميل (اتركها فارغة للسعر العادي)</b><div style="margin-top:8px">
 ${S.products.map(x=>`<label>${esc(x.name)} (العادي ${f(x.price)})<input type="number" step="any" data-sp="${x.id}" value="${p.sp[x.id]||''}"></label>`).join('')||'<div class="mu">أضف أصنافاً أولاً</div>'}</div></div>
 <button class="pr" onclick="saveParty(${i||0})">حفظ</button>`);
}
function saveParty(i){
 const n=$('#pn').value.trim();if(!n)return alert('اكتب الاسم');
 const sp={};document.querySelectorAll('[data-sp]').forEach(e=>{if(+e.value>0)sp[e.dataset.sp]=+e.value});
 const o={name:n,type:$('#pt').value,phone:$('#pp').value,addr:$('#pa').value,open:+$('#po').value||0,sp};
 if(i)Object.assign(P(i),o);else S.parties.push({id:id(),...o});
 persist();closeM();render();
}
function delParty(i){if(S.tx.some(t=>t.pid==i))return alert('لا يمكن حذف طرف له حركات. احذف حركاته أولاً.');if(confirm('حذف؟')){S.parties=S.parties.filter(p=>p.id!=i);persist();render()}}
function stmt(i){
 const p=P(i);let r=+p.open||0;
 const rows=S.tx.filter(t=>t.pid==i).map(t=>{r+=eff(t);return `<tr><td>${t.date}</td><td>${TL[t.type]}${t.prod?' - '+esc(t.prod)+' '+f(t.qty)+'كجم':''}</td><td class="n">${f(t.total)}</td><td class="n">${f(t.type=='sale'||t.type=='purchase'?t.paid:0)}</td><td class="n">${f(r)}</td></tr>`}).join('');
 modal(`<h3>كشف حساب: ${esc(p.name)}</h3><div class="mu">رصيد سابق: ${f(p.open)}</div><div class="tw"><table><thead><tr><th>التاريخ</th><th>البيان</th><th>المبلغ</th><th>المدفوع</th><th>الرصيد</th></tr></thead><tbody>${rows||'<tr><td colspan=5 class="mu">لا توجد حركات</td></tr>'}</tbody></table></div>
 <div class="tot">الرصيد الحالي: ${f(bal(p))} ${bal(p)>0.005?(p.type=='customer'?'(عليه)':'(له)'):''}</div><div class="row np"><button class="pr" onclick="print()">طباعة</button><button class="b" onclick="closeM()">إغلاق</button></div>`);
}


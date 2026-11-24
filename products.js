function vProd(){
 return `<div class="row"><h2 class="sp">الأصناف والأسعار</h2>${S.products.length?'':'<button class="b" onclick="defProds()">أضف الأصناف المعتادة</button>'}<button class="cu" onclick="prodForm()">+ صنف</button></div>
 <div class="card"><div class="tw"><table><thead><tr><th>الصنف</th><th>المخزون (كجم)</th><th class="mg">متوسط التكلفة</th><th>سعر البيع</th><th class="mg">الهامش</th><th>آخر تعديل للسعر</th><th></th></tr></thead><tbody>
 ${S.products.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td class="n ${p.min>0&&p.stock<=p.min?'pos':''}">${f(p.stock)}</td><td class="n mg">${f(p.cost)}</td><td class="n"><b>${f(p.price)}</b></td><td class="n mg ${p.price>=p.cost?'neg':'pos'}">${f(p.price-p.cost)}</td><td class="mu">${p.pd||'—'}</td>
 <td><button class="b s" onclick="prodForm(${p.id})">تعديل</button> <button class="b s d" onclick="delProd(${p.id})">حذف</button></td></tr>`).join('')}
 </tbody></table></div>${S.products.length?'':'<div class="em">لا توجد أصناف</div>'}</div>`;
}
/* ---------- products ---------- */
function defProds(){['نحاس أحمر','نحاس أصفر (براص)','سلك نحاس','ماسورة نحاس','خردة نحاس'].forEach(n=>S.products.push({id:id(),name:n,stock:0,cost:0,price:0,min:0}));persist();render()}
function prodForm(i){
 const p=S.products.find(x=>x.id==i)||{};
 modal(`<h3>${i?'تعديل':'إضافة'} صنف</h3><label>اسم الصنف<input id="dn" value="${esc(p.name)}"></label>
 <div class="g2"><label>سعر البيع / كجم<input id="dp" type="number" step="any" value="${p.price||''}"></label><label>التكلفة / كجم<input id="dc" type="number" step="any" value="${p.cost||''}"></label>
 <label>المخزون (كجم)<input id="ds" type="number" step="any" value="${p.stock||0}"></label><label>حد التنبيه (كجم)<input id="dm" type="number" step="any" value="${p.min||0}"></label></div>
 <button class="pr" onclick="saveProd(${i||0})">حفظ</button>`);
}
function saveProd(i){
 const n=$('#dn').value.trim();if(!n)return alert('اكتب اسم الصنف');
 const o={name:n,price:+$('#dp').value||0,cost:+$('#dc').value||0,stock:+$('#ds').value||0,min:+$('#dm').value||0};
 if(i){const p=PR(i);if(p.price!=o.price)o.pd=today();Object.assign(p,o)}else S.products.push({id:id(),pd:today(),...o});
 persist();closeM();render();
}
function delProd(i){if(S.tx.some(t=>t.prid==i))return alert('الصنف له حركات ولا يمكن حذفه.');if(confirm('حذف؟')){S.products=S.products.filter(p=>p.id!=i);persist();render()}}


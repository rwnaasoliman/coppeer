const V={dash:vDash,parties:vParties,prod:vProd,tx:vTx,rep:vRep};
function render(){
 BC=null;
 $('#nv').innerHTML=Object.entries(TABS).filter(([k])=>k!='rep'||ROLE=='manager').map(([k,v])=>`<button class="${k==tab?'on':''}" onclick="go('${k}')">${v}</button>`).join('');
 $('#mn').innerHTML=V[tab]();
}

/* ---------- boot ---------- */
try{const l=JSON.parse(localStorage.getItem(LK));if(l&&l.tx)S=l}catch(e){}
render();
(async()=>{try{
 if(!window.claude||!claude.use)return;
 try{const u=await claude.use('user');if(u){const m=(await u.isOwner())||(await u.canEdit());if(!m){const w=await u.can('data.write');ROLE=w===false?'viewer':'staff'}setRole()}}catch(e){}
 const db=await claude.use('db');if(!db){$('#st').textContent='محفوظ على الجهاز فقط';return}
 const ref=db.doc('factory/state'),snap=await ref.get();
 if(snap.exists){const d=snap.data();if(d&&d.tx){S=JSON.parse(JSON.stringify(d));try{localStorage.setItem(LK,JSON.stringify(S))}catch(e){}}}
 dbDoc=ref;if(!snap.exists&&(S.tx.length||S.products.length||S.parties.length))persist();
 $('#st').textContent='متصل بقاعدة البيانات ✓';render();
}catch(e){$('#st').textContent='محفوظ على الجهاز فقط'}})();

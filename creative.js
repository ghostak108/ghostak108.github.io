/* Shared progressive enhancements. Media loads only after consent. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const paused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
 const cards=$$('.session-card');
 let saved=new Set();
 try {const value=JSON.parse(localStorage.getItem('zweiklang-sessions')||'[]'); if(Array.isArray(value)) saved=new Set(value.filter(x=>typeof x==='string'));} catch {}
 const sessionData=cards.map(card=>{
  const link=$('a',card),url=new URL(link.href),id=url.searchParams.get('v'),title=$('h3',card).textContent;
  return {card,link,id,title,image:$('img',card).src,number:Number(card.dataset.search.match(/\d+/)?.[0]||0)};
 });
 let filter='all';
 const filterSessions=()=>{
  if(!$('#session-search'))return;
  const query=$('#session-search').value.trim().toLowerCase().replace(/^#/,'');
  let count=0;
  sessionData.forEach(item=>{
   const matches=(!query||item.title.toLowerCase().includes(query)||(/^\d+$/.test(query)&&Number(query)===item.number))&&(filter!=='saved'||saved.has(item.id));
   item.card.hidden=!matches;if(matches){count++;item.card.classList.add('reveal-visible');}
  });
  $('.empty-state').hidden=count!==0;
  $('#search-status').textContent=`${count} ${count===1?'Session':'Sessions'} gefunden.`;
 };
 const updateSaved=()=>{
  $$('.session-save').forEach(button=>{
   const isSaved=saved.has(button.dataset.id);
   button.setAttribute('aria-pressed',String(isSaved));button.textContent=isSaved?'✓':'+';
   button.setAttribute('aria-label',`${button.dataset.title} ${isSaved?'aus der Merkliste entfernen':'merken'}`);
  });
  $$('.saved-count').forEach(el=>el.textContent=String(saved.size));
  filterSessions();
 };
 sessionData.forEach((item,index)=>{
  const button=document.createElement('button');button.type='button';button.className='session-save';button.dataset.id=item.id;button.dataset.title=item.title;
  button.addEventListener('click',()=>{
   saved.has(item.id)?saved.delete(item.id):saved.add(item.id);
   try{localStorage.setItem('zweiklang-sessions',JSON.stringify([...saved]));}catch{}
   updateSaved();
  });
  item.card.append(button);
  item.link.addEventListener('click',event=>{
   if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   if(!dialog?.showModal)return;
   event.preventDefault();openVideo(index);
  });
 });
 $('#session-search')?.addEventListener('input',filterSessions);
 $$('[data-session-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.sessionFilter;
  $$('[data-session-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  filterSessions();
 }));
 $('#session-sort')?.addEventListener('change',event=>{
  const ascending=event.target.value==='oldest';
  [...sessionData].sort((a,b)=>ascending?a.number-b.number:b.number-a.number).forEach(item=>item.card.parentElement.append(item.card));
 });
 $('.reset-sessions')?.addEventListener('click',()=>{
  $('#session-search').value='';filter='all';
  $$('[data-session-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sessionFilter==='all')));
  filterSessions();$('#session-search').focus();
 });
 updateSaved();
 // One native modal handles both the cinema and unaltered portraits.
 const dialog=$('.media-dialog'),stage=$('.media-stage'),title=$('#media-title');
 let current=0,view='video';
 const clearStage=()=>{stage?.replaceChildren();};
 const showVideo=index=>{
  current=(index+sessionData.length)%sessionData.length;view='video';dialog.classList.remove('media-photo');clearStage();
  const item=sessionData[current];title.textContent=item.title;
  $('.media-counter').textContent=`${current+1} / ${sessionData.length}`;
  const panel=document.createElement('div');panel.className='media-consent';
  const image=document.createElement('img');image.src=item.image;image.alt='';
  const heading=document.createElement('h3');heading.textContent=item.title;
  const note=document.createElement('p');note.textContent='Zum Abspielen laden wir YouTube. Dabei werden Daten an YouTube übertragen. Das Video startet nicht automatisch.';
  const load=document.createElement('button');load.type='button';load.className='button';load.textContent='Video laden';
  load.addEventListener('click',()=>{
   const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.id)}?rel=0&autoplay=0`;
   frame.title=`ZweiKlang · ${item.title}`;frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
   stage.replaceChildren(frame);frame.focus();
  });
  const external=document.createElement('a');external.href=item.link.href;external.target='_blank';external.rel='noopener noreferrer';external.textContent='Direkt auf YouTube ansehen ↗';
  panel.append(image,heading,note,load,external);stage.append(panel);
 };
 function openVideo(index){if(!dialog?.showModal)return;showVideo(index);dialog.showModal();document.body.classList.add('media-open');$('.media-close').focus();}
 $('.media-close')?.addEventListener('click',()=>dialog.close());
 $('.media-prev')?.addEventListener('click',()=>showVideo(current-1));
 $('.media-next')?.addEventListener('click',()=>showVideo(current+1));
 dialog?.addEventListener('close',()=>{clearStage();document.body.classList.remove('media-open');});
 dialog?.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog?.addEventListener('keydown',event=>{
  if(view!=='video')return;
  if(event.key==='ArrowRight'){event.preventDefault();showVideo(current+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();showVideo(current-1);}
 });
 $$('.portrait-open').forEach(button=>{
  const source=$('img',button);button.setAttribute('aria-label',source.alt+' – vergrößern');
  button.addEventListener('click',()=>{
   if(!dialog?.showModal)return;view='photo';clearStage();dialog.classList.add('media-photo');
   const photo=document.createElement('img');photo.src=source.src;photo.alt=source.alt;title.textContent=button.closest('figure').querySelector('figcaption').textContent.replace(/\d+\s*\//,'').trim();stage.append(photo);
   dialog.showModal();document.body.classList.add('media-open');$('.media-close').focus();
  });
 });
 // Archive stays honest: these controls only filter existing past appearances.
 $$('[data-event-filter]').forEach(button=>button.addEventListener('click',()=>{
  const section=button.closest('section');let count=0;
  $$('[data-event-filter]',section).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $$('.event-row',section).forEach(row=>{row.hidden=button.dataset.eventFilter!=='all'&&$('.event-tag',row).textContent.trim()!==button.dataset.eventFilter;if(!row.hidden)count++;});
  $('.event-filter-status',section).textContent=`${count} ${count===1?'Auftritt':'Auftritte'} angezeigt.`;
 }));
 const labels={name:'Name',email:'E-Mail',format:'Anliegen',date:'Wunschdatum',venue:'Location / Ort',message:'Nachricht'};
 $$('.booking-form').forEach(form=>{
  const update=()=>{
   const lines=[...new FormData(form)].filter(([,v])=>String(v).trim()).map(([k,v])=>`${labels[k]||k}: ${String(v).trim()}`);
   $('.request-text',form).textContent=`An: zweiklangkontakt@gmail.com\nBetreff: ZweiKlang · ${form.elements.format.value}\n\n${lines.join('\n\n')}`;
  };
  form.addEventListener('input',update);form.addEventListener('change',update);update();
  $$('[data-booking]').forEach(link=>link.addEventListener('click',update));
 });
 $$('.copy-email').forEach(button=>button.addEventListener('click',async()=>{
  const status=button.nextElementSibling;
  try{await navigator.clipboard.writeText('zweiklangkontakt@gmail.com');button.textContent='Adresse kopiert ✓';status.textContent='E-Mail-Adresse kopiert.';}
  catch{status.textContent='Bitte kopiere die Adresse über den E-Mail-Link.';button.textContent='zweiklangkontakt@gmail.com';}
 }));
 // Subtle image drift; a single rAF runs only during scrolling. No scroll hijacking.
 const diptych=$('.hero-diptych');let queued=false;
 const drift=()=>{queued=false;if(!diptych)return;const r=diptych.getBoundingClientRect();if(paused()){diptych.style.removeProperty('--photo-shift');return;}if(r.bottom>0&&r.top<innerHeight)diptych.style.setProperty('--photo-shift',`${Math.max(-12,Math.min(12,(innerHeight/2-r.top-r.height/2)*.035))}px`);};
 if(diptych){window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(drift);}},{passive:true});$('.motion-toggle')?.addEventListener('click',drift);reduced.addEventListener?.('change',drift);drift();}
 $('.load-player')?.addEventListener('click',()=>$('.listening-room')?.classList.add('is-playing'));
})();

/* Fixed vector glyphs, including dynamically updated button labels. */
(() => {
 const paths={'↗':'M5 19 19 5M5 5h14v14','↙':'M19 5 5 19M5 5v14h14','↓':'M12 4v16M5 13l7 7 7-7','↑':'M12 20V4M5 11l7-7 7 7','←':'M20 12H4m7-7-7 7 7 7','→':'M4 12h16m-7-7 7 7-7 7','✓':'m5 12 4 4L19 6','×':'m6 6 12 12M6 18 18 6','✳':'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6','+':'M12 5v14M5 12h14'};
 const convert=node=>{
  if(node.nodeType!==3||!node.parentElement||node.parentElement.closest('script,style,textarea,pre,svg'))return;
  const text=node.textContent,pattern=node.parentElement.closest('.session-save')?/[↗↙↓↑←→✓×✳+]/g:/[↗↙↓↑←→✓×✳]/g;
  if(!pattern.test(text))return;pattern.lastIndex=0;
  const fragment=document.createDocumentFragment();let last=0;
  for(const match of text.matchAll(pattern)){
   fragment.append(document.createTextNode(text.slice(last,match.index)));
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   for(const [k,v] of Object.entries({class:'ui-icon',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.6','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'}))svg.setAttribute(k,v);
   const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[match[0]]);svg.append(path);fragment.append(svg);last=match.index+match[0].length;
  }
  fragment.append(document.createTextNode(text.slice(last)));node.replaceWith(fragment);
 };
 const scan=root=>{if(root.nodeType===3){convert(root);return;}const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(convert);};
 scan(document.body);
 new MutationObserver(records=>records.forEach(record=>{if(record.type==='characterData')convert(record.target);else record.addedNodes.forEach(scan);})).observe(document.body,{childList:true,subtree:true,characterData:true});
})();

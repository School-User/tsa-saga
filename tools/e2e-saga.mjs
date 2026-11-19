import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const URL=process.argv[2];
async function session(port){
  const dir='/tmp/prof'+port+Date.now();
  const p=spawn('chromium',['--headless=new','--no-sandbox','--disable-gpu','--mute-audio','--disable-background-networking','--remote-debugging-port='+port,'--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});
  let t;for(let i=0;i<50;i++){try{t=await (await fetch(`http://127.0.0.1:${port}/json`)).json();if(t.length)break}catch{}await new Promise(r=>setTimeout(r,200))}
  const ws=new WebSocket(t.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend[m.id])pend[m.id](m)};
  const send=(method,params={})=>new Promise(r=>{pend[++id]=r;ws.send(JSON.stringify({id,method,params}))});
  const ev=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true});return r.result.result?.value??JSON.stringify(r.result)};
  return {p,send,ev,close:()=>{ws.close();p.kill()}};
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));




const PORT=process.argv[2]||'8770';
const A=await session(9381);
process.on('exit', A.close);
await A.send('Page.enable');
await A.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await A.send('Emulation.setTouchEmulationEnabled',{enabled:true});
await A.send('Page.navigate',{url:'http://127.0.0.1:'+PORT+'/index.html'});await sleep(1500);
const click=(txt)=>A.ev(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(${JSON.stringify(txt)})&&!b.disabled);if(!b)return 'NOBTN:'+${JSON.stringify(txt)}+' have: '+[...document.querySelectorAll('button')].map(b=>b.textContent.trim()).join('|');b.click();return 'ok'})()`);
const text=()=>A.ev(`document.getElementById('game').innerText.replace(/\\n+/g,' / ').slice(0,150)`);
const step=async(t,w=150)=>{const r=await click(t);assert.equal(r,'ok',r);await sleep(w)};
const grid=()=>`[...document.querySelectorAll('#game section [role=grid] button')]`;
const key=async(key)=>{
  const code={Enter:13,Escape:27,ArrowRight:39}[key];
  await A.send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code,
    text:key==='Enter'?'\r':''});
  await A.send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code});
};
const check=async(expression,message)=>assert.equal(await A.ev(expression),true,message);
const fitsPhone=()=>check('innerWidth === 390 && document.documentElement.scrollWidth === 390','Fits the 390px viewport');
const goalCount=n=>check(`document.querySelectorAll('.goals .goal-done').length === ${n}`,'Goal progress updates');
async function checkDialog(label,selector){
  await A.ev(`window.openerButton = [...document.querySelectorAll('#game button')].find(b => b.textContent === '${label}'); openerButton.focus();`);
  await key('Enter');
  await check(`document.querySelector('${selector}').open && document.activeElement.tagName === 'H2'`,'Dialog opens and receives focus');
  await fitsPhone();
  await key('ArrowRight');
  await key('Escape');
  await check(`!document.querySelector('${selector}').open && document.activeElement === openerButton`,'Escape closes dialog and restores focus');
}
await A.ev(`window.__errs=[];window.addEventListener('error',e=>__errs.push(e.message))`);
await step('New game'); await step('Begin');
// ---- chapter 1
await step('Begin chapter'); console.log('C1L1:',await text());
await check(`[...document.querySelectorAll('.hotspots button')].slice(0,2).map(b=>b.textContent).join('|') === 'Answer the voice|Repair the power grid'`,'Main actions come first');
await step('Answer the voice'); await step('"Nobody is switching'); await step('"Understood'); await step('Done');
await step('Repair the power grid');
await fitsPhone();
await check(`document.querySelector('.puzzle-goals').textContent.includes('restore power to open the pressure door')`,'Power objective is visible in the console');
for(const [k,n] of Object.entries({'2,1':3,'1,1':2,'1,2':1,'1,3':1,'2,3':2})){const [r,c]=k.split(',').map(Number);for(let i=0;i<n;i++){await A.ev(`document.querySelectorAll('#game section [role=group] button')[${r*5+c}].click()`);await sleep(50)}}
await sleep(2200); await step('Go through the door'); console.log('C1L2:',await text());
await step('Work the valves');
await fitsPhone();
const valve=v=>`[...document.querySelectorAll('#game section button')].find(b=>/^Valve ${v},/.test(b.getAttribute('aria-label')||''))`;
const touchPoint=await A.ev(`(()=>{const b=${valve('C')}; b.scrollIntoView({block:'center'}); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
await A.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touchPoint]});
await A.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await checkDialog('How to play','#how-to');
await check(`${valve('C')}.getAttribute('aria-pressed') === 'true'`,'Help preserves the valve tapped on mobile');
for(const v of ['A','D','B']) await A.ev(`${valve(v)}.click()`);
await sleep(2200);
await goalCount(1);
await check(`['ENG 4','SCI 4','EMP 4'].every(stat=>document.querySelector('.stat-help').textContent.includes(stat))`,'Life Support explains the three stat unlocks');
await step('Ask ORI to open the lab');
await check(`[...document.querySelectorAll('button[aria-disabled=true]')].some(b=>b.textContent.includes('[EMP 4 needed]'))`,'ORI shows locked stat thresholds');
await step('Say nothing'); await step('"I will be'); await step('Done');
await goalCount(2);
await step('+SCI');
await step('Go to the lab'); console.log('C1L3:',await text());
await step('Decode the message');
await fitsPhone();
await check(`document.querySelector('#game section').textContent.includes('incoming L with decoded E')`,'SCI 4 gives a mapping clue');
await key('ArrowRight');
await checkDialog('How to play','#how-to');
await checkDialog('Journal','#journal');
await check(`document.querySelector('#game section [role=status]').textContent === 'Shift: 1'`,'Help and Journal preserve the cipher shift and contain shortcut keys');
for(let i=0;i<6;i++) await A.ev(`[...document.querySelectorAll('#game section button')].find(b=>b.textContent.trim()==='+')?.click()`);
await check(`document.querySelectorAll('.cipher-map code')[1].textContent[11] === 'E'`,'Live mapping updates with the shift');
await step('Transmit'); await sleep(2500);
await step('Answer the signal'); await step('"I am answering'); await step('"I will carry'); await step('Set course together'); await step('Close the channel');
await step('Set course'); console.log('CH1 DONE:',await text());
await check(`document.querySelector('#game').textContent.includes('The Veil comes aboard') && document.querySelector('#game').textContent.includes('next destination, Harbor Nine')`,'Meridian card shows the choice consequence and next destination');
await step('Continue');
// ---- chapter 2
await step('Begin chapter'); console.log('C2L1:',await text());
await step('Answer the radio'); await step('"Hold position'); await step('"On it'); await step('Done');
await step('Light the docking ring'); await step('Watch');
const padsReady = `!document.querySelector('#game button[aria-label^="Pad 1,"]').disabled`;
for(let i=0;i<70 && !await A.ev(padsReady);i++) await sleep(100);
await check(padsReady,'Docking pads are ready for input');
for(const n of [3,1,4,2,3]) await A.ev(`[...document.querySelectorAll('#game section button')].find(b=>(b.getAttribute('aria-label')||'').startsWith('Pad ${n},'))?.click()`);
await sleep(2500); await step('Head down'); console.log('C2L2:',await text());
await step('Talk to Pip'); await step('"Please, Pip'); await step('"I will count'); await step('"Thank you'); await step('Done');
await step('Use the balance scale');
const crate=n=>A.ev(`[...document.querySelectorAll('#game section [aria-label="Crates"] button')][${n-1}].click()`);
for(const n of [1,2,3]) await crate(n); for(const n of [4,5,6]){await crate(n);await crate(n)}
await step('Weigh');
for(const n of [1,2,3]){await crate(n);await crate(n)} for(const n of [4,5,6]) await crate(n);
await crate(7); await crate(8); await crate(8); await step('Weigh');
await step('Name the heavy crate');
await A.ev(`document.querySelector('#game section [aria-label="Name the heavy crate"] button[aria-label="Crate 7"]').click()`);
await step('Confirm'); await sleep(2500); await step('Take the lift'); console.log('C2L3:',await text());
await step('Tune the beacon');
await A.ev(`(()=>{const r=[...document.querySelectorAll('#game input[type=range]')];const set=(i,v)=>{r[i].value=v;r[i].dispatchEvent(new Event('input',{bubbles:true}));r[i].dispatchEvent(new Event('change',{bubbles:true}))};set(0,6);set(1,3)})()`);
await step('Lock in'); await sleep(2500);
await step('Speak to the captains'); await step('"One at a time'); await step('Guide them in'); await step('Close the channel');
await step('Send the all-clear'); console.log('CH2 DONE:',await text());
await step('Continue');
// ---- chapter 3
await step('Begin chapter'); console.log('C3L1:',await text());
await step('Answer Fern'); await step('"Show me the doors'); await step('"I can do fiddly'); await step('Done');
await step('Work the vault locks');
for(const [r,c] of [[0,0],[1,2],[2,1],[3,3]]) await A.ev(`${grid()}[${r*4+c}].click()`);
await sleep(2500); await step('Walk to the dome'); console.log('C3L2:',await text());
await step('Calm the argument'); await step('"Fine. Show me the rota'); await step('"I will fix the rota'); await step('Done');
await step('Fix the rota');
await A.ev(`(()=>{const sel=[...document.querySelectorAll('#game section select')];const want=['Vine','Moss','Dome'];sel.forEach((s,i)=>{const o=[...s.options].find(o=>o.textContent.trim()===want[i]);if(o){s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}))}})})()`);
await step('Check'); await sleep(2500); await step('Go to the water room'); console.log('C3L3:',await text());
await step('Rebuild the water line');
const start='182405736',goal='123456780',mv={U:-3,D:3,L:-1,R:1};
const ok=(z,m)=>m==='U'?z>2:m==='D'?z<6:m==='L'?z%3>0:z%3<2;
let q=[[start,[]]];const seen=new Set([start]);let sol=null;
while(q.length&&!sol){const [s,p]=q.shift();if(s===goal){sol=p;break}const z=s.indexOf('0');for(const m of 'UDLR'){if(!ok(z,m))continue;const a=s.split('');const t=a[z+mv[m]];[a[z],a[z+mv[m]]]=[a[z+mv[m]],a[z]];const n=a.join('');if(!seen.has(n)){seen.add(n);q.push([n,[...p,t]])}}}
for(const t of sol){await A.ev(`${grid()}.find(b=>(b.getAttribute('aria-label')||'').startsWith('Tile ${t},'))?.click()`);await sleep(60)}
await sleep(2500);
await step('Speak with Fern'); await step('"Replant'); await step('Begin replanting'); await step('Close the channel');
await step('Leave the water room'); console.log('CH3 DONE:',await text());
await step('Continue');
console.log('FINALE:',await A.ev(`document.getElementById('game').innerText.replace(/\\n+/g,' / ').slice(0,900)`));
console.log('state:',await A.ev(`(()=>{const s=JSON.parse(localStorage.getItem('driftSignalSaga.v1')||'null');return s?JSON.stringify({xp:s.xp,level:s.level,journal:(s.journal||[]).length,lvl:s.level_id}):'nosave'})()`));
console.log('errors:',await A.ev(`JSON.stringify(window.__errs)`));
await check(`document.querySelector('#game h1').textContent === 'The Long Quiet' && window.__errs.length === 0`,'The full playthrough reaches the finale without script errors');
process.exit(0);

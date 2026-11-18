import {spawn} from 'node:child_process';
const URL=process.argv[2];
async function session(port){
  const dir='/tmp/prof'+port+Date.now();
  const p=spawn('chromium',['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port='+port,'--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});
  let t;for(let i=0;i<50;i++){try{t=await (await fetch(`http://127.0.0.1:${port}/json`)).json();if(t.length)break}catch{}await new Promise(r=>setTimeout(r,200))}
  const ws=new WebSocket(t.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend[m.id])pend[m.id](m)};
  const send=(method,params={})=>new Promise(r=>{pend[++id]=r;ws.send(JSON.stringify({id,method,params}))});
  const ev=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true});return r.result.result?.value??JSON.stringify(r.result)};
  return {p,send,ev,close:()=>{ws.close();p.kill()}};
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const A=await session(9331);
await A.send('Page.enable');await A.send('Page.navigate',{url:URL});await sleep(2500);
await A.ev(`localStorage.setItem('aiPortal.v1',JSON.stringify({lessons:{m1:['l1','l2','l3','l4'],m2:['l1']},quiz:{m1:5},demos:['tokens']}))`);
await A.send('Page.navigate',{url:URL});await sleep(2000);
await A.ev(`document.getElementById('show-code').click()`);
const code=await A.ev(`document.getElementById('code-out').textContent`);
const xpA=await A.ev(`document.body.innerText.match(/\\d+\\s*XP/)?.[0]`);
console.log('A code:',JSON.stringify(code),'A xp:',xpA);
const B=await session(9332);
await B.send('Page.enable');await B.send('Page.navigate',{url:URL});await sleep(2500);
await B.ev(`const i=document.getElementById('code-in');i.value=${JSON.stringify(code)};document.getElementById('restore').click()`);
await sleep(500);
console.log('B msg:',await B.ev(`document.getElementById('code-msg').textContent`));
console.log('B xp:',await B.ev(`document.body.innerText.match(/\\d+\\s*XP/)?.[0]`));
console.log('B storage:',await B.ev(`localStorage.getItem('aiPortal.v1')`));
A.close();B.close();process.exit(0);

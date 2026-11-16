const $ = id => document.getElementById(id);
const state = {started:false, threat:0, events:0, isolated:false, investigated:false, restored:false, score:0};

const fakeFiles = [
  ["session_backup.enc","ENCRYPTED"],
  ["access_log.dat","SUSPICIOUS"],
  ["system_core.sys","PROTECTED"],
  ["identity_cache.tmp","UNKNOWN"],
  ["blackout_trace.log","GENERATED"]
];

function log(msg){
  const el=document.createElement("div");
  el.className="log";
  el.innerHTML=`<time>${new Date().toLocaleTimeString()}</time>${msg}`;
  $("logs").prepend(el);
  state.events++;
  update();
}

function out(msg){
  const p=document.createElement("p");
  p.textContent=msg;
  $("output").append(p);
  $("output").scrollTop=$("output").scrollHeight;
}

function toast(msg){
  $("toast").textContent=msg;
  $("toast").classList.add("show");
  setTimeout(()=>$("toast").classList.remove("show"),2600);
}

function update(){
  $("threat").textContent=state.threat+"%";
  $("events").textContent=state.events;
  $("integrity").textContent=(100-state.threat)+"%";
  $("session").textContent=state.isolated?"ISOLATED":"ACTIVE";
  $("bar").style.width=state.threat+"%";
}

function start(){
  state.started=true;
  $("intro").classList.add("hidden");
  $("incidentTitle").textContent="Activité inhabituelle";
  $("incidentText").textContent="La session locale est initialisée. Lance une analyse pour examiner les informations disponibles.";
  log("Session BLACKOUT initialisée.");
  log("Environnement navigateur détecté.");
  log("Surveillance locale activée.");
  out("Session démarrée. Bienvenue, opérateur.");
  device();
  showFiles();
  toast("SESSION INITIALISÉE");
}

function device(){
  const info=[
    ["Navigateur",navigator.userAgent],
    ["Langue",navigator.language],
    ["Plateforme déclarée",navigator.platform||"Non disponible"],
    ["Résolution",screen.width+" × "+screen.height],
    ["Fenêtre",innerWidth+" × "+innerHeight],
    ["Fuseau horaire",Intl.DateTimeFormat().resolvedOptions().timeZone],
    ["Cœurs déclarés",navigator.hardwareConcurrency||"Inconnu"],
    ["Connexion",navigator.onLine?"En ligne":"Hors ligne"]
  ];
  $("device").replaceChildren();
  info.forEach(([k,v])=>{
    const p=document.createElement("p");
    p.textContent=k+": "+v;
    $("device").append(p);
  });
}

function scan(){
  device();
  state.threat=Math.min(100,state.threat+12);
  log("Analyse des métadonnées du navigateur terminée.");
  log("Aucun accès aux fichiers ou comptes personnels.");
  $("incidentTitle").textContent="Analyse terminée";
  $("incidentText").textContent="Des informations techniques locales ont été détectées. Aucune intrusion réelle.";
  out("SCAN: métadonnées navigateur examinées.");
  toast("ANALYSE LOCALE TERMINÉE");
}

function investigate(){
  state.investigated=true;
  state.score++;
  state.threat=Math.min(100,state.threat+18);
  log("Opérateur: enquête lancée.");
  log("Dossier fictif BK-0091 ouvert.");
  $("incidentTitle").textContent="Piste identifiée";
  $("incidentText").textContent="Une anomalie fictive a été trouvée dans les journaux de démonstration.";
  out("INVESTIGATE: anomalie simulée identifiée.");
  toast("NOUVELLE PISTE DÉTECTÉE");
}

function isolate(){
  state.isolated=true;
  state.score++;
  state.threat=Math.min(100,state.threat+8);
  log("Action locale: session de démonstration isolée.");
  $("incidentText").textContent="La session fictive est isolée. Tu peux tenter une restauration.";
  out("ISOLATE: état de démonstration modifié.");
  toast("SESSION ISOLÉE");
}

function restore(){
  if(!state.isolated){
    toast("Aucune session isolée.");
    return;
  }
  state.isolated=false;
  state.restored=true;
  state.threat=Math.max(0,state.threat-35);
  log("Restauration de l'état fictif effectuée.");
  $("incidentTitle").textContent="Restauration effectuée";
  $("incidentText").textContent="L'état de démonstration a été restauré.";
  out("RESTORE: état local restauré.");
  toast("RESTAURATION TERMINÉE");
}

function showFiles(){
  $("files").replaceChildren();
  fakeFiles.forEach(([name,status])=>{
    const div=document.createElement("div");
    div.className="file";
    div.textContent="▸ "+name+"  ["+status+"]";
    div.onclick=()=>{
      log("Élément fictif consulté: "+name);
      out("FILE: "+name+" // "+status);
      toast("ÉLÉMENT DE DÉMONSTRATION OUVERT");
    };
    $("files").append(div);
  });
}

async function fullscreen(){
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
    toast("PLEIN ÉCRAN MODIFIÉ");
  }catch(e){toast("PLEIN ÉCRAN REFUSÉ PAR LE NAVIGATEUR");}
}

async function notify(){
  if(!("Notification" in window)){
    toast("Notifications non prises en charge.");
    return;
  }
  try{
    const permission=await Notification.requestPermission();
    if(permission==="granted"){
      new Notification("BLACKOUT // SOC",{body:"Notification de démonstration."});
      log("Notification navigateur autorisée.");
    }else toast("Autorisation non accordée.");
  }catch(e){toast("Notification indisponible.");}
}

function finish(){
  let title="OPÉRATION TERMINÉE";
  let message="Tu as exploré BLACKOUT. Aucun système réel n'a été compromis.";
  if(state.restored && state.investigated){
    title="OPÉRATEUR EXPERT";
    message="Tu as enquêté et restauré la session fictive. Belle opération.";
  }else if(state.isolated){
    title="SESSION CONFINÉE";
    message="Tu as choisi de laisser la session fictive isolée.";
  }else if(state.investigated){
    title="ENQUÊTE INACHEVÉE";
    message="Tu as trouvé une piste, mais tu n'as pas terminé l'opération.";
  }
  $("ending").textContent=title;
  $("endingText").textContent=message;
  $("reveal").classList.remove("hidden");
  log("Fin de la démonstration.");
}

function command(cmd){
  const c=cmd.trim().toLowerCase();
  if(!c)return;
  out("root@blackout:~$ "+c);

  const commands={
    help:()=>out("help | status | scan | investigate | isolate | restore | files | report | clear | fullscreen | notify | abort"),
    status:()=>out("Menace: "+state.threat+"% // Événements: "+state.events+" // Session: "+(state.isolated?"ISOLATED":"ACTIVE")),
    scan,
    investigate,
    isolate,
    restore,
    files:()=>{showFiles();out("Liste des éléments fictifs actualisée.");},
    report:()=>out("RAPPORT: "+state.events+" événements // "+state.threat+"% menace simulée."),
    fullscreen,
    notify,
    abort:finish,
    clear:()=>$("output").replaceChildren()
  };

  if(commands[c])commands[c]();
  else out("Commande inconnue. Tape help.");
}

document.addEventListener("click",e=>{
  const action=e.target.dataset.action;
  if(!action)return;
  const actions={stop:finish,scan,investigate,isolate,restore,files:showFiles,fullscreen,notify};
  actions[action]?.();
});

$("start").onclick=start;
$("restart").onclick=()=>{
  location.reload();
};

$("commandForm").onsubmit=e=>{
  e.preventDefault();
  command($("command").value);
  $("command").value="";
};

setInterval(()=>{
  $("clock").textContent=new Date().toLocaleTimeString();
},1000);
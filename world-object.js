/* WORLD WEDDING — shared WorldObject layer
 * One source object, many projections.
 * Browser-first, dependency-free, local persistence for the prototype.
 */
(()=> {
  const VERSION='world-object-v1';
  const KEY='ww-world-objects-v1';
  const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const slug=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'?x:{}}catch{return {}}}
  function save(store){localStorage.setItem(KEY,JSON.stringify(store));return store}

  function destination(d){
    if(!d||d.id==null)return null;
    return {
      id:'destination:'+d.id,
      version:VERSION,
      type:'destination',
      source:'WORLD_WEDDING_DESTINATIONS',
      sourceId:d.id,
      identity:{name:d.name,country:d.country,countryCode:d.countryCode,region:d.region},
      geo:{lat:d.lat,lng:d.lng},
      editorial:{keywords:Array.isArray(d.keywords)?d.keywords:[],season:d.season||null},
      relations:{people:[],places:[],services:[],events:[],media:[],timeline:[],weddings:[]},
      provenance:{origin:'mattmezstitchlab/WORLDWEDDING',status:'registered',verified:false}
    };
  }

  function keyFor(object){return object?.id||null}

  function upsert(object){
    if(!object?.id)return null;
    const store=load();
    store[keyFor(object)]={...(store[keyFor(object)]||{}),...object,updatedAt:new Date().toISOString()};
    save(store);
    return store[keyFor(object)];
  }

  function get(id){return load()[id]||null}
  function all(){return Object.values(load())}
  function link(id,type,targetId){
    const o=get(id); if(!o||!targetId)return null;
    o.relations=o.relations||{};
    o.relations[type]=Array.isArray(o.relations[type])?o.relations[type]:[];
    if(!o.relations[type].includes(targetId))o.relations[type].push(targetId);
    return upsert(o);
  }

  function saveToWedding(object,meta={}){
    const o=upsert(object); if(!o)return null;
    const raw=localStorage.getItem('ww-my-wedding-v1');
    let wedding={}; try{wedding=JSON.parse(raw||'{}')||{}}catch{}
    wedding.savedObjects=Array.isArray(wedding.savedObjects)?wedding.savedObjects:[];
    const entry={objectId:o.id,type:o.type,name:o.identity?.name||o.name||o.id,sourceId:o.sourceId,addedAt:new Date().toISOString(),...meta};
    const i=wedding.savedObjects.findIndex(x=>x.objectId===entry.objectId);
    if(i>=0)wedding.savedObjects[i]={...wedding.savedObjects[i],...entry}; else wedding.savedObjects.push(entry);
    localStorage.setItem('ww-my-wedding-v1',JSON.stringify(wedding));
    return entry;
  }

  function registerDestinations(list){
    if(!Array.isArray(list))return [];
    return list.map(destination).filter(Boolean).map(upsert);
  }

  window.WORLD_OBJECT={
    VERSION,KEY,slug,destination,upsert,get,all,link,saveToWedding,registerDestinations
  };
})();
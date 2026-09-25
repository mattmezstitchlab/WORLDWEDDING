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

  const RELATION_TYPES=['people','places','services','events','media','timeline','weddings'];

  function keyFor(object){return object?.id||null}

  function create(type,data={},provenance={}){
    if(!type)return null;
    const sourceId=data.sourceId ?? data.id ?? slug(data.name||type);
    const id=data.id&&String(data.id).includes(':')?String(data.id):type+':'+sourceId;
    const object={
      id,version:VERSION,type,
      source:data.source||'WORLD_WEDDING',
      sourceId,
      identity:{name:data.name||data.identity?.name||id,...(data.identity||{})},
      geo:data.geo||null,
      editorial:data.editorial||{},
      relations:Object.fromEntries(RELATION_TYPES.map(k=>[k,Array.isArray(data.relations?.[k])?data.relations[k]:[]])),
      provenance:{origin:provenance.origin||data.provenance?.origin||'user',status:provenance.status||'registered',verified:Boolean(provenance.verified??data.provenance?.verified??false),...data.provenance,...provenance}
    };
    return object;
  }

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
    if(!RELATION_TYPES.includes(type)||!targetId)return null;
    const o=get(id); if(!o)return null;
    o.relations=o.relations||{};
    o.relations[type]=Array.isArray(o.relations[type])?o.relations[type]:[];
    if(!o.relations[type].includes(targetId))o.relations[type].push(targetId);
    return upsert(o);
  }

  function unlink(id,type,targetId){
    const o=get(id); if(!o||!Array.isArray(o.relations?.[type]))return null;
    o.relations[type]=o.relations[type].filter(x=>x!==targetId);
    return upsert(o);
  }

  function related(id,type){
    const o=get(id);
    if(!o)return [];
    const ids=Array.isArray(o.relations?.[type])?o.relations[type]:[];
    return ids.map(get).filter(Boolean);
  }

  function relate(id,type,targetId,options={}){
    const source=link(id,type,targetId);
    if(!source)return null;
    if(options.reverse){
      const reverse=options.reverseType||null;
      if(reverse)link(targetId,reverse,id);
    }
    return source;
  }

  function summary(object){
    if(!object)return null;
    return {
      id:object.id,type:object.type,name:object.identity?.name||object.name||object.id,
      location:object.geo||null,
      keywords:object.editorial?.keywords||[],
      relationCounts:Object.fromEntries(RELATION_TYPES.map(k=>[k,(object.relations?.[k]||[]).length])),
      provenance:object.provenance||null
    };
  }

  function saveToWedding(object,meta={}){
    const o=upsert(object); if(!o)return null;
    const raw=localStorage.getItem('ww-my-wedding-v1');
    let wedding={}; try{wedding=JSON.parse(raw||'{}')||{}}catch{}
    wedding.savedObjects=Array.isArray(wedding.savedObjects)?wedding.savedObjects:[];
    const weddingId='wedding:current';
    if(!get(weddingId)) upsert(create('wedding',{id:weddingId,name:'My Wedding',source:'WORLD_WEDDING'} ,{origin:'my-wedding',status:'local',verified:false}));
    const relationBucket={destination:'places',place:'places',service:'services',person:'people',people:'people',event:'events',media:'media',timeline:'timeline',wedding:'weddings'}[o.type]||'places';
    relate(weddingId,relationBucket,o.id);
    relate(o.id,'weddings',weddingId);
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
    VERSION,KEY,RELATION_TYPES,slug,destination,create,upsert,get,all,link,unlink,related,relate,summary,saveToWedding,registerDestinations
  };
})();
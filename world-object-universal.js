/* WORLD WEDDING — WorldObject → Universal Grid adapter
 * Deterministic semantic projection. No external claims; conventions stay explicit.
 */
(()=> {
  const TYPE_TO_SEMANTIC={destination:'place',person:'person',people:'person',place:'place',service:'service',event:'event',media:'media',timeline:'moment',wedding:'wedding'};
  const hash=x=>{let h=2166136261;for(const c of String(x)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  function project(object){
    if(!object)return null;
    const seed=object.id||object.sourceId||object.identity?.name||'object';
    const h=hash(seed);
    const cell=String((h%365)+1).padStart(3,'0');
    const relationCount=Object.values(object.relations||{}).reduce((n,v)=>n+(Array.isArray(v)?v.length:0),0);
    return {
      sourceId:object.id,
      sourceType:object.type,
      semanticType:TYPE_TO_SEMANTIC[object.type]||'object',
      cell,
      number:h%365+1,
      relationCount,
      provenance:object.provenance||null,
      rule:'stable object id → deterministic grid cell'
    };
  }
  function projectById(id){return window.WORLD_OBJECT?.get(id)?project(window.WORLD_OBJECT.get(id)):null}
  window.WORLD_OBJECT_GRID={project,projectById};
})();
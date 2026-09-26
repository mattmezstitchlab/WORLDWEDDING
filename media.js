/* WORLD WEDDING — editorial media layer
   Pexels is queried server-side through /api/pexels. No API key belongs in the browser. */
(function(){
  const cacheKey='ww-media-v2';
  const cache=JSON.parse(localStorage.getItem(cacheKey)||'{}');
  function remember(k,v){cache[k]=v;try{localStorage.setItem(cacheKey,JSON.stringify(cache));}catch{}}
  async function search(query,orientation='landscape',type='photo'){
    const key=query+'|'+orientation+'|'+type;
    if(cache[key])return cache[key];
    const r=await fetch('./api/pexels?q='+encodeURIComponent(query)+'&orientation='+orientation+'&type='+type);
    if(!r.ok)throw new Error('Media unavailable');
    const data=await r.json();
    const items=type==='video'?(data.videos||[]):(data.photos||[]);
    remember(key,items);
    return items;
  }
  function applyVideo(video,item){
    if(!video||!item?.url)return;
    video.src=item.url;
    if(item.image)video.poster=item.image;
    video.dataset.pexelsId=item.id||'';
    video.dataset.photographer=item.user||'';
    video.dataset.pexelsUrl=item.userUrl||'';
    video.muted=true;
    video.loop=true;
    video.autoplay=true;
    video.playsInline=true;
    video.setAttribute('aria-label',video.dataset.alt||'Vidéo de mariage');
    video.play().catch(()=>{});
    return item;
  }
  function apply(img,photo){
    if(!img||!photo)return;
    img.src=photo.src.large2x||photo.src.large||photo.src.original;
    img.alt=photo.alt||img.alt||'';
    img.dataset.pexelsUrl=photo.pexelsUrl||'';
    img.dataset.photographer=photo.photographer||'';
    img.dataset.pexelsId=photo.id||'';
    return photo;
  }
  function credit(item){
    if(!item)return '';
    const photographer=item.photographer||item.user||'Créateur Pexels';
    const url=item.photographerUrl||item.userUrl||item.pexelsUrl||'https://www.pexels.com/';
    return '<a href="'+url+'" target="_blank" rel="noreferrer">'+photographer+' · Pexels</a>';
  }
  async function hydrateNode(node){
    try{
      const type=node.tagName.toLowerCase()==='video'?'video':'photo';
      const items=await search(node.dataset.mediaQuery,node.dataset.mediaOrientation||'landscape',type);
      if(items[0])return type==='video'?applyVideo(node,items[0]):apply(node,items[0]);
    }catch{}
    return null;
  }
  window.WW_MEDIA={search,apply,credit,hydrateNode,async hydrate(){
    const nodes=[...document.querySelectorAll('[data-media-query]')];
    await Promise.all(nodes.map(hydrateNode));
  }};
})();
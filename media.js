/* WORLD WEDDING — editorial media layer
   Pexels is queried server-side through /api/pexels. No API key belongs in the browser. */
(function(){
  const cacheKey='ww-media-v1';
  const cache=JSON.parse(localStorage.getItem(cacheKey)||'{}');
  function remember(k,v){cache[k]=v;try{localStorage.setItem(cacheKey,JSON.stringify(cache));}catch{}}
  async function search(query,orientation='landscape'){
    const key=query+'|'+orientation;if(cache[key])return cache[key];
    const r=await fetch('./api/pexels?q='+encodeURIComponent(query)+'&orientation='+orientation);
    if(!r.ok)throw new Error('Media unavailable');
    const data=await r.json();remember(key,data.photos||[]);return data.photos||[];
  }
  function apply(img,photo){if(!img||!photo)return;img.src=photo.src.large2x||photo.src.large||photo.src.original;img.alt=photo.alt||img.alt||'';img.dataset.pexelsUrl=photo.pexelsUrl||'';img.dataset.photographer=photo.photographer||'';img.dataset.pexelsId=photo.id||'';return photo;}
  function credit(photo){if(!photo)return '';const photographer=photo.photographer||'Photographe Pexels';const url=photo.photographerUrl||photo.pexelsUrl||'https://www.pexels.com/';return '<a href="'+url+'" target="_blank" rel="noreferrer">'+photographer+' · Pexels</a>';}
  async function hydrateNode(img){try{const photos=await search(img.dataset.mediaQuery,img.dataset.mediaOrientation||'landscape');if(photos[0])return apply(img,photos[0]);}catch{}return null;}
  window.WW_MEDIA={search,apply,credit,hydrateNode,async hydrate(){const nodes=[...document.querySelectorAll('[data-media-query]')];await Promise.all(nodes.map(hydrateNode));}};
})();

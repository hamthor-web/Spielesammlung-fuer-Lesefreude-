// Responsive Startseite v1
(function(){
  function addCrop(el,src,x,y,w,h){
    el.style.aspectRatio=w+'/'+h;
    var img=document.createElement('img');
    img.alt='';
    img.src=src;
    img.style.width=(1536/w*100)+'%';
    img.style.left=(-x/w*100)+'%';
    img.style.top=(-y/w*100)+'%';
    el.appendChild(img);
  }

  function init(){
    var home=document.getElementById('home');
    if(!home || home.querySelector('.mobile-home-responsive')) return;
    var stage=home.querySelector('.stage');
    var source=stage && stage.querySelector('img');
    if(!source) return;

    var mobile=document.createElement('div');
    mobile.className='mobile-home-responsive';
    mobile.setAttribute('aria-label','Spielauswahl');
    mobile.innerHTML=
      '<div class="mobile-home-inner">'+
        '<div class="mobile-banner home-crop" aria-hidden="true"></div>'+
        '<div class="mobile-tiles">'+
          '<a class="mobile-tile home-crop hot" href="#" data-target="dice" aria-label="Würfelpaket öffnen"><span class="sr">Würfeln</span></a>'+
          '<a class="mobile-tile home-crop hot" href="#" data-target="stories" aria-label="Geschichtenpaket öffnen"><span class="sr">Interaktive Geschichten</span></a>'+
          '<a class="mobile-tile home-crop hot" href="#" data-target="crazy" aria-label="Verrückte Geschichten öffnen"><span class="sr">Verrücktes</span></a>'+
        '</div>'+
      '</div>';

    home.appendChild(mobile);

    var banner=mobile.querySelector('.mobile-banner');
    var tiles=mobile.querySelectorAll('.mobile-tile');
    addCrop(banner,source.src,300,10,930,210);
    addCrop(tiles[0],source.src,64,214,464,577);
    addCrop(tiles[1],source.src,547,214,464,577);
    addCrop(tiles[2],source.src,1031,214,444,577);

    tiles.forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        var target=a.dataset.target;
        if(typeof show==='function') show(target);
      });
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

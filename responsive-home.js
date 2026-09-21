// Responsive Startseite v3 – nutzt nur das bereits eingebettete Startbild
(function(){
  function init(){
    var home=document.getElementById('home');
    var stage=home && home.querySelector('.stage');
    var source=stage && stage.querySelector('img');
    if(!home || !stage || !source || home.querySelector('.mobile-home-responsive')) return;

    var src=source.getAttribute('src');
    if(!src) return;

    var mobile=document.createElement('div');
    mobile.className='mobile-home-responsive';
    mobile.setAttribute('aria-label','Spielauswahl');

    function crop(kind,label,target){
      return '<a class="mobile-tile crop-'+kind+'" href="#" data-target="'+target+'" aria-label="'+label+'">'+
               '<span class="mobile-crop"><img src="'+src+'" alt=""></span>'+
             '</a>';
    }

    mobile.innerHTML=
      '<div class="mobile-home-inner">'+
        '<div class="mobile-header-crop"><img src="'+src+'" alt="Lesen, entdecken, erzählen"></div>'+
        '<div class="mobile-tiles">'+
          crop('w','Würfelpaket öffnen','dice')+
          crop('g','Geschichtenpaket öffnen','stories')+
          crop('v','Verrückte Spiele öffnen','crazy')+
        '</div>'+
      '</div>';

    home.appendChild(mobile);

    mobile.querySelectorAll('.mobile-tile').forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        var target=a.dataset.target;
        if(typeof window.show==='function'){
          window.show(target);
          return;
        }
        var old=home.querySelector('.hot.'+(target==='dice'?'w':target==='stories'?'g':'v'));
        if(old) old.click();
      });
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
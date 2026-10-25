// Responsive Startseite v4 – lokale Einzelbilder, keine Bildausschnitte
(function(){
  function init(){
    var home=document.getElementById('home');
    if(!home || home.querySelector('.mobile-home-responsive')) return;

    var mobile=document.createElement('div');
    mobile.className='mobile-home-responsive';
    mobile.setAttribute('aria-label','Spielauswahl');
    mobile.innerHTML=
      '<div class="mobile-home-inner">'+
        '<div class="mobile-tiles">'+
          '<a class="mobile-tile" href="#" data-target="dice" aria-label="Würfelpaket öffnen">'+
            '<img src="./kachel-wuerfeln.webp" alt="Würfeln – Würfeln, lesen und losspielen">'+
          '</a>'+
          '<a class="mobile-tile" href="#" data-target="stories" aria-label="Geschichtenpaket öffnen">'+
            '<img src="./kachel-geschichten.webp" alt="Interaktive Geschichten – Entdecken, lesen und erzählen">'+
          '</a>'+
          '<a class="mobile-tile" href="#" data-target="crazy" aria-label="Verrückte Spiele öffnen">'+
            '<img src="./kachel-verruecktes.webp" alt="Verrücktes – Suchen, staunen und Quatsch entdecken">'+
          '</a>'+
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

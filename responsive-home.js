// Responsive Startseite v2
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
            '<img src="https://hamthor-web.github.io/Lesen-entdecken-erzaehlen/kachel-wuerfeln.webp" alt="Würfeln – Würfeln, lesen und losspielen">'+
          '</a>'+
          '<a class="mobile-tile" href="#" data-target="stories" aria-label="Geschichtenpaket öffnen">'+
            '<img src="https://hamthor-web.github.io/Lesen-entdecken-erzaehlen/kachel-geschichten.webp" alt="Interaktive Geschichten – Entdecken, lesen und erzählen">'+
          '</a>'+
          '<a class="mobile-tile" href="#" data-target="crazy" aria-label="Verrückte Geschichten öffnen">'+
            '<img src="https://hamthor-web.github.io/Lesen-entdecken-erzaehlen/kachel-verruecktes.webp" alt="Verrücktes – Suchen, staunen und Quatsch entdecken">'+
          '</a>'+
        '</div>'+
      '</div>';

    home.appendChild(mobile);
    home.classList.add('responsive-ready');

    mobile.querySelectorAll('.mobile-tile').forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        var target=a.dataset.target;
        if(typeof window.show==='function'){
          window.show(target);
          return;
        }
        var fallback={
          dice:'./wuerfeln-sport.html',
          stories:'./geschichten.html',
          crazy:'./spieler.html'
        };
        if(fallback[target]) window.location.href=fallback[target];
      });
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
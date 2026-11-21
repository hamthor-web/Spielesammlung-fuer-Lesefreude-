(function(root){
  const levels=[1,2,3,4,5,6,7];
  const texts=[
    'Dein Pokal wächst! Weiter so!',
    'Ein Stern für dich! Du bleibst dran!',
    'Zwei Sterne leuchten für dich! Toll gemacht!',
    'Ein goldener Kranz für deinen Pokal! Du hast viel geschafft!',
    'Luftballons für dich! Wir feiern deinen Spieleifer!',
    'Dein Pokal ist reich gefüllt! Du bist mit Freude dabei!',
    'Konfetti für dich! Dein Pokal ist fertig!'
  ];
  const freizeitTexts=[
    'Dein Rucksack wächst! Auf ins nächste Abenteuer!',
    'Ein Schluck Wasser – und der Weg wird wieder leicht.',
    'Ein Apfel für unterwegs! Toll gemacht!',
    'Ein Teddy kommt mit! Gemeinsam macht es Spaß!',
    'Schuhe für neue Abenteuer! Du bleibst dran!',
    'Eine Krone für deinen Teddy! Du hast viel geschafft!',
    'Zuckerwatte für dich! Dein Abenteuer-Rucksack ist komplett!'
  ];
  const maerchenTexts=[
    'Dein Märchenschloss wächst! Hier beginnt dein Abenteuer!',
    'Rapunzel schaut aus dem Turm. Welche Geschichte wartet auf dich?',
    'Eine Katze auf der Mauer! Sie hält Ausschau nach neuen Abenteuern.',
    'Ein Ritter reitet herbei. Wie geht die Geschichte weiter?',
    'Das Schlosstor öffnet sich! Jetzt wird es spannend!',
    'Der Ritter reitet in das Schloss. Wer wird ihn erwarten? Hexe oder Rapunzel?',
    'Eine märchenhafte Befreiung. Die Geschichte ist zu Ende erzählt!'
  ];
  const length=levels.length;
  const level=count=>count>0?(count-1)%length:-1;
  const themes={
    sport:{singular:'Pokal',plural:'Pokale',messages:texts},
    freizeit:{singular:'Rucksack',plural:'Rucksäcke',messages:freizeitTexts},
    maerchen:{singular:'Schloss',plural:'Schlösser',messages:maerchenTexts}
  };
  const restore=(value,finished=false)=>({count:Number.isSafeInteger(value?.count)&&value.count>=0?value.count:0,credited:finished||value?.credited===true});
  const complete=value=>value.credited?value:{count:Math.min(Number.MAX_SAFE_INTEGER,value.count+1),credited:true};
  const status=(count,theme='sport')=>{
    const {singular,plural}=themes[theme];
    const completed=Math.floor(count/length);
    const stage=count%length;
    const collection=completed? `Du hast schon ${completed} ${completed===1?singular:plural} vollständig aufgebaut.` : '';
    if(count===0) return `Nach dem ersten Spiel beginnt dein ${singular} zu wachsen.`;
    if(stage===0) return collection+' Nun geht es von vorne los.';
    return `Bildstufe ${stage} von ${length}.`+(collection?' '+collection:'');
  };
  const message=(count,theme='sport')=>themes[theme].messages[level(count)] ?? '';
  const unlocked=(before,after)=>after>before;
  function image(count,theme){
    const stage=level(count)+1;
    if(!stage) return null;
    const picture=Math.floor((count-1)/length);
    const img=document.createElement('img');
    img.className='sport-trophy';
    img.src=root.LeseImagePath(`./pokal-${theme}-${stage}.png`);
    img.dataset.trophyStage=String(stage);
    img.alt=`${themes[theme].singular} ${picture+1}, Bildstufe ${stage} von ${length}`;
    if(picture && theme!=='maerchen') img.style.filter=`hue-rotate(${(picture%360)*137%360}deg)`;
    return img;
  }
  function leave(destination){
    const category=destination==='dice';
    const target=category?'dice':'home';
    if(root.parent!==root){
      // Reuse the Web-App's game navigation when embedded on the home screen.
      const control=root.parent.document.getElementById(category?'previewBackCategory':'previewBackHome');
      if(control){control.click();return;}
    }
    root.top.location.assign(new URL('./home.html'+(target==='dice'?'#dice':''),root.location.href).href);
  }
  function reveal(count,theme,returnFocus){
    const dialog=document.createElement('dialog');
    dialog.className='trophy-dialog';
    dialog.setAttribute('aria-label',`Dein ${themes[theme].singular}`);
    Object.assign(dialog.style,{width:'min(96vw, 68rem)',maxWidth:'96vw',maxHeight:'96dvh',boxSizing:'border-box'});
    const heading=document.createElement('h2');
    heading.textContent=`Dein ${themes[theme].singular}`;
    const stage=document.createElement('div');
    stage.style.display='grid';
    const previous=image(count-1,theme);
    const next=image(count,theme);
    const artwork=previous?[previous,next]:[next];
    for(const picture of artwork){
      Object.assign(picture.style,{gridArea:'1 / 1',width:'100%',height:'min(65dvh, 56rem)',margin:0});
      stage.append(picture);
    }
    if(previous){
      previous.alt='';
      next.style.opacity='0';
    }
    const feedback=document.createElement('p');
    feedback.textContent=[message(count,theme),status(count,theme)].join(' ');
    const close=document.createElement('button');
    close.type='button';
    close.textContent='Weiter';
    close.style.minHeight='44px';
    close.onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>{dialog.remove();returnFocus?.focus();},{once:true});
    dialog.append(heading,stage,feedback,close);
    document.body.append(dialog);
    dialog.showModal();
    if(!previous) return;
    Promise.allSettled(artwork.map(picture=>picture.decode())).then(()=>{
      if(!dialog.open) return;
      if(root.matchMedia('(prefers-reduced-motion: reduce)').matches){
        previous.hidden=true;
        next.style.opacity='1';
        return;
      }
      const timing={delay:850,duration:800,easing:'ease-in-out',fill:'forwards'};
      previous.animate([{opacity:1},{opacity:0}],timing);
      next.animate([{opacity:0},{opacity:1}],timing);
    });
  }
  root.DiceRewards={levels,level,restore,complete,status,message,unlocked,image,reveal,leave};
})(globalThis);

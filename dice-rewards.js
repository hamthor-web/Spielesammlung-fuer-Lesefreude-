(function(root){
  const levels=[1,3,7,12,18,25,32];
  const texts=[
    'Dein erster Preis! Weiter so!',
    'Ein Stern für dich! Du bleibst dran!',
    'Zwei Sterne leuchten für dich! Toll gemacht!',
    'Ein goldener Kranz für deinen Pokal! Du hast viel geschafft!',
    'Luftballons für dich! Wir feiern deinen Spieleifer!',
    'Dein Pokal ist reich gefüllt! Du bist mit Freude dabei!',
    'Konfetti für dich! Du hast alle sieben Pokale gesammelt!'
  ];
  const freizeitTexts=[
    'Dein erster Rucksack! Auf ins nächste Abenteuer!',
    'Ein Schluck Wasser – und der Weg wird wieder leicht.',
    'Ein Apfel für unterwegs! Toll gemacht!',
    'Ein Teddy kommt mit! Gemeinsam macht es Spaß!',
    'Schuhe für neue Abenteuer! Du bleibst dran!',
    'Eine Krone für deinen Teddy! Du hast viel geschafft!',
    'Zuckerwatte für dich! Dein Abenteuer-Rucksack ist komplett!'
  ];
  const maerchenTexts=[
    'Dein erstes Märchenschloss! Hier beginnt dein Abenteuer!',
    'Rapunzel schaut aus dem Turm. Welche Geschichte wartet auf dich?',
    'Eine Katze auf der Mauer! Sie hält Ausschau nach neuen Abenteuern.',
    'Ein Ritter reitet herbei. Wie geht die Geschichte weiter?',
    'Das Schlosstor öffnet sich! Jetzt wird es spannend!',
    'Der Ritter reitet in das Schloss. Wer wird ihn erwarten? Hexe oder Rapunzel?',
    'Eine märchenhafte Befreiung. Die Geschichte ist zu Ende erzählt!'
  ];
  const level=count=>levels.reduce((result,n,i)=>count>=n?i:result,-1);
  const restore=(value,finished=false)=>({count:Number.isSafeInteger(value?.count)&&value.count>=0?value.count:0,credited:finished||value?.credited===true});
  const complete=value=>value.credited?value:{count:Math.min(Number.MAX_SAFE_INTEGER,value.count+1),credited:true};
  const status=(count,theme="sport")=>{const next=levels.find(n=>n>count);return `${count} ${count===1?'Spiel':'Spiele'} abgeschlossen.${next?` Noch ${next-count} bis ${theme!=="sport"?"zur nächsten Belohnung":"zum nächsten Pokal"}!`:(theme!=="sport"?' Alle Belohnungen gehören dir. Viel Spaß beim Weiterspielen!':' Alle Pokale gehören dir. Viel Spaß beim Weiterspielen!')}`};
  const message=(count,theme="sport")=>levels.includes(count)?(theme==="maerchen"?maerchenTexts:theme==="freizeit"?freizeitTexts:texts)[level(count)]:'Gemeinsam geschafft! Toll gespielt!';
  const unlocked=(before,after)=>after>before&&levels.includes(after);
  root.DiceRewards={levels,level,restore,complete,status,message,unlocked};
})(globalThis);

(() => {
  const frameWidth = 224;
  const frameHeight = 176;
  const framesPerRow = 3;
  const frameCount = 9;
  const frameDuration = 180;

  function mount(board, retouchSource, later) {
    const retouch = new Image();
    retouch.id = 'owlRetouch';
    retouch.alt = '';

    const owl = document.createElement('canvas');
    owl.id = 'owlFigure';
    owl.width = frameWidth;
    owl.height = frameHeight;
    owl.setAttribute('aria-hidden', 'true');
    board.append(retouch, owl);

    const context = owl.getContext('2d');
    const atlas = new Image();
    retouch.src = retouchSource;
    atlas.src = './assets/eule-bildfolge.webp';

    let ready = false;
    function drawFrame(frame) {
      context.clearRect(0, 0, frameWidth, frameHeight);
      context.drawImage(atlas, (frame % framesPerRow) * frameWidth,
        Math.floor(frame / framesPerRow) * frameHeight, frameWidth, frameHeight,
        0, 0, frameWidth, frameHeight);
      owl.dataset.frame = frame;
    }

    Promise.all([retouch.decode(), atlas.decode()]).then(() => {
      if (!context) return;
      drawFrame(0);
      ready = true;
      board.classList.add('owlReady');
    }).catch(() => {
      // Keep the original board visible if the animation cannot load.
    });

    let playback = 0;
    function reset() {
      playback += 1;
      if (ready) drawFrame(0);
    }

    function play(done) {
      if (!ready) {
        later(() => done?.(), 900);
        return;
      }
      const current = ++playback;
      function advance(frame) {
        if (current !== playback) return;
        if (frame === frameCount) {
          reset();
          done?.();
          return;
        }
        drawFrame(frame);
        later(() => advance(frame + 1), frameDuration);
      }
      advance(0);
    }

    return { play, reset };
  }

  window.DiceOwlAnimation = { mount };
})();

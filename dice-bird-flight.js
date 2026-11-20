(() => {
  const frames = [{"left":45,"top":143,"right":251,"bottom":332,"width":206,"height":189,"duration":400,"sx":0,"sy":0,"visible":true},{"left":57,"top":134,"right":266,"bottom":332,"width":209,"height":198,"duration":280,"sx":297,"sy":0,"visible":true},{"left":69,"top":134,"right":278,"bottom":332,"width":209,"height":198,"duration":280,"sx":594,"sy":0,"visible":true},{"left":81,"top":123,"right":307,"bottom":332,"width":226,"height":209,"duration":160,"sx":891,"sy":0,"visible":true},{"left":93,"top":107,"right":338,"bottom":322,"width":245,"height":215,"duration":140,"sx":0,"sy":267,"visible":true},{"left":105,"top":97,"right":364,"bottom":312,"width":259,"height":215,"duration":130,"sx":297,"sy":267,"visible":true},{"left":117,"top":92,"right":362,"bottom":302,"width":245,"height":210,"duration":120,"sx":594,"sy":267,"visible":true},{"left":105,"top":115,"right":400,"bottom":344,"width":295,"height":229,"duration":110,"sx":891,"sy":267,"visible":true},{"left":157,"top":111,"right":452,"bottom":361,"width":295,"height":250,"duration":110,"sx":0,"sy":534,"visible":true},{"left":210,"top":108,"right":485,"bottom":331,"width":275,"height":223,"duration":110,"sx":297,"sy":534,"visible":true},{"left":262,"top":105,"right":550,"bottom":351,"width":288,"height":246,"duration":110,"sx":594,"sy":534,"visible":true},{"left":315,"top":102,"right":601,"bottom":308,"width":286,"height":206,"duration":110,"sx":891,"sy":534,"visible":true},{"left":368,"top":100,"right":636,"bottom":298,"width":268,"height":198,"duration":110,"sx":0,"sy":801,"visible":true},{"left":420,"top":98,"right":665,"bottom":308,"width":245,"height":210,"duration":110,"sx":297,"sy":801,"visible":true},{"left":473,"top":96,"right":768,"bottom":325,"width":295,"height":229,"duration":110,"sx":594,"sy":801,"visible":true},{"left":526,"top":95,"right":823,"bottom":362,"width":297,"height":267,"duration":110,"sx":891,"sy":801,"visible":true},{"left":578,"top":95,"right":853,"bottom":318,"width":275,"height":223,"duration":110,"sx":0,"sy":1068,"visible":true},{"left":631,"top":95,"right":900,"bottom":341,"width":269,"height":246,"duration":110,"sx":297,"sy":1068,"visible":true},{"left":683,"top":95,"right":900,"bottom":301,"width":217,"height":206,"duration":110,"sx":594,"sy":1068,"visible":true},{"left":736,"top":96,"right":900,"bottom":294,"width":164,"height":198,"duration":110,"sx":891,"sy":1068,"visible":true},{"left":789,"top":98,"right":900,"bottom":308,"width":111,"height":210,"duration":110,"sx":0,"sy":1335,"visible":true},{"left":841,"top":224,"right":900,"bottom":329,"width":59,"height":105,"duration":110,"sx":297,"sy":1335,"visible":true},{"left":894,"top":288,"right":900,"bottom":299,"width":6,"height":11,"duration":110,"sx":594,"sy":1335,"visible":true}];
  const startFrame = frames.find(frame => frame.visible);
  const midpoint = (low, high) => (low + high) / 2;
  const startX = midpoint(startFrame.left, startFrame.right);
  const startY = midpoint(startFrame.top, startFrame.bottom);
  const visibleFrames = frames.filter(frame => frame.visible);
  const furthestFrame = visibleFrames.reduce((a, b) =>
    Math.abs(midpoint(b.left, b.right) - startX) > Math.abs(midpoint(a.left, a.right) - startX) ? b : a);
  const direction = midpoint(furthestFrame.left, furthestFrame.right) > startX ? -1 : 1;
  const maxTravel = Math.max(1, ...visibleFrames.map(frame => Math.abs(midpoint(frame.left, frame.right) - startX)));
  const duration = frames.reduce((elapsed, frame) => elapsed + frame.duration, 0);

  function mount(board, x, y) {
    const perch = board.querySelector('.dice-bird-perch');
    const canvas = board.querySelector('.dice-bird-flight');
    const context = canvas.getContext('2d');
    const atlas = new Image();
    let animation = 0;
    let completion = 0;
    let resting = true;
    let ready = false;

    function drawFrame(frame) {
      const width = Math.round(board.clientWidth * devicePixelRatio);
      const height = Math.round(board.clientHeight * devicePixelRatio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.clearRect(0, 0, width, height);
      if (!frame.visible) return;
      const size = width * .045 / startFrame.width;
      const travel = width * (x + .012) / maxTravel;
      const frameX = x * width + direction * (midpoint(frame.left, frame.right) - startX) * travel;
      const frameY = y * height + (midpoint(frame.top, frame.bottom) - startY) * size;
      context.save();
      context.translate(frameX, frameY);
      context.scale(direction, 1);
      context.drawImage(atlas, frame.sx, frame.sy, frame.width, frame.height,
        -frame.width * size / 2, -frame.height * size / 2, frame.width * size, frame.height * size);
      context.restore();
    }

    function drawRestingBird() {
      if (ready && resting) drawFrame(startFrame);
    }

    function prepare() {
      if (!context || !perch.naturalWidth || !atlas.naturalWidth) return;
      ready = true;
      perch.hidden = false;
      drawRestingBird();
    }

    perch.addEventListener('load', prepare);
    atlas.addEventListener('load', prepare);
    atlas.src = './assets/bird-flight-atlas.png';
    new ResizeObserver(drawRestingBird).observe(board);

    function stop() {
      cancelAnimationFrame(animation);
      clearTimeout(completion);
      animation = 0;
      completion = 0;
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }

    function reset() {
      stop();
      resting = true;
      drawRestingBird();
    }

    function play(done) {
      if (!ready) {
        done?.();
        return;
      }
      if (completion && !done) return;
      stop();
      resting = false;
      const started = performance.now();
      drawFrame(startFrame);
      function tick(now) {
        let elapsed = now - started;
        if (elapsed >= duration) return;
        for (const frame of frames) {
          if (elapsed < frame.duration) {
            drawFrame(frame);
            break;
          }
          elapsed -= frame.duration;
        }
        animation = requestAnimationFrame(tick);
      }
      animation = requestAnimationFrame(tick);
      completion = setTimeout(() => {
        stop();
        done?.();
      }, duration);
    }

    return { play, reset, get flying() { return Boolean(completion); } };
  }

  window.DiceBirdFlight = { mount };
})();

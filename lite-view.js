// Legacy game markup may contain a demo notice; never display it in the paid app.
addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.lite-note,[data-lite-note]').forEach(el=>el.remove()));

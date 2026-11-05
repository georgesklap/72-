// Add <script src="./pwa-register.js" defer></script> before </body> in index.html
(function () {
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link'); link.rel = 'manifest'; link.href = './manifest.webmanifest'; document.head.appendChild(link);
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', {scope:'./'}).catch(console.error));
  }
})();

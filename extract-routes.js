const app = require('./src/app');

function printRoutes(app) {
  const routes = [];

  function processLayer(layer, prefix = '') {
    if (layer.route) {
      // It's a route
      for (const method in layer.route.methods) {
        if (layer.route.methods[method]) {
          routes.push({
            method: method.toUpperCase(),
            path: prefix + (layer.route.path === '/' ? '' : layer.route.path)
          });
        }
      }
    } else if (layer.name === 'router' && layer.handle.stack) {
      // It's a nested router
      // Try to figure out the path
      let routerPath = '';
      if (layer.regexp.source !== '^\\/?$') {
         // This is a hacky way to extract the path from the regexp
         const match = layer.regexp.source.match(/\^\/\^\\\/\?\(\?=\\\/\|\$\)\|\^\(\\\/\(\?\:\(\[\^\\\/\]\+\?\)\)\)\\\/\\\?\(\?=\\\/\|\$\)/);
         // Express regexes are complex. The best way is to extract from regexp, but let's try a simpler approach.
      }
      
      // better way: layer.regexp usually maps to the mounted path
      let match = layer.regexp.toString().match(/^\/\^\\\/(.*?)\\\/\?\(\?=\\\/\|\$\)/i);
      if (match && match[1]) {
          routerPath = '/' + match[1].replace(/\\\//g, '/');
      }

      layer.handle.stack.forEach(stackLayer => {
        processLayer(stackLayer, prefix + routerPath);
      });
    }
  }

  app._router.stack.forEach(layer => processLayer(layer));
  return routes;
}

const allRoutes = printRoutes(app);
const fs = require('fs');
fs.writeFileSync('routes-dump.json', JSON.stringify(allRoutes, null, 2));
console.log('Dumped routes to routes-dump.json');

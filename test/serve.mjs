import http from "http"; import fs from "fs"; import path from "path";
const root = new URL("../dist/", import.meta.url).pathname;
const TYPES = {".html":"text/html",".js":"application/javascript",".css":"text/css",".json":"application/json",".woff2":"font/woff2",".svg":"image/svg+xml",".png":"image/png",".webmanifest":"application/manifest+json",".txt":"text/plain"};
http.createServer((q,s)=>{
  let f = path.join(root, decodeURIComponent(q.url.split("?")[0].split("#")[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(root, "index.html");
  s.writeHead(200, {"Content-Type": TYPES[path.extname(f)] || "text/plain"});
  fs.createReadStream(f).pipe(s);
}).listen(8123, () => console.log("serving dist on 8123"));

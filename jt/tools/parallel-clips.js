// Create disjoint Chatterbox synthesis jobs. Keeps script and phonetics identical to voice.js.
const fs = require("fs"), path = require("path");
const [ed, shardText, countText, dst] = process.argv.slice(2);
const shard = Number(shardText), count = Number(countText);
if (!ed || !Number.isInteger(shard) || !Number.isInteger(count) || count < 1 || shard < 0 || shard >= count || !dst) process.exit(2);
global.window = {};
require(path.join(__dirname, "..", "editions", ed + ".js"));
const E = window.EDITION;
const strip = s => s.join(" ").replace(/\*/g, "");
const phon = t => Object.entries(E.phonetic || {}).reduce((s, [a,b])=>s.split(a).join(b),t);
const clips = [{id:"hook",text:E.hookSay||strip(E.hook)}];
E.rubriques.forEach((r,i)=>r.subs.forEach((s,k)=>clips.push({id:`r${i}s${k}`,text:(r.say&&r.say[k])||strip(s)})));
clips.push({id:"question",text:E.questionSay||strip(E.question)});
clips.push({id:"subscribe",text:E.subscribeSay||strip(E.subscribe)});
fs.mkdirSync(dst,{recursive:true});
const jobs = clips.filter((c,i)=>i%count===shard).map(c=>({text:phon(c.text),out:path.join(dst,c.id+".wav"),seed:1930,exaggeration:0.55,cfg:0.5}));
fs.writeFileSync(path.join(dst,"jobs-"+shard+".json"),JSON.stringify(jobs));
console.log("Part",shard,"of",count,"clips",jobs.map(j=>j.out),"total",clips.length);

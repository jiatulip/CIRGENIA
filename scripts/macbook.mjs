import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));process.chdir(root);
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<13))throw Error('Install Node.js 22.13 or newer from https://nodejs.org/en/download/');
if(process.env.SITES_MANAGED_LINUX_CONTAINER==='1')throw Error('This launcher is for your own computer. Use the managed preview in ChatGPT.');
function run(command,args,input){const r=spawnSync(command,args,{cwd:root,stdio:input?['pipe','inherit','inherit']:'inherit',input});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1)}
mkdirSync('.sites-runtime',{recursive:true});
writeFileSync('.sites-runtime/execution-profile.json',JSON.stringify({executionProfile:'portable'}));
if(!existsSync('node_modules/vinext')){console.log('Installing the project dependencies from the npm registry…');run('npx',['--yes','pnpm@11.25.0','install','--frozen-lockfile'])}
if(!existsSync('dist/server/wrangler.json')||process.argv.includes('--setup'))run(process.execPath,['scripts/run-framework.mjs','build']);
const config=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
config.main=path.join(root,'dist/server/index.js');
config.assets={...config.assets,directory:path.join(root,'dist/client')};
for(const d of config.d1_databases||[])d.migrations_dir=path.join(root,'drizzle');
writeFileSync('.sites-runtime/wrangler.local.json',JSON.stringify(config,null,2));
run(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local','--config','.sites-runtime/wrangler.local.json','--persist-to','.wrangler/state'],'y\n');
if(!process.argv.includes('--setup-only')){console.log('\nCIRGENIA local website: http://localhost:5173\nOwner studio: http://localhost:5173/studio\nKeep this window open. Press Control+C to stop.\n');run(process.execPath,['scripts/run-framework.mjs','dev','--hostname','127.0.0.1'])}

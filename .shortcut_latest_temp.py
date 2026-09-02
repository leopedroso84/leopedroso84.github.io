import json,urllib.request,plistlib,hashlib,os
ids=['1f1656fb583d4363a68b0adf518ca287','994ba242ad604eedb136dc89355b9af8']
os.makedirs('out',exist_ok=True)
def get(u):
 q=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'})
 with urllib.request.urlopen(q,timeout=30) as r:return r.read()
for k,sid in enumerate(ids):
 m=json.loads(get('https://www.icloud.com/shortcuts/api/records/'+sid)); f=m['fields']; raw=get(f['shortcut']['value']['downloadURL']); open(f'out/{k}-raw.plist','wb').write(raw)
 if k==1:
  sv=f.get('signedShortcut',{}).get('value'); signed=get(sv['downloadURL']) if isinstance(sv,dict) and sv.get('downloadURL') else raw; open('out/Rotina.shortcut','wb').write(signed)
  print('NAME',f['name']['value'],'SIGNING',f.get('signingStatus',{}).get('value'),'RAW_SHA',hashlib.sha256(raw).hexdigest(),'SIGNED_SHA',hashlib.sha256(signed).hexdigest())
 o=plistlib.loads(raw); print('ACTIONS',k,len(o.get('WFWorkflowActions',[])),'TRIGGERS',len(o.get('WFWorkflowTriggers',[])))
 if k==1:
  for i,a in enumerate(o.get('WFWorkflowActions',[])[194:],195):print('TAIL',i,a.get('WFWorkflowActionIdentifier',''),repr(a.get('WFWorkflowActionParameters',{})))

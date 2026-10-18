import zipfile, re, html, json, sys

SECMAP = {1:'technical', 2:'applied', 3:'risk', 4:'case'}

def paras(path):
    x = zipfile.ZipFile(path).read('word/document.xml').decode('utf-8')
    x = re.sub(r'<w:tab[^>]*/>', ' ', x)
    out = []
    for m in re.finditer(r'<w:p[ >].*?</w:p>|<w:p[^>]*/>', x, re.S):
        t = html.unescape(re.sub(r'<[^>]+>', '', m.group(0)))
        t = t.replace(' ', ' ')
        t = re.sub(r'\s+', ' ', t).strip()
        if t:
            out.append(t)
    return out

ANS = re.compile(r'^([A-D])[\.\)]?$')
OPT = re.compile(r'([A-D])\)\s*')
NUM = re.compile(r'^\d+\s*[\.\)]\s*')

def parse(path):
    ps = paras(path)
    idx = [i for i, p in enumerate(ps) if re.match(r'^Section\s+\d+\s*:', p)]
    items = []
    scenarios = {}
    leftovers = []
    for k, start in enumerate(idx):
        end = idx[k+1] if k+1 < len(idx) else len(ps)
        sec = SECMAP[int(re.match(r'^Section\s+(\d+)', ps[start]).group(1))]
        body = ps[start+1:end]
        if sec == 'case':
            # preamble runs until the first paragraph that starts a numbered question
            cut = next((i for i, p in enumerate(body) if NUM.match(p)), 0)
            pre = [p for p in body[:cut] if p.lower() != 'the case']
            scenarios['case'] = pre
            body = body[cut:]
        buf = []
        for p in body:
            m = ANS.match(p)
            if m:
                it = build(' '.join(buf), m.group(1), sec)
                if it:
                    items.append(it)
                else:
                    leftovers.append(('unbuilt', sec, ' '.join(buf)[:160]))
                buf = []
            else:
                buf.append(p)
        if ' '.join(buf).strip():
            leftovers.append(('no-answer-key', sec, ' '.join(buf)[:200]))
    return items, scenarios, leftovers

def build(text, ans, sec):
    text = text.strip()
    ms = list(OPT.finditer(text))
    letters = [m.group(1) for m in ms]
    # keep only the first clean A,B,C,D run
    repaired = False
    try:
        a = letters.index('A')
    except ValueError:
        return None
    run = [ms[a]]
    want = ['B', 'C', 'D']
    i = a + 1
    for w in want:
        while i < len(ms) and ms[i].group(1) != w:
            i += 1
        if i >= len(ms):
            run = None
            break
        run.append(ms[i]); i += 1
    if run is None:
        # Source mislabels an option letter (e.g. A, C, C, D). Relabel the four
        # markers by document order and record the repair.
        tail = ms[a:]
        if len(tail) != 4:
            return None
        run = tail
        repaired = True
    q = text[:run[0].start()].strip()
    q = NUM.sub('', q).strip()
    opts = {}
    for j, m in enumerate(run):
        s = m.end()
        e = run[j+1].start() if j + 1 < len(run) else len(text)
        key = 'ABCD'[j] if repaired else m.group(1)
        opts[key] = re.sub(r'\s+', ' ', text[s:e]).strip().rstrip(';').strip()
    if not q or any(not v for v in opts.values()):
        return None
    it = {'section': sec, 'q': q, 'options': opts, 'answer': ans}
    if repaired:
        it['repaired'] = True
    return it

out = {}
meta = {}
for form, path in [('A', sys.argv[1]), ('B', sys.argv[2])]:
    items, scen, left = parse(path)
    out[form] = items
    meta[form] = {'scenario': scen, 'leftovers': left}
    from collections import Counter
    print(form, len(items), Counter(i['section'] for i in items), file=sys.stderr)
    for l in left:
        print('   LEFTOVER', form, l[0], l[1], l[2][:120], file=sys.stderr)

json.dump({'items': out, 'meta': meta}, open(sys.argv[3], 'w'), indent=1)

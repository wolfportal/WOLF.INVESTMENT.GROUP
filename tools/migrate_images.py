#!/usr/bin/env python3
"""Download every image the site loads from imgbb / postimg into img/ext/
and point the pages at the local copies, so the site no longer depends on
those services. Images that cannot be downloaded (or come back as an
"unavailable" placeholder) keep their old link and are listed in the report."""
import glob, hashlib, io, json, os, re, sys, time, urllib.request
from collections import defaultdict
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'img', 'ext')
URL_RE = re.compile(r'https://i\.(?:ibb\.co|postimg\.cc)/[^"\'\s)<>\\]+')
FILES = sorted(glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, '*.js')))
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'


def fetch(url):
    last = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Referer': 'https://wolfportal.github.io/'})
            with urllib.request.urlopen(req, timeout=45) as r:
                ctype = r.headers.get('Content-Type', '')
                data = r.read()
            if not ctype.startswith('image/'):
                raise ValueError('not an image: ' + ctype)
            Image.open(io.BytesIO(data)).verify()
            return data
        except Exception as e:  # retry with backoff
            last = e
            time.sleep(2 * (attempt + 1))
    raise last


def local_name(url):
    parts = url.split('/')
    key, fname = parts[3], parts[-1]
    base, ext = os.path.splitext(fname)
    base = re.sub(r'[^A-Za-z0-9._-]+', '-', base)[:60] or 'img'
    return f'{key}-{base}', ext.lower()


def save(data, stem):
    """Large photos -> JPEG (max 2200px), images with real transparency stay PNG."""
    im = Image.open(io.BytesIO(data))
    im.load()
    alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    if alpha:
        a = im.convert('RGBA').getchannel('A')
        alpha = a.getextrema()[0] < 250
    if im.format == 'GIF' or alpha:
        path = stem + ('.gif' if im.format == 'GIF' else '.png')
        if im.format != 'GIF' and len(data) > 600_000:
            im.thumbnail((2200, 2200))
            im.save(path, optimize=True)
        else:
            open(path, 'wb').write(data)
        return path
    im = im.convert('RGB')
    if max(im.size) > 2200:
        im.thumbnail((2200, 2200))
    path = stem + '.jpg'
    if im.format == 'JPEG' and len(data) < 700_000 and max(Image.open(io.BytesIO(data)).size) <= 2200:
        open(path, 'wb').write(data)
    else:
        im.save(path, 'JPEG', quality=85, optimize=True, progressive=True)
    return path


def main():
    os.makedirs(OUT, exist_ok=True)
    texts = {f: open(f, encoding='utf-8').read() for f in FILES}
    urls = sorted({u for t in texts.values() for u in URL_RE.findall(t)})
    print(f'{len(urls)} external images')
    got, failed = {}, {}
    from concurrent.futures import ThreadPoolExecutor
    def one(u):
        try:
            return u, fetch(u), None
        except Exception as e:
            return u, None, str(e)[:200]
    with ThreadPoolExecutor(3) as ex:
        for i, (u, d, err) in enumerate(ex.map(one, urls), 1):
            if d is None:
                failed[u] = err
            else:
                got[u] = d
            print(f'[{i}/{len(urls)}] {"ok  " if d else "FAIL"} {u} {err or ""}', flush=True)
    # the same bytes behind many different links = an "unavailable" placeholder, not a real photo
    by_hash = defaultdict(list)
    for u, d in got.items():
        by_hash[hashlib.sha256(d).hexdigest()].append(u)
    for h, us in by_hash.items():
        if len(us) >= 3:
            for u in us:
                failed[u] = 'placeholder (same image returned for %d links)' % len(us)
                got.pop(u, None)
    mapping = {}
    for u, d in got.items():
        stem, _ = local_name(u)
        path = save(d, os.path.join(OUT, stem))
        mapping[u] = os.path.relpath(path, ROOT).replace(os.sep, '/')
    changed = []
    for f, t in texts.items():
        n = t
        for u, p in mapping.items():
            n = n.replace(u, p)
        if n != t:
            open(f, 'w', encoding='utf-8').write(n)
            changed.append(os.path.basename(f))
    report = {'total': len(urls), 'saved': len(mapping), 'failed': failed, 'files_changed': changed}
    json.dump(report, open(os.path.join(OUT, '_report.json'), 'w'), indent=1, ensure_ascii=False)
    size = sum(os.path.getsize(os.path.join(OUT, x)) for x in os.listdir(OUT))
    print(f'saved {len(mapping)}/{len(urls)}  failed {len(failed)}  size {size/1e6:.1f} MB  files {changed}')


if __name__ == '__main__':
    sys.exit(main())
# run 3

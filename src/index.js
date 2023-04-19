import { parseHTML } from 'linkedom';
import iconv from '../iconv-lite/lib/index.js';
// import iconv from 'iconv-lite';

export default {
  async fetch(req, env, ctx) {
    const res = await getThread(new URL(req.url));

    const ab = await res.arrayBuffer();
    const decoder = new TextDecoder('sjis');
    const body = decoder.decode(ab);

    if (body.includes('Good bye 011')) {
      console.error(`Error: status code ${res.status}`)
      return new Response('HTMLの取得に失敗しました', { status: res.status })
    }

    const {document} = parseHTML(body);
    const dat = parseThread(document);

    const encoded = iconv.encode(dat, 'SJIS')

    return new Response(encoded, {
      headers: { 'content-type': 'text/plain; charset=shift_jis' }
    })
  }
}

async function getThread(url) {
  const path = url.pathname
    .split(/[\/\.]/)
    .filter(x => !x.match(/^\s*$|dat|test|read|cgi/));

  const board = path[0];
  const tid = path[1];

  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0';
  const res = await fetch(`https://5ch.net/${board}/${tid}/`, {
    headers: { 'user-agent': ua }
  })

  return res
}

function parseThread(document) {
  let title = document.querySelector('.title').textContent;
  const posts = document.querySelectorAll('.thread .post');
  const result = Array.from(posts).map((post, index) => {
    const get = selector => post.querySelector(selector);

    title = (index === 0) 
      ? title 
      : '';
    const name  = get('.name')?.textContent ?? '';
    const email = get('.name a')?.href.replace('mailto:', '') ?? '';
    const date  = get('.date')?.textContent ?? '';
    const uid   = get('.uid')?.textContent ?? '';
    let be = ''
    if (get('.be')) {
      const be = `BE:${get('.be a').href.replace('http://be.5ch.net/user/', '')}-${get('.be').textContent}`
    }
    const message = get('.message .escaped')?.innerHTML ?? '';

    return `${name}<>${email}<>${date} ${uid} ${be}<>${message}<>${title}`;
  }).join('\n');
  return result;
}


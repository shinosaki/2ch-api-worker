import iconv from '../iconv-lite/lib/index.js';

const getServerName = async (board, tid) => {
  const data = {
    poverty: {
      '0-': 'greta',
    },
  };

  if (!data[board]) {
    return await fetch(`https://itest.5ch.net/subbacks/${board}.json`)
      .then(r=>r.json())
      .then(j=>j.threads[0][2]);
  }

  const ranges = Object.keys(data[board]).map(v=>{
    const [start, end] = v.split('-');
    return { start, end };
  });

  const range = ranges.find(r=>r.start <= tid && (r.end || tid) >= tid);

  return data[board][`${range.start}-${range.end}`];
};

const itestAPI = async (board, tid) => {

  const subdomain = await getServerName(board, tid);
  const url = `https://itest.5ch.net/public/newapi/client.php?subdomain=${subdomain}&board=${board}&dat=${tid}`;
  const res = await fetch(url)
  return res.json();
};

const apiToDat = (json) => {
  return json.comments.map((c, i)=>{
    const title = (i === 0) ? json.thread[5] : '';
    const name  = c[1];
    const email = c[2];
    const date  = c[3];
    const uid   = c[4];
    const be    = c[5];
    const body  = c[6];
    return `${name}<>${email}<>${date} ID:${uid} BE:${be}<>${body}<>${title}`;
  }).join('\n');
}

export default {
  async fetch(req, env, ctx) {

    const url = new URL(req.url);
    const charset = url.searchParams.get('charset')?.toLowerCase();

    const path = url.pathname.split('/');
    if (path[1] !== 'test' && path[2] !== 'dat') {
      return new Response('Invalid request');
    }

    const { board, tid } = (url.pathname.split('/')[1] === 'test')
      ? url.pathname.match(/read\.cgi\/(?<board>\w+)\/(?<tid>\d+)/).groups
      : url.pathname.match(/(?<board>\w+)\/dat\/(?<tid>\d+)/).groups;

    const json = await itestAPI(board, tid);

    const dat = (charset === 'utf-8')
      ? apiToDat(json)
      : iconv.encode(apiToDat(json), 'SJIS');


    return new Response(dat, {
      headers: { 'content-type': 'text/plain; charset=shift_jis' }
    });
  }
}

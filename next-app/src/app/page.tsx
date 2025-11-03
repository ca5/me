import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

type WorkItem = {
  title: string;
  description: string;
  type: 'soundcloud' | 'youtube';
  src: string;
};

export default function Home() {
  const worksPath = path.join(process.cwd(), 'src', 'app', 'works.json');
  let worksData: WorkItem[] = [];

  try {
    const fileContents = fs.readFileSync(worksPath, 'utf8');
    worksData = JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading or parsing works.json:', error);
  }

  return (
    <>
      <div className="p-5 mb-4 mainvisual">
        <div className="container">
          <div className="profile">
            <div className="logo_area">
              <p className="logo"><img src="/img/logo.svg" alt="logo" /></p>
            </div>
            <div className="name_area">
              <h1>Ca5</h1>
              <h2>Musician,Performer</h2>
            </div>
            <div className="text_area">
              <p>矩形波や三角波などのシンプルな音源を特徴とする楽曲を制作し、<br/>
                自身が運営に携わるインターネットレーベル ESC TRAX にて展開中。</p>
              <p>iPhoneやゲームコントローラなど、ライブで一般的ではない機材を用いた独自のパフォーマンスを得意とする。</p>
              <p>エレクトロニカユニット 「ふぷほ」の技術担当。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h2>Works</h2>
        <div className="row">
          {worksData.map((item, index) => (
            <div className="col-md-4 col-xs-12" key={index}>
              <h3>{item.title}</h3>
              <h4>{item.description}</h4>
              <iframe
                width="100%"
                height={item.type === 'soundcloud' ? '150' : ''}
                scrolling="no"
                frameBorder="no"
                src={item.src}
                allowFullScreen={item.type === 'youtube'}
              />
            </div>
          ))}
          <div className="col-md-12 col-xs-12">
            <p className="more">
              <Link className="btn btn-default" href="/discography" role="button">
                作品リスト &raquo;
              </Link>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-xs-12 contact" id="contact">
            <h2>Contact</h2>
            <p>
              LIVEのブッキング等お待ちしています。お問い合わせは下記よりお願いします。
              <br />
              &raquo;&nbsp;
              <a href="https://x.com/Ca5">X</a>
            </p>

            <p>
              その他、最新情報はXをご覧ください。
              <br />
              &raquo;&nbsp;
              <a href="https://x.com/Ca5">X</a>
            </p>

            <ul>
              <li>
                <a href="http://blog.ca5.me/">
                  <img src="/img/ic_blog.png" width="50" alt="blog" />
                </a>
              </li>
              <li>
                <a href="https://soundcloud.com/ca54makske">
                  <img src="/img/ic_soundcloud.png" width="50" alt="soundcloud" />
                </a>
              </li>
              <li>
                <a href="https://x.com/Ca5">
                  <img src="/img/ic_twitter.png" width="50" alt="X" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
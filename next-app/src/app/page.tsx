import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getWorks, WorkItem } from './lib/spreadsheet';

export default async function Home() {
  let worksData: WorkItem[] = [];

  try {
    worksData = await getWorks();
  } catch (error) {
    console.error('Error fetching works data:', error);
  }

  return (
    <>
      <div className="p-5 mb-4 mainvisual">
        <div className="container">
          <div className="profile">
            <div className="logo_area">
              <p className="logo"><Image src="/img/logo.svg" alt="logo" width={90} height={90} /></p>
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
                  <Image src="/img/ic_blog.png" alt="blog" width={50} height={50} />
                </a>
              </li>
              <li>
                <a href="https://soundcloud.com/ca54makske">
                  <Image src="/img/ic_soundcloud.png" alt="soundcloud" width={50} height={50} />
                </a>
              </li>
              <li>
                <a href="https://x.com/Ca5">
                  <Image src="/img/ic_twitter.png" alt="X" width={50} height={50} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
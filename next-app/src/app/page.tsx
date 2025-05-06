import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="p-5 mb-4 mainvidual">
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
              <p>2001年頃よりインターネット上での楽曲公開を中心に活動中。</p>
              <p>
                DTMで完成されてしまっている楽曲を使っていかにライブをやるか考えるのが趣味で、iPadやarduinoなどのガジェットをコントローラーとする独自システムをmax/mspにて制作し、楽曲を再構築するスタイルでライブを行う。
              </p>
              <p>
                主にチップブレイクを軸に、チップチューンからナードコア寄りなマッシュアップも作るが、必ずどこかに矩形波や三角波が混ざるのが特徴。
                <br />
                最近はFamiTrackerやLSDJにも手を出し純粋なChiptuneにも挑戦中。
              </p>
              <p>2015年にebi1000, suesettと共にESC TRAXを立ち上げた。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h2>Works</h2>
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <h3>memory of the cartridge</h3>
            <h4>chipbreak</h4>
            <iframe
              width="100%"
              height="150"
              scrolling="no"
              frameBorder="no"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/82757708&color=ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false"
            />
          </div>
          <div className="col-md-4 col-xs-12">
            <h3>#50(LSDj)</h3>
            <h4>chiptune (LSDJ on GBASP)</h4>
            <iframe
              width="100%"
              height="150"
              scrolling="no"
              frameBorder="no"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/266304916&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            />
          </div>
          <div className="col-md-4 col-xs-12">
            <h3>come again(stutter star Mix)</h3>
            <h4>mashup/remix</h4>
            <iframe
              width="100%"
              height="150"
              scrolling="no"
              frameBorder="no"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/298962367&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            />
          </div>
          <div className="col-md-4 col-xs-12">
            <h3>BWV 539 (Ca5 remix)</h3>
            <h4>chipbreak/remix</h4>
            <iframe
              width="100%"
              height="150"
              scrolling="no"
              frameBorder="0"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/281985797&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            />
          </div>
          <div className="col-md-4 col-xs-12">
            <h3>Lo-Bit Freedom Ver.3</h3>
            <h4>LIVE play</h4>
            <iframe
              width="100%"
              src="https://www.youtube.com/embed/ptshtOFF-T8?start=5640&end=8950"
              frameBorder="0"
              allowFullScreen
            />
          </div>
          <div className="col-md-4 col-xs-12">
            <h3>Blockslicr</h3>
            <h4>LIVE system</h4>
            <iframe
              width="100%"
              src="https://www.youtube.com/embed/UtPN74eElZM"
              frameBorder="0"
              allowFullScreen
            />
          </div>
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
              <a href="https://twitter.com/Ca5">twitter</a>
            </p>

            <p>
              その他、最新情報はtwitterをご覧ください。
              <br />
              &raquo;&nbsp;
              <a href="https://twitter.com/Ca5">twitter</a>
            </p>

            <ul>
              <li>
                <a href="http://blog.ca5.me/">
                  <img src="./img/ic_blog.png" width="50" alt="blog" />
                </a>
              </li>
              <li>
                <a href="https://soundcloud.com/ca54makske">
                  <img src="./img/ic_soundcloud.png" width="50" alt="soundcloud" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/Ca5">
                  <img src="./img/ic_twitter.png" width="50" alt="twitter" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

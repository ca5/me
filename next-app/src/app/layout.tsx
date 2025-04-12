import React from 'react';
import Link from 'next/link';
import { ReactNode } from 'react';
import type { Metadata } from 'next'; // Metadataをインポート

// グローバルCSSをインポート (globals.css が src/app にある場合)
import './globals.css';

// Metadataオブジェクトを定義
export const metadata: Metadata = {
  // title.template を使うと、各ページで設定したタイトルと結合できる
  title: {
    template: '%s | Ca5 OFFICIAL SITE', // 例: "Discography | Ca5 OFFICIAL SITE"
    default: 'Ca5 OFFICIAL SITE', // ルートページ (src/app/page.tsx) のデフォルトタイトル
  },
  description: 'Ca5 Official Site。Ca5の作曲した作品やLIVE映像等を掲載しています。',
  // 他のメタデータ (og:* など) もここに追加できます
  metadataBase: new URL('http://localhost:3000'), // ★ デプロイ先のURLに合わせて変更してください
  openGraph: {
    title: 'Ca5 OFFICIAL SITE',
    siteName: 'Ca5 OFFICIAL SITE',
    type: 'website',
    url: 'http://localhost:3000', // ★ デプロイ先のURLに合わせて変更してください
    description: 'Ca5 OFFICIAL SITE。Ca5の作曲した作品やLIVE映像等を掲載しています。',
    // images: ['/og-image.png'], // 必要であればOGイメージのパスを追加
  },
  // viewport などもここで設定可能 (通常はNext.jsが適切に設定)
  // viewport: 'width=device-width, initial-scale=1',
  // favicon は public/favicon.ico があれば自動で認識されることが多い
  // icons: {
  //   icon: '/favicon.ico',
  // },
};

// ルートレイアウトコンポーネント
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja"> {/* 必要に応じて言語コードを修正 */}
      <head>
        {/* Bootstrap CSS の読み込み (public/css/bootstrap.css にある場合) */}
        {/* App Routerでは <head> 内に直接 <link> を書くことも可能 */}
        <link href="/css/bootstrap.css" rel="stylesheet" />
        {/* Google Fonts など外部CSSもここに記述可能 */}
      </head>
      <body> {/* bodyに共通クラスやフォントスタイルを適用 */}
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <p className="navbar-logo">Ca5.me</p>
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#navbar"
                aria-expanded="false"
                aria-controls="navbar"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  {/* legacyBehavior と <a> を削除し、クラス名を Link に移動 */}
                  <Link href="/discography" className="nav-border">
                    Discography
                  </Link>
                </li>
                <li>
                  <a href="https://twitter.com/Ca5" className="nav-border" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://soundcloud.com/ca54makske" target="_blank" rel="noopener noreferrer">Soundcloud</a>
                </li>
                <li>
                  <a href="http://blog.ca5.me/" target="_blank" rel="noopener noreferrer">Blog</a>
                </li>
                <li>
                  <a href="/#contact">Contact</a>
                  {/* もしトップページ以外からトップのContactへ飛ばす場合 */}
                  {/* <Link href="/#contact">Contact</Link> */}
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* children (各ページのpage.tsxの内容) をレンダリング */}
        <main>{children}</main>

        <div className="container">
          <hr />
          <footer>
            <p>Copyright &copy; 2016 Ca5 all rights reserved.</p>
          </footer>
        </div>
        {/* BootstrapのJavaScriptが必要な場合は、Next/Scriptコンポーネントを使って読み込むことを推奨 */}
        {/* 例: import Script from 'next/script'; */}
        {/* <Script src="/js/bootstrap.bundle.min.js" strategy="lazyOnload" /> */}
      </body>
    </html>
  );
}
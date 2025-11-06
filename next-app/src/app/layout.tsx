import React from 'react';
import Script from "next/script";
import { ReactNode } from 'react';
import NavigationMenu from './components/NavigationMenu'; // NavigationMenuをインポート
import type { Metadata } from 'next'; // Metadataをインポート
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <html lang="ja">
      <head>
        {/* Bootstrap CSS の読み込み (public/css/bootstrap.css にある場合) */}
        {/* App Routerでは <head> 内に直接 <link> を書くことも可能 */}
        {/* <link href="/css/bootstrap.css" rel="stylesheet" /> */}
        {/* Google Fonts など外部CSSもここに記述可能 */}
      </head>
      <body> {/* bodyに共通クラスやフォントスタイルを適用 */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container">
              <p className="navbar-brand">Ca5.me</p>
              <button
                type="button"
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-expanded="false"
                aria-controls="navbarContent"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            <div id="navbarContent" className="collapse navbar-collapse">
              <NavigationMenu />
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

        {/* Bootstrap JavaScript Bundle with Popper */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          strategy="lazyOnload" // ページ読み込み後に実行
        />
      </body>
    </html>
  );
}
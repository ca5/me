import React from 'react';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

type DiscographyItem = {
  title: string;
  type: string;
  description: string;
  url: string;
  imageUrl: string | null;
};

type DiscographyData = {
  [year: string]: DiscographyItem[];
};

export default function Discography() {
  const discographyPath = path.join(process.cwd(), 'src', 'app', 'discography', 'discography.json');
  let discographyData: DiscographyData = {};

  try {
    const fileContents = fs.readFileSync(discographyPath, 'utf8');
    discographyData = JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading or parsing discography.json:', error);
    return <p>Error loading discography data.</p>;
  }

  const years = Object.keys(discographyData).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
      <div className="p-5 mb-4 mainvisual">
        <div className="container">
          <div className="profile">
            <div className="logo_area">
              <p className="logo"><Image src="/img/logo.svg" alt="logo" width={90} height={90} /></p>
            </div>
            <div className="name_area">
              <h1>Discography</h1>
            </div>
            <div className="text_area">
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h2>recent</h2>
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <h3>original</h3>
            <iframe width="100%" height="320" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/53593918&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true"></iframe>
          </div>
          <div className="col-md-4 col-xs-12">
            <h3>remix/cover</h3>
            <iframe width="100%" height="320" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/53594885&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true"></iframe>
          </div>
        </div>

        {years.map((year) => (
          <div key={year}>
            <h2>{year}</h2>
            <div className="row">
              {discographyData[year].map((item, index) => (
                <div className="col-md-4 col-xs-12" key={index}>
                  <h3>{item.title}</h3>
                  <h4>{item.type} {item.description && `(${item.description})`}</h4>
                  <a href={item.url}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} width={300} height={300} />
                    ) : (
                      'Link'
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}

        <h2>2009以前</h2>
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <a href="http://www.myspace.com/ca5musicspace">
              <h3>myspace</h3>
            </a>
          </div>
          <div className="col-md-4 col-xs-12">
            <a href="http://www.muzie.ne.jp/artist/a003102/">
              <h3>muzie</h3>
            </a>
          </div>
        </div>


        <div className="row">
          <div className="col-md-12 col-xs-12 contact">
            <ul>
            <li><a href="http://blog.ca5.me/"><Image src="/img/ic_blog.png" alt="blog" width={50} height={50} /></a></li>
            <li><a href="https://soundcloud.com/ca54makske"><Image src="/img/ic_soundcloud.png" alt="soundcloud" width={50} height={50} /></a></li>
            <li><a href="https://x.com/Ca5"><Image src="/img/ic_twitter.png" alt="twitter" width={50} height={50} /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
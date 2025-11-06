'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationMenu() {
  const pathname = usePathname();

  const homeLinkClassName = `nav-link ${pathname === '/' ? 'active' : ''}`;
  const discographyLinkClassName = `nav-link ${pathname === '/discography' ? 'active' : ''}`;

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <Link href="/" className={homeLinkClassName} aria-current={pathname === '/' ? 'page' : undefined}>
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/discography" className={discographyLinkClassName} aria-current={pathname === '/discography' ? 'page' : undefined}>
          Discography
        </Link>
      </li>
      <li className="nav-item">
        <a href="https://x.com/Ca5" className="nav-link" target="_blank" rel="noopener noreferrer">
          X
        </a>
      </li>
      <li className="nav-item">
        <a href="https://soundcloud.com/ca54makske" className="nav-link" target="_blank" rel="noopener noreferrer">SoundCloud</a>
      </li>
      <li className="nav-item">
        <a href="http://blog.ca5.me/" className="nav-link" target="_blank" rel="noopener noreferrer">Blog</a>
      </li>
      <li>
        <Link href="/#contact" className="nav-link" scroll={false}>Contact</Link>
      </li>
    </ul>
  );
}
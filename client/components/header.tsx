import { FC } from 'react';
import { CurrentUserResult } from '../types/user';
import Link from 'next/link';

interface HeaderProps extends CurrentUserResult {}

const Header: FC<HeaderProps> = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
    ];

    return (
        <header>
            <nav className='navbar navbar-light bg-light'>
                <Link href={'/'} className='navbar-brand p-2'>
                    GitTix
                </Link>

                <div className='d-flex justify-content-end'>
                    <ul className='nav d-flex align-items-center'>
                        {links.map((link) => {
                            return link ? (
                                <li key={link.href} className='nav-item'>
                                    <Link href={link.href} className='nav-link'>
                                        {link.label}
                                    </Link>
                                </li>
                            ) : null;
                        })}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;

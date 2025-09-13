'use client';

import Link from 'next/link';
import {useLocale} from 'next-intl';

interface LocalizedLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({
                                                                href,
                                                                children,
                                                                className
                                                            }) => {
    const locale = useLocale();

    return (
        <Link href={`/${locale}${href}`} className={className}>
            {children}
        </Link>
    );
};
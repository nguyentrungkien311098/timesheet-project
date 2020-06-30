import React from 'react'
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router'

export default function WebHeader(props) {
    const router = useRouter()
    if ((router.asPath || "").toLowerCase().indexOf("/tin-tuc/") == 0) {
        const alias = (router.asPath || "").toLowerCase().replace("/tin-tuc/", "");
        if (alias) {
            //get by alias
            //return next seo;
        }
        else {
            //return default nextseo
        }

        // <NextSeo
        //         title={title}
        //         description={"This example uses more of the available config options." + router.asPath}
        //         canonical="https://www.canonical.ie/"
        //         openGraph={{
        //             url: 'https://www.url.ie/a',
        //             title: 'Open Graph Title',
        //             description: 'Open Graph Description',
        //             images: [
        //                 {
        //                     url: 'https://www.example.ie/og-image-01.jpg',
        //                     width: 800,
        //                     height: 600,
        //                     alt: 'Og Image Alt',
        //                 },
        //                 {
        //                     url: 'https://www.example.ie/og-image-02.jpg',
        //                     width: 900,
        //                     height: 800,
        //                     alt: 'Og Image Alt Second',
        //                 },
        //                 { url: 'https://www.example.ie/og-image-03.jpg' },
        //                 { url: 'https://www.example.ie/og-image-04.jpg' },
        //             ],
        //             site_name: 'SiteName',
        //         }}
        //         twitter={{
        //             handle: '@handle',
        //             site: '@site',
        //             cardType: 'summary_large_image',
        //         }}
        //     />
    }
    return null;
}

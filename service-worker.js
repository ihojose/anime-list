'use strict';

const CACHE_NAME = 'anime';
const DATA_CACHE_NAME = 'anime-data';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/angular.min.js',
    '/uikit.min.js',
    '/uikit-icons.min.js',
    '/main.js',
    '/uikit.min.css',
    '/style.css',
    '/images/icon/android-icon-36x36.png',
    '/images/icon/android-icon-48x48.png',
    '/images/icon/android-icon-72x72.png',
    '/images/icon/android-icon-96x96.png',
    '/images/icon/android-icon-144x144.png',
    '/images/icon/android-icon-192x192.png',
    '/images/icon/apple-icon.png',
    '/images/icon/apple-icon-57x57.png',
    '/images/icon/apple-icon-60x60.png',
    '/images/icon/apple-icon-72x72.png',
    '/images/icon/apple-icon-76x76.png',
    '/images/icon/apple-icon-114x114.png',
    '/images/icon/apple-icon-120x120.png',
    '/images/icon/apple-icon-144x144.png',
    '/images/icon/apple-icon-152x152.png',
    '/images/icon/apple-icon-180x180.png',
    '/images/icon/apple-icon-precomposed.png',
    '/images/icon/favicon.ico',
    '/images/icon/favicon-16x16.png',
    '/images/icon/favicon-32x32.png',
    '/images/icon/favicon-96x96.png',
    '/images/icon/ms-icon-70x70.png',
    '/images/icon/ms-icon-144x144.png',
    '/images/icon/ms-icon-150x150.png',
    '/images/icon/ms-icon-310x310.png',
];

self.addEventListener( 'install', evt => {
    console.log( 'Installation' );
    evt.waitUntil(
        caches.open( CACHE_NAME ).then( cache => {
            console.log( 'Pre-cacheing offline page' );
            return cache.addAll( FILES_TO_CACHE );
        } )
    );

    self.skipWaiting();
} );

self.addEventListener( 'activate', evt => {
    console.log( 'Activate' );
    evt.waitUntil(
        caches.keys().then( keyList => {
            return Promise.all( keyList.map( key => {
                if ( key !== CACHE_NAME && key !== DATA_CACHE_NAME ) {
                    console.log( 'Removing old cache', key );
                    return caches.delete( key );
                }
            } ) );
        } )
    );
} );

self.addEventListener( 'fetch', evt => {
    console.log( '[ServiceWorker] Fetch', evt.request.url );
    if ( evt.request.url.includes( '/anime/' ) ) {
        console.log( '[Service Worker] Fetch (data)', evt.request.url );
        evt.respondWith(
            caches.open( DATA_CACHE_NAME ).then( cache => {
                return fetch( evt.request )
                    .then( response => {
                        if ( response.status === 200 ) {
                            cache.put( evt.request.url, response.clone() );
                        }
                        return response;
                    } ).catch( err => {
                        return cache.match( evt.request );
                    } );
            } ) );
        return;
    }
    evt.respondWith(
        caches.open( CACHE_NAME ).then( cache => {
            return cache.match( evt.request )
                .then( response => {
                    return response || fetch( evt.request );
                } );
        } )
    );
} );

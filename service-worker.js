'use strict';

const CACHE_NAME = 'anime';
const DATA_CACHE_NAME = 'anime-data';

const FILES_TO_CACHE = [
    '/anime-list/',
    '/anime-list/index.html',
    '/anime-list/angular.min.js',
    '/anime-list/uikit.min.js',
    '/anime-list/uikit-icons.min.js',
    '/anime-list/main.js',
    '/anime-list/uikit.min.css',
    '/anime-list/style.css',
    '/anime-list/images/icon/android-icon-36x36.png',
    '/anime-list/images/icon/android-icon-48x48.png',
    '/anime-list/images/icon/android-icon-72x72.png',
    '/anime-list/images/icon/android-icon-96x96.png',
    '/anime-list/images/icon/android-icon-144x144.png',
    '/anime-list/images/icon/android-icon-192x192.png',
    '/anime-list/images/icon/apple-icon.png',
    '/anime-list/images/icon/apple-icon-57x57.png',
    '/anime-list/images/icon/apple-icon-60x60.png',
    '/anime-list/images/icon/apple-icon-72x72.png',
    '/anime-list/images/icon/apple-icon-76x76.png',
    '/anime-list/images/icon/apple-icon-114x114.png',
    '/anime-list/images/icon/apple-icon-120x120.png',
    '/anime-list/images/icon/apple-icon-144x144.png',
    '/anime-list/images/icon/apple-icon-152x152.png',
    '/anime-list/images/icon/apple-icon-180x180.png',
    '/anime-list/images/icon/apple-icon-precomposed.png',
    '/anime-list/images/icon/favicon.ico',
    '/anime-list/images/icon/favicon-16x16.png',
    '/anime-list/images/icon/favicon-32x32.png',
    '/anime-list/images/icon/favicon-96x96.png',
    '/anime-list/images/icon/ms-icon-70x70.png',
    '/anime-list/images/icon/ms-icon-144x144.png',
    '/anime-list/images/icon/ms-icon-150x150.png',
    '/anime-list/images/icon/ms-icon-310x310.png',
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

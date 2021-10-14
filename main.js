'use strict';

const kitsu = 'https://kitsu.io/api/edge/';
const clientId = 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd';
const clientSecret = '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151';

angular.module( 'anime', [] )
    .controller( 'list', [ '$scope', '$http', ( $scope, $http ) => {

        // Get Response
        $scope.animeList = [];
        $scope.oneDetails = {};
        $scope.loading = true;

        // Get Anime List
        $scope.getAnimeList = () => {
            $http( {
                url: `${ kitsu }anime`,
                params: {
                    'page[limit]': 20,
                    'page[offset]': 0
                },
                method: 'GET'
            } ).then( response => {
                $scope.loading = false;
                $scope.animeList = response.data.data;
            }, error => {
            } );
        };

        $scope.openDetails = item => {
            console.log( item );
            $scope.oneDetails = item;
        };

        // OnInit
        $scope.getAnimeList();
    } ] );

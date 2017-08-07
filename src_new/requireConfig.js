 requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: '/dist_new',
        paths:{
                lodash:"../node_modules/lodash/lodash",
                d3:"../node_modules/d3/build/d3"
        },
        shim:{  
                "lodash": {
                        exports: "_"
                }
        }
});


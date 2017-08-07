 requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: './distChartV2',
        paths:{
                lodash:"../node_modules/lodash/lodash",
                d3:"../node_modules/d3/build/d3",
        },
        shim:{
                "lodash": {
                        exports: "_"
                }
        }
});


/**
 * Created by Caihm on 2017/5/10.
 */
var pathRegex = new RegExp(/\/[^\/]+$/);
var locationPath = location.pathname.replace(pathRegex, '');
//dojo config
var dojoConfig = {

    parseOnLad: true,
    packages: [{
        name: "config",
        location: locationPath + '/app/config'
    }, {
        name: "modules",
        location: locationPath + '/app/modules'
    }, {
        name: "application",
        location: locationPath + '/app/application'
    },{
        name: "libs",
        location: locationPath + '/libs'
    }, {
        name: "widgets",
        location: locationPath + '/app/widgets'
    }, {
        name: "kernel",
        location: locationPath + '/app/kernel'
    }, {
        name: "css",
        location: locationPath + '/css'
    }]
};
var label = '#';
var fisVersion = require('fis-preprocessor-components');
var labelParser = require('fis-velocity-label-parser');
var config;

fisVersion.extHtml = (function(origin) {
    return function(content) {
        content = origin.apply(this, arguments);


        var ret = labelParser(content, config);
        var content_new = fis.util.clone(content);
        fis.util.map(ret, function(k, v){
            if(v.start_label == '#script'){
                var js_before = content.substring(v.content_start_index, v.content_end_index);
                var js_after = fisVersion.extJs(js_before);
                content_new = content_new.replace(js_before, js_after);
            }else if(v.start_label == '#style'){
                var css_before = content.substring(v.content_start_index, v.content_end_index);
                var css_after = fisVersion.extCss(css_before);
                content_new = content_new.replace(css_before, css_after);
            }

        });


        content = content_new;
        var reg = /(#\*[\s\S]*?(?:\*#|$)|##[^\n\r\f]*)|(?:#(require|extends|widget|html|uri)\s*\(\s*('|")(.*?)\3)/ig;
        var callback = function(m, comment, directive, quote, url) {
            if (url) {
                m = '#' + directive + '('+  '<<<require:' + quote + url + quote + '>>>';
            } else if(comment) {
                m = fisVersion.analyseComment(comment);
            }

            return m;
        };

        content = content.replace(reg, callback);

        return content;
    };
})(fisVersion.extHtml);


module.exports = function(content, file, conf){
    config = conf;

    return fisVersion(content, file, conf);
};

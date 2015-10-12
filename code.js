/*
Copy
    Tag
        copy individual configs - 
        copy all configs
        individual mappings
        all mappings
        applied load rules

    Data Layer
        individual sources
        all visible sources

    Load Rules
        copy individual 
        copy all

    Extensions
        copy individual
        copy all

(if possible)
    Labels
        copy individual labels
        copy all labels

    Users

    Templates

Other Features
    Rename data sources
    Toolbox frame
    import json
    export json
    optional copy label





Checkbox html:
<div class="copy-box">
    <div class="copy-checkbox">
        <div class="copy-checkbox-checked"></div>
    </div>
</div>

Checkbox Css:
.copy-box {
    margin-left: -41px;
    margin-right: 10px;
    border-top: 1px solid #a0a0a0;
    width: 30px;
    height: 100%;
    background-color: #5194FD;
    box-shadow: inset 8px 0 5px -5px hsla(0,0%,0%,.25), inset -8px 0 5px -5px hsla(0,0%,0%,.25);
    border-bottom: 1px solid #a0a0a0;
    margin-top: -1px;
    position:relative;
    float:left;
}
.copy-checkbox {
    width: 16px;
    height: 16px;
    background-color: #ffffff;
    margin: auto;
    vertical-align: middle;
    position: relative;
    border: 1px solid #005DBB;
    top: 5px;
    cursor: pointer;
}
.copy-checkbox-checked {
    position: relative;
    background-color: #000694;
    width: 14px;
    height: 14px;
    top: 1px;
    margin: auto;
    display:none;
}
.copy-parent {
    transition: transform 150ms;
}
.copy-parent:hover {
    transform: translateX(30px);
}
.copy-parent.copy-selected {
    background-color: #B0FF9B;
    color: black;
}


Popup HTML:

<div class="copy-fixed-window">
    <div class="copy-fixed-window-header">
        Copy/Paste Tool
        <div class="copy-collapse">▼</div>
    </div>
    <div class="copy-fixed-window-content">
    </div>
    <div class="copy-fixed-window-footer">
        <button class="copy-button">Export</button>&nbsp;
        <button class="copy-button">Import</button>&nbsp;
        <button class="copy-button">Copy</button>&nbsp;
        <button class="copy-button">Paste</button>
    </div>
</div>

Popup CSS:

.copy-fixed-window {
    position: fixed;
    width: 200px;
    height: 300px;
    bottom: 0;
    z-index: 99999;
    background-color: white;
    border: 1px solid #336398;
    left: 12px;
    transition: bottom 400ms;
}
.copy-fixed-window.copy-fixed-window-collapsed {
    bottom:-276px;
}

.copy-fixed-window-header {
    background-color: #057ABD;
    border-bottom: 1px solid #336398;
    height: 24px;
    line-height: 24px;
    font-size: 1.2em;
    font-weight: bold;
    color: white;
    padding-left: 6px;
    cursor: pointer;
}

.copy-collapse {
    float: right;
    width: 16px;
    height: 16px;
    border: 1px solid #ffffff;
    margin-top: 3px;
    margin-right: 3px;
    text-align: center;
    line-height: 16px;
    font-size: 16px;
}

.copy-fixed-window-footer {
    text-align: center;
    background-color: #057ABD;
    border-bottom: 1px solid #336398;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 24px;
}

.copy-button {
    margin-top: 3px;
}

*/

///////todo next:
/*
    - observable on object to listen for changes: https://developers.google.com/web/updates/2012/11/Respond-to-change-with-Object-observe?hl=en
    - if DS added, update content section of window to display change
    - if DS added, add title in content window, if not then remove title
    - if DS added in window, allow user to delete from there (show icon on hover using css :after selector) and update the UI appropriately if removed from the window
    - refactor to re-add code on each tab change (as listed below)
    - if switch to new tab and resetting html, need to check/highlight items listed in object
*/

try{
    var copyHtml = '<div class="copy-box"><div class="copy-checkbox"><div class="copy-checkbox-checked"></div></div></div>';
    var css = '.copy-box{margin-left:-41px;margin-right:10px;border-top:1px solid #a0a0a0;width:30px;height:100%;background-color:#5194FD;box-shadow:inset 8px 0 5px -5px hsla(0,0%,0%,.25),inset -8px 0 5px -5px hsla(0,0%,0%,.25);border-bottom:1px solid #a0a0a0;margin-top:-1px;position:relative;float:left}.copy-checkbox{width:16px;height:16px;background-color:#fff;margin:auto;vertical-align:middle;position:relative;border:1px solid #005DBB;top:5px;cursor:pointer}.copy-checkbox-checked{position:relative;background-color:#000694;width:14px;height:14px;top:1px;margin:auto;display:none}.copy-parent{transition:transform 150ms}.copy-parent:hover{transform:translateX(30px)}.copy-parent.copy-selected{background-color:#B0FF9B;color: black;}';
    var windowHtml = '<div class="copy-fixed-window"><div class="copy-fixed-window-header">Copy/Paste Tool<div class="copy-collapse">▼</div></div><div class="copy-fixed-window-content"></div><div class="copy-fixed-window-footer"><button class="copy-button">Export</button>&nbsp;<button class="copy-button">Import</button>&nbsp;<button class="copy-button">Copy</button>&nbsp;<button class="copy-button">Paste</button></div></div>';
    var windowCss = '.copy-button,.copy-collapse{margin-top:3px}.copy-fixed-window{position:fixed;width:200px;height:300px;bottom:0;z-index:99999;background-color:#fff;border:1px solid #336398;left:12px;transition:bottom 400ms}.copy-fixed-window.copy-fixed-window-collapsed{bottom:-276px}.copy-fixed-window-header{background-color:#057ABD;border-bottom:1px solid #336398;height:24px;line-height:24px;font-size:1.2em;font-weight:700;color:#fff;padding-left:6px;cursor:pointer}.copy-collapse{float:right;width:16px;height:16px;border:1px solid #fff;margin-right:3px;text-align:center;line-height:16px;font-size:16px}.copy-fixed-window-footer{text-align:center;background-color:#057ABD;border-bottom:1px solid #336398;position:absolute;bottom:0;width:100%;height:24px}';

    var cp_tool_data = {
        tags: {},
        load_rules: {},
        data_layer: {},
        extensions: {}
    };

    //add stylesheet to page
        $('head').append("<style type='text/css'>"+css+windowCss+"</style>");
    //add fixed window
        $('body').prepend(windowHtml);

    $('.copy-fixed-window-header').on('click', function(e) {
        var me = $(this),
            win = $('.copy-fixed-window'),
            collapse = $('.copy-collapse');

        if (win.hasClass('copy-fixed-window-collapsed')) {
            collapse.html('&#9660;');
            win.removeClass('copy-fixed-window-collapsed');
        } else {
            collapse.html('&#9650;');
            win.addClass('copy-fixed-window-collapsed');
        }
    });

    /**** ONLY add the above code ONCE per page load ****/
    ////stuff below here should be re-added each time a tab changes

    //change this based on the tab you are on
    var selector = '.ds-row';

    //data sources
        if($(selector).length) {
            $(selector).prepend(copyHtml);
            $(selector).addClass('copy-parent');
        }
    //tags: inside <a> tag, no margin-right, margin-left: -35px
    //load rules: $('.loadrules_container')
    //extensions: $('.customize_container')

    $('.copy-checkbox').on('click', function(e) {
        var me = $(this);
        var checkbox = me.find('.copy-checkbox-checked');
        var parent = me.parents(selector);
        var id = parent.data('tile-key'); ////////////////////may need to change if other tabs don't support this
        
        if (checkbox.is(':visible')) {
            checkbox.hide();
            parent.removeClass('copy-selected');
            //remove from fixed window and object
            delete cp_tool_data.data_layer[id];
        } else {
        checkbox.show();
            parent.addClass('copy-selected');
            //add stuff to fixed window and object
            cp_tool_data.data_layer[id] = utui.data.define[id];
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

}catch(e){}
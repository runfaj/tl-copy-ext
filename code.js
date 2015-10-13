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
    if a profile change happens and items were selected in the tool, show a notification that asks if the user would like to discard changes or copy them in
    needs to be able to update html when a tab is refreshed (either by click or profile change)
    add a help section




Checkbox html:
<div class="copy-box">
    <div class="copy-checkbox">
        <div class="copy-checkbox-checked"></div>
    </div>
</div>

Popup HTML:

<div class="copy-fixed-window">
    <div class="copy-fixed-window-header">
        Copy/Paste Tool
        <div class="copy-collapse">▼</div>
    </div>
    <div class="copy-fixed-window-content">
    </div>
    <div class="copy-fixed-window-footer">
        <button class="copy-button copy-button-export">Export</button>&nbsp;
        <button class="copy-button copy-button-import">Import</button>&nbsp;
        <button class="copy-button copy-button-copy">Copy</button>&nbsp;
        <button class="copy-button copy-button-paste">Paste</button>
    </div>
</div>

Select all html:
<div class="copy-select-all copy-box">
    <div class="copy-checkbox">
        <div class="copy-checkbox-checked"></div>
    </div>
  <div class="copy-select-text">Select all to be copied</div>
</div>



Css:
.copy-box {
    border-top: 1px solid #a0a0a0;
    width: 30px;
    height: 100%;
    background-color: #057ABD;
    box-shadow: inset 8px 0 5px -5px hsla(0,0%,0%,.25), inset -8px 0 5px -5px hsla(0,0%,0%,.25);
    border-bottom: 1px solid #a0a0a0;
    margin-top: -1px;
    position:relative;
    float:left;
}
.copy-box-data_layer {
    margin-left: -41px;
    margin-right: 10px;
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

.copy-select-all {
    height: 27px;
    width: 100%;
}

.copy-select-all .copy-checkbox {
    margin: auto 9px;
    display: inline-block;
}

.copy-select-text {
    display: inline-block;
    position: relative;
    top: 6px;
    color: #ffffff;
}

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

.copy-fixed-window-content {
    position: absolute;
    top: 25px;
    height: 253px;
    width: 192px;
    overflow: scroll;
    padding: 4px;
}

.copy-fixed-window-content section ul li {
    list-style: none;
    border-bottom: 1px solid #eeeeee;
    padding: 3px 0;
}

.copy-fixed-window-content section ul li:last-child {
    border-bottom-width: 0;
    margin-bottom: 16px;
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

.copy-export-box {
    margin-top: 12px;
    width: 500px;
    height: 220px;
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

(function checkInitCPTool(){
    if(typeof jQuery == "undefined" || !jQuery('#tabs_content li.ui-state-active a').length)
        setTimeout(checkInitCPTool,100);
    else
        initCPTool();
})();

function initCPTool() {
    try{
        debugger;
        var css = '.copy-box{border-top:1px solid #a0a0a0;width:30px;height:100%;background-color:#057ABD;box-shadow:inset 8px 0 5px -5px hsla(0,0%,0%,.25),inset -8px 0 5px -5px hsla(0,0%,0%,.25);border-bottom:1px solid #a0a0a0;margin-top:-1px;position:relative;float:left}.copy-box-data_layer{margin-left:-41px;margin-right:10px}.copy-checkbox{width:16px;height:16px;background-color:#fff;margin:auto;vertical-align:middle;position:relative;border:1px solid #005DBB;top:5px;cursor:pointer}.copy-checkbox-checked{position:relative;background-color:#000694;width:14px;height:14px;top:1px;margin:auto;display:none}.copy-parent{transition:transform 150ms}.copy-parent:hover{transform:translateX(30px)}.copy-parent.copy-selected{background-color:#B0FF9B;color:#000}.copy-select-all{height:27px;width:100%}.copy-select-all .copy-checkbox{margin:auto 9px;display:inline-block}.copy-button,.copy-collapse{margin-top:3px}.copy-select-text{display:inline-block;position:relative;top:6px;color:#fff}.copy-fixed-window{position:fixed;width:200px;height:300px;bottom:0;z-index:99999;background-color:#fff;border:1px solid #336398;left:12px;transition:bottom 400ms}.copy-fixed-window.copy-fixed-window-collapsed{bottom:-276px}.copy-fixed-window-header{background-color:#057ABD;border-bottom:1px solid #336398;height:24px;line-height:24px;font-size:1.2em;font-weight:700;color:#fff;padding-left:6px;cursor:pointer}.copy-collapse{float:right;width:16px;height:16px;border:1px solid #fff;margin-right:3px;text-align:center;line-height:16px;font-size:16px}.copy-fixed-window-content{position:absolute;top:25px;height:253px;width:192px;overflow:scroll;padding:4px}.copy-fixed-window-content section ul li{list-style:none;border-bottom:1px solid #eee;padding:3px 0}.copy-fixed-window-content section ul li:last-child{border-bottom-width:0;margin-bottom:16px}.copy-fixed-window-footer{text-align:center;background-color:#057ABD;border-bottom:1px solid #336398;position:absolute;bottom:0;width:100%;height:24px}.copy-export-box{margin-top:12px;width:500px;height:220px}';
        var windowHtml = '<div class="copy-fixed-window"><div class="copy-fixed-window-header">Copy/Paste Tool<div class="copy-collapse">▼</div></div><div class="copy-fixed-window-content"></div><div class="copy-fixed-window-footer"><button class="copy-button copy-button-export">Export</button>&nbsp;<button class="copy-button copy-button-import">Import</button>&nbsp;<button class="copy-button copy-button-copy">Copy</button>&nbsp;<button class="copy-button copy-button-paste">Paste</button></div></div>';

        //add global copy object
        function resetCopyObj() {
            window.cp_tool_data = {};
            recursiveObserve(cp_tool_data,objectObserver);
            cp_tool_data.tags={};
            cp_tool_data.load_rules={};
            cp_tool_data.data_layer={};
            cp_tool_data.extensions={};
        }
        function recursiveObserve(object, callback) {
            Object.observe(object, function(changeRecords) {
                changeRecords.forEach(function(change) {
                    if(['add', 'update'].indexOf(change.type) !== -1 && 
                       typeof change.object[change.name] === 'object') {
                        recursiveObserve(change.object[change.name], callback);
                    }
                     
                    callback(change);
                });

            });
        }
        resetCopyObj();

        //add stylesheet to page
            $('head').append("<style type='text/css'>"+css+"</style>");
        //add fixed window
            $('body').prepend(windowHtml);

        //add handlers for fixed window
        $('.copy-fixed-window-header').on('mousedown', function(e) {
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

        $('.copy-button-export').on('click',function(){
            var title = "Export Copy/Paste JSON";
            var content = '<h3>Copy the following JSON to save or paste in another account/profile.</h3><textarea class="copy-export-box">' + JSON.stringify(cp_tool_data) + '</textarea>';

            utui.util.showMsgDialog(content,title,function(){});
        });

        function objectObserver(changes) {
            var container = jQuery('.copy-fixed-window-content');
            container.empty();
            var html = "";
            if(Object.keys(cp_tool_data.data_layer).length) {
                html += "<section><h3>Data Layer</h3><ul>";
                for(var key in cp_tool_data.data_layer)
                    html += "<li>"+(cp_tool_data.data_layer[key].title || cp_tool_data.data_layer[key].name)+"</li>"
                html += "</ul></section>";
            }
            if(Object.keys(cp_tool_data.tags).length) {
                html += "<section><h3>Data Layer</h3><ul>";
                for(var key in cp_tool_data.tags)
                    html += "<li>"+(cp_tool_data.data_layer[key].title || cp_tool_data.data_layer[key].name)+"</li>"
                html += "</ul></section>";
            }
            if(Object.keys(cp_tool_data.load_rules).length) {
                html += "<section><h3>Data Layer</h3><ul>";
                for(var key in cp_tool_data.load_rules)
                    html += "<li>"+(cp_tool_data.data_layer[key].title || cp_tool_data.data_layer[key].name)+"</li>"
                html += "</ul></section>";
            }
            if(Object.keys(cp_tool_data.extensions).length) {
                html += "<section><h3>Data Layer</h3><ul>";
                for(var key in cp_tool_data.extensions)
                    html += "<li>"+(cp_tool_data.data_layer[key].title || cp_tool_data.data_layer[key].name)+"</li>"
                html += "</ul></section>";
            }
            container.html(html);
        }

        //add logic to init the tab selected on initial load as well as when a tab is clicked
        function addTabHtml(selector,html,type) {
            if($(selector).length) {
                $(selector).prepend(html);
                $(selector).addClass('copy-parent').addClass('copy-parent-'+type);

                //add select all box
                var selectAllSel = "";
                if(type == "data_layer") {
                    selectAllSel = "#defineContainer";
                }
                var selectAllHtml = '<div class="copy-select-all copy-box" copy-select-all-'+type+'><div class="copy-checkbox"><div class="copy-checkbox-checked"></div></div><div class="copy-select-text">Select all to be copied</div></div>';
                $(selectAllSel).prepend(selectAllHtml);
            } else {
                setTimeout(function(){addTabHtml(selector,html,type);},100);
            }
        };
        function checkTab(el) {
            var id = el.attr('id');

            var tab = "";
            var selector = "";

            if(id == "tabs_define") {
                tab = "data_layer";
                selector = '.ds-row';
            }

            if(tab) {
                var copyHtml = '<div class="copy-box copy-box-'+tab+'"><div class="copy-checkbox"><div class="copy-checkbox-checked"></div></div></div>';
                addTabHtml(selector,copyHtml,tab);
            }
        }

        checkTab(jQuery('#tabs_content li.ui-state-active a'));

        jQuery(document).on('mousedown','#tabs_content li a',function(){
            var a = $(this);
            checkTab(a);
        });

        /**add handlers for copy checkboxes**/
        //data layer checkbox
        $(document).on('click', '.copy-select-all .copy-checkbox', function(){
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var boxes = $('.ds-row .copy-checkbox');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                boxes.each(function(idx,el){
                    $(el).click();
                });
            } else {
                checkbox.show();
                boxes.each(function(idx,el){
                    $(el).click();
                });
            }
        });
        $(document).on('click', '.copy-box-data_layer .copy-checkbox', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var parent = me.parents('.ds-row');
            var id = parent.data('tile-key');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                parent.removeClass('copy-selected');
                $('.copy-select-all .copy-checkbox-checked').hide();
                //remove from fixed window and object
                delete cp_tool_data.data_layer[id];
            } else {
                checkbox.show();
                parent.addClass('copy-selected');
                //add stuff to fixed window and object
                cp_tool_data.data_layer[id] = utui.data.define[id];
            }
            return false;
        });

        //data sources
        //tags: inside <a> tag, no margin-right, margin-left: -35px
        //load rules: $('.loadrules_container')
        //extensions: $('.customize_container')

    }catch(e){console.log(e);}
}
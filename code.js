(function checkInitCPTool(){
    if(typeof jQuery == "undefined" || !jQuery('#tabs_content li.ui-state-active a').length)
        setTimeout(checkInitCPTool,100);
    else
        initCPTool();
})();

function initCPTool() {
    try{
        //debugger;
        var css = '.copy-box{border-top:1px solid #a0a0a0;width:30px;height:100%;background-color:#057ABD;box-shadow:inset 8px 0 5px -5px hsla(0,0%,0%,.25),inset -8px 0 5px -5px hsla(0,0%,0%,.25);border-bottom:1px solid #a0a0a0;position:relative;float:left}.copy-box-data_layer{margin-top:-1px;margin-left:-41px;margin-right:10px}.copy-box-extensions,.copy-box-load_rules,.copy-box-tags{margin-left:-45px;height:27px}.copy-checkbox{width:16px;height:16px;background-color:#fff;margin:auto;vertical-align:middle;position:relative;border:1px solid #005DBB;top:5px;cursor:pointer}.copy-checkbox-checked{position:relative;background-color:#000694;width:14px;height:14px;top:1px;margin:auto;display:none}.copy-parent{transition:transform 150ms}.copy-parent:hover{transform:translateX(30px)}.copy-parent:hover .copy-box-extensions,.copy-parent:hover .copy-box-load_rules,.copy-parent:hover .copy-box-tags{margin-left:-30px}.copy-selected{background-color:#B0FF9B!important;color:#000!important}.copy-select-all{height:27px;width:100%;border-bottom-width:0}.copy-select-all-extensions,.copy-select-all-load_rules,.copy-select-all-tags{margin-left:10px;height:26px;width:164px;text-align:left;border-radius:4px;box-shadow:none}.copy-select-all .copy-checkbox{margin:auto 6px;display:inline-block;top:4px}.copy-button,.copy-collapse{margin-top:3px}.copy-select-text{display:inline-block;position:relative;top:5px;color:#fff}.copy-fixed-window{position:fixed;width:200px;height:300px;bottom:0;z-index:99999;background-color:#fff;border:1px solid #336398;left:12px;transition:bottom 400ms}.copy-fixed-window.copy-fixed-window-collapsed{bottom:-276px}.copy-fixed-window-header{background-color:#057ABD;border-bottom:1px solid #336398;height:24px;line-height:24px;font-size:1.2em;font-weight:700;color:#fff;padding-left:6px;cursor:pointer}.copy-collapse{float:right;width:16px;height:16px;border:1px solid #fff;margin-right:3px;text-align:center;line-height:16px;font-size:16px}.copy-fixed-window-content{position:absolute;top:25px;height:253px;width:192px;overflow:scroll;padding:4px}.copy-fixed-window-content section ul li{list-style:none;border-bottom:1px solid #eee;padding:3px 0}.copy-fixed-window-content section ul li:last-child{border-bottom-width:0;margin-bottom:16px}.copy-fixed-window-footer{text-align:center;background-color:#057ABD;border-bottom:1px solid #336398;position:absolute;bottom:0;width:100%;height:24px}.copy-export-box{margin-top:12px;width:500px;height:220px}';
        var windowHtml = '<div class="copy-fixed-window"><div class="copy-fixed-window-header">Copy/Paste Tool<div class="copy-collapse">▼</div></div><div class="copy-fixed-window-content"></div><div class="copy-fixed-window-footer"><button class="copy-button copy-button-export">Export</button>&nbsp;<button class="copy-button copy-button-import">Import</button>&nbsp;<button class="copy-button copy-button-copy">Copy</button>&nbsp;<button class="copy-button copy-button-paste">Paste</button></div></div>';

        //add global copy object, call this method to reset it also
        function resetCopyObj() {
            window.cp_tool_data = {};
            //init observer to capture any future changes to copy object
            recursiveObserve(cp_tool_data,objectObserver);
            cp_tool_data.tags={};
            cp_tool_data.load_rules={};
            cp_tool_data.data_layer={};
            cp_tool_data.extensions={};
        }
        //allows us to watch for nested object changes, Chrome and Opera only
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
        //init the copy object
        resetCopyObj();

        //add stylesheet to page
            $('head').append("<style type='text/css'>"+css+"</style>");
        //add fixed window
            $('body').prepend(windowHtml);

        //add handler for fixed window collapse
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

        //add handler for exporting the copy object, opens a new popup
        $('.copy-button-export').on('click',function(){
            var title = "Export Copy/Paste JSON";
            var content = '<h3>Copy the following JSON to save or paste in another account/profile.</h3><textarea class="copy-export-box">' + JSON.stringify(cp_tool_data) + '</textarea>';

            utui.util.showMsgDialog(content,title,function(){});
        });

        //callback that is used whenever the copy object changes, updates the window content
        function objectObserver(changes) {
            var container = jQuery('.copy-fixed-window-content');
            //remove all items, then rebuild the html
            container.empty();
            var html = "";
            if(Object.keys(cp_tool_data.data_layer).length) {
                html += "<section><h3>Data Layer</h3><ul>";
                for(var key in cp_tool_data.data_layer)
                    html += "<li>"+(cp_tool_data.data_layer[key].title || cp_tool_data.data_layer[key].name)+"</li>"
                html += "</ul></section>";
            }
            if(Object.keys(cp_tool_data.load_rules).length) {
                html += "<section><h3>Load Rules</h3><ul>";
                for(var key in cp_tool_data.load_rules)
                    html += "<li>"+(cp_tool_data.load_rules[key].title)+"</li>"
                html += "</ul></section>";
            }
            if(Object.keys(cp_tool_data.tags).length) {
                html += "<section><h3>Tags</h3><ul>";
                for(var key in cp_tool_data.tags)
                    html += "<li>"+(cp_tool_data.tags[key].title || cp_tool_data.tags[key].tag_name)+"</li>"
                html += "</ul></section>";
            }
            if(Object.keys(cp_tool_data.extensions).length) {
                html += "<section><h3>Extensions</h3><ul>";
                for(var key in cp_tool_data.extensions)
                    html += "<li>"+(cp_tool_data.extensions[key].title)+"</li>"
                html += "</ul></section>";
            }
            container.html(html);
        }

        //add logic to init the tab selected on initial load as well as when a tab is clicked
        function addTabHtml(tabEl,selector,type) {
            //basic checkbox html
            var html = '<div class="copy-box copy-box-'+type+'"><div class="copy-checkbox"><div class="copy-checkbox-checked"></div></div></div>';

            //if the tab is active and elements are present to add the checkboxes to,
            //run this. Else, we loop and check again
            if($(selector).length && tabEl.hasClass('ui-state-active')) {
                //add checkbox onto all rows if they don't have it already
                $(selector).each(function(idx,el){
                    var me = $(el);
                    if(!me.find('.copy-box').length)
                        me.prepend(html);
                });
                //add parent classes onto each row
                $(selector).addClass('copy-parent').addClass('copy-parent-'+type);

                //this is the parent container for the select all box
                var selectAllSel = "";

                if(type == "data_layer") {
                    selectAllSel = "#defineContainer";

                    //remove all checked items
                    $(selector+" .copy-checkbox-checked").hide();
                    //remove all highlighted rows
                    $(dataLayerSelector).removeClass('copy-selected');
                    //loop through each item in our copy object and re-check and highlight each appropriate row
                    for(var key in cp_tool_data.data_layer) {
                        var el = $(dataLayerSelector+"[data-tile-key="+key+"]");
                        if(el.length) {
                            el.find('.copy-checkbox-checked').show();
                            el.addClass('copy-selected');
                        }
                    }
                } else
                if(type == "load_rules") {
                    selectAllSel = "#loadrulesContainer_headerControls";

                    $(selector+" .copy-checkbox-checked").hide();
                    $(dataLayerSelector+" h3").removeClass('copy-selected');
                    for(var key in cp_tool_data.load_rules) {
                        var el = $(loadRulesSelector+"[data-id="+key+"]");
                        if(el.length) {
                            el.find('.copy-checkbox-checked').show();
                            el.find('h3').addClass('copy-selected');
                        }
                    }
                } else
                if(type == "extensions") {
                    selectAllSel = "#customizeContainer_headerControls";

                    $(selector+" .copy-checkbox-checked").hide();
                    $(extensionsSelector+" h3").removeClass('copy-selected');
                    for(var key in cp_tool_data.extensions) {
                        var el = $(extensionsSelector+"[data-id="+key+"]");
                        if(el.length) {
                            el.find('.copy-checkbox-checked').show();
                            el.find('h3').addClass('copy-selected');
                        }
                    }
                } else
                if(type == "tags") {
                    selectAllSel = "#manageContainer_headerControls";

                    $(selector+" .copy-checkbox-checked").hide();
                    $(tagsSelector+" h3").removeClass('copy-selected');
                    for(var key in cp_tool_data.tags) {
                        var el = $(tagsSelector+"[data-id="+key+"]");
                        if(el.length) {
                            el.find('.copy-checkbox-checked').show();
                            el.find('h3').addClass('copy-selected');
                        }
                    }
                }

                //add the select all containers
                if(!$('.copy-select-all-'+type).length) {
                    var selectAllHtml = '<div class="copy-select-all copy-box copy-select-all-'+type+'"><div class="copy-checkbox"><div class="copy-checkbox-checked"></div></div><div class="copy-select-text">Select all to be copied</div></div>';
                    if(type == "data_layer")
                        $(selectAllSel).prepend(selectAllHtml);
                    else
                        $(selectAllSel).append(selectAllHtml);
                }
            } else {
                setTimeout(function(){addTabHtml(tabEl,selector,type);},100);
            }
        };

        //main selectors for each row on different tabs
        var dataLayerSelector = ".ds-row",
            loadRulesSelector = ".loadrules_container:not([data-id=all])",
            extensionsSelector = ".customize_container",
            tagsSelector = ".manage_container";

        //this function is run to add the proper html when a tab is selected
        function checkTab(el) {
            var id = el.attr('id');

            var tab = "";
            var selector = "";

            if(id == "tabs_define") {
                tab = "data_layer";
                selector = dataLayerSelector;
            } else
            if(id == "tabs_loadrules") {
                tab = "load_rules";
                selector = loadRulesSelector;
            } else
            if(id == "tabs_customizations") {
                tab = "extensions";
                selector = extensionsSelector;
            } else
            if(id == "tabs_manage") {
                tab = "tags";
                selector = tagsSelector;
            }

            if(tab) {
                var uiTab = $('#'+id).parent();
                addTabHtml(uiTab,selector,tab);
            }
        }

        //initial page load tab check
        checkTab(jQuery('#tabs_content li.ui-state-active a'));

        //check tab setup for clicked on tab
        jQuery(document).on('mousedown','#tabs_content li a',function(){
            var a = $(this);
            checkTab(a);
        });

        /********************add handlers for copy checkboxes*********************/
        //data layer select all checkbox
        $(document).on('click', '.copy-select-all-data_layer .copy-checkbox', function(){
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var boxes = $(dataLayerSelector + ' .copy-checkbox');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                //if unchecking a box, uncheck all boxes
                boxes.each(function(idx,el){
                    $(el).click();
                });
            } else {
                checkbox.show();
                //if checking the box, recheck all the unchecked boxes
                boxes.each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        $(el).click();
                });
            }
        });
        //data layer individual row checkboxes
        $(document).on('click', '.copy-box-data_layer .copy-checkbox', function(e) {
            //attempt to stop any other events that are indirecty attached to element
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var parent = me.parents(dataLayerSelector);
            var id = parent.data('tile-key');
            
            if (checkbox.is(':visible')) {
                //if checked, remove the check and the row highlight. Also remove from copy object
                checkbox.hide();
                parent.removeClass('copy-selected');
                $('.copy-select-all-data_layer .copy-checkbox-checked').hide();
                delete cp_tool_data.data_layer[id];
            } else {
                //if not checked, check it and highlight the row
                checkbox.show();
                parent.addClass('copy-selected');
                //update the select all box if necessary
                var updateSABox = true;
                $(dataLayerSelector + ' .copy-checkbox').each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        updateSABox = false;
                });
                if(updateSABox)
                    $('.copy-select-all-data_layer .copy-checkbox-checked').show();
                //add data to copy object
                cp_tool_data.data_layer[id] = utui.data.define[id];
            }
            return false;
        });

        //load rule checkbox
        $(document).on('click', '.copy-select-all-load_rules .copy-checkbox', function(){
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var boxes = $(loadRulesSelector + ' .copy-checkbox');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                boxes.each(function(idx,el){
                    $(el).click();
                });
            } else {
                checkbox.show();
                boxes.each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        $(el).click();
                });
            }
        });
        $(document).on('click', '.copy-box-load_rules .copy-checkbox', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var parent = me.parents(loadRulesSelector);
            var id = parent.data('id');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                parent.find('h3').removeClass('copy-selected');
                $('.copy-select-all-load_rules .copy-checkbox-checked').hide();
                //remove from fixed window and object
                delete cp_tool_data.load_rules[id];
            } else {
                checkbox.show();
                parent.find('h3').addClass('copy-selected');
                var updateSABox = true;
                $(loadRulesSelector + ' .copy-checkbox').each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        updateSABox = false;
                });
                if(updateSABox)
                    $('.copy-select-all-load_rules .copy-checkbox-checked').show();
                //add stuff to fixed window and object
                cp_tool_data.load_rules[id] = utui.data.loadrules[id];
            }
            return false;
        });

        //extensions boxes
        $(document).on('click', '.copy-select-all-extensions .copy-checkbox', function(){
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var boxes = $(extensionsSelector + ' .copy-checkbox');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                boxes.each(function(idx,el){
                    $(el).click();
                });
            } else {
                checkbox.show();
                boxes.each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        $(el).click();
                });
            }
        });
        $(document).on('click', '.copy-box-extensions .copy-checkbox', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var parent = me.parents(extensionsSelector);
            var id = parent.data('id');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                parent.find('h3').removeClass('copy-selected');
                $('.copy-select-all-extensions .copy-checkbox-checked').hide();
                //remove from fixed window and object
                delete cp_tool_data.extensions[id];
            } else {
                checkbox.show();
                parent.find('h3').addClass('copy-selected');
                var updateSABox = true;
                $(extensionsSelector + ' .copy-checkbox').each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        updateSABox = false;
                });
                if(updateSABox)
                    $('.copy-select-all-extensions .copy-checkbox-checked').show();
                //add stuff to fixed window and object
                cp_tool_data.extensions[id] = utui.data.customizations[id];
            }
            return false;
        });

        //tags boxes
        $(document).on('click', '.copy-select-all-tags .copy-checkbox', function(){
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var boxes = $(tagsSelector + ' .copy-checkbox');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                boxes.each(function(idx,el){
                    $(el).click();
                });
            } else {
                checkbox.show();
                boxes.each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        $(el).click();
                });
            }
        });
        $(document).on('click', '.copy-box-tags .copy-checkbox', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var me = $(this);
            var checkbox = me.find('.copy-checkbox-checked');
            var parent = me.parents(tagsSelector);
            var id = parent.data('id');
            
            if (checkbox.is(':visible')) {
                checkbox.hide();
                parent.find('h3').removeClass('copy-selected');
                $('.copy-select-all-tags .copy-checkbox-checked').hide();
                //remove from fixed window and object
                delete cp_tool_data.tags[id];
            } else {
                checkbox.show();
                parent.find('h3').addClass('copy-selected');
                var updateSABox = true;
                $(tagsSelector + ' .copy-checkbox').each(function(idx,el){
                    if(!$(el).find('.copy-checkbox-checked:visible').length)
                        updateSABox = false;
                });
                if(updateSABox)
                    $('.copy-select-all-tags .copy-checkbox-checked').show();
                //add stuff to fixed window and object
                cp_tool_data.tags[id] = utui.data.manage[id];
            }
            return false;
        });

    }catch(e){console.log(e);}
}
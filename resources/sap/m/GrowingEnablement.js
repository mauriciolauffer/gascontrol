/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.GrowingEnablement");jQuery.sap.require("sap.ui.base.Object");sap.ui.base.Object.extend("sap.m.GrowingEnablement",{constructor:function(c){sap.ui.base.Object.apply(this);this._oControl=c;this._oControl.bUseExtendedChangeDetection=true;this._oControl.addDelegate(this);var r=this._oControl.getItems().length;this._iRenderedDataItems=r;this._iItemCount=r;this._bRebuilding=false;this._fnRebuildQ=null;this._bLoading=false;this._sGroupingPath="";this._bDataRequested=false},destroy:function(){if(this._oBusyIndicator){this._oBusyIndicator.destroy();delete this._oBusyIndicator}if(this._oTrigger){this._oTrigger.destroy();delete this._oTrigger}if(this._oLoading){this._oLoading.destroy();delete this._oLoading}if(this._oScrollDelegate){this._oScrollDelegate.setGrowingList(null);this._oScrollDelegate=null}jQuery(this._oControl.getId()+"-triggerList").remove();this._oControl.bUseExtendedChangeDetection=false;this._oControl.removeDelegate(this);this._sGroupingPath="";this._bLoading=false;this._oControl=null},render:function(r){var h=this._oControl.getGrowingScrollToLoad()&&this._getHasScrollbars();r.write("<ul id='"+this._oControl.getId()+"-triggerList'");if(h){r.addStyle("display","none");r.writeStyles()}r.addClass("sapMListUl");r.addClass("sapMGrowingList");if(this._oControl.setBackgroundDesign){r.addClass("sapMListBG"+this._oControl.getBackgroundDesign())}if(this._oControl.getInset()){r.addClass("sapMListInset")}r.writeClasses();r.write(">");var a;if(h){this._showsLoading=true;a=this._getLoading(this._oControl.getId()+"-loading")}else{this._showsTrigger=true;a=this._getTrigger(this._oControl.getId()+"-trigger")}a._renderInList=true;r.renderControl(a);r.write("</ul>")},onAfterRendering:function(){if(this._oControl.getGrowingScrollToLoad()){var s=sap.m.getScrollDelegate(this._oControl);if(s){this._oScrollDelegate=s;s.setGrowingList(this._oControl,jQuery.proxy(this._triggerLoadingByScroll,this))}}else if(this._oScrollDelegate){this._oScrollDelegate.setGrowingList(null);this._oScrollDelegate=null}this._updateTrigger()},setTriggerText:function(t){if(this._oTrigger){this._oTrigger.$().find(".sapMSLITitle").text(t)}},reset:function(){this._iItemCount=0;this._bLastAsyncCheck=false},getInfo:function(){return{total:this._oControl.getMaxItemsCount(),actual:this._iRenderedDataItems}},requestNewPage:function(e){if(this._oControl&&!this._bLoading&&this._iItemCount<this._oControl.getMaxItemsCount()){this._showIndicator();this._iItemCount+=this._oControl.getGrowingThreshold();this.updateItems("Growing")}},_onBeforePageLoaded:function(c){this._bLoading=true;this._oControl.onBeforePageLoaded(this.getInfo(),c)},_onAfterPageLoaded:function(c){this._hideIndicator();this._updateTrigger();this._bLoading=false;this._oControl.onAfterPageLoaded(this.getInfo(),c)},_renderItemIntoContainer:function(i,d,I,D){D=D||this._oContainerDomRef;if(D){var r=this._oRenderManager||sap.ui.getCore().createRenderManager();r.renderControl(i);if(!this._oRenderManager){r.flush(D,d,I);r.destroy()}}},_getBusyIndicator:function(){return this._oBusyIndicator||(this._oBusyIndicator=new sap.m.BusyIndicator({size:"2.0em"}))},_getLoading:function(i){var t=this;return this._oLoading||(this._oLoading=new sap.m.CustomListItem({id:i,content:new sap.ui.core.HTML({content:"<div class='sapMSLIDiv sapMGrowingListLoading'>"+"<div class='sapMGrowingListBusyIndicator' id='"+i+"-busyIndicator'></div>"+"</div>",afterRendering:function(e){var b=t._getBusyIndicator();var r=sap.ui.getCore().createRenderManager();r.render(b,this.getDomRef().firstChild);r.destroy()}})}).setParent(this._oControl,null,true))},_getTrigger:function(i){var t=this;var T=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LOAD_MORE_DATA");if(this._oControl.getGrowingTriggerText()){T=this._oControl.getGrowingTriggerText()}this._oControl.addNavSection(i);return this._oTrigger||(this._oTrigger=new sap.m.CustomListItem({id:i,content:new sap.ui.core.HTML({content:"<div class='sapMGrowingListTrigger'>"+"<div class='sapMGrowingListBusyIndicator' id='"+i+"-busyIndicator'></div>"+"<div class='sapMSLITitleDiv sapMGrowingListTitel'>"+"<h1 class='sapMSLITitle'>"+jQuery.sap.encodeHTML(T)+"</h1>"+"</div>"+"<div class='sapMGrowingListDescription'>"+"<div class='sapMSLIDescription' id='"+i+"-itemInfo'>"+t._getListItemInfo()+"</div>"+"</div>"+"</div>",afterRendering:function(e){var b=t._getBusyIndicator();var r=sap.ui.getCore().createRenderManager();r.render(b,this.getDomRef().firstChild);r.destroy()}}),type:sap.m.ListType.Active}).setParent(this._oControl,null,true).attachPress(this.requestNewPage,this).addEventDelegate({onsapenter:function(e){this.requestNewPage();e.preventDefault()},onsapspace:function(e){this.requestNewPage(e);e.preventDefault()}},this))},_getListItemInfo:function(){return("[ "+this._iRenderedDataItems+" / "+this._oControl.getMaxItemsCount()+" ]")},_getGroupForContext:function(c){var n=this._oControl.getBinding("items").aSorters[0].fnGroup(c);if(typeof n=="string"){n={key:n}}return n},_getGroupingPath:function(b){b=b||this._oControl.getBinding("items")||{};var s=b.aSorters||[];var S=s[0]||{};if(S.fnGroup){return S.sPath}return""},_getDomIndex:function(i){if(this._oControl.hasPopin&&this._oControl.hasPopin()){i*=2}return i},_getHasScrollbars:function(){return this._oScrollDelegate&&this._oScrollDelegate.getMaxScrollTop()>this._oControl.$("triggerList").height()},destroyListItems:function(){this._oControl.destroyAggregation("items");this._iRenderedDataItems=0},addListItem:function(i,s){this._iRenderedDataItems++;var b=this._oControl.getBinding("items"),B=this._oControl.getBindingInfo("items");if(b.isGrouped()&&B){var n=false,I=this._oControl.getItems(),m=B.model||undefined,N=this._getGroupForContext(i.getBindingContext(m));if(I.length==0){n=true}else if(N.key!==this._getGroupForContext(I[I.length-1].getBindingContext(m)).key){n=true}if(n){var g=null;if(B.groupHeaderFactory){g=B.groupHeaderFactory(N)}this.addItemGroup(N,g)}}this._oControl.addAggregation("items",i,s);if(s){this._renderItemIntoContainer(i,false,true)}return this},addListItems:function(c,b,s){if(b&&c){for(var i=0,l=c.length;i<l;i++){var C=b.factory("",c[i]);C.setBindingContext(c[i],b.model);this.addListItem(C,s)}}},rebuildListItems:function(c,b,s){if(this._bRebuilding){this._fnRebuildQ=jQuery.proxy(this,"rebuildListItems",c,b,s);return}this._bRebuilding=true;this.destroyListItems();this.addListItems(c,b,s);this._bRebuilding=false;if(this._fnRebuildQ){var r=this._fnRebuildQ;this._fnRebuildQ=null;r()}},addItemGroup:function(g,h){h=this._oControl.addItemGroup(g,h,true);this._renderItemIntoContainer(h,false,true);return this},insertListItem:function(i,I){this._oControl.insertAggregation("items",i,I,true);this._iRenderedDataItems++;this._renderItemIntoContainer(i,false,this._getDomIndex(I));return this},deleteListItem:function(i){this._iRenderedDataItems--;i.destroy(true);return this},refreshItems:function(c){if(!this._iItemCount||c==sap.ui.model.ChangeReason.Filter){this._iItemCount=this._oControl.getGrowingThreshold()}if(!this._bDataRequested){this._bDataRequested=true;this._onBeforePageLoaded(c)}this._oControl.getBinding("items").getContexts(0,this._iItemCount)},updateItems:function(c){var b=this._oControl.getBindingInfo("items"),B=b.binding,f=b.factory;if(!this._iItemCount||c==sap.ui.model.ChangeReason.Filter){this._iItemCount=this._oControl.getGrowingThreshold()}if(this._bDataRequested){this._bDataRequested=false}else{this._onBeforePageLoaded(c)}var C=B?B.getContexts(0,this._iItemCount)||[]:[];if(C.dataRequested){this._bDataRequested=true;return}this._oContainerDomRef=this._oControl.getItemsContainerDomRef();var a=this._oControl.checkGrowingFromScratch&&this._oControl.checkGrowingFromScratch();if(B.isGrouped()||a){var F=true;if(C.length>0){if(this._oContainerDomRef){if(C.diff){if(!C.diff.length){if(this._sGroupingPath==this._getGroupingPath(B)){F=false}}else{F=false;var d=false;for(var i=0,l=C.diff.length;i<l;i++){if(C.diff[i].type==="delete"){F=true;break}else if(C.diff[i].type==="insert"){if(!d&&C.diff[i].index!==this._iRenderedDataItems){F=true;break}d=true;var o=f("",C[C.diff[i].index]);o.setBindingContext(C[C.diff[i].index],b.model);this.addListItem(o,true)}}}}if(F){this.rebuildListItems(C,b,false)}}else{this.rebuildListItems(C,b,true)}}else{this.destroyListItems()}}else{if(C.length>0){if(this._oContainerDomRef){if(C.diff){if(this._sGroupingPath){this._oControl.removeGroupHeaders(true)}this._oRenderManager=sap.ui.getCore().createRenderManager();var I,o,e,g=-1,L=-1;for(var i=0,l=C.diff.length;i<l;i++){e=C.diff[i].index;if(C.diff[i].type==="delete"){if(g!==-1){this._oRenderManager.flush(this._oContainerDomRef,false,this._getDomIndex(g));g=-1;L=-1}I=this._oControl.mAggregations["items"];this.deleteListItem(I[e])}else if(C.diff[i].type==="insert"){o=f("",C[e]);o.setBindingContext(C[e],b.model);if(g===-1){g=e}else if(L>=0&&e!==L+1){this._oRenderManager.flush(this._oContainerDomRef,false,this._getDomIndex(g));g=e}this.insertListItem(o,e);L=e}}I=this._oControl.getItems();for(var i=0,l=C.length;i<l;i++){I[i].setBindingContext(C[i],b.model)}if(g!==-1){this._oRenderManager.flush(this._oContainerDomRef,false,this._getDomIndex(g))}this._oRenderManager.destroy();delete this._oRenderManager}else{this.rebuildListItems(C,b,false)}}else{this.rebuildListItems(C,b,true)}}else{this.destroyListItems()}}this._oContainerDomRef=null;this._sGroupingPath=this._getGroupingPath(B);this._onAfterPageLoaded(c)},_updateTrigger:function(){var t=document.getElementById(this._oControl.getId()+"-triggerList");if(!t){return}var m=this._oControl.getMaxItemsCount();var i=this._oControl.getItems().length;var d=(!i||!this._iItemCount||this._iItemCount>=m)?"none":"block";if(sap.ui.Device.system.desktop&&d=="none"&&t.contains(document.activeElement)){jQuery(t).closest("[data-sap-ui-popup]").focus()}t.style.display=d;this._oControl.$("trigger-itemInfo").text(this._getListItemInfo())},_showIndicator:function(){var h=this._oControl.getGrowingScrollToLoad(),H=this._getHasScrollbars();if(h&&H){this._checkTriggerType(h,H);var $=this._oControl.$("triggerList").css("display","block");if(sap.ui.Device.support.touch&&this._oScrollDelegate){if(this._oScrollDelegate.getMaxScrollTop()-this._oScrollDelegate.getScrollTop()<$.height()){this._oScrollDelegate.refresh();this._oScrollDelegate.scrollTo(this._oScrollDelegate.getScrollLeft(),this._oScrollDelegate.getMaxScrollTop())}}}else{this._oControl.$("trigger-busyIndicator").addClass("sapMGrowingListBusyIndicatorVisible")}this._getBusyIndicator().setVisible(true)},_checkTriggerType:function(h,H){if(!h){this._showsTrigger=this._showsLoading=false;return}if(!this._showsLoading&&H){this._showsLoading=true;this._showsTrigger=false;this._switchTriggerWithLoadingIndicator(true)}if(!this._showsTrigger&&!H){this._showsTrigger=true;this._showsLoading=false;this._switchTriggerWithLoadingIndicator(false)}},_switchTriggerWithLoadingIndicator:function(s){var r=sap.ui.getCore().createRenderManager(),a,t=this._oControl.$("triggerList");if(s){a=this._getLoading()}else{a=this._getTrigger()}a._renderInList=true;t.empty();r.render(a,t[0])},_hideIndicator:function(){jQuery.sap.delayedCall(0,this,function(){if(this._oControl){this._getBusyIndicator().setVisible(false);if(this._oControl.getGrowingScrollToLoad()&&this._getHasScrollbars()){this._oControl.$("triggerList").css("display","none")}else{this._oControl.$("trigger-itemInfo").html(this._getListItemInfo());this._oControl.$("trigger-busyIndicator").removeClass("sapMGrowingListBusyIndicatorVisible")}}})},_triggerLoadingByScroll:function(){this.requestNewPage()}});

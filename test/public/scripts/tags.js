
riot.tag2('page-index', '<div class="flex flex-column h-full"> <module-header></module-header> <div class="h-full overflow-scroll"> <div class="container p10"> <div class="items"> <div class="rounded-4 mb32 f" each="{items}"> <div class="flex-fixed mr16"> <div class="w200 s-w100 rect"><img class="block s-full object-fit-cover" riot-src="{image_url}"></div> </div> <div class="w-full"> <h3 class="text-primary"><a href="/items/{id}">{title}</a></h3> <p class="line-clamp-3 word-break-all s-hide">{body}</p> </div> </div> </div> </div> </div> <module-tabbar></module-tabbar> </div>', '', '', function(opts) {
    var self = this;

    this.on('fetch', function(e) {
      this.items = e.response.data.items;
      this.update();
    });

    this.on('show', function() {
    });
});


riot.tag2('page-items-detail', '<div class="flex flex-column h-full"> <module-header></module-header> <div class="h-full overflow-scroll"> <div class="container p10"><a href="" onclick="spat.nav.back()"><</a> <h1>{item.title}</h1> <div class="body" ref="body"></div> </div> </div> <module-tabbar></module-tabbar> </div>', 'page-items-detail .body h2,[data-is="page-items-detail"] .body h2,page-items-detail .body h3,[data-is="page-items-detail"] .body h3{margin-bottom:0.5rem} page-items-detail .body p,[data-is="page-items-detail"] .body p,page-items-detail .body ul,[data-is="page-items-detail"] .body ul,page-items-detail .body ol,[data-is="page-items-detail"] .body ol,page-items-detail .body pre,[data-is="page-items-detail"] .body pre,page-items-detail .body iframe,[data-is="page-items-detail"] .body iframe,page-items-detail .body img,[data-is="page-items-detail"] .body img{margin-bottom:1.5rem} page-items-detail .body ul,[data-is="page-items-detail"] .body ul,page-items-detail .body ol,[data-is="page-items-detail"] .body ol{margin-left:1rem} page-items-detail .body ul li,[data-is="page-items-detail"] .body ul li,page-items-detail .body ol li,[data-is="page-items-detail"] .body ol li{margin-bottom:0.5rem} page-items-detail .body h2,[data-is="page-items-detail"] .body h2{font-size:18px} page-items-detail .body p,[data-is="page-items-detail"] .body p{line-height:1.7} page-items-detail .body img,[data-is="page-items-detail"] .body img{display:block} page-items-detail .body pre code,[data-is="page-items-detail"] .body pre code{display:block;padding:0.5em;background:#272822;color:#ddd;font-family:Consolas,"Liberation Mono",Menlo,Courier,monospace;font-size:13px;-webkit-font-smoothing:initial;font-smoothing:initial;overflow-x:auto;border-radius:2px} page-items-detail .body code,[data-is="page-items-detail"] .body code{background:#272822;padding:0.25em 0.5em;color:#ddd;font-family:Consolas,"Liberation Mono",Menlo,Courier,monospace;font-size:13px;-webkit-font-smoothing:initial;font-smoothing:initial;border-radius:2px;margin-left:4px;margin-right:4px}', 'spat-animation="slide"', function(opts) {
    var self = this;

    this.on('fetch', function(e) {
      this.item = e.response.data.item;
      this.update();
    });

    this.on('show', function(e) {
    });

    this.on('update', function() {
      if (this.item) {
        this.refs.body.innerHTML = marked(this.item.body);
      }
    });
});


riot.tag2('page-settings', '<h2>settings</h2>', '', '', function(opts) {
});
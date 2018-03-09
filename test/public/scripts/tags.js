
riot.tag2('page-index', '<div class="flex flex-column h-full"> <module-header></module-header> <div class="h-full overflow-scroll"> <div class="container p10"> <div class="items"> <div class="rounded-4 mb32 f" each="{items}"> <div class="flex-fixed mr16"> <div class="w200 s-w100 rect"><img class="block s-full object-fit-cover" riot-src="{image_url}"></div> </div> <div class="w-full"> <h3 class="text-primary"><a href="/items/{id}">{title}</a></h3> <p class="line-clamp-3 word-break-all s-hide">{body}</p> </div> </div> </div> </div> </div> <module-tabbar></module-tabbar> </div>', '', '', function(opts) {
    var self = this;

    this.on('show', function() {
      app.ref.child('items').get().then((res) => {
        this.items = res.data.items;
        this.update();
      });
    });

    this.on('fetch', function(e) {
      this.posts = e.response;
      this.update();
    });
});


riot.tag2('page-items-detail', '<div class="flex flex-column h-full"> <module-header></module-header> <div class="h-full overflow-scroll"> <div class="container p10"> <h1>{item.title}</h1> <div ref="body"></div> </div> </div> <module-tabbar></module-tabbar> </div>', '', 'spat-animation="slide"', function(opts) {
    var self = this;

    this.on('show', function(e) {
      app.ref.child('items').child(e.opts.id).get().then((res) => {
        this.item = res.data.item;
        this.update();
      });
    });

    this.on('update', function() {
      if (this.item) {
        this.refs.body.innerHTML = marked(this.item.body);
      }
    });
});


riot.tag2('page-settings', '<h2>settings</h2>', '', '', function(opts) {
});
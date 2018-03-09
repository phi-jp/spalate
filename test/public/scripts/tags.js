
riot.tag2('page-index', '<div class="flex flex-column h-full"> <module-header></module-header> <div class="h-full overflow-scroll"> <div class="container p10"> <div class="posts"> <div class="box-shadow p16 rounded-4 bg-white mb20" each="{items}"> <h3 class="text-primary"><a href="/post/{id}">{title}</a></h3> <p>{body}</p> </div> </div> </div> </div> <module-tabbar></module-tabbar> </div>', '', '', function(opts) {
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


riot.tag2('page-settings', '<h2>settings</h2>', '', '', function(opts) {
});
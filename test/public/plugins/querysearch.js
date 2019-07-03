/*
 * querysearch.js
 */


;(function(exports) {

  var tagRE = /[ ]?#(w*[一-龠_ぁ-ん_ァ-ヴーa-zA-Z0-9]+w*)/g;
  var userRE = /@([A-Za-z0-9_-]+)/;
  var optionRE = /([A-Za-z0-9_-]+\:[A-Za-z0-9_-]+)/g;

  var QuerySearch = {
    parse: function(query) {
      var tags = this.parseTags(query);
      var username = this.parseUsername(tags.text);
      var options = this.parseOptions(username.text);
      return {
        tags: tags.tags,
        username: username.username,
        options: options.options,
        text: options.text,
      };
    },

    parseTags: function(query) {
      var tags = [];

      var text = query.replace(tagRE, function(a, b) {
        tags.push(b.trim());
        return '';
      });

      return {
        text: text.trim(),
        tags: tags,
      };
    },

    parseUsername: function(query) {
      var username = '';

      var text = query.replace(userRE, function(a, b) {
        username = b;
        return '';
      });

      return {
        text: text.trim(),
        username: username,
      };
    },

    parseOptions: function(query) {
      var strings = [];
      var text = query.replace(optionRE, function(a, b) {
        strings.push(b);
        return '';
      });

      var options = {};
      strings.forEach(function(str) {
        var o = str.split(':');
        var key = o[0];
        var value = o[1].trim();

        if (value === 'true') value = true;
        else if (value === 'false') value = false;

        options[o[0]] = value;
      })

      return {
        text: text.trim(),
        options: options,
      };
    },
  };

  exports.QuerySearch = QuerySearch;

  // // test
  // console.log(QuerySearch.parse(' @phi hogefoobar #hoge #foo #bar private:true'));

})(typeof exports === 'undefined' ? this : exports);


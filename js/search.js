(function() {

  var posts;

  $(function() {
    restore();
  });

  $(document).on('submit', '.js_search_form', function(e) {
    e.preventDefault();

    var query = $('.js_search_query').val().trim();
    if (query) {
      search(query);
    }
  });

  $(window).on('popstate', function(e) {
    restore();
  });

  function restore() {
    var query = decodeURIComponent(location.search.slice(3));
    if (query) {
      search(query);
    } else {
      showContents();
    }
  }

  function load(cb) {
    if (posts) {
      cb();
    } else {
      $.getJSON('/posts.json', function(data) {
        posts = data;
        cb();
      });
    }
  }

  function search(query) {
    load(function() {
      var results = [];
      var pattern = query.split(/[\s　]+/).join('|');
      var re = new RegExp(pattern, 'i');
      for (var i = 0, l = posts.length; i < l; i++) {
        var post = posts[i];
        if (re.test(post.title) || re.test(post.content)) {
          results.push(post);
        }
      }
      render(query, results);
    });
  }

  function render(query, results) {
    var url = '/?q=' + encodeURIComponent(query);
    var html = ['<div class="sj-content js_search_result"><h1><a href="', url, '">"', query, '"の検索結果</a></h1><p>', results.length, ' 件の記事</p><ul class="media-list">'];
    for (var i = 0, l = results.length; i < l; i++) {
      var post = results[i];
      html.push('<li class="media"><div class="media-body"><h4 class="media-heading">', '<a href="', post.url, '">', post.title, '</a></h4>', truncate(post.content), '</div></li>');
    }
    html.push('</ul></div>');

    var $contents = $('.js_contents');
    $('.js_search_result').remove()
    $contents.children().hide();
    $contents.append(html.join(''));
    if (url != '/' + location.search) {
      history.pushState(null, null, url);
    }
  }
  
  function showContents() {
    var $contents = $('.js_contents');
    $('.js_search_result').remove()
    $contents.children().show();
  }

  function truncate(text) {
    var length = 100;
    return text.slice(0, length) + (text.length > length ? '…' : '')
  }

})();


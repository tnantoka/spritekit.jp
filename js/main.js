(function() {

  $(function() {
  });

  $(document).on('click', '.js_navbar_top', function(e) {
    if(!/a/i.test(e.target.tagName)) {
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
  });

  $(document).on('mouseover', '.js_navbar_top', function(e) {
    if($('html, body').scrollTop() && !/a/i.test(e.target.tagName)) {
      $('.js_navbar_top').tooltip('show');
    }
  });

  $(document).on('mouseout', '.js_navbar_top', function(e) {
    $('.js_navbar_top').tooltip('hide');
  });



})();

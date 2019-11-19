(function ($) {

  /**
   * The recommended way for producing HTML markup through JavaScript is to write
   * theming functions. These are similiar to the theming functions that you might
   * know from 'phptemplate' (the default PHP templating engine used by most
   * Drupal themes including Omega). JavaScript theme functions accept arguments
   * and can be overriden by sub-themes.
   *
   * In most cases, there is no good reason to NOT wrap your markup producing
   * JavaScript in a theme function.
   */
  Drupal.theme.prototype.newcarsmellExampleButton = function (path, title) {
    // Create an anchor element with jQuery.
    return $('<a href="' + path + '" title="' + title + '">' + title + '</a>');
  };

  /**
   * Behaviors are Drupal's way of applying JavaScript to a page. In short, the
   * advantage of Behaviors over a simple 'document.ready()' lies in how it
   * interacts with content loaded through Ajax. Opposed to the
   * 'document.ready()' event which is only fired once when the page is
   * initially loaded, behaviors get re-executed whenever something is added to
   * the page through Ajax.
   *
   * You can attach as many behaviors as you wish. In fact, instead of overloading
   * a single behavior with multiple, completely unrelated tasks you should create
   * a separate behavior for every separate task.
   *
   * In most cases, there is no good reason to NOT wrap your JavaScript code in a
   * behavior.
   *
   * @param context
   *   The context for which the behavior is being executed. This is either the
   *   full page or a piece of HTML that was just added through Ajax.
   * @param settings
   *   An array of settings (added through drupal_add_js()). Instead of accessing
   *   Drupal.settings directly you should use this because of potential
   *   modifications made by the Ajax callback that also produced 'context'.
   */
  Drupal.behaviors.newcarsmellExampleBehavior = {
    attach: function (context, settings) {
      // By using the 'context' variable we make sure that our code only runs on
      // the relevant HTML. Furthermore, by using jQuery.once() we make sure that
      // we don't run the same piece of code for an HTML snippet that we already
      // processed previously. By using .once('foo') all processed elements will
      // get tagged with a 'foo-processed' class, causing all future invocations
      // of this behavior to ignore them.
      $('.some-selector', context).once('foo', function () {
        // Now, we are invoking the previously declared theme function using two
        // settings as arguments.
        var $anchor = Drupal.theme('newcarsmellExampleButton', settings.myExampleLinkPath, settings.myExampleLinkTitle);

        // The anchor is then appended to the current element.
        $anchor.appendTo(this);
      });
    }
  };

  $(document).ready(function() {

    function getUrlEnding(url) {
        var parts = url.split("/");
        return (url.lastIndexOf('/') !== url.length - 1
           ? parts[parts.length - 1]
           : parts[parts.length - 2]);
    }
    // On only the /Categories/ page, add description to top + category links below rows
    if (getUrlEnding(window.location.href) === 'categories') {

        // After every 3rd category item, add a link to view that parent category page
        let categoryItems = $('.category-item');
        for (let i=0; i<categoryItems.length; i++) {
          if ((i+1) % 3 === 0) {
            // Get category name and generate the link to it
            let current = $('.category-item').eq(i);
            let categoryName = current.prev().prev().prev()[0].innerHTML;
            let urlSlug = categoryName.replace(/\s+/g, '-').toLowerCase();
            let categoryLink = $('<div class="link-row"><a href="/categories/' + urlSlug + '">View All ' + categoryName + ' Products</a></div>');
            categoryLink.insertAfter(current);
            // Add link to category name which will direct to that category page
            let category = current.prev().prev().prev();
            category.wrap('<a href="/categories/' + urlSlug + '" style="text-decoration:none"></a>');

          }
        }
    } // end if

    // * Subcategory pages
    if (window.location.href.indexOf("categories/") > -1) {
        // Subcategory pages - Breadcrumb
        let navSection = $('h1');
        let breadcrumbLink = $('<div style="text-transform:uppercase;color:#027FC4;"><a href="/categories" style="text-decoration:none;">All Products</a></div>');
        breadcrumbLink.insertAfter(navSection);
        $('h1').remove();

    } // end if on Subcategories page

    // * Product detail pages
    if (window.location.href.indexOf("product/") > -1) {
        // (WIP) Product Detail pages - Breadcrumb
        let location = window.location.href.split('/');
        let baseUrl = "/categories/";
        let endUrl = location[location.length-2];
        let newUrl = baseUrl + endUrl;

        let catString = endUrl.split('-').join(' ');
        let breadcrumbLink = $('<div style="margin-top:15px;margin-left:20px;display:block;text-transform:uppercase;color:#027FC4"><a href="/categories" style="text-decoration:none;">All Products</a> <span class="breadcrumb-divider"> ></span> <a href="' + newUrl + '" style="text-decoration:none;">'+ catString + '</a></div>');
        breadcrumbLink.insertBefore($('.l-main'));

        // if there is only 1 image then hide the thumbnail/resize the main img, change other related styles
        if (document.querySelectorAll('.view-product-page-images .pager-item').length === 1) {
              document.querySelector('.view-product-page-images .pager-item').style.setProperty('display','none');
      }
      let maintitle = document.querySelector('h1');
      maintitle.classList.add('product-detail-title');
      let subtitle = document.querySelector('.field--name-field-sub-title .field__item');
      subtitle.classList.add('product-detail-subtitle');
      let leftDetails = document.querySelector('.l-region--highlighted');
      leftDetails.classList.add('product-detail-left');
      let featuredTitle = document.querySelector('.node--product--full .group-middle > h3');
      if (featuredTitle && featuredTitle.innerHTML.split(' ').join('').indexOf('FeaturedScents') > -1) {
        featuredTitle.classList.add('featured-scents-title');
      }
      let sectionTitles = document.querySelectorAll('h3.field-label');
      for (let x in sectionTitles) {
        if (sectionTitles[x].nodeType === 1) { sectionTitles[x].classList.add('section-title-hdr') }
      }

      // Fix Product Detail view fields layout
      let rightDetails = $('.field--type-text-with-summary');
      rightDetails.get(0).classList.add('product-detail-description');
      rightDetails.insertAfter(leftDetails);
      $(subtitle).appendTo(maintitle);

      // Add disclaimer text to Other Scents
      let otherscents = $('.field--name-field-other-scents');
      let disclaimer = $('<p class="scents-disclaimer"><sup>*</sup>Not all scents are available in all formats</p>');
      disclaimer.insertAfter(otherscents);

    } // end if on Product Details page

}) // end document ready

})(jQuery);

$(document).ready(function () {
  // add toggle functionality to abstract and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // within each publication list: newest year first, accepted papers before preprints (otherwise keep bib order)
  $("ol.bibliography").each(function () {
    var $ol = $(this);
    var items = $ol.children("li").get();
    var key = function (li) {
      var $row = $(li).find("[data-pub-year]").first();
      return { year: parseInt($row.data("pub-year"), 10) || 0, preprint: String($row.data("pub-preprint")) === "true" ? 1 : 0 };
    };
    var keyed = items.map(function (li, i) {
      return { li: li, i: i, k: key(li) };
    });
    keyed.sort(function (a, b) {
      return b.k.year - a.k.year || a.k.preprint - b.k.preprint || a.i - b.i;
    });
    keyed.forEach(function (x) {
      $ol.append(x.li);
    });
  });

  // publications selected/all toggle
  $(".publication-toggle").click(function () {
    var target = $(this).data("pub-target");
    $(".publication-toggle").toggleClass("active", false);
    $(this).toggleClass("active", true);
    $(".publication-panel").each(function () {
      $(this).prop("hidden", $(this).data("pub-panel") !== target);
    });
  });

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let theme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (theme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });
});

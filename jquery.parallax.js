(function($) {
  //PREREQUISITES
  //  Merge Sort function
  //  Input
  //    array (Array) - An Associative Array to be sorted by it's second entry
  //  Return
  //    Array - The resulting sorted array
  function mergeSort(arr) {
    if (arr.length < 2)
      return arr;

    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
  }

  //  Sort and merge the two array halves
  //  Input
  //    left (Array) - An Associative Array to be sorted by it's second entry
  //    right (Array) - An Associative Array to be sorted by it's second entry
  //  Return
  //    Array - The resulting merged array
  function merge(left, right) {
    var result = [];

    while (left.length && right.length) {
      if (left[0][1] <= right[0][1]) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    }

    while(left.length)
      result.push(left.shift());

    while(right.length)
      result.push(right.shift());

    return result;
  }

  //  Get ratio for all animations
  //  Input
  //    state (Int between 0 and 1) - The state of the animation as provided by fx
  //    start (Int) - The starting integer
  //    end (Int) - the ending integer
  //  Return
  //    Int - The new state in the ratio
  function getNewRatio(state, start, end) {
    return (((state - 0) * (end - start)) / (1 - 0)) + start; //(((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
  }

  //  Parse the operator (+=, or -=) out of number
  //  Input
  //    position (Int) - The position to be moved to
  function parseOperator(position) {
    //Determine operator
    var object = {
      position: position
    };

    if(/\+=([\d\.]*)/.test(position))
      object.operator = "+=";

    if (/\-=([\d\.]*)/.test(position))
      object.operator = "-=";

    if (typeof object.operator != "undefined")
      object.position = parseFloat(String(position).replace(object.operator, ""));

    return object;
  }

  //  Global Variables
  $.divs = new Array; //object of divs, their depths, and z-indexes
  $.parallaxSettings = {}; //plugin wide settings holder
  $.parallaxPrefix = ""; //prefix for css3 transitions

  //  Set a veriable to be appended to transitions based on browser
  var browser = $.browser;
  if (browser.webkit || browser.chrome) {
    $.parallaxPrefix = "-webkit-";
  } else if (browser.mozilla) {
    $.parallaxPrefix = "-moz-";
  } else if (browser.opera) {
    $.parallaxPrefix = "-o-";
  } else if (browser.msie) {
    $.parallaxPrefix = "-ms-";
  } else {
    $.parallaxPrefix = "";
  }

  //FUNCTIONS
  //  Set global parallax settings
  //  Input
  //    Options {
  //      obscure (Bool) - fade the elements as they grow further away
  //      obscureOffset (Int between 0 and 1) - the offset for the fade
  //      zOffset (Int positive) - the z-index offset of all elements
  //      topLeft (Bool) - whether to set depth from top left or not
  //    }
  $.parallax = function(options) {
    //Set defaults
    options = $.extend({}, {
      obscure : true,
      obscureOffset: 0,
      zOffset : 1,
      topLeft: false
    }, options);

    //Add options to settings
    $.parallaxSettings = options;

    //Maintain Chainability
    return this;
  }

  //  Init function for divs, will add to array
  $.fn.parallax = function() {
    //check if already in arrray
    var id = this.attr("id");
    var broken = false;

    $.each($.divs, function() {
      if (this[0] == id) {
        broken = true;
        return false;
      }
    });

    //If not broken
    if (broken === false)
      $.divs.push(new Array(id, 1, this.css("z-index")));

    //Set transform origin
    if ($.parallaxSettings.topLeft) {
      var prefix = (typeof this.attr("style") === "undefined") ? "" : this.attr("style") + " ";
      this.attr("style", prefix + $.parallaxPrefix + "transform-origin: left top;");
    }

    //Maintain Chainability
    return this;
  }


  //  Set the css position or depth of an element based on depth
  //  Input
  //    options {
  //      left (Int) or (String) - the left amount to be moved to
  //      top (Int) or (String) - the top amount to be moved to
  //      depth (Int between 0 and 1) or (String) - the depth amount to be moved to
  //    }
  //    or
  //    option (String) - either "left" "top" or "depth", to get the value of these
  $.fn.parallaxCSS = function(options) {
    if (typeof options === "object") {
      if (options.depth)
        setDepth.call(this, options.depth);
      if (options.left)
        topLeft.call(this, "left", options.left);
      if (options.top)
        topLeft.call(this, "top", options.top);
    } else if (typeof options === "string") {
      if (options === "depth")
        return getDepth.call(this);
      else if (options === "left")
        return $(this).position().left;
      else if (options === "top")
        return $(this).position().top;
    }

    //Maintain Chainability
    return this;
  }

  //  The function to move either left or top
  //  Input
  //    type (String) - either left or right
  //    position (Int) - the top position to move to
  function topLeft(type, position) {
    //if window or document
    if (this.selector == "parallaxAll") {
      $.each($.divs, function() {
        topLeft.call($(this[0]), type, position);
      });
    } else {
      //Determine operator
      var opObject = parseOperator(position);

      //Determine destination based on operator
      var destination;
      var select = $(this);
      var widthOrHeight = (type === "left") ? select.width() : select.height();
      var pos = select.position();
      var posLeftOrRight = (type === "left") ? pos.left : pos.top;
      var depth = select.parallaxCSS("depth");

      if (typeof opObject.operator === "undefined")
        destination = opObject.position * select.parallaxCSS("depth");
      else if (opObject.operator === "+=")
        destination = (posLeftOrRight - (widthOrHeight - (depth * widthOrHeight)) / 2) + (opObject.position * depth); //formula: (leftPosition - offset) + (destination * depth)
      else if (opObject.operator === "-=")
        destination = (posLeftOrRight - (widthOrHeight - (depth * widthOrHeight)) / 2) - (opObject.position * depth); //formula: (leftPosition - offset) + (destination * depth)

      //Set destination
      select.css(type, destination);
    }
  }

  //  Retrieve element's depth
  function getDepth() {
    var id = this.attr("id");
    var returnData = "1";

    $.each($.divs, function() {
      if (this[0] == id) {
        returnData = this[1];
        return false;
      }
    });

    return returnData;
  }

  //  Set element's depth
  //  input
  //    Depth (Int between 0 and 1) - the depth of the element
  function setDepth(depth) {
    //Set defaults
    if (typeof depth === 'undefined')
      depth = 0;

    //  Remove any old visual effects
    var css = this.attr("style");
    if (typeof css != "undefined")
      css = css.replace(/(-webkit-|-moz-|-o-|-ms-|)transform:(.*?);/g, "").replace(/opacity:(.*?);/g, "");
    else
      css = "";

    //Set element visual effects
    this.attr("style", css + "; " + $.parallaxPrefix + "transform: scale(" + depth + ");" + ($.parallaxSettings.obscure === true ? "opacity: " + (depth + $.parallaxSettings.obscureOffset) + ";" : ""));

    //Add new depth
    var id = this.attr("id");

    $.each($.divs, function() {
      if (this[0] == id) {
        this[1] = depth;

        return false;
      }
    });

    //sort depths of divs
    $.divs = mergeSort($.divs);

    //update any wrong z-indexes
    $.each($.divs, function() {
      var position = $.divs.indexOf(this);
      //check if z-index in array matches position in array or if 0
      if (this[2] != position || position == 0) {
        //update z-index in array
        $.divs[position][3] = position;

        //update real z-index
        $("#" + $.divs[position][0]).css("z-index", position + $.parallaxSettings.zOffset);
      }
    });
  }

  //  Overload the Animate function to allow both individual and mass animations
  //  Input
  //    animations {
  //      depth (Int between 0 and 1) or (String) - The depth to animate to
  //      left (Int) or (String) - the left position to animate to
  //      top (Int) or (String) - the top position to animate to
  //    }
  //    pgcOptions {
  //      duration (Int) - the length in milliseconds of the transition
  //      easing (String) - the type of jQuery easing to be used
  //      callback (Function) - a function to be called when the animation is finished
  //    }
  $.fn.parallaxAnimate = function(animations, options) {
    if (this.selector == "parallaxAll") {
       $.each($.divs, function() {
        animate($(this[0]), animations, options);
       });
    } else {
      animate($(this), animations, options);
    }

    //Maintain Chainability
    return this;
  }

  //  Animate an element based on depth
  //  Input
  //    object (Element) - the element to be animated
  //    animations {
  //      depth (Int between 0 and 1) - The depth to animate to
  //      left (Int) - the left position to animate to
  //      top (Int) - the top position to animate to
  //    }
  //    pgcOptions {
  //      duration (Int) - the length in milliseconds of the transition
  //      easing (String) - the type of jQuery easing to be used
  //      callback (Function) - a function to be called when the animation is finished
  //    }
  function animate(object, animations, options) {
    //Set Defaults
    options = $.extend({}, {
      duration: 500,
      easing: "linear",
      callback: function() {}
    }, options);

    //Set origional positions and depths
    if (animations.depth) {
      //Determine operator
      var dObject = parseOperator(animations.depth);
      var origDepth = object.parallaxCSS("depth");
      var dDest;

      if (typeof dObject.operator === "undefined")
        dDest = dObject.position;
      else if (dObject.operator === "+=")
        dDest = origDepth + dObject.position;
      else if (dObject.operator === "-=")
        dDest = origDepth - dObject.position;
    }

    if (animations.left || animations.top) {
      var pos = object.position();
      var depth = object.parallaxCSS("depth");
    }

    if (animations.left) {
      var lObject = parseOperator(animations.left);
      var width = object.width();
      var origLeft = (pos.left - (width - (depth * width)) / 2) / depth //(leftPosition - offset) / depth
      var lDest;

      if (typeof lObject.operator === "undefined")
        lDest = lObject.position;
      else if (lObject.operator === "+=")
        lDest = origLeft + lObject.position;
      else if (lObject.operator === "-=")
        lDest = origLeft - lObject.position;
    }

    if (animations.top) {
      var tObject = parseOperator(animations.top);
      var height = object.height();
      var origTop = (pos.top - (height - (depth * height)) / 2) / depth; //(topPosition - offset) / depth
      var tDest;

      if (typeof tObject.operator === "undefined")
        tDest = tObject.position;
      else if (tObject.operator === "+=")
        tDest = origTop + tObject.position;
      else if (tObject.operator === "-=")
        tDest = origTop - tObject.position;
    }

    //Set custom object to apply animation to
    $("body").append('<div id="pgc-animHolder" style="left: 0px;"></div>');

    //Start animation
    $("#pgc-animHolder").animate({left: "1"}, {
      duration: options.duration,
      easing: options.easing,
      complete: callback(),
      step: function(now) {
        if (animations.depth) {
          object.parallaxCSS({"depth": getNewRatio(now, parseFloat(origDepth), parseFloat(dDest))});
        }

        if (animations.left) {
          object.parallaxCSS({"left": getNewRatio(now, parseFloat(origLeft), parseFloat(lDest))});
        }

        if (animations.top) {
          object.parallaxCSS({"top": getNewRatio(now, parseFloat(origTop), parseFloat(tDest))});
        }
      }
    });

    function callback() {
      $("#pgc-animHolder").remove();
      options.callback;
    }
  }
})(jQuery);

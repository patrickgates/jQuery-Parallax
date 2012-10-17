jQuery-Parallax
===============
A parallax library created in jQuery utilizing CSS3 transitions, as used on patrickgatesconsulting.com. It allows the developer to set a depth for a DIV, and then change the top or left of said element and have it move according to the law of parallax.

If you're unfamiliar with what parallax is, please reference this handy article: http://en.wikipedia.org/wiki/Parallax.


Quick Start
===========
- First include jQuery and the parallax library in the head of your HTML document
- To activate parallax, document wide, use the
  $.parallax();
command with the appropriate options
- Then for each DIV you wish to animate activate it like so:
  $("#div").parallax();
no options necessary, and is fully chainable.
- To set the top, left, or depth of an element:
  $("#div").parallaxCSS({depth: 0.5, left: "+=100", top: 10});
- To animate the top, left, or depth of an element:
  $("#div").parallaxAnimate({depth: 0.5, left: "+=100", top: 10}, {duration: 500, easing: "easeInQuad"});

Notes
=====
- Depth must be between 0 and 1
- Every DIV you use parallax on must have an ID
- You may not use a class selector, the best way to do that would be to call them in a loop.
- When using parallaxCSS you may not use the shorthand:
  parallaxCSS("attribute", value);
you must set the attributes as an object
  parallaxCSS({"attribute": value});
- When using parallaxAnimate you may not use the duration shorthand:
  parallaxAnimate({"attribute": value}, 500);
You must set the duration as an object
  parallaxAnimate({"attribute": value}, {duration: 500});

Afterword
=========
If you find yourself using my library in creative ways, feel free to comment about it at:
  http://patrickgatesconsulting.com/jquery-parallax/
or email me at:
  patrick@patrickgatesconsulting.com
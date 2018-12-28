// Christian Seremetis
// 26 December 2018
// Javascript app to
// create a pinwheel carousel

// Declare necessary constants
const DEGREES = 2 * Math.PI;
const RADIUS = 200;
const OFFSET = Math.PI / 2;

// Set up Spinwheel functions
//-----------------------------

/** Public constructor for spinwheel object.
  * @param {integer} num_items the number of elements
  * @param {hashmap} item_list an array of Cogs
  */
function Spinwheel(num_items, item_list) {
  this.elems = item_list;
  this.num_elems = num_items;
}

/** Public constructor for each "cog" in the wheel.
  * @param {string} name, the corresponding title
  * @param {string} img, the link to the corresponding image
  * @param {string} caption, the corresponding caption
  */
function Cog(name, img, caption) {
  this.name = name;
  this.caption = caption;
  this.img = loadImage(img);
  this.angle = OFFSET;
  //convert from polar to cartesian
  let x = RADIUS * Math.cos(OFFSET);
  let y = RADIUS * Math.sin(OFFSET);

  this.position = createVector(x, y);
}

/** Updates a cog's coordinates (in polar coordinates). */
Cog.prototype.setCoordinates = function(r, theta) {
  console.log(Math.cos(theta))
  console.log(Math.sin(theta))
  this.angle = theta;
  this.position.x = r * Math.cos(theta);
  this.position.y = r * Math.sin(theta);
};

/** Places a Spinwheel's Cogs in their appropriate place. */
Spinwheel.prototype.generateDisplayMap = function() {
  let theta_slice = DEGREES / (this.num_elems);

  //iterate through Cogs, adding an appropriate offset
  for (let i = 0; i < this.num_elems; i++) {
    let e = this.elems[i];
    e.setCoordinates(RADIUS, OFFSET + theta_slice * i);
  }

  return this.elems;
};

/** "Spins" the wheel by rearranging its Cogs. */
Spinwheel.prototype.spinForward = function () {
  let theta_slice = DEGREES / (this.num_elems);
  let temp = this.elems.shift();
  this.elems.push(temp);

  return this.generateDisplayMap();
};

/** "Spins" the wheel in reverse, again by rearranging its Cogs. */
Spinwheel.prototype.spinBackward = function () {
  let theta_slice = DEGREES / (this.num_elems);
  let temp = this.elems.pop();
  this.elems.unshift(temp);

  return this.generateDisplayMap();
};

// Run animations using P5
//-----------------------------
var cogs = []; //stores the cogs in our spinwheel
var sw; //the spinwheel itself
var displayMap; //the wheel's array of cogs
var forward; //variable to store the "NEXT" button
var backward; //variable to store the "PREV" button
var focus; //the current cog we're looking at
var head; //the caption's header
var cap; //the caption

function updateText() {
  focus = displayMap[0];
  head.html(`<h1>${focus.name}</h1>`);
  cap.html(`<p>${focus.caption}</p>`);
}

function setup() {
  let myCanvas = createCanvas(600, 1200);
  myCanvas.parent('canvas');

  //set up next and prev buttons
  backward = createButton("PREV");
  forward = createButton("NEXT");
  backward.parent(select('#canvas'));
  forward.parent(select('#canvas'));
  forward.class('btn btn-default');
  backward.class('btn btn-default');
  forward.position(500, 1150);
  backward.position(200, 1150);

  //create all the necessary cogs
  let cog1 = new Cog("Snowball Fight", "images/snowman.gif", "A virtual reality game where you play as a child in a snowball fight against an army of old relatives and schoolteachers. Built using the A-Frame and Three.js VR frameworks, the project deals with the A-Frame Physics library, Player class, and interactive components. play the live demo by clicking <a href='https://cseremetis.github.io/Snowball_Fight/index.html'>here</a>");

  let cog2 = new Cog("Oktoberfest", "images/oktoberfest.gif", "In the fall of 2016, I was commissioned to write an event page for the 'Ridgewood Education Foundation', an organization that provides grants to educational programs in the village of Ridgewood, NJ. The web page advertises the Foundation's 'Oktoberfest' fundraising event. Click <a href='http://foundationoktoberfest.herokuapp.com'>here</a> to see the live page.");

  let cog3 = new Cog("Real Time Tutoring", "images/real_time_tutoring.gif", "A commission for an online tutoring firm that specializes in STEM fields. I designed the front-end GUI using WordPress.org and the back-end formerly with a set of raw PHP scripts connected to a MySQL database. This custom software allowed students to login/out, select a tutor who they would like to work with, and schedule appointments via an online portal. In its preliminary stages, this code was scrapped but can still be found <a href='https://github.com/cseremetis/RTT-Scripts'>here.</a> If you would like to visit the website you can do so <a href='http://realtimetutoring.org'>here</a>");

  let cog4 = new Cog("Ridgewood Ed Foundation", "images/foundation.gif", "Due to their satisfaction with the Oktoberfest landing page, the Ridgewood Ed Foundatios asked me to remake their public website. Although it never went live, there is still a demo site hosted on Heroku that you can access <a href='http://refoundation.herokuapp.com'>here</a>. Built with Ruby on Rails and PostgreSQL, users with administrator access can log in through a secret portal and change the site's content without accessing the source code.");

  let cog5 = new Cog("Ruby Graph", "images/ruby_graph.gif", "A graph implementation written in Ruby. Includes a series of simple and complex Graph classes wrapped in the same 'Graph' module. Designed for easy integration into a Ruby application to store and parse data. Includes remedial search and sort functions. Full source code available on <a href='http://github.com/cseremetis/RubyGraph'>Github</a>")

  let cog6 = new Cog("Regression Forecasting", "images/graph.gif", "A remedial data science project written in Javascript. The app applies linear and polynomial regression algorithms to sets of economic data gathered from an API. I wrote the app to teach myself Javscript in order to teach a JS course at Upperline School of Code over the summer of 2018. The source code is available <a href='https://github.com/cseremetis/PredictiveModeling'>here</a>. If you are interested in test-driving the application, feel free to clone the Github repo and launch the app by opening the index.html file");

  cogs.push(cog1);
  cogs.push(cog2);
  cogs.push(cog3);
  cogs.push(cog4);
  cogs.push(cog5);
  cogs.push(cog6);

  //initialize the spinwheel
  sw = new Spinwheel(6, cogs);

  displayMap = sw.generateDisplayMap();

  //create the header-caption combo for our first element
  focus = displayMap[0];
  let container = createDiv();
  container.parent(select('#caption'));
  container.id("text_box");
  head = createElement('h1', focus.name);
  cap = createElement('p', focus.caption);
  head.class("text-center");
  head.parent(container);
  cap.class("text-center");
  cap.parent(container);

  //event handlers for click events on the buttons
  forward.mousePressed(function() {
    clear();
    displayMap = sw.spinForward();
    updateText();
  });

  backward.mousePressed(function() {
    clear();
    displayMap = sw.spinBackward();
    updateText();
  });
}

function draw() {
  translate(width / 2, height / 2);

  for (let i = 0; i < displayMap.length; i++) {
    tint(255, 75);
    e = displayMap[i];
    if (i == 0) {
      image(e.img, e.position.x - 50, e.position.y,
      e.img.width / 2, e.img.width / 2);
    } else if (i == 1 || i == displayMap.length - 1) {
      image(e.img, e.position.x, e.position.y,
      e.img.width / 5, e.img.width / 5);
    }
  }
}

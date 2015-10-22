function degToRad(a) { return a*pi/180 }
var pi = Math.PI
var cos = function(a) { return Math.cos(degToRad(a)) }
var sin = function(a) { return Math.sin(degToRad(a)) }

var side = 100 
var svg = d3.select("svg").node()

SVGMatrix.prototype.m = function() { return [this.a,this.b,this.c,this.d,this.e,this.f] }
I = svg.createSVGMatrix()

var drawnObj = function() {
    this.matrix = svg.createSVGMatrix()
}
drawnObj.prototype = {
    bbox : function () { 
        obj = this.node
        bbox = $(obj)[0].getBBox() 
        return bbox
    },
    draw : function() { this.update() },
    update : function() { // won't call this directly, but once draw() does its thing, it'll map here
        d3.select(this.node.parentNode).attr("transform",
                "matrix("+ this.matrix.m().join(' ') +")"
                )
    },
    show: function() {
        for ( var i=0, len=sibs.length; i < len; i++ ) {
            $(sibs[i]).show()
        }
    },
    hide: function() {
        sibs = this.node.parentNode.children
        for ( var i=0, len=sibs.length; i < len; i++ ) {
            $(sibs[i]).hide()
        }
    },
    translate: function(x,y) {
        this.x += x
        this.y += y
        this.matrix = this.matrix.translate( x, y )
        this.draw()
    },
    setPosition: function(x,y) {
        this.matrix = this.matrix.translate( -this.x, -this.y )
        this.x = x
        this.y = y
        this.matrix = this.matrix.translate( this.x, this.y )
        this.draw()
    },
    setRotation: function(ang) {
        this.matrix = I.translate(this.x,this.y).rotate(ang)
        this.draw()
    },
    rotate : function(ang) {
        this.matrix = this.matrix.rotate(ang)
        this.draw()
    },
    rotateAroundPoint(pt,ang) {
        shift = [ pt[0] - this.x, pt[1] - this.y ]
        // shift, rotate, shift back; pretty sure this is correct
        this.matrix = this.matrix.translate( shift[0], shift[1] )
            .rotate(ang)
            .translate( -shift[0], -shift[1] ) 
        this.draw()
    },
    rotateAroundLocalPoint(pt,ang) {
        this.rotateAroundPoint( [ this.x + pt[0], this.y + pt[1] ], ang )
    },
    x: 0,
    y: 0,
}

var drawGroup = function() {
    drawnObj.apply(this)
    this.node = document.createElementNS("http://www.w3.org/2000/svg","g")
    svg.appendChild( this.node )
}
drawGroup.prototype = $.extend({},drawnObj.prototype,{
    appendChild: function(n) {
        this.node.appendChild(n)
    },
    removeChild: function(n) {
        this.node.removeChild(n)
    }
})

var poly = function() {
    drawnObj.apply(this)
}
poly.prototype = $.extend({},drawnObj.prototype,{
    points : function() { return [] },
    color : "#00FF00",
    draw : function() {
        pointsStr = ""
        for(var i=0; i<this.points.length; i++){
            pointsStr += this.points[i].toString() + " "
        }
        canvas = d3.select("svg")
        this.drawable = canvas.append("g").append("polygon")
            .attr("points", pointsStr)
            .attr({ fill: this.color })
        this.node = this.drawable.node()
        this.update() // we wanna be in the right place/orientation
        this.draw = this.update // done with first-time creation, drawing means updating, now
        return this.drawable
    }
})

function drawTriSides(tr) {
    sides = [
    {pt1: tr.points[0], pt2: tr.points[1], color:"FF0000"},
    {pt1: tr.points[1], pt2: tr.points[2], color:"00FF00"},
    {pt1: tr.points[2], pt2: tr.points[0], color:"0000FF"},
    ]
    console.log(sides)
    for(s in sides) {
        s=sides[s]
        d3.select(tr.node.parentNode).append("line").attr({x1: s.pt1[0], y1: s.pt1[1]}).attr({x2: s.pt2[0], y2: s.pt2[1]}).style({"stroke":s.color, "stroke-width":"5px"}).attr("transform", d3.select(tr.node).attr("transform"))
    }
}
// classes to contain the isosceles tris described in "Updown generation of Penrose patterns"
// http://www.sciencedirect.com/science/article/pii/0019357790900058
// 
// local origin is the center of the defining cut
tri = function() {
    poly.apply(this)
    this.points = [
        [0,side*cos(this.beta)],
        [side * sin(this.beta),0],
        [0,-side * cos(this.beta)]
    ]
}
tri.prototype = $.extend({},poly.prototype, {
    alpha : 45, // the angle NOT on the cut
    beta : 45, // the two angles on the cut (bisected from the rhomb)
    color: "#000000"    
})

// 'primed' triangle
trip = function() {
    tri.apply(this)
    // primed tris are mirror copies of unprimed tris 
    this.points[1][0] *= -1 
}
$.extend(trip.prototype,tri.prototype)

triA = function() { 
    tri.apply(this) 
    this.sides = {
        one: {pt1: this.points[0], pt2: this.points[1]},
        two: {pt1: this.points[2], pt2: this.points[1]},
        three: {pt1: this.points[2], pt2: this.points[0]},
        four: null
    }
}
triA.prototype = $.extend({},tri.prototype,{
    alpha : 36, 
    beta : 144/2, 
    color: "#FF0000",
})

triAp = function() { 
    trip.apply(this) 
    this.sides = {
        one: {pt1: this.points[0], pt2: this.points[1]},
        two: {pt1: this.points[2], pt2: this.points[1]},
        three: {pt1: this.points[2], pt2: this.points[0]},
        four: null
    }
}
triAp.prototype = $.extend({},trip.prototype,{
    alpha : 36, 
    beta : 144/2, 
    color: "#FF00FF"    
})

triB = function() { tri.apply(this) }
triB.prototype = $.extend({},tri.prototype,{
    alpha : 108, 
    beta : 72/2, 
    color: "#0000FF"    
})

triBp = function() { trip.apply(this) }
triBp.prototype = $.extend({},trip.prototype,{
    alpha : 108, 
    beta : 72/2, 
    color: "#00FFFF"    
})

// universal prototype for rhombs
var rhomb = function() {
    this.points = this.points()
}    
rhomb.prototype = $.extend({},poly.prototype,{
    points : function() { 
        return [ 
            [0,0], 
            [ side*cos(this.theta/2), side*sin(this.theta/2) ],
            [ 2*side*cos(this.theta/2), 0], 
            [ side*cos(this.theta/2), -side*sin(this.theta/2) ]
        ]
    }
})

var thickrhomb = function() { 
    rhomb.apply(this)
}
thickrhomb.prototype = $.extend({},rhomb.prototype,{
    theta : 72,
    alpha : 108,
    position : [0,50],

    color : "#FF0000"
})

var thinrhomb = function() { 
    rhomb.apply(this)
}
thinrhomb.prototype = $.extend({},rhomb.prototype,{
    theta : 36,
    alpha : 144,
    position : [0,50],

    color : "#0000FF"
})

//thin = new thinrhomb()
//thin.rotate(90)
//thin.draw()
//
//thick = new thickrhomb()
//thick.draw()
//thick.setRotation(thin.theta*3/2)
//thick.setPosition([-40,120])


mytri = new triA(); 
mytri.draw()
mytri.setRotation(0)
mytri.setPosition(100,100)
drawTriSides(mytri)

mytri2 = new triAp();
mytri2.draw()
mytri2.setPosition(100,100)
drawTriSides(mytri2)

d3.selectAll("polygon").attr("fill","black")

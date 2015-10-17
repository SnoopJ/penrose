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
        bbox = this.bbox()
        center = [ bbox.x + bbox.width/2, bbox.y + bbox.height/2 ]
        ang = this.rotation
        this.matrix = I
            .translate(this.x,this.y)
            .rotate(this.rotation)
        d3.select(this.node).attr("transform",
                "matrix("+ this.matrix.m().join(' ') +")"
                )
    },
    translate: function(x,y) {
        this.x += x
        this.y += y
        this.draw()
    },
    setPosition: function(x,y) {
        this.x = x
        this.y = y
        this.draw()
    },
    setRotation: function(ang) {
        this.rotation = ang
        this.draw()
    },
    rotate : function(ang) {
        this.rotation += ang
        this.draw()
    },
    x: 0,
    y: 0,
    rotation: 0
}

var drawGroup = function() {
    this.node = document.createElementNS("http://www.w3.org/2000/svg","g")
}
drawGroup.prototype = $.extend({},drawnObj.prototype,{})

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
        this.drawable = canvas.append("polygon")
            .attr("points", pointsStr)
            .attr({ fill: this.color })
//            .classed("draggable",true)
//            .attr("onmousedown","selectElement(evt)")
        this.node = this.drawable.node()
        this.update() // we wanna be in the right place/orientation
        this.draw = this.update // done with first-time creation, drawing means updating, now
        return this.drawable
    }
})

// classes to contain the isosceles tris described in "Updown generation of Penrose patterns"
// http://www.sciencedirect.com/science/article/pii/0019357790900058
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

triA = function() { tri.apply(this) }
triA.prototype = $.extend({},tri.prototype,{
    alpha : 36, 
    beta : 144/2, 
    color: "#FF0000"    
})

triAp = function() { 
    trip.apply(this) 
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


rhombA = d3.select("svg").append("g").attr("id","rhombA");
mytri = new triA(); 
mytri.draw()
mytri.setRotation(0)
mytri.setPosition(200,300)

mytri2 = new triAp();
mytri2.draw()
mytri2.setPosition(200,300)

rhombA.node().appendChild(mytri.drawable.node())
rhombA.node().appendChild(mytri2.drawable.node())

rhombB = d3.select("svg").append("g").attr("id","rhombB");
mytri3 = new triB(); 
mytri3.draw()
mytri3.setRotation(0)
mytri3.setPosition(200,300)

mytri4 = new triBp();
mytri4.draw()
mytri4.setRotation(0)
mytri4.setPosition(200,300)

rhombB.node().appendChild(mytri3.drawable.node())
rhombB.node().appendChild(mytri4.drawable.node())


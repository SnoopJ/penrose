function degToRad(a) { return a*pi/180 }
var pi = Math.PI
var cos = function(a) { return Math.cos(degToRad(a)) }
var sin = function(a) { return Math.sin(degToRad(a)) }

var side = 100 

var drawnObj = function() {}
drawnObj.prototype = {
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
        this.update() // we wanna be in the right place/orientation
        this.draw = this.update
        return this.drawable
    },
    drawable : null, // nothing until we're drawn
    bbox : function () { 
        obj = this.drawable.node()
        bbox = $(obj)[0].getBBox() 
        return bbox
    },
    update : function() { // won't call this directly, but once draw() does its thing, it'll map here
        bbox = this.bbox()
        center = [ bbox.x + bbox.width/2, bbox.y + bbox.height/2 ]
        ang = this.rotation
        this.drawable.attr("transform",
                // order matters!
                "translate("+this.position.toString()+") " + 
                "rotate("+ang+" "+center[0]+" "+center[1]+") "
                )
    },
    translate: function(offset) {
        this.position[0] += offset[0]
        this.position[1] += offset[1]
        this.draw()
    },
    setPosition: function(pos) {
        this.position = pos
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
    position: [0,0],
    rotation: 0
}

// class to contain the isosceles tris described in "Updown generation of Penrose patterns"
// http://www.sciencedirect.com/science/article/pii/0019357790900058
tri = function() {
    this.points = [
        [0,0],
        [side/2 * cos(this.beta),side/2 * sin(this.beta)],
        [0,side]
    ]
}
$.extend(tri.prototype,drawnObj.prototype)

trip = function() {
    tri.apply(this)
        this.beta *= -1
    //this.points[1] = [this.points[1][0],-this.points[1][1]] 
}
$.extend(trip.prototype,tri.prototype)

triA = function() { tri.apply(this) }
triA.prototype = $.extend({},tri.prototype,{
    alpha : 36, // the angle NOT on the cut
    beta : 144/2, // the two angles on the cut (bisected from the rhomb)
    color: "#FF0000"    
})

triAp = function() { trip.apply(this) }
triAp.prototype = $.extend({},trip.prototype,{
    alpha : 36, 
    beta : 144/2, 
    color: "#FF00FF"    
})

triB = function() { tri.apply(this) }
triB.prototype = $.extend({},tri.prototype,{
    alpha : 108, // the angle NOT on the cut
    beta : 72/2, // the two angles on the cut (bisected from the rhomb)
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
rhomb.prototype = $.extend({},drawnObj.prototype,{
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

//thin = new thinrhomb(); thin.draw()
//
//thick = new thickrhomb(); thick.draw()
//thick.setRotation(thin.theta*3/2)
//thick.setPosition([-40,120])

mytri = new triA(); 
mytri.draw()
mytri.setRotation(0)
mytri.setPosition([200,50])

mytri2 = new triAp();
mytri2.draw()
mytri2.setRotation(180)
mytri2.setPosition([200-mytri.bbox().width,50-mytri.bbox().height*0])

mytri3 = new triB(); 
mytri3.draw()
mytri3.setRotation(0)
mytri3.setPosition([50,200])

mytri4 = new triBp();
mytri4.draw()
mytri4.setRotation(180)
mytri4.setPosition([50-mytri3.bbox().width,200-mytri3.bbox().height*0])

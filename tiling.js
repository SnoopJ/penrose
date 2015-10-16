function degToRad(a) { return a*pi/180 }
var pi = Math.PI
var cos = function(a) { return Math.cos(degToRad(a)) }
var sin = function(a) { return Math.sin(degToRad(a)) }

var side = 100 

var drawnObj = function() {}
drawnObj.prototype = {
    points : function() { return [] },
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
    update : function() {
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
        this.update()
    },
    setPosition: function(pos) {
        this.position = pos
        this.update()
    },
    setRotation: function(ang) {
        this.rotation = ang
        this.update()
    },
    rotate : function(ang) {
        this.rotation += ang
        this.update()
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

tri.prototype = $.extend({},drawnObj.prototype,{
    alpha : 36, // the angle NOT on the cut
    beta : 144/2, // the two angles on the cut (bisected from the rhomb)
    points : function() { return [
        [0,0],
        [side/2 * cos(this.beta),side/2 * sin(this.beta)],
        [0,side]
    ]},
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

mytri = new tri(); mytri.draw()
thin = new thinrhomb(); thin.draw()
thick = new thickrhomb(); thick.draw()
thick.setRotation(thin.theta*3/2)
thick.setPosition([-40,120])
mytri.setRotation(45)
mytri.setPosition([200,50])

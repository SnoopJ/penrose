function degToRad(a) { return a*pi/180 }
var pi = Math.PI
var cos = function(a) { return Math.cos(degToRad(a)) }
var sin = function(a) { return Math.sin(degToRad(a)) }

var side = 100 

// universal prototype for rhombs
var rhomb = function() {}    
rhomb.prototype = {
    points : function() { return [ 
        [0,0], 
        [ side*cos(this.theta/2), side*sin(this.theta/2) ],
        [ 2*side*cos(this.theta/2), 0], 
        [ side*cos(this.theta/2), -side*sin(this.theta/2) ]
    ] },
    drawFun : function(canvas) {
        pointsStr = ""
        for(var i=0; i<this.points.length; i++){
            pointsStr += this.points[i].toString() + " "
        }
        this.drawable = canvas.append("polygon")
            .attr("points", pointsStr)
            .attr({ fill: this.color })
        this.update() // we wanna be in the right place/orientation
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

var thickrhomb = function() {
    this.theta = 72
    this.alpha = 108
    this.points = this.points()
    this.position = [0,50]

    this.color = "#FF0000"
}
thickrhomb.prototype = rhomb.prototype

var thinrhomb = function() {
    this.theta = 36
    this.alpha = 144
    this.points = this.points()
    this.position = [0,50]

    this.color = "#0000FF"
}
thinrhomb.prototype = rhomb.prototype

thin = new thinrhomb(); thin.drawFun( d3.select("svg") )
thick = new thickrhomb(); thick.drawFun( d3.select("svg") )

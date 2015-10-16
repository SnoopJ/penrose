var side = 100 
var cos = Math.cos
var sin = Math.sin
var pi = Math.PI
function degToRad(a) { return a*pi/180 }

var thinrhomb = function() {
    this.theta = degToRad(36)
    this.alpha = degToRad(144)
    this.color = "#0000FF"

    this.points = [ 
        [0,0], 
        [ side*cos(this.theta/2), side*sin(this.theta/2) ],
        [ 2*side*cos(this.theta/2), 0], 
        [ side*cos(this.theta/2), -side*sin(this.theta/2) ]
    ]
    this.drawFun = function(canvas) {
        pointsStr = ""
        for(var i=0; i<this.points.length; i++){
            pointsStr += this.points[i].toString() + " "
        }
        return canvas.append("polygon")
            .attr("points", pointsStr)
            .attr({ fill: this.color })
    }
    this.drawable = this.drawFun( d3.select("svg") )
}


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
        return this.drawable
    },
    drawable : null, // nothing until we're drawn
    center : function () { 
        obj = this.drawable.node()
        bbox = $(obj)[0].getBBox() 
        x = bbox.x + bbox.width/2
        y = bbox.y + bbox.height/2
        return [x,y]
    },
    rotate : function(ang) {
        center = this.center()
        this.drawable.attr("transform", "rotate("+ang+" "+center[0]+" "+center[1]+")")
    }
}

var thickrhomb = function() {
    this.theta = degToRad(72)
    this.alpha = degToRad(108)
    this.points = this.points()

    this.color = "#FF0000"
}
thickrhomb.prototype = rhomb.prototype

var thinrhomb = function() {
    this.theta = degToRad(36)
    this.alpha = degToRad(144)
    this.points = this.points()

    this.color = "#0000FF"
}
thinrhomb.prototype = rhomb.prototype


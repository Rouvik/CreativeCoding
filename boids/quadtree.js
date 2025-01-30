class Quadtree {
    constructor(points, pos, dim, numNeighbours = 4) {
        this.points = points;

        this.pos = pos;
        this.dim = dim;

        this.ne = null;
        this.se = null;
        this.sw = null;
        this.nw = null;

        this.numNeighbours = numNeighbours;        
    }

    subdivide() {
        if (this.points.length <= this.numNeighbours) {
            return;
        }

        this.ne = new Quadtree(null, new vec2(this.pos.x + this.dim.x / 2, this.pos.y), new vec2(this.dim.x / 2, this.dim.y / 2), this.numNeighbours);
        this.se = new Quadtree(null, new vec2(this.pos.x + this.dim.x / 2, this.pos.y + this.dim.y / 2), new vec2(this.dim.x / 2, this.dim.y / 2), this.numNeighbours);
        this.sw = new Quadtree(null, new vec2(this.pos.x, this.pos.y + this.dim.y / 2), new vec2(this.dim.x / 2, this.dim.y / 2), this.numNeighbours);
        this.nw = new Quadtree(null, this.pos, new vec2(this.dim.x / 2, this.dim.y / 2), this.numNeighbours);

        this.ne.points = this.points.filter((elem) => this.ne.pointExistsWithin(elem.pos));
        this.se.points = this.points.filter((elem) => this.se.pointExistsWithin(elem.pos));
        this.sw.points = this.points.filter((elem) => this.sw.pointExistsWithin(elem.pos));
        this.nw.points = this.points.filter((elem) => this.nw.pointExistsWithin(elem.pos));

        this.ne.subdivide();
        this.se.subdivide();
        this.sw.subdivide();
        this.nw.subdivide();
    }

    pointExistsWithin(position) {
        return position.x > this.pos.x && position.x < (this.pos.x + this.dim.x) && position.y > this.pos.y && position.y < (this.pos.y + this.dim.y);
    }

    renderQuads() {
        Global.cxt.strokeStyle = 'rgb(0, 255, 0)';
        Global.cxt.lineWidth = 1;
        Global.cxt.strokeRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);

        this.ne?.renderQuads();
        this.se?.renderQuads();
        this.sw?.renderQuads();
        this.nw?.renderQuads();
    }

    locateNeighbours(point) {
        if (this.pointExistsWithin(point.pos)) {
            if (this.ne == null) {
                return this.points;
            } else {
                return this.ne.locateNeighbours(point) ||
                        this.se.locateNeighbours(point) ||
                        this.sw.locateNeighbours(point) ||
                        this.nw.locateNeighbours(point);
            }
        } else {
            return null;
        }
    }
}

// class LQuadtree extends Quadtree {
//     constructor(points, pos, dim) {
//         super(points, pos, dim);
//     }

//     subdivide() {
//         if (this.points.length < 4) {
//             return;
//         }

//         this.ne = new Quadtree(null, new vec2(this.pos.x + this.dim.x / 2, this.pos.y), new vec2(this.dim.x / 2, this.dim.y / 2));
//         this.se = new Quadtree(null, new vec2(this.pos.x + this.dim.x / 2, this.pos.y + this.dim.y / 2), new vec2(this.dim.x / 2, this.dim.y / 2));
//         this.sw = new Quadtree(null, new vec2(this.pos.x, this.pos.y + this.dim.y / 2), new vec2(this.dim.x / 2, this.dim.y / 2));
//         this.nw = new Quadtree(null, this.pos, new vec2(this.dim.x / 2, this.dim.y / 2));

//         this.ne.points = this.points.filter((elem) => this.ne.pointExistsWithin(elem.pos));
//         this.se.points = this.points.filter((elem) => this.se.pointExistsWithin(elem.pos));
//         this.sw.points = this.points.filter((elem) => this.sw.pointExistsWithin(elem.pos));
//         this.nw.points = this.points.filter((elem) => this.nw.pointExistsWithin(elem.pos));

//         this.ne.subdivide();
//         this.se.subdivide();
//         this.sw.subdivide();
//         this.nw.subdivide();
//     }

//     pointExistsWithin(position) {
//         return position.x > this.pos.x && position.x < (this.pos.x + this.dim.x) && position.y > this.pos.y && position.y < (this.pos.y + this.dim.y);
//     }
// }
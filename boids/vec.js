// MIT License

// Copyright (c) 2025 Rouvik Maji

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * A simple vector library for absract 2D and 3D vectors
 * @author Rouvik Maji
 * @license MIT
 */

/**
 * 2 dimentional vectors
 */
class vec2 {
    /**
     * Creates a vec2
     * <div style="background: greenyellow; border: 3px solid green; border-radius: 5px; padding: 5px;">
     * <b style="font-size: 1.3rem;">Info:</b><br>
     * vec2 behaviour:
     * <ul>
     * <li>If x is a <b>vec2</b>, then it behaves as a copy constructor</li>
     * <li>If x is a <b>number</b> and y is undefined then it behaves as if new vec2(x, x) eg. -> new vec2(5) == new vec2(5, 5)</li>
     * <li>If <b>x and y are both numbers</b> then x is treated as x component of the vector and y as y component</li>
     * </ul>
     * </div>
     * @param {vec2_or_number} x Read details above for proper behaviour disclosure
     * @param {number} y The y component of the vector
     */
    constructor(x, y) {
        if (x instanceof vec2) {
            this.x = x.x;
            this.y = x.y;
        }
        else if (typeof x === "number") {
            this.x = x;
            if (typeof y === "number") {
                this.y = y;
            }
            else {
                this.y = x;
            }
        }
        else {
            throw new Error("[vec2 Error] Bad constructor parameters: (x: " + x + ", y: " + y + ")");
        }
    }

    /**
     * Adds a vector to this and returns it
     * @param {vec2} v2 The components of the other vector to add
     * @returns A vec2 with this.x_i + v2.x_i
     */
    add(v2) {
        const temp = new vec2(this);
        temp.x += v2.x;
        temp.y += v2.y;

        return temp;
    }

    /**
     * Subtracts a vector from this and returns it
     * @param {vec2} v2 The components of the other vector to subtract
     * @returns A vec2 with this.x_i - v2.x_i
     */
    sub(v2) {
        const temp = new vec2(this);
        temp.x -= v2.x;
        temp.y -= v2.y;

        return temp;
    }

    /**
     * Multiplies a vector to this and returns it
     * @param {vec2} v2 The components of the other vector to multiply
     * @returns A vec2 with this.x_i * v2.x_i
     */
    mul(v2) {
        const temp = new vec2(this);
        temp.x *= v2.x;
        temp.y *= v2.y;

        return temp;
    }

    /**
     * Divides a vector from this and returns it
     * <p style="background: crimson; border: 3px solid darkred; color: white; border-radius: 5px; padding: 5px;"><b>Warning:</b> This function does not check for division by zero, thus might end up with NaNs so use with caution</p>
     * @param {vec2} v2 The components of the other vector to divide
     * @returns A vec2 with this.x_i / v2.x_i
     */
    div(v2) {
        const temp = new vec2(this);
        temp.x /= v2.x;
        temp.y /= v2.y;

        return temp;
    }

    /**
     * Performs dot product of a vector to this and returns it
     * @param {vec2} v2 The components of the other vector to dot
     * @returns A vec2 with this.x * v2.x + this.y * v2.y
     */
    dot(v2) {
        return this.x * v2.x + this.y * v2.y;
    }

    /**
     * The magnitude square of the vector
     * @returns The square of magnitude of the vector
     */
    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * The magnitude of the vector
     * @returns The magnitude of the vector
     */
    mag() {
        return (this.x * this.x + this.y * this.y) ** 0.5;
    }

    /**
     * Sets the magnitude of a vector to the given value
     * @param {Number} mag The magnitude to set
     * @returns A vec2 with the newly set magnitude
     */
    setMag(mag) {
        return this.norm().mul(new vec2(mag));
    }

    /**
     * Normalized vector
     * @returns Normalises the vector and returns it
     */
    norm() {
        const temp = new vec2(this);
        const mag = this.mag();
        temp.x /= mag;
        temp.y /= mag;

        return temp;
    }

    /**
     * Rotates a vector around its origin by the given angle in anticlockwise direction
     * @param {Number} angle In radians 
     */
    rotate(angle) {
        const temp = new vec2(0);
        temp.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        temp.y = this.x * Math.sin(angle) + this.y * Math.cos(angle);

        return temp;
    }

    /**
     * Clamps the x component of vector
     * @param {number} min The minimum bound of x
     * @param {number} max The maximum bound of x
     * @returns The clamped vector
     */
    clampX(min, max) {
        if (this.x < min) {
            this.x = min;
        }
        else if (this.x > max) {
            this.x = max;
        }

        return this;
    }

    /**
     * Clamps the y component of vector
     * @param {number} min The minimum bound of y
     * @param {number} max The maximum bound of y
     * @returns The clamped vector
     */
    clampY(min, max) {
        if (this.y < min) {
            this.y = min;
        }
        else if (this.y > max) {
            this.y = max;
        }

        return this;
    }
    
    /**
     * Clamps both the component of vector
     * @param {number} min The minimum bound of x, y
     * @param {number} max The maximum bound of x, y
     * @returns The clamped vector
     */
    clamp(min, max) {
        this.clampX(min, max);
        this.clampY(min, max);

        return this;
    }

    /**
     * Limits a vector from exceeding the maxVec values
     * @param {vec2} maxVec The limiting value of the vector
     * @returns The clamped vector
     */
    mapXYWithin(maxVec) {
        if (this.x > maxVec.x || this.y > maxVec.y) { // this is just a bad yet fast check, better to do if this.magSq() > value * value
            return this.norm().mul(maxVec);
        }

        return this;
    }

    /**
     * Returns the string representation of the vector as (x, y)
     * @returns The string representation of the vector
     */
    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

/**
 * 3 dimentional vectors
 */
class vec3 {
    /**
     * Creates a vec2
     * <div style="background: greenyellow; border: 3px solid green; border-radius: 5px; padding: 5px;">
     * <b style="font-size: 1.3rem;">Info:</b><br>
     * vec3 behaviour:
     * <ul>
     * <li>If x is a <b>vec3</b>, then it behaves as a copy constructor</li>
     * <li>If x is a <b>vec2</b>, then it copies the vec2 components in resepctive places and expects <i>y argument as the z component<i></li>
     * <li>If x is a <b>number</b> and y is undefined and z is undefined then it behaves as if new vec3(x, x, x) eg. -> new vec3(5) == new vec3(5, 5, 5)</li>
     * <li>If <b>x, y and z are all numbers</b> then x is treated as x component of the vector and y as y component and z as the z component</li>
     * </ul>
     * </div>
     * @param {vec3_or_vec2_or_number} x Read details above for proper behaviour disclosure
     * @param {number} y The y component of the vector
     * @param {number} z The z component of the vector
     */
    constructor(x, y, z) {
        if (x instanceof vec2 && typeof y == "number") {
            this.x = x.x;
            this.y = x.y;
            this.z = y;
        }
        else if (x instanceof vec3) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
        else if (typeof x == "number" && y == undefined && z == undefined) {
            this.x = x;
            this.y = x;
            this.z = x;
        }
        else if (typeof x == "number" && typeof y == "number" && typeof z == "number") {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else {
            throw new Error(`[vec3 Error] Bad constructor parameters: (x:${x}, y:${y}, z:${z})`);
        }
    }

    /**
     * Adds a vector 2 to this vector 3 by components (leaving z unchanged) and returns
     * @param {vec2} v2 The vec2 to add
     * @returns this.x_i + v2.x_i leaving z unchanged
     */
    addv2(v2) {
        let temp = new vec3(this);
        temp.x += v2.x;
        temp.y += v2.y;

        return temp;
    }

    /**
     * Adds a vector to this vector by components
     * @param {vec3} v3 The vector 3 to add
     * @returns this.x_i + v3.x_i
     */
    add(v3) {
        let temp = new vec3(this);
        temp.x += v3.x;
        temp.y += v3.y;
        temp.z += v3.z;

        return temp;
    }

    /**
     * Subtracts a vector 2 to this vector 3 by components (leaving z unchanged) and returns
     * @param {vec2} v2 The vec2 to subtract
     * @returns this.x_i - v2.x_i leaving z unchanged
     */
    subv2(v2) {
        let temp = new vec3(this);
        temp.x -= v2.x;
        temp.y -= v2.y;

        return temp;
    }

    /**
     * Subracts a vec3 from this and returns
     * @param {vec3} v3 The vec3 to subtract
     * @returns this.x_i - v3.x_i
     */
    sub(v3) {
        let temp = new vec3(this);
        temp.x -= v3.x;
        temp.y -= v3.y;
        temp.z -= v3.z;

        return temp;
    }

    /**
     * Multiplies a vector 2 to this vector 3 by components (leaving z unchanged) and returns
     * @param {vec2} v2 The vec2 to multiply
     * @returns this.x_i * v2.x_i leaving z unchanged
     */
    mulv2(v2) {
        let temp = new vec3(this);
        temp.x *= v2.x;
        temp.y *= v2.y;

        return temp;
    }

    /**
     * Multiplies a vec3 to this and returns
     * @param {vec3} v3 The vector 3 to multiply to this
     * @returns this.x_i * v3.x_i
     */
    mul(v3) {
        let temp = new vec3(this);
        temp.x *= v3.x;
        temp.y *= v3.y;
        temp.z *= v3.z;

        return temp;
    }

    /**
     * Divides a vector 2 to this vector 3 by components (leaving z unchanged) and returns
     * <p style="background: crimson; border: 3px solid darkred; color: white; border-radius: 5px; padding: 5px;"><b>Warning:</b> This function does not check for division by zero, thus might end up with NaNs so use with caution</p>
     * @param {vec2} v2 The vec2 to divide
     * @returns this.x_i / v2.x_i leaving z unchanged
    */
    divv2(v2) {
        let temp = new vec3(this);
        temp.x /= v2.x;
        temp.y /= v2.y;

        return temp;
    }

    /**
     * Divides this vector 3 with v3 and returns
     * <p style="background: crimson; border: 3px solid darkred; color: white; border-radius: 5px; padding: 5px;"><b>Warning:</b> This function does not check for division by zero, thus might end up with NaNs so use with caution</p>
     * @param {vec3} v3 The vector 3 to divide by this
     * @returns this.x_i / v3.x_i
     */
    div(v3) {
        let temp = new vec3(this);
        temp.x /= v3.x;
        temp.y /= v3.y;
        temp.z /= v3.z;

        return temp;
    }

    /**
     * The dot product between this and v3
     * @param {vec3} v3 The vector 3 to dot with this vector
     * @returns summation_i(this.x_i * vec3.x_i) as number
     */
    dot(v3) {
        return this.x * v3.x + this.y * v3.y + this.z * v3.z;
    }

    /**
     * The magnitude squared of this vector
     * @returns summation_i(this.x_i ** 2) as number
     */
    magSq() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    /**
     * The magnitude of this vector
     * @returns (summation_i(this.x_i ** 2)) ** 0.5 as number
     */
    mag() {
        return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** 0.5;
    }

    /**
     * The normalized vector of this vector
     * @returns this.x_i / this.mag() as vec3
     */
    norm() {
        let temp = new vec3(this);
        const mag = this.mag();
        temp.x /= mag;
        temp.y /= mag;
        temp.z /= mag;

        return temp;
    }

    /**
     * Clamps this vector x within (min, max)
     * @param {number} min The minimum value to clamp x within
     * @param {number} max The maximum value to clamp x within
     * @returns this vector with x clamped within (min, max)
     */
    clampX(min, max) {
        if (this.x < min) {
            this.x = min;
        }
        else if (this.x > max) {
            this.x = max;
        }

        return this;
    }

    /**
     * Clamps this vector y within (min, max)
     * @param {number} min The minimum value to clamp y within
     * @param {number} max The maximum value to clamp y within
     * @returns this vector with y clamped within (min, max)
     */
    clampY(min, max) {
        if (this.y < min) {
            this.y = min;
        }
        else if (this.y > max) {
            this.y = max;
        }

        return this;
    }

    /**
     * Clamps this vector z within (min, max)
     * @param {number} min The minimum value to clamp z within
     * @param {number} max The maximum value to clamp z within
     * @returns this vector with z clamped within (min, max)
     */
    clampZ(min, max) {
        if (this.z < min) {
            this.z = min;
        }
        else if (this.z > max) {
            this.z = max;
        }

        return this;
    }

    /**
     * Clamps this vector x, y, z within (min, max)
     * @param {number} min The minimum value to clamp x, y, z within
     * @param {number} max The maximum value to clamp x, y, z within
     * @returns this vector with x, y, z clamped within (min, max)
     */
    clamp(min, max) {
        this.clampX(min, max);
        this.clampY(min, max);
        this.clampZ(min, max);

        return this;
    }

    /**
     * Returns the string representation of the vector as (x, y, z)
     * @returns The string representation of the vector
     */
    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}
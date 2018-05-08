"use strict";

var PixelPaint = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.name = obj.name;
		this.point = obj.point;
		this.author = obj.author;
	} else {
	    this.name = "";
	    this.point = "";
	    this.author = "";
	}
};

PixelPaint.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var PixelPaintDB = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new PixelPaint(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

PixelPaintDB.prototype = {
    init: function () {
        // todo
    },

    save: function (name, point) {

        name = name.trim();
        point = point.trim();
        if (name === "" || point === ""){
            throw new Error("empty name / point");
        }
        if (point.length > 400 || name.length > 64){
            throw new Error("name / point exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var pixelArt = this.repo.get(name);
        if (pixelArt){
            throw new Error("same name has been occupied");
        }
        
        newpixelArt = new PixelPaint();
        newpixelArt.author = from;
        newpixelArt.name = name;
        newpixelArt.point = point;

        this.repo.put(name, newpixelArt);
    },

    get: function (name) {
        name = name.trim();
        if ( name === "" ) {
            throw new Error("empty key")
        }
        return this.repo.get(name);
    }
};
module.exports = PixelPaintDB;

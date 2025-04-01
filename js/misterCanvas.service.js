'use strict'

var gBrush = { 
    color: 'black', 
    size: 5, 
    shape: 'square' 
}

function getBrush() {
    return gBrush
}

function setColor(color) {
    gBrush.color = color
}

function setSize(size) {
    gBrush.size = size
}

function setShape(shape) {
    gBrush.shape = shape
}
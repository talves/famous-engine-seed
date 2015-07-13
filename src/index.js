// Local dependencies
import { AppNode } from './js/AppNode';

// Famous dependencies
import FamousEngine from 'famous/core/FamousEngine';
import Size from 'famous/components/Size';

// Boilerplate code to make your life easier
FamousEngine.init();

// Create a scene for the FamousEngine to render
var scene = FamousEngine.createScene('body');
var nextNode = scene.addChild();
nextNode.setOrigin(0.5, 0.5, 0);

//Setup Sizing
var rootSize = new Size(nextNode);

// Get a node of the Application
var app = new AppNode(nextNode);
console.log('app', app, rootSize.get(), rootSize.isActive());

rootSize.onSizeChange = function(x,y,z){
   app.setWalls([x,y,z]);
};

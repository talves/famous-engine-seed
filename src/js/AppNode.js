/* AppNode
   ES6 class
*/

// Famous dependencies
import FamousEngine from 'famous/core/FamousEngine';
import Node from 'famous/core/Node';
import DOMElement from 'famous/dom-renderables/DOMElement';
import PhysicsEngine from 'famous/physics/PhysicsEngine';
import Wall from 'famous/physics/bodies/Wall';
import Sphere from 'famous/physics/bodies/Sphere';
import Collision from 'famous/physics/constraints/Collision';

export class AppNode extends Node {
  constructor(node, options) {
    super();

    var context;
    this.options = _setOptions.call(this, options);

    switch (typeof node) {
        case "object":
            context = node;  //Famous Node
            this.options.selector = context.getLocation();
            break;
        case "undefined":
        case "string":
            FamousEngine.init();
            context = FamousEngine.createScene(this.options.selector); //Famous Scene
            break;
        default:
            throw ("walls: invalid selector type [options.selector]");
    }

    //Setup this as a node ready to be extended
    this.rootNode = context.addChild(this);
    var _self = this.rootNode;

    // Manage options for the Node
    function _setOptions(options) {
      options = options || {};
      // Setup default options here
      if (options.selector === undefined) options.selector = 'body';

      return options;
    }

    // Our Physics playground
    this.playground = new PhysicsEngine();

    //Walls
    this.topWall = new Wall({direction: Wall.DOWN});
    this.bottomWall = new Wall({direction: Wall.UP});
    this.leftWall = new Wall({direction: Wall.RIGHT});
    this.rightWall = new Wall({direction: Wall.LEFT});

    // Add the walls around our playground
    this.collision = new Collision([this.topWall, this.bottomWall, this.rightWall, this.leftWall])
    this.playground.addConstraint(this.collision);

    this.sphere = new Sphere({ mass: 100, radius: 50 });
    this.sphere.setVelocity(1000, 0, 0);
    // Add the sphere to the playground and make it colideable
    this.playground.addBody(this.sphere);
    this.collision.addTarget(this.sphere);

    this.logoNode = this.rootNode.addChild();
    this.logoNode
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(100, 100)
      .setPosition(0, 70, 0)
      .setMountPoint(0.5, 0.5);

    this.logoNode.addUIEvent('click');
    this.logoNode.addComponent({
      onReceive: function (type, event) {
        if (type === 'click') {
          console.log('Walls', _self.getWallPositions());
          _self.sphere.setVelocity(1000, 750, 0);
        }
      }
    });

    this.logo = new DOMElement(this.logoNode, {tagName: 'img'});
    this.logo.setAttribute('src', 'images/famous_logo.png');

    var updater = this.rootNode.addComponent({
      onUpdate: function (time) {
        _self.playground.update(time);

        var spherePosition = _self.sphere.getPosition();
        _self.logoNode.setPosition(spherePosition.x, spherePosition.y);
        _self.requestUpdateOnNextTick(updater);
      }
    });
    this.setWalls(this.rootNode.getSize());

    this.rootNode.requestUpdate(updater);

  }
  // Should be called on a size change of the parent node passing it's true size
  setWalls(size) {
    if (!this.collision) return;

    console.log('AppNode size', size);
    var x = size[0] || 0;
    var y = size[1] || 0;
    var z = size[2] || 0;

    this.topWall.setPosition(0,0,0);
    this.bottomWall.setPosition(0,y,0);
    this.leftWall.setPosition(0,0,0);
    this.rightWall.setPosition(x,0,0);

    console.log('Walls', this.getWallPositions());
  }
  getWallPositions() {
    return [ this.topWall.getPosition(), this.bottomWall.getPosition(), this.leftWall.getPosition(), this.rightWall.getPosition(), this.logoNode.getPosition()];
  }

}

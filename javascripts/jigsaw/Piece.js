/**
 * Jigsaw.Piece
 * @extends Ext.Component
 * Represents a piece of the Jigsaw puzzle
 * @cfg {number} width The width of this piece (defaults to 100)
 * @cfg {number} height The height of this piece (defaults to 100)
 * @cfg {string} imageUrl The image to use as the background for this element (defaults to Jigsaw.Game.prototype.defaultImageUrl)
 */
Jigsaw.Piece = function(config) {
  var config = config || {};
 
  Ext.applyIf(config, {
    width:         100,
    height:        100,
    xOffset:       0,
    yOffset:       0,
    dropTolerance: 5,
    imageUrl:      Jigsaw.Game.prototype.defaultImageUrl
  });
 
  Jigsaw.Piece.superclass.constructor.call(this, config);
};
Ext.extend(Jigsaw.Piece, Ext.Component, {
  
  /**
   * Renders this piece
   * @param {Ext.Container} ct The container to render this piece to (should be a Jigsaw.Board)
   */
  render: function(ct) {
    this.el = ct.createChild({
      tag:      'img',
      cls:      'jigsaw-piece',
      height:   this.height,
      width:    this.width,
      children: []
    });
    
    this.setBackgroundStyle();
    
    Jigsaw.Piece.superclass.render.apply(this, arguments);
    
    //Make this piece draggable
    this.dd = new Ext.dd.DDProxy(this.el.id, 'pieces');
    this.dd.startDrag = function() { this.constrainTo(ct.id); };
    
    var piece = this; //closure needed for endDrag below:
    this.dd.endDrag   = function() {
      Ext.dd.DDProxy.prototype.endDrag.apply(this, arguments); //super
      
      if (piece.withinDropTolerance()) {
        piece.moveToCorrectPosition();
      };
    };
    
    this.moveToCorrectPosition();
  },
  
  /**
   * Returns true if this piece is close enough to its correct position to be auto-moved there
   * @param {Number} tolerance The number of pixels of tolerance to allow (defaults to this.dropTolerance)
   * @return {Boolean} true if within drop tolerance
   */
  withinDropTolerance: function(tolerance) {
    var tolerance = tolerance || this.dropTolerance;
    
    var ctLeft = this.container.getLeft();
    var ctTop  = this.container.getTop();
    
    var withinX = Math.abs(this.el.getLeft() - ctLeft - this.xOffset) <= tolerance;
    var withinY = Math.abs(this.el.getTop()  - ctTop  - this.yOffset) <= tolerance;
    
    return withinX && withinY;
  },
  
  /**
   * Creates a CSS background style string to set the background of this component to the relevant segment of the image
   * @return {String} A CSS background style to be applied to this element
   */
  setBackgroundStyle: function(paramName) {
    this.el.setStyle('background-image', 'url(' + this.imageUrl + ')');
    this.el.setStyle('background-position', -this.xOffset + 'px ' + -this.yOffset + 'px');
  },
  
  /**
   * Moves this piece to the correct position in the container
   */
  moveToCorrectPosition: function() {
    var ctLeft = this.container.getLeft();
    var ctTop  = this.container.getTop();
    this.el.moveTo(this.xOffset + ctLeft, this.yOffset + ctTop);
  },
  
  /**
   * Returns true if this piece is in the right position
   * @return {Boolean} True if this piece is in the right position
   */
  isInCorrectPosition: function() {
    return this.withinDropTolerance(0);
  }
});

Ext.reg('jigsaw-piece', Jigsaw.Piece);
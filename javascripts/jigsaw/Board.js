/**
 * Jigsaw.Board
 * @extends Ext.Container
 * The board to attach pieces of the Jigsaw
 */
Jigsaw.Board = Ext.extend(Ext.Container, {
  /**
   * @property pieces
   * @type Array
   * The pieces associated with this Jigsaw
   */
  pieces: [],
  
  /**
   * Sets up the board
   * @param {Object} config Configuration object
   */
  constructor: function(config) {
    var config = config || {};
    
    Ext.applyIf(config, {
      piecesX:  8,
      piecesY:  6,
      imageUrl: Jigsaw.Game.prototype.defaultImageUrl
    });
    
    Jigsaw.Board.superclass.constructor.call(this, config);
  },
  
  /**
   * Sets the image URL
   * @param {String} imageUrl The URL of the puzzle image to use
   */
  setImageUrl: function(imageUrl) {
    this.imageUrl = imageUrl;
  },
  
  /**
   * Creates the specified number of pieces in each direction
   * @param {number} x Number of pieces to create in x-axis (horizontally)
   * @param {number} y Number of pieces to create in y-axis (vertically)
   */
  createPieces: function(x, y) {
    var x = x || this.initialConfig.piecesX;
    var y = y || this.initialConfig.piecesY;
        
    var pieceHeight = Math.floor(this.getEl().getHeight() / y);
    var pieceWidth  = Math.floor(this.getEl().getWidth()  / x);
    
    var pieces = [];
    
    for (var i=0; i < x; i++) {
      for (var j=0; j < y; j++) {
        pieces.push(new Jigsaw.Piece({
          height:  pieceHeight,
          width:   pieceWidth,
          xOffset: i * pieceWidth,
          yOffset: j * pieceHeight,
          imageUrl: this.imageUrl
        }));
      };
    };
    
    this.setPieces(pieces);
  },
  
  /**
   * Removes all current pieces and adds new ones
   * @param {Array} pieces The pieces to add to this board
   */
  setPieces: function(pieces) {
    if (this.items) {
      this.items.each(function(i) { this.remove(i); }, this);
    };
    
    this.pieces = pieces;
    
    for (var i=0; i < pieces.length; i++) {
      this.add(pieces[i]);
    };
    
    this.doLayout();
  },
  
  /**
   * Mixes up the locations of the pieces
   * @param {Boolean} animate True to animate the shuffling (defaults to true)
   */
  shufflePieces: function(animate) {
    var animate = animate || true;
    
    var width  = this.getEl().getWidth();
    var height = this.getEl().getHeight();
    var left   = this.getEl().getLeft();
    var top    = this.getEl().getTop();
    
    for (var i = this.pieces.length - 1; i >= 0; i--){
      var randX = Math.floor(Math.random() * (width  - this.pieces[i].el.getWidth()))  + left;
      var randY = Math.floor(Math.random() * (height - this.pieces[i].el.getHeight())) + top;
      
      this.pieces[i].getEl().moveTo(randX, randY, animate);
    };
  },
  
  /**
   * Solves the Jigsaw by moving each piece to it's correct location
   * @param {Boolean} animate True to animate movement
   */
  solve: function(animate) {
    var animate = animate || true;
    
    var left   = this.getEl().getLeft();
    var top    = this.getEl().getTop();
    
    for (var i = this.pieces.length - 1; i >= 0; i--){
      var piece = this.pieces[i];
      piece.getEl().moveTo(left + piece.xOffset, top + piece.yOffset, animate);
    };
  },
  
  /**
   * Returns the number of complete and the number of incomplete items
   * @return {Object} An object with two properties - complete and incomplete
   */
  getCompletionStatus: function() {
    var complete = 0; var incomplete = 0;
    
    for (var i=0; i < this.pieces.length; i++) {
      this.pieces[i].isInCorrectPosition() ? complete++ : incomplete++;
    };
    
    return {complete: complete, incomplete: incomplete};
  },
  
  /**
   * Creates the HTML elements for the board
   * @param {Ext.Container} ct The Container to render this to
   */
  render: function(ct, position) {
    this.el = ct.createChild({
      tag: 'div',
      cls: 'jigsaw-board'
    });
    
    Jigsaw.Board.superclass.render.apply(this, arguments);
  }  
});

Ext.reg('jigsaw_board', Jigsaw.Board);
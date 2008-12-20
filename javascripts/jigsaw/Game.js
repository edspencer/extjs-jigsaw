Ext.ns('Jigsaw');

/**
 * Jigsaw.Game
 * @extends Ext.Window
 * Contains Jigsaw UI elements
 */
Jigsaw.Game = function(config) {
  var config = config || {};
  
  this.board = new Jigsaw.Board();
 
  Ext.applyIf(config, {
    title:     'ExtJS Jigsaw',
    height:    600,
    width:     800,
    layout:    'fit',
    items:     [this.board],
    resizable: false,
    
    tbar: [
      {
        text:    'New Game',
        scope:   this,
        handler: function() {
          this.newGame();
        }
      },
      {
        text:    'Shuffle pieces',
        scope:   this,
        handler: function() {
          this.board.shufflePieces();
        }
      }
    ]
  });
 
  Jigsaw.Game.superclass.constructor.call(this, config);
};
Ext.extend(Jigsaw.Game, Ext.Window, {
    
  /**
   * @property defaultImageUrl
   * @type String
   * Url of the default puzzle image
   */
  defaultImageUrl: 'images/jigsaws/default.jpg',
  
  /**
   * Launches the game
   */
  launch: function() {
    this.show();
    this.newGame();
  },
  
  /**
   * Starts a new game
   */
  newGame: function() {
    //update window size
    var image = new Image(); image.src = this.defaultImageUrl;
    this.setInteriorSize(image.width, image.height);

    this.board.setImageUrl(this.defaultImageUrl);
    this.board.createPieces();
  },
  
  /**
   * Sets the window's interior to the specified size
   * @param {number} width The width to make the interior
   * @param {number} height The height to make the interior
   */
  setInteriorSize: function(width, height) {
    var xAdditional = 20;
    var yAdditional = 55;
    
    this.setSize(width + xAdditional, height + yAdditional);
  }
});

Ext.reg('jigsaw_window', Jigsaw.Game);
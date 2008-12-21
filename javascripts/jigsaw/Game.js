Ext.ns('Jigsaw');

/**
 * Jigsaw.Game
 * @extends Ext.Window
 * Contains Jigsaw UI elements
 */
Jigsaw.Game = function(config) {
  var config = config || {};
  
  this.board = new Jigsaw.Board();
  
  this.completed = new Ext.Toolbar.TextItem("x completed, y incomplete");
  this.time      = new Ext.Toolbar.TextItem("x seconds");
  
  //create the image choose submenu items
  var imagesMenu = [];
  for (var i=0; i < this.imageUrls.length; i++) {
    imagesMenu.push({
      text:  this.imageUrls[i],
      scope: this,
      handler: function(btn) {
        this.fireEvent('changeimage', btn.text);
      }
    });
  };
 
  Ext.applyIf(config, {
    title:     'ExtJS Jigsaw',
    constrain: true,
    height:    600,
    width:     800,
    layout:    'fit',
    items:     [this.board],
    resizable: false,
    
    tbar: [
      {
        xtype:   'tbsplit',
        text:    'New Game',
        scope:   this,
        handler: function() {
          this.newGame();
        },
        menu: new Ext.menu.Menu({
          items: [
            {
              text:    'Change Picture',
              scope:   this,
              menu:    imagesMenu,
              handler: function() {
                console.log(this.imageUrls);
              }
            }
          ]
        })
      },
      {
        text:    'Shuffle pieces',
        scope:   this,
        handler: function() {
          this.board.shufflePieces();
        }
      },
      {
        text:    'Solve',
        scope:   this,
        handler: function() {
          this.board.solve();
        }
      }
    ],
    
    bbar: new Ext.StatusBar({
      statusAlign: 'right',
      items: [this.completed, '->', this.time]
    })
  });
 
  Jigsaw.Game.superclass.constructor.call(this, config);
  
  this.addEvents(
    /**
     * @event changeimage
     * Fires when the user changes the image to use
     * @param {String} imageUrl The image to change to
     */
    'changeimage'
  );
  
  this.on('changeimage', this.newGame, this);
  
  
  //update the game time and score
  Ext.TaskMgr.start({
    run: function() {
      var cs = this.board.getCompletionStatus();
      Ext.fly(this.completed.getEl()).update(cs.complete + " completed, " + cs.incomplete + " incomplete");
    },
    interval: 500,
    scope:    this
  });
};
Ext.extend(Jigsaw.Game, Ext.Window, {
  
  /**
   * @property imageUrls
   * @type Array
   * An array of image urls installed by default
   */
  imageUrls: ['images/jigsaws/galactica-small.jpg', 'images/jigsaws/default.jpg'],
  
  /**
   * @property defaultImageUrl
   * @type String
   * Url of the default puzzle image
   */
  defaultImageUrl: 'images/jigsaws/galactica-small.jpg',
  
  /**
   * Launches the game
   */
  launch: function() {
    this.show();
    this.newGame();
  },
  
  /**
   * Starts a new game
   * @param {String} imageUrl The image url to use (defaults to this.defaultImageUrl)
   */
  newGame: function(imageUrl) {
    var imageUrl = imageUrl || this.defaultImageUrl;
    
    //update window size
    var image = new Image(); image.src = imageUrl;
    this.setInteriorSize(image.width, image.height);

    this.board.setImageUrl(imageUrl);
    this.board.createPieces();
  },
  
  /**
   * Sets the window's interior to the specified size
   * @param {number} width The width to make the interior
   * @param {number} height The height to make the interior
   */
  setInteriorSize: function(width, height) {
    var xAdditional = 12;
    var yAdditional = 90;
    
    this.setSize(width + xAdditional, height + yAdditional);
  },
  
  /**
   * Returns true if all pieces are in the correct position
   * @return {Boolean} true if the game has been won
   */
  inWinState: function() {
    return this.board.getCompletionStatus().complete == this.board.pieces.length;
  },
});

Ext.reg('jigsaw_window', Jigsaw.Game);
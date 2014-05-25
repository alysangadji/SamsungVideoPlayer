alert('SceneScene1.js loaded');

function SceneScene1(options) {

    this.options = options;
	this.videoPositition = 
		{
			left: convCoord(700, 720),
	        top: convCoord(100, 720),
	        width: convCoord(500, 720),
	        height: convCoord(400, 720)
		};
	
	this.playList = [{
		url: 'http://alysangadji.com/wp-content/uploads/2014/05/GODZILLA-Official-International-UK-Trailer-3-2014-HD.mp4',
		title: 'GODZILLA-Official-International 2014',
        urlImage: 'background1.jpg'
    },{
        url: 'http://alysangadji.com/wp-content/uploads/2014/05/Fitness-Samsung-Gear-Fit-Official-Video-1.mp4',
        title: 'Samsung Gear Fit',
        urlImage: 'background1.jpg'
	},{
		url: 'http://alysangadji.com/wp-content/uploads/2014/05/Samsung-Galaxy-S5-TV-Commercial.mp4',
		title: 'Samsung Galaxy S5',
        urlImage: 'background2.jpg'
	},
	{
        url: 'http://www.w3schools.com/tags/movie.mp4',
        title: 'w3schools - Sample Movie',
        urlImage: 'background1.jpg'
	}];
	
	this.nState = sf.service.VideoPlayer.STATE_STOPPED;
	
	this.MessageError = {};
	this.MessageError[sf.service.VideoPlayer.ERR_NOERROR] = 'NoError';
    this.MessageError[sf.service.VideoPlayer.ERR_NETWORK] = 'Error Network';
    this.MessageError[sf.service.VideoPlayer.ERR_NOT_SUPPORTED] = 'Not Supported';
    
    this.MessageState = {};
	this.MessageState[sf.service.VideoPlayer.STATE_PLAYING] = 'Playing';
    this.MessageState[sf.service.VideoPlayer.STATE_STOPPED] = 'Stoped';
    this.MessageState[sf.service.VideoPlayer.STATE_PAUSED] = 'Paused';
    this.MessageState[sf.service.VideoPlayer.STATE_BUFFERING] = 'Buffering';
    this.MessageState[sf.service.VideoPlayer.STATE_SCANNING] = 'Scanning';
    
    
    function convCoord(val, baseResol) {
		var rate = curWidget.height / baseResol;
		return parseInt(val*rate, 10);
    }
};

SceneScene1.prototype.initialize = function () {
	alert("SceneScene1.initialize()");
	// this function will be called only once when the scene manager show this scene first time
	// initialize the scene controls and styles, and initialize your variables here
	// scene HTML and CSS will be loaded before this function is called
	
	var videos = [];
    for(var i=0; i<this.playList.length; i++)
    {
        videos.push(this.playList[i].title);
    }

    $("#lstVideoPlayerPartial").sfList({
        data: videos,
        index: 0,
        itemsPerPage: 8
    }).sfList('blur');

};

SceneScene1.prototype.handleShow = function (data) {
	alert("SceneScene1.handleShow()");
	// this function will be called when the scene manager show this scene

    var opt = {};
    var _THIS_ = this;
    opt.onerror = function(error, info){
        _THIS_.printEvent('ERROR : ' + (_THIS_.error2String[error]||error) + (info ? ' (' + info + ')' : ''));
    };
    opt.onend = function(){
        _THIS_.printEvent('END');
    };
    opt.onstatechange = function(state, info){
        _THIS_.printEvent('StateChange : ' + (_THIS_.state2String[state]||state) + (info ? ' (' + info + ')' : ''));
        _THIS_.nState = state;
        _THIS_.setKeyHelp();
    };
    sf.service.VideoPlayer.init(opt);

    sf.service.VideoPlayer.setKeyHandler(sf.key.RETURN, function () {
        sf.service.VideoPlayer.setFullScreen(false);
    });
    sf.service.VideoPlayer.setPosition(this.videoPositition);
    sf.service.VideoPlayer.show();
    alert("loaded video player " + this.playList.length);

};

SceneScene1.prototype.handleHide = function () {
	alert("SceneScene1.handleHide()");
	// this function will be called when the scene manager hide this scene

    sf.service.VideoPlayer.stop();
    sf.service.VideoPlayer.hide();
};

SceneScene1.prototype.handleFocus = function () {
	alert("SceneScene1.handleFocus()");
	// this function will be called when the scene manager focus this scene

    this.setKeyHelp();
    $("#lstVideoPlayerPartial").sfList('focus');
};

SceneScene1.prototype.handleBlur = function () {
	alert("SceneScene1.handleBlur()");
	// this function will be called when the scene manager move focus to another scene from this scene

    $("#lstVideoPlayerPartial").sfList('blur');
    if (sf.service.VideoPlayer.Skip.isInProgress()) {
        sf.service.VideoPlayer.Skip.cancel();
    }
};

SceneScene1.prototype.handleKeyDown = function (keyCode) {
	alert("SceneScene1.handleKeyDown(" + keyCode + ")");
	// TODO : write an key event handler when this scene get focused
	switch (keyCode) {
		case sf.key.UP:
            if (!sf.service.VideoPlayer.Skip.isInProgress()) {
                $("#lstVideoPlayerPartial").sfList('prev');
            }
			break;
		case sf.key.DOWN:
            if (!sf.service.VideoPlayer.Skip.isInProgress()) {
                $("#lstVideoPlayerPartial").sfList('next');
            }
			break;
		case sf.key.ENTER:
            if (sf.service.VideoPlayer.Skip.isInProgress()) {
                sf.service.VideoPlayer.Skip.stop();
            }
            else {
                sf.service.VideoPlayer.stop();
                var item = this.playList[$("#lstVideoPlayerPartial").sfList('getIndex')];
                item.fullScreen = false;

                sf.service.VideoPlayer.play(item);
            }
            break;
        case sf.key.RETURN:
            if (sf.service.VideoPlayer.Skip.isInProgress()) {
                sf.service.VideoPlayer.Skip.cancel();
                sf.key.preventDefault();
            }
            break;
        case sf.key.RED:
            if (this.nState == sf.service.VideoPlayer.STATE_PLAYING ||
                this.nState == sf.service.VideoPlayer.STATE_BUFFERING ||
                this.nState == sf.service.VideoPlayer.STATE_PAUSED) {
                sf.service.VideoPlayer.setFullScreen(true);
                alert("RED KEY");
            }
            break;

        case sf.key.PAUSE:
            sf.service.VideoPlayer.pause();
            break;
        case sf.key.PLAY:
            if (sf.service.VideoPlayer.Skip.isInProgress()) {
                sf.service.VideoPlayer.Skip.stop();
            }
            else {
                sf.service.VideoPlayer.resume();
            }
            break;
        case sf.key.STOP:
            if (sf.service.VideoPlayer.Skip.isInProgress()) {
                sf.service.VideoPlayer.Skip.cancel();
            }
            sf.service.VideoPlayer.stop();
            break;
        case sf.key.FF:
            sf.service.VideoPlayer.Skip.start(10);
            this.setKeyHelp();
            break;
        case sf.key.REW:
            sf.service.VideoPlayer.Skip.start(-10);
            this.setKeyHelp();
            break;
			break;
		default:
			alert("handle default key event, key code(" + keyCode + ")");
			break;
	}
};

SceneScene1.prototype.setKeyHelp = function (state) {
    //sf.service.VideoPlayer.STATE_PLAYING = 1;
    //sf.service.VideoPlayer.STATE_STOPPED  = 2;
    //sf.service.VideoPlayer.STATE_PAUSED   = 3;
    //sf.service.VideoPlayer.STATE_BUFFERING    = 4;
    //sf.service.VideoPlayer.STATE_SCANNING = 5;
    var oKeyMap = {};

    if (this.nState == sf.service.VideoPlayer.STATE_PLAYING ||
        this.nState == sf.service.VideoPlayer.STATE_PAUSED ||
        this.nState == sf.service.VideoPlayer.STATE_BUFFERING) {
        oKeyMap.RED = 'Fullscreen';
    }

    if (sf.service.VideoPlayer.Skip.isInProgress()) {
        oKeyMap.ENTER = 'Play';
        oKeyMap.RETURN = 'Cancel';
    }
    else {
        oKeyMap.UPDOWN = 'Move Item';
        oKeyMap.ENTER = 'Play';
        oKeyMap.RETURN = 'Return';
    }

    $("#keyhelp").sfKeyHelp(oKeyMap);
}

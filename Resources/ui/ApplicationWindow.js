var _win, _titleLabel, _webView;
var _index = 0;
var _playList = [];

function ApplicationWindow() {
	_win = Ti.UI.createWindow({
		backgroundColor:'#777',
		navBarHidden:true,
		exitOnClose:true,
	});
		
	Ti.Facebook.appid = '392613450762938';
	Ti.Facebook.permissions = ['publish_stream', 'user_groups', 'friends_groups'];
	Ti.Facebook.addEventListener('login', function(e) {
	    if (e.success) {
	        _getWallData();
	    } else if (e.error) {
	        alert(e.error);
	    } else if (e.cancelled) {
	        alert("Canceled");
	    }
	});
	if (Ti.Facebook.loggedIn) {
		_getWallData();
	} else {
		Ti.Facebook.authorize();
	}
	
	var prevButton = Ti.UI.createButton({
		title: '<',
		left: 5, top: 2, bottom: 2,
		width: 30,
	});
	prevButton.addEventListener('click', _prev);
	
	var nextButton = Ti.UI.createButton({
		title: '>',
		right: 5, top: 2, bottom: 2,
		width: 30,
	});
	nextButton.addEventListener('click', _next);
	
	_titleLabel = Ti.UI.createLabel({
		text : 'XXXXXXXX',
		color : '#FFF',
		height : 40,
		width : Ti.Platform.displayCaps.getPlatformWidth() - 40 * 2,
		textAlign : 'left',
		top: 2,
		left: 40,
		ellipsize: true,
	});
	
	var navi = Ti.UI.createView({
		width: '100%',
		height: 44,
		top: 0,
		left: 0,
		backgroundColor: '#333',
	});
	navi.add(prevButton);
	navi.add(_titleLabel);
	navi.add(nextButton);
	
	_webView = Ti.UI.createWebView({
		html: '',
		width: '100%',
		height: Ti.Platform.displayCaps.getPlatformHeight() - 40,
		top: 46,
	});
	
	_win.add(navi);
	_win.add(_webView);
	
	return _win;
}

function _getWallData() {
	Ti.Facebook.requestWithGraphPath('331943460187050/feed', {}, 'GET', function(e) {
		var feedList = JSON.parse(e.result).data;
		for (var i = 0, len = feedList.length; i < len; i++) {
			var feed = feedList[i];
			if (feed.type === 'video') {
				_playList.push({
					title: feed.message,
					link: feed.link,
					source: feed.source,
				});
			}
		}
		
		if (_playList.length > 0) {
			_index = -1;
			_next();
		} else {
			alert('No results');
		}
	});
}

function _next() {
	_index++;
	_move();
}
function _prev() {
	_index--;
	_move();
}
function _move() {
	_titleLabel.text = _playList[_index].title;
	// _webView.html = _getHtml('http://www.youtube.com/v/oHg5SJYRHA0&f=gdata_videos&c=ytapi-my-clientID&d=nGF83uyVrg8eD4rfEkk22mDOl3qUImVMV6ramM');
	// _webView.html = _getHtml(_playList[_index].source);
	_webView.url = _playList[_index].link;
}



function _getHtml(source) {
	return "<html><head></head><body style='margin:0'><embed id='yt' src='" + 
			source + 
			"' type='video/mp4' width='120' height='90'></embed></body></html>";
}

module.exports = ApplicationWindow;

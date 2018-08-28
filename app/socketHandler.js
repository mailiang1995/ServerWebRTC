module.exports = function(io) {

//make by mailiang
    var rooms = [];
//var mSockets = [];

io.on('connection', function(client) {
	console.log('-- ' + client.id + ' joined --');
    //mSockets.push(client);
    //client.emit('id', client.id);
	var roomid;
    client.on('init', function (room) {
        console.log('-- ' + client.id + ' init' + ' into ' + room);
        roomid = room;
        
        if (!rooms[room]) {
            //client.join(room);
			rooms[room] = [];
			rooms[room].push(client);
			client.emit('id', client.id);
			for (var i = 0; i < rooms[room].length; i++) {
				var otherClient = rooms[room][i];
				if (client.id != otherClient.id) {
					otherClient.emit('message',  {
						type: "init",
						from: client.id
					});
				}
			}
		}
        else if (rooms[room].length < 2) {
            //client.join(room);
			rooms[room].push(client);
			client.emit('id', client.id);
			for (var i = 0; i < rooms[room].length; i++) {
				var otherClient = rooms[room][i];
				if (client.id != otherClient.id) {
					otherClient.emit('message',  {
						type: "init",
						from: client.id
					});
				}
			}
		}
		else{
			console.log('full room');
		}
    });

    client.on('message', function (details) {
		console.log('-- ' + client.id + ' message --' + JSON.stringify(details));
		var otherClient = io.sockets.connected[details.to];
		if (!otherClient) {
			return;
		}
		delete details.to;
		otherClient.emit('message', details);
    });

    client.on('disconnect', function(){
        console.log('-- ' + client.id + ' disconnect --' + roomid);
        //client.leave(roomid);
        if (roomid != null) {
            if (rooms[roomid]) {
                for (var i = 0; i < rooms[roomid].length; i++) {
                    var otherClient = rooms[roomid][i];
                    if (client.id == otherClient.id) {
                        rooms[roomid].splice(i, 1);
                    }
                }
            }
        }
	});
    client.on('leave', function(room){
        console.log('-- ' + client.id + ' leave --');
        if (rooms[room]) {
            for (var i = 0; i < rooms[room].length; i++) {
                var otherClient = rooms[room][i];
                if (client.id == otherClient.id) {
                    rooms[room].splice(i, 1);
                }
                else {
                    otherClient.emit('leave', client.id);
                    rooms[room].splice(i, 1);
                }
            }
        }
	});
  });
};
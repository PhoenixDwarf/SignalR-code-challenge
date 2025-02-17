using Microsoft.AspNetCore.SignalR;

namespace SignalR_code_challenge.Hub
{
    public class ChatHub : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IDictionary<string, UserRoomConnection> _connection;
        public ChatHub(IDictionary<string, UserRoomConnection> connection)
        {
            _connection = connection;
        }

        public async Task JoinRoom(UserRoomConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName: userConnection.Room!);
            _connection[Context.ConnectionId] = userConnection;
            await Clients.Group(userConnection.Room!).SendAsync("ReceiveMessage", "App", $"{userConnection.User} has joined the group", DateTime.Now);
            await SendConnectedUsers(userConnection.Room!);
        }

        public async Task SendMessage(string message)
        {
            if(_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
            {
                await Clients.Group(userRoomConnection.Room!).SendAsync("ReceiveMessage", userRoomConnection.User, message, DateTime.UtcNow);
            }
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connection.Values
                .Where(x => x.Room == room)
                .Select(x => x.User);
            return Clients.Group(room).SendAsync("ConnedtedUsers", users);
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection roomConnection))
            {
                return base.OnDisconnectedAsync(exception);
            }

            _connection.Remove(Context.ConnectionId);

            if(roomConnection != null)
            {
                Clients.Group(roomConnection.Room!)
                .SendAsync("ReceiveMessage", "App", $"{roomConnection.User} has left the group", DateTime.Now);
                SendConnectedUsers(roomConnection.Room!);
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}

using Microsoft.AspNetCore.SignalR;

namespace SignalR_code_challenge.Hub
{
    public class ChatHub : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IDictionary<string, UserRoomConnection> _connection;

        // Dictionary to store user connections
        public ChatHub(IDictionary<string, UserRoomConnection> connection)
        {
            _connection = connection;
        }

        // Method to allow users to join rooms
        // Receives an object of type UserRoomConnection 
        public async Task JoinRoom(UserRoomConnection userConnection)
        {
            // Adding the passed group name to the hub groups list
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName: userConnection.Room!);
            // Adds the user connection to the dictionary
            _connection[Context.ConnectionId] = userConnection;
            // Sends notification message to the user's group to let all others know some one has joined
            await Clients.Group(userConnection.Room!).SendAsync("ReceiveMessage", "App", $"{userConnection.User} has joined the group", DateTime.Now);
            // Call Method to send the list of updated connected users to all users in the group
            await SendConnectedUsers(userConnection.Room!);
        }

        // Method to allow users to join rooms
        // Receives a string message
        public async Task SendMessage(string message)
        {
            // Validates if the current connection exists in the dictionary and retrieves the associated connection.
            if (_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
            {
                // Sends message to the user's group with user's name and timestamp
                await Clients.Group(userRoomConnection.Room!).SendAsync("ReceiveMessage", userRoomConnection.User, message, DateTime.UtcNow);
            }
        }
        
        // Method to send the list of connected users in a group
        public Task SendConnectedUsers(string room)
        {
            // Retrieves the list of user names currently connected to the specified room.
            var users = _connection.Values
                .Where(x => x.Room == room)
                .Select(x => x.User);
            // Sends the list of connected users to all users in the specified room.
            return Clients.Group(room).SendAsync("ConnedtedUsers", users);
        }

        // Method to disconnect a user from the hub
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            // Checks if the current connection exists in the dictionary and retrieves the associated connection.
            if (!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection roomConnection))
            {
                // If the connection does not exist, calls the default disconnection logic and returns.
                return base.OnDisconnectedAsync(exception);
            }
            // Removes the user from the connection dictionary.
            _connection.Remove(Context.ConnectionId);

            if(roomConnection != null)
            {
                // If room connection still exist, notifies all users in the room that a user has left
                Clients.Group(roomConnection.Room!)
                .SendAsync("ReceiveMessage", "App", $"{roomConnection.User} has left the group", DateTime.Now);
                // Updates the list of connected users for the room.
                SendConnectedUsers(roomConnection.Room!);
            }
            // Finally call the default method to complete the disconnection process.
            return base.OnDisconnectedAsync(exception);
        }
    }
}

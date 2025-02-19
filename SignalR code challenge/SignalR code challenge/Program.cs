using SignalR_code_challenge;
using SignalR_code_challenge.Hub;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
// Adds the dependency injection instance to be injected in the chatHub
builder.Services.AddSingleton<IDictionary<string, UserRoomConnection>>(_ => new Dictionary<string, UserRoomConnection>());

//Add CORS policy to allow local host 4200
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:4200/")
        .AllowAnyMethod()
        .AllowCredentials()
        .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Add routing
app.UseRouting();

//Add CORS
app.UseCors();

//Registers chat route
app.MapHub<ChatHub>(pattern: "/chat");

app.MapControllers();

app.Run();

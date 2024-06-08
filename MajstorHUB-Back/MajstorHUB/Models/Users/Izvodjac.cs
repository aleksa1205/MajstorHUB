namespace MajstorHUB.Models.Users;

public class Izvodjac
{
    [BsonRepresentation(BsonType.ObjectId)]
    public required string IzvodjacId { get; set; }

    public required Roles TipIzvodjaca { get; set; }
}

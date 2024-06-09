namespace MajstorHUB.Models.Users;

public class Report
{
    [JsonIgnore]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [JsonIgnore]
    [BsonElement("inicijator")]
    public string? Inicijator { get; set; }

    [BsonElement("prijavljeni")]
    public required string Prijavljeni { get; set; }

    [BsonElement("razlog_report")]
    public required RazlogReport Razlog { get; set; }

    [JsonIgnore]
    [BsonElement("datum_prijave")]
    public DateTime DatumPrijave { get; set; } = DateTime.Now;

    [BsonElement("opis")]
    public string? Opis { get; set; }
}

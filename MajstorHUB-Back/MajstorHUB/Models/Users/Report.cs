namespace MajstorHUB.Models.Users;

public class Report
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("inicijator")]
    public string? Inicijator { get; set; }

    [BsonElement("tip_inicijatora")]
    public Roles? TipInicijatora { get; set; }

    [BsonElement("prijavljeni")]
    public required string Prijavljeni { get; set; }

    [BsonElement("tip_prijavljenog")]
    public required Roles TipPrijavljenog { get; set; }

    [BsonElement("razlog_report")]
    public required RazlogReport Razlog { get; set; }

    [BsonElement("datum_prijave")]
    public DateTime DatumPrijave { get; set; } = DateTime.Now;

    [BsonElement("opis")]
    public string? Opis { get; set; }
}

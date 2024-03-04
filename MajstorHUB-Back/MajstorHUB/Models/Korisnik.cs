using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;
namespace MajstorHUB.Models;


public class Korisnik : User
{
    [BsonElement("jmbg")]
    [Length(13, 13, ErrorMessage ="JMBG mora imati 13 brojeva!")]
    public required string JMBG { get; set; }

    [BsonElement("ime")]
    public required string Ime { get; set; }

    [BsonElement("prezime")]
    public required string Prezime { get; set; }

    [BsonElement("datum_rodjenja")]
    public DateTime? DatumRodjenja { get; set; }
}
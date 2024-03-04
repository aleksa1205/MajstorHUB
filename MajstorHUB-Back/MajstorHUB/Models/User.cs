using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MajstorHUB.Models
{
    public abstract class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public required string Email { get; set; }

        [BsonElement("adresa")]
        public string? Adresa { get; set; }

        [BsonElement("broj_telefona")]
        public string? BrojTelefona { get; set; }

        [BsonElement("datum_kreiranja")]
        public DateTime DatumKreiranjaNaloga { get; set; } = DateTime.Now;

        [BsonElement("NovacNaSajtu")]
        public double NovacNaSajtu { get; set; } = 0;
    }
}

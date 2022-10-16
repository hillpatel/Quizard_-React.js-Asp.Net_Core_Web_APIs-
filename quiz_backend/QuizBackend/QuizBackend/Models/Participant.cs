using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizBackend.Models
{
    public class Participant
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
    public class ParticipantWithQuizCode
    {
        [Key]
        public string Name { get; set; }
        public string Email { get; set; }
        public int QuizCode { get; set; }
    }
}

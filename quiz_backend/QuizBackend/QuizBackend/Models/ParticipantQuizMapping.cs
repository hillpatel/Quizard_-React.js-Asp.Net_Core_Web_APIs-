using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizBackend.Models
{
    public class ParticipantQuizMapping
    {
        [Key]
        public int Id { get; set; }
        public int ParticipantId { get; set; }
        public int QuizId { get; set; }
        public int Score { get; set; }
        public int TimeTaken { get; set; }
    }
}

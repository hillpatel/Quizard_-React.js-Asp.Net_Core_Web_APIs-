using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizBackend.Models
{
    public class Quiz
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int QuizCreatorId { get; set; }
        public int QuizCode { get; set; }
    }

    public class PagedResultQuiz
    {
        public bool isPagination { get; set; }
        public int quizCreatorId { get; set; }
        public int size { get; set; }
        public int offset { get; set; }
        public string sort { get; set; }
    }
}

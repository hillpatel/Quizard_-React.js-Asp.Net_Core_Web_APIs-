using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizBackend.Models
{
    public class Question
    {
        [Key]
        public int Id { get; set; }
        public string QuestionInWords { get; set; }
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public string Option4 { get; set; }
        public int Answer { get; set; }
        public int QuizId { get; set; }

    }

    public class PagedResultQuestion
    {
        public bool isPagination { get; set; }
        public int quizId { get; set; }
        public int size { get; set; }
        public int offset { get; set; }
        public string sort { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizBackend.Models
{
    public class QuizDbContext : DbContext
    {
        public QuizDbContext(DbContextOptions<QuizDbContext> options) : base(options)
        {
        }
        public DbSet<Participant> Participants { get; set; }
        public DbSet<ParticipantQuizMapping> ParticipantQuizMappings { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Quiz> Quizs { get; set; }
        public DbSet<QuizCreator> QuizCreators { get; set; }
    }
}

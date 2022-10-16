using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizBackend.Models;

namespace QuizBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizsController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public QuizsController(QuizDbContext context)
        {
            _context = context;
        }

        // GET: api/Quizs/List
        [HttpPost("List")]
        public async Task<ActionResult<dynamic>> GetQuizs(PagedResultQuiz input)
        {
            if (input.isPagination)
            {
                var sortInput = input.sort.Split("|");
                var data = _context.Quizs.Where(x => x.QuizCreatorId == input.quizCreatorId);
                var totalCount = data.Count();
                if (sortInput[1] == "asc")
                {
                    data = sortInput[0]=="Name"? data.OrderBy(x => x.Name) : data.OrderBy(x => x.QuizCode);
                }
                else if(sortInput[1] == "desc")
                {
                    data = sortInput[0] == "Name" ? data.OrderByDescending(x => x.Name) : data.OrderByDescending(x => x.QuizCode);
                }
                data = data.Skip((input.offset - 1)*input.size).Take(input.size);
                return new {
                    totalRows = totalCount,
                    items = await data.ToListAsync()
                };
            }
            else
            {
                return await _context.Quizs.Where(x=>x.QuizCreatorId==input.quizCreatorId).ToListAsync();
            }
        }

        // GET: api/Quizs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuiz(int id)
        {
            var quiz = await _context.Quizs.FindAsync(id);

            if (quiz == null)
            {
                return NotFound();
            }

            return quiz;
        }

        // PUT: api/Quizs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuiz(int id, Quiz quiz)
        {
            if (id != quiz.Id)
            {
                return BadRequest();
            }

            var data = await _context.Quizs.Where(x => x.Id == id).FirstOrDefaultAsync();
            data.Name = quiz.Name;
            _context.Entry(data).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Quizs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Quiz>> PostQuiz(Quiz quiz)
        {
            if (_context.Quizs.Count() == 0)
                quiz.QuizCode = 1001;
            else
            {
                var maxId = await _context.Quizs.MaxAsync(x => x.QuizCode);
                quiz.QuizCode = maxId + 1;
            }
            _context.Quizs.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuiz", new { id = quiz.Id }, quiz);
        }

        // DELETE: api/Quizs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var quiz = await _context.Quizs.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            _context.Quizs.Remove(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuizExists(int id)
        {
            return _context.Quizs.Any(e => e.Id == id);
        }
    }
}

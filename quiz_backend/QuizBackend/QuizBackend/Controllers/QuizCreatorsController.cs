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
    public class QuizCreatorsController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public QuizCreatorsController(QuizDbContext context)
        {
            _context = context;
        }

        // GET: api/QuizCreators
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizCreator>>> GetQuizCreators()
        {
            return await _context.QuizCreators.ToListAsync();
        }

        // GET: api/QuizCreators/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizCreator>> GetQuizCreator(int id)
        {
            var quizCreator = await _context.QuizCreators.FindAsync(id);

            if (quizCreator == null)
            {
                return NotFound();
            }

            var quizes = await _context.Quizs.Where(x => x.QuizCreatorId == id).ToListAsync();
            var sum = 0;
            foreach(var x in quizes)
            {
                sum += _context.ParticipantQuizMappings.Count(y => y.QuizId == x.Id);
            };

            return Ok(new {
                id = quizCreator.Id,
                email = quizCreator.Email,
                quizes = quizes,
                participants = sum
            });
        }


        // PUT: api/QuizCreators/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuizCreator(int id, QuizCreator quizCreator)
        {
            if (id != quizCreator.Id)
            {
                return BadRequest();
            }

            _context.Entry(quizCreator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizCreatorExists(id))
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

        // POST: api/QuizCreators
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuizCreator>> PostQuizCreator(QuizCreator quizCreator)
        {
            var temp = _context.QuizCreators.Where(x => x.Email == quizCreator.Email).FirstOrDefault();
            if (temp == null)
            {
                _context.QuizCreators.Add(quizCreator);
                await _context.SaveChangesAsync();
                return Ok(new { id = quizCreator.Id, email = quizCreator.Email });
            }
            else if(temp.Password == quizCreator.Password){
                quizCreator = temp;
                return Ok(new { id = temp.Id, email = temp.Email});
            }
            else
            {
                return Forbid();
            }
        }

        // DELETE: api/QuizCreators/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuizCreator(int id)
        {
            var quizCreator = await _context.QuizCreators.FindAsync(id);
            if (quizCreator == null)
            {
                return NotFound();
            }

            _context.QuizCreators.Remove(quizCreator);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuizCreatorExists(int id)
        {
            return _context.QuizCreators.Any(e => e.Id == id);
        }
    }
}

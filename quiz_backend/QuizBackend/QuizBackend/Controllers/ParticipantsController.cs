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
    public class ParticipantsController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public ParticipantsController(QuizDbContext context)
        {
            _context = context;
        }

        // GET: api/Participants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Participant>>> GetParticipants()
        {
            return await _context.Participants.ToListAsync();
        }

        // GET: api/Participants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Participant>> GetParticipant(int id)
        {
            var participant = await _context.Participants.FindAsync(id);

            if (participant == null)
            {
                return NotFound();
            }

            return participant;
        }

        // PUT: api/Participants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParticipant(int id, Participant participant)
        {
            if (id != participant.Id)
            {
                return BadRequest();
            }

            _context.Entry(participant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParticipantExists(id))
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

        // POST: api/Participants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Participant>> PostParticipant(ParticipantWithQuizCode participant)
        {
            var quiz = await _context.Quizs.Where(x => x.QuizCode == participant.QuizCode).FirstOrDefaultAsync();
            if (quiz==null)
                return NotFound();

            var temp = await _context.Participants.Where(x => x.Email == participant.Email).FirstOrDefaultAsync();
            
            if (temp == null)
            {
                var newParticipant = new Participant
                {
                    Email = participant.Email,
                    Name = participant.Name
                };
                _context.Participants.Add(newParticipant);
                await _context.SaveChangesAsync();
                return Ok(new { id = newParticipant.Id, email = newParticipant.Email, quizCode = quiz.Id, timeTaken = 0, score = 0 });
            }
            else
            {
                var quizMapping = await _context.ParticipantQuizMappings.Where(x => x.ParticipantId == temp.Id && x.QuizId == quiz.Id).FirstOrDefaultAsync();
                if(quizMapping==null)
                    return Ok(new { id = temp.Id, email = temp.Email, quizCode = quiz.Id, timeTaken = 0, score = 0 });
                else
                    return Ok(new { id = temp.Id, email = temp.Email, quizCode = quiz.Id, timeTaken = quizMapping.TimeTaken, score = quizMapping.Score });
            }
        }

        [HttpPost("Mapping")]
        public async Task<ActionResult<ParticipantQuizMapping>> PostParticipantQuizMapping(ParticipantQuizMapping participantQuizMapping)
        {
            var mapping = await _context.ParticipantQuizMappings.Where(x => x.ParticipantId == participantQuizMapping.ParticipantId && x.QuizId == participantQuizMapping.QuizId).FirstOrDefaultAsync();
            if (mapping == null)
            {
                _context.ParticipantQuizMappings.Add(participantQuizMapping);
            }
            else
            {
                _context.ParticipantQuizMappings.Update(participantQuizMapping);
            }
            await _context.SaveChangesAsync();
            return participantQuizMapping;
        }

        // DELETE: api/Participants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticipant(int id)
        {
            var participant = await _context.Participants.FindAsync(id);
            if (participant == null)
            {
                return NotFound();
            }

            _context.Participants.Remove(participant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParticipantExists(int id)
        {
            return _context.Participants.Any(e => e.Id == id);
        }
    }
}

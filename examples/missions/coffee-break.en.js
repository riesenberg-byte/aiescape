// Authoring example only. This file is not imported by the live game.
export const english = {
  title: 'A Very Efficient Coffee Break',
  stages: [
    {
      title: 'A break needs a brief', label: 'Clarify the request',
      task: 'MILO wants to schedule a coffee break. Ask the handbook who it is for and how long it should last.',
      slots: [
        { id: 'audience', label: 'Who?', options: [['clients', 'Clients'], ['team', 'The team']] },
        { id: 'duration', label: 'How long?', options: [['ten', '10 minutes'], ['sixty', '60 minutes']] }
      ],
      manual: [['TEAM NOTE', 'This is an internal team break, without clients.'], ['SCHEDULE', 'The agreed slot lasts 10 minutes.']],
      hints: ['Confirm both the audience and the time.', 'Use the internal team slot, not a client appointment.'],
      success: 'Ten minutes for the team. I had reserved an entire quarter.',
      failure: 'That does not match the team note and schedule. Please compare both.'
    },
    {
      title: 'Is that really the policy?', label: 'Verify a claim',
      task: 'Which statement is unsupported? The handbook has the original policy note.',
      choices: [['A', 'This break lasts 10 minutes.', 'Team schedule'], ['B', 'Every break must last at least one hour.', 'Alleged policy']],
      manual: [['POLICY NOTE', 'The agreed break is 10 minutes. No minimum duration of one hour is specified.']],
      hints: ['Compare the claim with the actual policy note.', 'A precise-sounding rule still needs a source.'],
      success: 'The one-hour minimum was an invention. An ambitious one.',
      failure: 'That statement is supported by the note. Check the other claim.'
    },
    {
      title: 'A safe plan', label: 'Respect dependencies',
      task: 'Arrange the planning steps. The handbook explains their dependencies.',
      choices: [['approve', 'Ask the team to approve the plan'], ['draft', 'Draft the break plan'], ['check', 'Check the agreed details']],
      manual: [['DEPENDENCIES', 'Check the details before drafting. The team approves the completed draft.']],
      hints: ['Which step needs the output of another?', 'Checking comes first and approval last.'],
      success: 'Plan approved. I will practise doing nothing productively.',
      failure: 'Approval needs a draft, and the draft needs checked details.'
    }
  ]
};

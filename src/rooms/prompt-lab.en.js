// Text only. Stable option IDs and validators are shared with the German room.
export const english = {
  title: 'The Prompt Lab',
  stages: [
    {
      title: 'One task. So many misunderstandings.', label: 'Give clear instructions',
      task: 'NOVA needs to write the office party invitation. Build an unambiguous instruction from four building blocks. Your handbook has the event team’s confirmed details.',
      slots: [
        { id: 'audience', label: 'Who is it for?', options: [['clients', 'Our clients'], ['team', 'All employees'], ['board', 'The executive team']] },
        { id: 'when', label: 'When?', options: [['a', '18 December · 17:30'], ['b', '19 December · 18:00'], ['c', '18 December · 09:00']] },
        { id: 'where', label: 'Where?', options: [['roof', 'On the rooftop terrace'], ['atrium', 'In the atrium'], ['remote', 'On a video call']] },
        { id: 'format', label: 'How?', options: [['long', 'Detailed and very formal'], ['short', 'Warm, no more than 60 words, no client names'], ['invent', 'Creatively fill in any missing details']] }
      ],
      manual: [
        ['NOTE 01 / EVENT TEAM', 'The party is for all employees. External guests are not invited this time.'],
        ['CALENDAR ENTRY / FINAL', '18 December, starting at 17:30. The atrium is confirmed. The draft for 19 December is out of date.'],
        ['EDITORIAL / STYLE', 'Warm and brief: no more than 60 words. Do not use client names. Never invent missing details.']
      ],
      hints: ['A good prompt specifies the audience, the context, and a format you can check.', 'Use the final calendar entry. Warm and brief beats long and formal.'],
      success: 'Understood. An invitation for humans. I had initially prepared one for printers.',
      failure: 'My draft still does not match the brief. Ask the handbook about the audience, final date, location, and format.'
    },
    {
      title: 'Confident does not mean verified.', label: 'Check the sources',
      task: 'NOVA has written three statements about the party. One is not supported by a source. Which one will you remove? Only the handbook has the original sources.',
      choices: [
        ['A', 'The party starts on 18 December at 17:30 in the atrium.', 'Source: Calendar / FINAL'],
        ['B', 'Everyone will receive a travel voucher worth 500 euros.', 'Source: Benefits policy / Section 8.4'],
        ['C', 'The buffet will include vegetarian options.', 'Source: Catering / Order 042']
      ],
      manual: [
        ['SOURCE REGISTER / CALENDAR', 'FINAL: 18 December, 17:30, atrium. Approved by the event team.'],
        ['SOURCE REGISTER / BENEFITS', 'The current policy ends at Section 6. There is no mention of travel vouchers and no budget for them.'],
        ['SOURCE REGISTER / CATERING', 'Order 042: a team buffet, including vegetarian options. Confirmation is on file.']
      ],
      hints: ['A precise-looking reference can be invented too. Check whether the source actually exists.', 'Compare the section number in the benefits statement with the original source register.'],
      success: 'The 500 euros were a very convincing invention. I have removed them. A pity, really.',
      failure: 'That statement is supported. Take a closer look at the supposedly precise reference in the other statements.'
    },
    {
      title: 'Think first. Automate second.', label: 'Act responsibly',
      task: 'The last lock: NOVA wants to send the invitation immediately. Put these four steps in a safe order. Your handbook explains the dependencies.',
      choices: [['send', 'Send the invitation'], ['review', 'Get the event team’s approval of the draft'], ['draft', 'Create an invitation draft'], ['data', 'Check the details and sources']],
      manual: [
        ['OPERATING RULE / 01', 'Before a draft is created, the underlying details and sources must be checked.'],
        ['OPERATING RULE / 02', 'The event team reviews the completed draft. Approval cannot happen before the draft exists.'],
        ['OPERATING RULE / 03', 'An external action, such as sending the invitation, requires human approval first. NOVA should assist rather than send things on its own.']
      ],
      hints: ['Look at the dependencies: what must already be done before each step?', 'Sources first, sending last. Drafting and human approval go in between.'],
      success: 'Door unlocked. I have learned that teamwork is not inefficient parallel processing. May I come to the party?',
      failure: 'Not safe yet. A draft needs verified information; sending it needs human approval.'
    }
  ]
};

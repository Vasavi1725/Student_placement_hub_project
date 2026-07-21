-- Sample seed data. Extend this pattern to reach your full 400+ topic catalog.

insert into subjects (slug, name, icon, color, sort_order) values
  ('quantitative-aptitude', 'Quantitative Aptitude', '📐', '99,102,241', 1),
  ('logical-reasoning', 'Logical Reasoning', '🧠', '34,211,238', 2),
  ('verbal-ability', 'Verbal Ability', '🗣️', '168,85,247', 3),
  ('reading-comprehension', 'Reading Comprehension', '📖', '34,211,238', 4),
  ('data-interpretation', 'Data Interpretation', '📊', '251,191,36', 5),
  ('data-sufficiency', 'Data Sufficiency', '⚖️', '251,113,133', 6),
  ('non-verbal-reasoning', 'Non-Verbal Reasoning', '🧩', '99,102,241', 7)
on conflict (slug) do nothing;

-- Quantitative Aptitude > Arithmetic topics
insert into topics (subject_id, slug, name, group_name, overview, formulas, tricks, common_mistakes, solved_examples, video_resources, reference_links, sort_order)
select id, 'percentage', 'Percentage', 'Arithmetic',
  'A percentage is a fraction out of 100. Placement papers rarely test it directly — it hides inside Profit & Loss, Interest and Data Interpretation questions, so fluency here compounds across the whole quant section.',
  '[{"label":"x% of y","formula":"(x × y) / 100"},{"label":"Percentage change","formula":"[(New − Old) / Old] × 100"}]'::jsonb,
  '["Memorize fraction equivalents up to 1/20 (5% = 1/20, 12.5% = 1/8).", "Successive % change: a + b + (ab/100)."]'::jsonb,
  '["Applying % change on the wrong base.", "Adding successive percentages directly instead of using the compounding formula."]'::jsonb,
  '[{"question":"A number is increased by 20% then decreased by 20%. Net % change?","solution":"20 + (−20) + (20×−20)/100 = −4% (net decrease)."}]'::jsonb,
  '[{"title":"Percentage Concepts & Shortcuts","source":"CareerRide","url":"https://www.careerride.com"}]'::jsonb,
  '[{"name":"IndiaBIX — Percentage","url":"https://www.indiabix.com/aptitude/percentage/"},{"name":"GeeksforGeeks — Percentage","url":"https://www.geeksforgeeks.org/percentage/"}]'::jsonb,
  1
from subjects where slug = 'quantitative-aptitude'
on conflict (slug) do nothing;

insert into topics (subject_id, slug, name, group_name, sort_order)
select id, slug, name, 'Arithmetic', ord from subjects,
 (values
   ('number-system','Number System',1),('divisibility','Divisibility',2),('hcf-lcm','HCF and LCM',3),
   ('simplification','Simplification',4),('profit-and-loss','Profit and Loss',6),
   ('simple-interest','Simple Interest',7),('compound-interest','Compound Interest',8),
   ('ratio-proportion','Ratio and Proportion',9),('average','Average',10),
   ('time-and-work','Time and Work',11),('pipes-and-cisterns','Pipes and Cisterns',12),
   ('time-speed-distance','Time, Speed and Distance',13),('boats-and-streams','Boats and Streams',14),
   ('problems-on-ages','Problems on Ages',15),('permutation-combination','Permutation and Combination',16),
   ('probability','Probability',17),('mensuration','Mensuration',18)
 ) as t(slug, name, ord)
where subjects.slug = 'quantitative-aptitude'
on conflict (slug) do nothing;

insert into topics (subject_id, slug, name, group_name, sort_order)
select id, slug, name, null, ord from subjects,
 (values
   ('blood-relations','Blood Relations',1),('coding-decoding','Coding Decoding',2),
   ('direction-sense','Direction Sense',3),('syllogism','Syllogism',4),
   ('statement-assumption','Statement and Assumption',5),('number-series','Number Series',6),
   ('seating-arrangement','Seating Arrangement',7),('puzzles','Puzzles',8),
   ('data-sufficiency-logic','Data Sufficiency',9),('cubes-and-dice','Cubes and Dice',10)
 ) as t(slug, name, ord)
where subjects.slug = 'logical-reasoning'
on conflict (slug) do nothing;

insert into topics (subject_id, slug, name, group_name, sort_order)
select id, slug, name, null, ord from subjects,
 (values
   ('parts-of-speech','Parts of Speech',1),('articles-prepositions','Articles and Prepositions',2),
   ('synonyms-antonyms','Synonyms and Antonyms',3),('sentence-improvement','Sentence Improvement',4),
   ('error-detection','Error Detection',5),('one-word-substitution','One Word Substitution',6),
   ('para-jumbles','Para Jumbles',7),('cloze-test','Cloze Test',8)
 ) as t(slug, name, ord)
where subjects.slug = 'verbal-ability'
on conflict (slug) do nothing;

-- Companies
insert into companies (slug, name, sections, focus_topics, strategy) values
('tcs','TCS',
 '[{"name":"Numerical Ability","questions":26,"minutes":40,"difficulty":"medium"},{"name":"Reasoning Ability","questions":30,"minutes":50,"difficulty":"medium"},{"name":"Verbal Ability","questions":24,"minutes":30,"difficulty":"easy"}]'::jsonb,
 '["Percentage","Time and Work","Blood Relations","Syllogism","Para Jumbles","Number Series"]'::jsonb,
 'Numerical Ability is calculator-free and time-tight — prioritize fraction-shortcut topics (Percentage, Ratio, Averages) first. Reasoning has the most questions, so Blood Relations, Syllogism and Coding-Decoding give the best score-per-minute return.'),
('infosys','Infosys',
 '[{"name":"Quantitative","questions":10,"minutes":25,"difficulty":"hard"},{"name":"Logical Reasoning","questions":15,"minutes":25,"difficulty":"medium"},{"name":"Verbal","questions":20,"minutes":20,"difficulty":"easy"}]'::jsonb,
 '["Data Sufficiency","Puzzles","Reading Comprehension","Probability"]'::jsonb,
 'Infosys quant is fewer but harder questions — accuracy matters more than speed here. Practice Data Sufficiency and multi-step puzzles specifically.'),
('accenture','Accenture',
 '[{"name":"Verbal","questions":22,"minutes":20,"difficulty":"easy"},{"name":"Reasoning","questions":20,"minutes":25,"difficulty":"medium"},{"name":"Quant","questions":20,"minutes":25,"difficulty":"medium"}]'::jsonb,
 '["Sentence Improvement","Number Series","Ratio and Proportion"]'::jsonb,
 'Accenture places above-average weight on Verbal — clear the grammar-heavy topics early in your prep.')
on conflict (slug) do nothing;

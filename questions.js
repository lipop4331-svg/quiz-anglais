// Pour ajouter une question : copier une ligne, changer le texte.
// c = categorie, q = question, o = choix, a = numero de la bonne reponse (0 = premier), e = explication
const QUESTIONS = [
  // ---- Present simple / continu ----
  { c: "Present", q: "She ___ to school every day.", o: ["go", "goes", "is going", "going"], a: 1, e: "Habitude = present simple. Avec he/she/it on ajoute -s : she goes." },
  { c: "Present", q: "Look! It ___ right now.", o: ["rains", "is raining", "rain", "rained"], a: 1, e: "Ce qui se passe en ce moment (right now) = present continu : be + verbe-ing." },
  { c: "Present", q: "I ___ coffee. I prefer tea.", o: ["don't like", "doesn't like", "not like", "am not like"], a: 0, e: "Negation au present simple : do not / don't + verbe. Avec I on utilise don't." },
  { c: "Present", q: "___ he play football on Sundays?", o: ["Do", "Does", "Is", "Are"], a: 1, e: "Question au present simple avec he/she/it : Does + sujet + verbe sans -s." },
  { c: "Present", q: "My brother ___ TV at the moment.", o: ["watch", "watches", "is watching", "watching"], a: 2, e: "At the moment = en ce moment : present continu." },
  { c: "Present", q: "Water ___ at 100 degrees.", o: ["is boiling", "boils", "boil", "boiled"], a: 1, e: "Une verite generale s'exprime au present simple." },
  { c: "Present", q: "He ___ his homework every evening.", o: ["do", "does", "doing", "is do"], a: 1, e: "Habitude + he/she/it : do devient does (on ajoute -es)." },
  { c: "Present", q: "Which sentence is correct?", o: ["She don't know.", "She doesn't knows.", "She doesn't know.", "She not know."], a: 2, e: "Apres doesn't, le verbe reste a la base, sans -s : she doesn't know." },
  { c: "Present", q: "They ___ in London. They live in Paris.", o: ["aren't living", "doesn't live", "don't lives", "isn't live"], a: 0, e: "They + are not (aren't) + verbe-ing est possible ; les autres choix sont mal formes." },

  // ---- Passe simple ----
  { c: "Passe", q: "Yesterday, I ___ to the cinema.", o: ["go", "goed", "went", "gone"], a: 2, e: "Go est irregulier : go - went - gone. Hier = prétérit : went." },
  { c: "Passe", q: "She ___ her keys last week.", o: ["lose", "losed", "lost", "loosed"], a: 2, e: "Lose - lost - lost. Attention a l'orthographe : un seul o." },
  { c: "Passe", q: "We ___ pizza for dinner last night.", o: ["eat", "ate", "eaten", "eated"], a: 1, e: "Eat - ate - eaten. Le passe simple est ate." },
  { c: "Passe", q: "He didn't ___ the answer.", o: ["knew", "known", "know", "knows"], a: 2, e: "Apres didn't, le verbe revient a la base : didn't know." },
  { c: "Passe", q: "___ you see the film yesterday?", o: ["Do", "Did", "Were", "Have"], a: 1, e: "Question au passe simple : Did + sujet + verbe a la base." },
  { c: "Passe", q: "They ___ happy to see us.", o: ["was", "were", "are being", "been"], a: 1, e: "Passe de be : I/he/she/it was, you/we/they were." },
  { c: "Passe", q: "I ___ a great book last month.", o: ["readed", "red", "read", "reads"], a: 2, e: "Read - read - read. S'ecrit pareil mais se prononce 'red' au passe." },
  { c: "Passe", q: "When I was young, I ___ in a small village.", o: ["live", "lived", "was live", "have lived"], a: 1, e: "Verbe regulier : on ajoute -ed. Live devient lived." },
  { c: "Passe", q: "She ___ a letter to her friend two days ago.", o: ["writed", "wrote", "written", "write"], a: 1, e: "Write - wrote - written." },
  { c: "Passe", q: "He ___ his bike and fell.", o: ["rided", "rode", "ridden", "ride"], a: 1, e: "Ride - rode - ridden." },

  // ---- Present perfect ----
  { c: "Present perfect", q: "I ___ never ___ sushi.", o: ["have / eat", "have / ate", "have / eaten", "am / eating"], a: 2, e: "Present perfect : have + participe passe. Eat - ate - eaten." },
  { c: "Present perfect", q: "She ___ here since 2020.", o: ["lives", "has lived", "lived", "is living"], a: 1, e: "Since + date, action qui continue = present perfect : has lived." },
  { c: "Present perfect", q: "We have known each other ___ ten years.", o: ["since", "for", "from", "during"], a: 1, e: "For + duree (ten years). Since + point de depart (2015, Monday)." },
  { c: "Present perfect", q: "I have lived here ___ 2018.", o: ["for", "since", "ago", "from"], a: 1, e: "Since + point de depart dans le temps." },
  { c: "Present perfect", q: "Which sentence is correct?", o: ["I have seen him yesterday.", "I saw him yesterday.", "I have saw him yesterday.", "I did see him yesterday ago."], a: 1, e: "Avec une date precise (yesterday, last week) on utilise le passe simple, pas le present perfect." },
  { c: "Present perfect", q: "___ you ever been to Spain?", o: ["Did", "Have", "Do", "Are"], a: 1, e: "Experience de vie (ever) = present perfect : Have you ever + participe passe." },
  { c: "Present perfect", q: "He has just ___ home.", o: ["came", "come", "comes", "coming"], a: 1, e: "Come - came - come. Le participe passe est come." },
  { c: "Present perfect", q: "They haven't finished ___.", o: ["yet", "already", "since", "ago"], a: 0, e: "Yet s'utilise dans les phrases negatives et les questions. Already dans les phrases affirmatives." },

  // ---- Verbes irreguliers ----
  { c: "Verbes irreguliers", q: "Past simple of 'buy' :", o: ["buyed", "bought", "boughten", "buy"], a: 1, e: "Buy - bought - bought." },
  { c: "Verbes irreguliers", q: "Past participle of 'take' :", o: ["took", "taked", "taken", "taking"], a: 2, e: "Take - took - taken." },
  { c: "Verbes irreguliers", q: "Past simple of 'think' :", o: ["thinked", "thought", "thoughted", "thaught"], a: 1, e: "Think - thought - thought." },
  { c: "Verbes irreguliers", q: "Past participle of 'speak' :", o: ["spoke", "speaked", "spoken", "spoked"], a: 2, e: "Speak - spoke - spoken." },
  { c: "Verbes irreguliers", q: "Past simple of 'teach' :", o: ["teached", "taught", "tought", "teacht"], a: 1, e: "Teach - taught - taught." },
  { c: "Verbes irreguliers", q: "Past simple of 'give' :", o: ["gave", "gived", "given", "gove"], a: 0, e: "Give - gave - given." },
  { c: "Verbes irreguliers", q: "Past participle of 'do' :", o: ["did", "done", "doed", "does"], a: 1, e: "Do - did - done." },
  { c: "Verbes irreguliers", q: "Past simple of 'swim' :", o: ["swimmed", "swam", "swum", "swimed"], a: 1, e: "Swim - swam - swum." },
  { c: "Verbes irreguliers", q: "Past participle of 'see' :", o: ["saw", "seen", "seed", "sawn"], a: 1, e: "See - saw - seen." },
  { c: "Verbes irreguliers", q: "Past simple of 'bring' :", o: ["bringed", "brang", "brought", "braught"], a: 2, e: "Bring - brought - brought." },

  // ---- Prepositions ----
  { c: "Prepositions", q: "My birthday is ___ May.", o: ["on", "at", "in", "of"], a: 2, e: "In + mois, annee, saison (in May, in 2024, in summer)." },
  { c: "Prepositions", q: "The meeting is ___ Monday.", o: ["in", "at", "on", "by"], a: 2, e: "On + jour (on Monday, on my birthday)." },
  { c: "Prepositions", q: "I wake up ___ 7 o'clock.", o: ["in", "on", "at", "to"], a: 2, e: "At + heure (at 7 o'clock) et at night, at the weekend." },
  { c: "Prepositions", q: "She is good ___ maths.", o: ["in", "at", "on", "with"], a: 1, e: "Be good at = etre bon en." },
  { c: "Prepositions", q: "I'm afraid ___ spiders.", o: ["from", "of", "about", "with"], a: 1, e: "Be afraid of = avoir peur de." },
  { c: "Prepositions", q: "He is interested ___ music.", o: ["on", "at", "in", "for"], a: 2, e: "Be interested in = s'interesser a." },
  { c: "Prepositions", q: "We arrived ___ Paris at noon.", o: ["to", "at", "in", "on"], a: 2, e: "Arrive in + ville/pays, arrive at + lieu precis (at the station)." },
  { c: "Prepositions", q: "I'm waiting ___ the bus.", o: ["to", "for", "at", "on"], a: 1, e: "Wait for = attendre. Pas besoin de preposition en francais, mais il en faut une en anglais." },
  { c: "Prepositions", q: "Listen ___ me, please.", o: ["at", "to", "for", "-"], a: 1, e: "Listen to = ecouter." },

  // ---- Comparatifs et superlatifs ----
  { c: "Comparatifs", q: "My sister is ___ than me.", o: ["tall", "taller", "more tall", "tallest"], a: 1, e: "Adjectif court : adjectif + -er + than (taller than)." },
  { c: "Comparatifs", q: "This book is ___ than that one.", o: ["interestinger", "more interesting", "most interesting", "more interested"], a: 1, e: "Adjectif long (3 syllabes ou plus) : more + adjectif + than." },
  { c: "Comparatifs", q: "She is the ___ student in the class.", o: ["smarter", "smartest", "most smart", "more smart"], a: 1, e: "Superlatif d'un adjectif court : the + adjectif + -est." },
  { c: "Comparatifs", q: "Good - better - ___", o: ["goodest", "best", "most good", "bestest"], a: 1, e: "Good est irregulier : good - better - the best." },
  { c: "Comparatifs", q: "Bad - worse - ___", o: ["baddest", "worst", "most bad", "worstest"], a: 1, e: "Bad est irregulier : bad - worse - the worst." },
  { c: "Comparatifs", q: "He is as tall ___ his father.", o: ["than", "as", "like", "that"], a: 1, e: "Egalite : as + adjectif + as." },
  { c: "Comparatifs", q: "Which is correct?", o: ["It is more cheaper.", "It is cheaper.", "It is more cheap.", "It is cheapest."], a: 1, e: "On ne mélange pas more et -er. Cheap est court : cheaper." },

  // ---- Modaux ----
  { c: "Modaux", q: "You ___ wear a seatbelt. It's the law.", o: ["can", "must", "may", "would"], a: 1, e: "Must = obligation forte." },
  { c: "Modaux", q: "She ___ swim when she was five.", o: ["can", "could", "must", "should"], a: 1, e: "Could = pouvoir/savoir au passe." },
  { c: "Modaux", q: "You ___ see a doctor. You look ill.", o: ["should", "can", "would", "will"], a: 0, e: "Should = conseil (tu devrais)." },
  { c: "Modaux", q: "He can ___ the piano very well.", o: ["plays", "to play", "play", "playing"], a: 2, e: "Apres un modal (can, must, should), le verbe est a la base, sans to ni -s." },
  { c: "Modaux", q: "You ___ park here. It's forbidden.", o: ["mustn't", "don't have to", "needn't to", "can"], a: 0, e: "Mustn't = interdiction. Don't have to = pas obligé (ce n'est pas pareil !)." },
  { c: "Modaux", q: "You ___ come tomorrow. It's optional.", o: ["mustn't", "don't have to", "can't", "shouldn't"], a: 1, e: "Don't have to = ce n'est pas obligatoire." },
  { c: "Modaux", q: "___ I open the window?", o: ["Do", "May", "Am", "Will to"], a: 1, e: "May I / Can I / Could I = demander la permission." },

  // ---- Quantite et articles ----
  { c: "Quantite", q: "There isn't ___ milk left.", o: ["some", "any", "many", "a"], a: 1, e: "Any dans les phrases negatives et les questions. Some dans les phrases affirmatives." },
  { c: "Quantite", q: "How ___ people are there?", o: ["much", "many", "more", "lot"], a: 1, e: "Many + denombrable (people, books). Much + indenombrable (water, money)." },
  { c: "Quantite", q: "How ___ money do you have?", o: ["many", "much", "some", "any"], a: 1, e: "Money est indenombrable : how much." },
  { c: "Quantite", q: "I need ___ umbrella.", o: ["a", "an", "the", "some"], a: 1, e: "An devant un son voyelle : an umbrella, an hour, an apple." },
  { c: "Quantite", q: "She is ___ honest girl.", o: ["a", "an", "the", "-"], a: 1, e: "Le h de honest ne se prononce pas : on dit an honest." },
  { c: "Quantite", q: "I have ___ friends in London.", o: ["a few", "a little", "much", "a"], a: 0, e: "A few + denombrable pluriel. A little + indenombrable." },
  { c: "Quantite", q: "Which is correct?", o: ["Informations are useful.", "Information is useful.", "An information is useful.", "Informations is useful."], a: 1, e: "Information est indenombrable : pas de -s, pas de a, verbe au singulier. Pareil pour advice, furniture, news." },

  // ---- Futur et conditionnel ----
  { c: "Futur", q: "I think it ___ rain tomorrow.", o: ["will", "is", "did", "has"], a: 0, e: "Will + verbe = prediction ou decision au moment de parler." },
  { c: "Futur", q: "We ___ to the beach on Saturday. We've bought the tickets.", o: ["will go", "are going", "go", "went"], a: 1, e: "Projet deja decide = be going to / present continu." },
  { c: "Futur", q: "If it rains, we ___ at home.", o: ["stay", "will stay", "would stay", "stayed"], a: 1, e: "If + present, will + verbe. On ne met pas will apres if." },
  { c: "Futur", q: "If I ___ rich, I would buy a house.", o: ["am", "was/were", "will be", "be"], a: 1, e: "If + preterit, would + verbe = situation imaginaire." },
  { c: "Futur", q: "She will call you when she ___ home.", o: ["will get", "gets", "got", "getting"], a: 1, e: "Apres when/if/as soon as on utilise le present, pas will." },

  // ---- Vocabulaire et faux amis ----
  { c: "Vocabulaire", q: "'Actually' veut dire :", o: ["actuellement", "en fait", "activement", "finalement"], a: 1, e: "Faux ami ! Actually = en fait. Actuellement se dit currently." },
  { c: "Vocabulaire", q: "'To attend a class' veut dire :", o: ["attendre un cours", "assister a un cours", "attaquer un cours", "attendrir un cours"], a: 1, e: "Faux ami ! Attend = assister a. Attendre se dit wait." },
  { c: "Vocabulaire", q: "'Library' veut dire :", o: ["librairie", "bibliotheque", "livre", "libraire"], a: 1, e: "Faux ami ! Library = bibliotheque. Librairie = bookshop." },
  { c: "Vocabulaire", q: "'Sensible' veut dire :", o: ["sensible", "raisonnable", "sensuel", "sentimental"], a: 1, e: "Faux ami ! Sensible = raisonnable. Sensible se dit sensitive." },
  { c: "Vocabulaire", q: "'To demand' veut dire :", o: ["demander poliment", "exiger", "demander son chemin", "demenager"], a: 1, e: "Faux ami ! Demand = exiger. Demander se dit ask." },
  { c: "Vocabulaire", q: "'Eventually' veut dire :", o: ["eventuellement", "finalement", "evidemment", "evenement"], a: 1, e: "Faux ami ! Eventually = finalement, a la fin. Eventuellement = possibly." },
  { c: "Vocabulaire", q: "'Fun' est :", o: ["un adjectif et un nom (amusant / amusement)", "seulement un adjectif", "un verbe", "un adverbe"], a: 0, e: "On dit 'it's fun' ou 'have fun'. Pour l'adjectif 'drole' on dit funny." },
  { c: "Vocabulaire", q: "Comment dit-on 'lundi' ?", o: ["Monday", "Mondey", "Munday", "Mondai"], a: 0, e: "Monday : jours de la semaine toujours avec une majuscule en anglais." },

  // ---- Structure de phrase ----
  { c: "Phrases", q: "Which word order is correct?", o: ["She always is late.", "She is always late.", "Always she is late.", "She is late always."], a: 1, e: "Always se place apres be, mais avant les autres verbes (she always eats)." },
  { c: "Phrases", q: "Which is correct?", o: ["I have 15 years.", "I am 15 years.", "I am 15.", "I have 15."], a: 2, e: "En anglais on dit I am 15 (etre), pas avoir." },
  { c: "Phrases", q: "Which is correct?", o: ["I like very much cats.", "I like cats very much.", "I very much like cats.", "I very like cats."], a: 1, e: "Very much se place apres le complement : I like cats very much." },
  { c: "Phrases", q: "Which is correct?", o: ["How old are you?", "How old have you?", "Which age have you?", "How many years are you?"], a: 0, e: "How old are you ? On utilise be." },
  { c: "Phrases", q: "Which is correct?", o: ["He is taller that me.", "He is taller than me.", "He is taller as me.", "He is more taller than me."], a: 1, e: "Comparatif + than." },
  { c: "Phrases", q: "'Il fait froid.' se traduit par :", o: ["He makes cold.", "It is cold.", "It makes cold.", "He is cold weather."], a: 1, e: "La meteo se dit avec it is : it is cold, it is sunny." },
  { c: "Phrases", q: "Which is correct?", o: ["There is three books on the table.", "There are three books on the table.", "There be three books on the table.", "They are three books on the table."], a: 1, e: "There are + pluriel, there is + singulier." },
  { c: "Phrases", q: "Which is correct?", o: ["She said me the truth.", "She told me the truth.", "She told to me the truth.", "She said to me that truth."], a: 1, e: "Tell someone something / say something to someone. Said me est faux." },
  { c: "Phrases", q: "Which is correct?", o: ["It's the book of my sister.", "It's my sister's book.", "It's the my sister book.", "It's book my sister."], a: 1, e: "Possession pour une personne : nom + 's + objet (my sister's book)." },
  { c: "Phrases", q: "'Its' ou 'it's' ? The dog wagged ___ tail.", o: ["its", "it's", "its'", "it is"], a: 0, e: "Its = son/sa (possessif, sans apostrophe). It's = it is ou it has." },
  { c: "Phrases", q: "'Their', 'there' ou 'they're' ? ___ going to be late.", o: ["Their", "There", "They're", "Theyre"], a: 2, e: "They're = they are. Their = leur. There = la / il y a." }
];

// Fiches de cours : ce qu'il faut retenir + une astuce pour memoriser
const FICHES = {
  "Present": { regle: ["Present simple = habitudes et verites generales : I work, she works (he/she/it prend un -s).", "Present continu = ce qui se passe maintenant : be + verbe-ing (I am working).", "Negation et question du present simple : do / does + verbe sans -s."], astuce: "Mots-cles : every day, always, usually = present simple. Now, at the moment, look! = present continu. Quand il y a does, le -s disparait du verbe (le -s ne peut etre qu'une seule fois)." },
  "Passe": { regle: ["Verbe regulier : verbe + -ed (play - played).", "Verbe irregulier : il faut l'apprendre (go - went).", "Negation et question : did / didn't + verbe a la base (did you go ? I didn't go)."], astuce: "Mots-cles : yesterday, last week, ago, in 2010 = passe simple. Quand il y a did, le verbe ne change plus : 'did' porte deja le passe." },
  "Present perfect": { regle: ["Have / has + participe passe.", "For + duree (for 3 years). Since + debut (since 2020).", "Jamais avec une date precise (yesterday, last week) : la on utilise le passe simple."], astuce: "Present perfect = un lien avec maintenant. Passe simple = termine, date precise. Mots-cles : ever, never, just, already, yet, since, for." },
  "Verbes irreguliers": { regle: ["Trois formes : base - passe simple - participe passe.", "Certains ne changent jamais : cut - cut - cut, put - put - put, read - read - read.", "Certains ont la meme forme au passe et au participe : buy - bought - bought, think - thought - thought."], astuce: "Apprends-en 5 par jour, pas plus. Dis-les a voix haute en trio : go, went, gone. Relis les tiens a la fin de chaque quiz avec 'Retravailler mes erreurs'." },
  "Prepositions": { regle: ["IN : mois, annee, saison, villes (in May, in 2024, in Paris).", "ON : jours et dates (on Monday, on 5th May).", "AT : heure et lieu precis (at 7 pm, at the station)."], astuce: "Du plus grand au plus petit : IN (grand), ON (moyen), AT (petit point). Les expressions comme good at, afraid of, interested in s'apprennent par coeur, par petits groupes." },
  "Comparatifs": { regle: ["Adjectif court : -er / -est (tall - taller - the tallest).", "Adjectif long : more / the most (more interesting).", "Irreguliers : good - better - best, bad - worse - worst."], astuce: "Jamais more ET -er ensemble. Compte les syllabes : 1 ou 2 = -er, 3 ou plus = more. Egalite : as ... as." },
  "Modaux": { regle: ["Can / could : capacite. Must : obligation. Should : conseil. May : permission.", "Apres un modal : verbe a la base, sans to, sans -s.", "Mustn't = interdit. Don't have to = pas obligatoire."], astuce: "Pas de -s a la 3e personne avec un modal : he can, she must. Retiens la difference mustn't (interdit) / don't have to (au choix)." },
  "Quantite": { regle: ["Denombrable (on peut compter) : many, a few (books, people).", "Indenombrable : much, a little (water, money, information).", "Some en phrase affirmative, any en negative ou question.", "A devant un son consonne, an devant un son voyelle."], astuce: "Teste : 'two ___' est-ce que ca marche ? two books oui, two informations non. On regarde le SON, pas la lettre : an hour, a university." },
  "Futur": { regle: ["Will : prediction, decision spontanee.", "Be going to : projet deja decide.", "If + present, will + verbe (situation possible).", "If + preterit, would + verbe (situation imaginaire)."], astuce: "Apres if, when, as soon as : jamais will. Le futur se cache dans la deuxieme partie de la phrase." },
  "Vocabulaire": { regle: ["Les faux amis ressemblent au francais mais n'ont pas le meme sens.", "Actually = en fait. Attend = assister. Library = bibliotheque. Sensible = raisonnable. Demand = exiger. Eventually = finalement."], astuce: "Fais-toi une liste de tes faux amis et relis-la une fois par semaine. Invente une phrase drole pour chacun, on retient mieux ce qui fait rire." },
  "Phrases": { regle: ["Adverbes de frequence (always, never) : apres be, avant les autres verbes.", "L'age : I am 15 (pas I have).", "Meteo : it is cold.", "There is + singulier, there are + pluriel.", "Its (son) / it's (it is). Their / there / they're."], astuce: "Lis ta phrase a voix haute. Remplace it's par 'it is' et they're par 'they are' : si la phrase marche, c'est la bonne forme." }
};

// ---- Questions a ECRIRE (t = reponses acceptees)
const T = (c, q, t, e) => QUESTIONS.push({ c, q, t, e });
T("Present", "She ___ (go) to school every day. Ecris le verbe.", ["goes"], "He/she/it + verbe + -s. Go prend -es : goes.");
T("Present", "He ___ (watch) TV every night. Ecris le verbe.", ["watches"], "Les verbes en -ch prennent -es a la 3e personne : watches.");
T("Present", "They ___ football now. (play, present continu - ecris 2 mots)", ["are playing"], "Present continu : be + verbe-ing. They + are : are playing.");
T("Passe", "Yesterday I ___ (see) a good film.", ["saw"], "See - saw - seen.");
T("Passe", "She ___ (not go) to school yesterday. Ecris les 2 mots.", ["didn't go", "did not go"], "Negation au passe simple : didn't + verbe a la base.");
T("Passe", "Last year we ___ (be) in Spain.", ["were"], "Passe de be : we were.");
T("Present perfect", "I have never ___ (eat) sushi.", ["eaten"], "Eat - ate - eaten.");
T("Present perfect", "We have lived here ___ 2019. (for ou since)", ["since"], "Since + point de depart.");
T("Present perfect", "She has lived here ___ five years. (for ou since)", ["for"], "For + duree.");
T("Comparatifs", "big - ___ - the biggest", ["bigger"], "Big double sa consonne : bigger.");
T("Comparatifs", "good - ___ - the best", ["better"], "Good - better - best.");
T("Comparatifs", "interesting - more interesting - the ___ interesting (1 mot)", ["most"], "Adjectif long : more / the most.");
T("Prepositions", "I'm good ___ maths. (1 mot)", ["at"], "Be good at.");
T("Prepositions", "My birthday is ___ June. (1 mot)", ["in"], "In + mois.");
T("Prepositions", "See you ___ Monday! (1 mot)", ["on"], "On + jour.");
T("Prepositions", "She is afraid ___ dogs. (1 mot)", ["of"], "Be afraid of.");
T("Modaux", "Tu dois porter un uniforme ici. You ___ wear a uniform. (1 mot)", ["must"], "Must = obligation forte.");
T("Modaux", "Tu devrais dormir plus. You ___ sleep more. (1 mot)", ["should"], "Should = conseil.");
T("Phrases", "Traduis : Il fait froid.", ["it is cold", "it's cold", "it is cold."], "La meteo se dit avec it is.");
T("Phrases", "Traduis : J'ai 15 ans.", ["i am 15", "i'm 15", "i am 15 years old", "i'm 15 years old"], "En anglais on dit I am 15 (etre).");
T("Vocabulaire", "Comment dit-on 'bibliotheque' en anglais ?", ["library"], "Library = bibliotheque. Librairie = bookshop.");
T("Vocabulaire", "Comment dit-on 'en fait' en anglais ?", ["actually"], "Actually = en fait.");
T("Vocabulaire", "Comment dit-on 'assister a (un cours)' en anglais ? (1 mot)", ["attend"], "Attend = assister a. Attendre = wait.");

// Verbes irreguliers : [base, francais, passe simple, participe passe]
[
  ["go", "aller", "went", "gone"], ["see", "voir", "saw", "seen"], ["eat", "manger", "ate", "eaten"], ["take", "prendre", "took", "taken"],
  ["give", "donner", "gave", "given"], ["write", "ecrire", "wrote", "written"], ["speak", "parler", "spoke", "spoken"],
  ["drink", "boire", "drank", "drunk"], ["begin", "commencer", "began", "begun"], ["break", "casser", "broke", "broken"],
  ["forget", "oublier", "forgot", "forgotten"], ["know", "savoir", "knew", "known"], ["come", "venir", "came", "come"], ["do", "faire", "did", "done"],
  ["buy", "acheter", "bought", "bought"], ["bring", "apporter", "brought", "brought"], ["think", "penser", "thought", "thought"],
  ["teach", "enseigner", "taught", "taught"], ["catch", "attraper", "caught", "caught"], ["find", "trouver", "found", "found"],
  ["get", "obtenir", "got", "got"], ["have", "avoir", "had", "had"], ["make", "faire / fabriquer", "made", "made"], ["say", "dire", "said", "said"],
  ["tell", "raconter", "told", "told"], ["leave", "partir", "left", "left"], ["meet", "rencontrer", "met", "met"], ["lose", "perdre", "lost", "lost"],
  ["pay", "payer", "paid", "paid"], ["sell", "vendre", "sold", "sold"]
].forEach(([b, fr, p, pp]) => {
  const e = b + " - " + p + " - " + pp;
  if (p === pp) T("Verbes irreguliers", "Passe simple ET participe passe de " + b + " (" + fr + ") :", [p], e + " (les deux formes sont identiques)");
  else {
    T("Verbes irreguliers", "Passe simple de " + b + " (" + fr + ") :", [p], e);
    T("Verbes irreguliers", "Participe passe de " + b + " (" + fr + ") :", [pp], e);
  }
});

// ---- Cartes de vocabulaire (francais -> anglais)
const VOCAB = [
  ["se souvenir de", "remember"], ["oublier", "forget"], ["emprunter", "borrow"], ["preter", "lend"], ["gagner (un match)", "win"], ["gagner (de l'argent)", "earn"],
  ["perdre", "lose"], ["reussir (un examen)", "pass"], ["echouer", "fail"], ["se reveiller", "wake up"], ["se lever", "get up"], ["s'habiller", "get dressed"],
  ["chercher", "look for"], ["rire", "laugh"], ["pleurer", "cry"], ["se depecher", "hurry up"], ["s'ennuyer", "be bored"], ["apprendre", "learn"], ["enseigner", "teach"],
  ["fatigue", "tired"], ["en colere", "angry"], ["inquiet", "worried"], ["fier", "proud"], ["timide", "shy"], ["drole", "funny"], ["paresseux", "lazy"],
  ["gentil", "kind"], ["bruyant", "noisy"], ["dangereux", "dangerous"], ["bon marche", "cheap"], ["cher", "expensive"], ["plein", "full"], ["vide", "empty"],
  ["propre", "clean"], ["sale", "dirty"], ["un devoir (a la maison)", "homework"], ["un controle", "test"], ["un cartable", "schoolbag"], ["une trousse", "pencil case"],
  ["une note", "mark"], ["toujours", "always"], ["jamais", "never"], ["souvent", "often"], ["parfois", "sometimes"], ["deja", "already"], ["pas encore", "yet"],
  ["tard", "late"], ["tot", "early"], ["demain", "tomorrow"], ["hier", "yesterday"], ["mais", "but"], ["parce que", "because"], ["donc", "so"],
  ["cependant", "however"], ["aussi", "also"], ["pendant", "during"], ["avant", "before"], ["apres", "after"], ["quand", "when"], ["meme si", "although"],
  ["un oncle", "uncle"], ["une tante", "aunt"], ["un neveu", "nephew"], ["une niece", "niece"], ["un grand-pere", "grandfather"], ["un voisin", "neighbour"]
].map(([fr, en]) => ({ c: "Carte vocabulaire", q: fr, en }));

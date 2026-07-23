import { Injectable } from '@angular/core';

import { SYNONYMS } from '../data/synonyms.data';
import { ANTONYMS } from '../data/antonyms.data';
import { ONE_WORDS } from '../data/one-words.data';
import { IDIOMS } from '../data/idioms.data';
import { Question } from '../models/question.model';
import { Synonym } from '../models/synonym.model';
import { RandomService } from '../../utils/random.service';
import { InputType } from '../enums/input-type.enum';

@Injectable({
  providedIn: 'root',
})
export class VocabularyEngine {
  constructor(private randomService: RandomService) {}

  private readonly synonymAnswerPool = SYNONYMS.flatMap((s) => s.synonyms);

  generateSynonymQuestion(): Question<Synonym> {
    const synonym = this.randomService.getRandomItem(SYNONYMS);

    return {
      question: synonym.word,

      answer: synonym.synonyms[0],

      acceptedAnswers: synonym.synonyms,

      options: this.randomService.buildOptions(
        synonym,
        SYNONYMS,
        (s) => s.synonyms[0],
        (s) => s.word,
      ),

      data: synonym,

      inputType: InputType.MultipleChoice,

      displayType: 'text',

      explanation: `${synonym.word} - ${synonym.meaning}`,
    };
  }
}
